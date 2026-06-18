import type { ProductCategory } from '@/types/catalog'

export const CATEGORY_HEADINGS: Record<ProductCategory, string> = {
  cameras: 'Cameras',
  sensors: 'Sensors',
  accessories: 'Accessories',
  plan: 'Plan',
}

export const CATEGORY_ORDER: ProductCategory[] = [
  'cameras',
  'sensors',
  'accessories',
  'plan',
]
