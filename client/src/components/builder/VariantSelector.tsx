import type { CatalogVariant } from '@/types/catalog'
import styles from './VariantSelector.module.css'

interface VariantSelectorProps {
  variants: CatalogVariant[]
  selectedVariantId: string
  onSelect: (variantId: string) => void
  name: string
}

export function VariantSelector({
  variants,
  selectedVariantId,
  onSelect,
  name,
}: VariantSelectorProps) {
  return (
    <div className={styles.group} role="radiogroup" aria-label={`${name} color`}>
      {variants.map((variant) => {
        const isSelected = variant.id === selectedVariantId

        return (
          <button
            key={variant.id}
            type="button"
            role="radio"
            aria-checked={isSelected}
            className={isSelected ? styles.chipSelected : styles.chip}
            onClick={() => onSelect(variant.id)}
          >
            <span
              className={styles.swatch}
              style={{ backgroundColor: variant.swatchColor ?? undefined }}
              aria-hidden="true"
            />
            <span className={styles.label}>{variant.label}</span>
          </button>
        )
      })}
    </div>
  )
}
