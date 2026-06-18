export type CatalogSource = 'supabase' | 'local'

export type ProductCategory = 'cameras' | 'sensors' | 'accessories' | 'plan'

export interface CatalogVariant {
  id: string
  slug: string
  label: string
  swatchColor: string | null
  imageUrl: string | null
  sortOrder: number
}

export interface CatalogProduct {
  id: string
  slug: string
  stepId: string
  name: string
  description: string
  imageUrl: string
  compareAtPrice: number | null
  price: number
  badge: string | null
  category: ProductCategory
  learnMoreUrl: string
  priceLabel: string | null
  isRequired: boolean
  showInBuilder: boolean
  sortOrder: number
  variants: CatalogVariant[]
}

export interface CatalogStep {
  id: string
  slug: string
  order: number
  title: string
  icon: string
  nextLabel: string
}

export type SelectionKey = `${string}:${string}`

/** Human-readable keys in app-config.json, e.g. `cam-v4:cam-v4-white` */
export type SlugSelectionKey = `${string}:${string}`

export interface AppConfig {
  activeStep: number
  initialSelections: Record<SlugSelectionKey, number>
  shipping: {
    label: string
    compareAt: number | null
    price: number
  }
  financing: {
    monthlyLow: number
  }
}

export interface CatalogResponse extends AppConfig {
  source: CatalogSource
  steps: CatalogStep[]
  products: CatalogProduct[]
}
