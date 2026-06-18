import { createSupabaseClient, isSupabaseConfigured } from '../lib/supabase.js'
import { resolveInitialSelections } from '../lib/resolveInitialSelections.js'
import { resolveAssetUrl } from '../lib/resolveAssetUrl.js'
import appConfig from '../data/app-config.json' with { type: 'json' }
import localCatalog from '../data/catalog.json' with { type: 'json' }
import type {
  CatalogProduct,
  CatalogResponse,
  CatalogStep,
  CatalogVariant,
} from '../types/catalog.js'
import type { ProductRow, StepRow, VariantRow } from '../types/database.js'

function mapStep(row: StepRow, supabaseUrl: string): CatalogStep {
  return {
    id: row.id,
    slug: row.slug,
    order: row.step_order,
    title: row.title,
    icon: resolveAssetUrl(row.icon, supabaseUrl) ?? row.icon,
    nextLabel: row.next_label,
  }
}

function mapVariant(row: VariantRow, supabaseUrl: string): CatalogVariant {
  return {
    id: row.id,
    slug: row.slug,
    label: row.label,
    swatchColor: row.swatch_color,
    imageUrl: resolveAssetUrl(row.image_url, supabaseUrl),
    sortOrder: row.sort_order,
  }
}

function mapProduct(
  row: ProductRow,
  variants: VariantRow[],
  supabaseUrl: string,
): CatalogProduct {
  return {
    id: row.id,
    slug: row.slug,
    stepId: row.step_id,
    name: row.name,
    description: row.description,
    imageUrl: resolveAssetUrl(row.image_url, supabaseUrl) ?? row.image_url,
    compareAtPrice: row.compare_at_price,
    price: Number(row.price),
    badge: row.badge,
    category: row.category,
    learnMoreUrl: row.learn_more_url,
    priceLabel: row.price_label,
    isRequired: row.is_required,
    showInBuilder: row.show_in_builder,
    sortOrder: row.sort_order,
    variants: variants.map((variant) => mapVariant(variant, supabaseUrl)),
  }
}

function groupVariantsByProduct(variants: VariantRow[]): Map<string, VariantRow[]> {
  const map = new Map<string, VariantRow[]>()

  for (const variant of variants) {
    const list = map.get(variant.product_id) ?? []
    list.push(variant)
    map.set(variant.product_id, list)
  }

  return map
}

async function fetchCatalogFromSupabase(): Promise<CatalogResponse> {
  const supabaseUrl = process.env.SUPABASE_URL
  if (!supabaseUrl) {
    throw new Error('SUPABASE_URL is not configured')
  }

  const supabase = createSupabaseClient()

  const [stepsResult, productsResult, variantsResult] = await Promise.all([
    supabase.from('steps').select('*').order('step_order'),
    supabase.from('products').select('*').order('sort_order'),
    supabase.from('variants').select('*').order('sort_order'),
  ])

  if (stepsResult.error) {
    throw new Error(`Failed to fetch steps: ${stepsResult.error.message}`)
  }
  if (productsResult.error) {
    throw new Error(`Failed to fetch products: ${productsResult.error.message}`)
  }
  if (variantsResult.error) {
    throw new Error(`Failed to fetch variants: ${variantsResult.error.message}`)
  }

  const variantsByProduct = groupVariantsByProduct(variantsResult.data as VariantRow[])
  const products = (productsResult.data as ProductRow[]).map((row) =>
    mapProduct(row, variantsByProduct.get(row.id) ?? [], supabaseUrl),
  )

  return {
    source: 'supabase',
    activeStep: appConfig.activeStep,
    shipping: appConfig.shipping,
    financing: appConfig.financing,
    initialSelections: resolveInitialSelections(products, appConfig.initialSelections),
    steps: (stepsResult.data as StepRow[]).map((row) => mapStep(row, supabaseUrl)),
    products,
  }
}

export async function getCatalog(): Promise<CatalogResponse> {
  if (isSupabaseConfigured()) {
    return fetchCatalogFromSupabase()
  }

  return localCatalog as CatalogResponse
}
