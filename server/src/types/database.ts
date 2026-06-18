export interface StepRow {
  id: string
  slug: string
  step_order: number
  title: string
  icon: string
  next_label: string
}

export interface ProductRow {
  id: string
  slug: string
  step_id: string
  name: string
  description: string
  image_url: string
  compare_at_price: number | null
  price: number
  badge: string | null
  category: 'cameras' | 'sensors' | 'accessories' | 'plan'
  learn_more_url: string
  price_label: string | null
  is_required: boolean
  show_in_builder: boolean
  sort_order: number
}

export interface VariantRow {
  id: string
  slug: string
  product_id: string
  label: string
  swatch_color: string | null
  image_url: string | null
  sort_order: number
}
