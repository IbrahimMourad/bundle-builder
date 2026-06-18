export type CatalogSource = 'supabase' | 'local'

export type ProductCategory = 'cameras' | 'sensors' | 'accessories' | 'plan'

export interface CatalogVariant {
  id: string
  label: string
  swatchColor: string | null
  imageUrl: string | null
  sortOrder: number
}

export interface CatalogProduct {
  id: string
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
  order: number
  title: string
  icon: string
  nextLabel: string
}

export type SelectionKey = `${string}:${string}`

export interface AppConfig {
  activeStep: number
  initialSelections: Record<SelectionKey, number>
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
