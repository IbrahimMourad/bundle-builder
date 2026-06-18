import type { CatalogVariant } from '@/types/catalog'
import styles from './VariantSelector.module.css'

interface VariantSelectorProps {
  variants: CatalogVariant[]
  selectedVariantId: string
  onSelect: (variantId: string) => void
  name: string
}

function VariantThumb({ variant }: { variant: CatalogVariant }) {
  if (variant.imageUrl) {
    return (
      <img
        className={styles.thumb}
        src={variant.imageUrl}
        alt=""
        width={28}
      />
    )
  }

  return (
    <span
      className={styles.thumbFallback}
      style={{ backgroundColor: variant.swatchColor ?? 'var(--color-border)' }}
      aria-hidden="true"
    />
  )
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
            <VariantThumb variant={variant} />
            <span className={styles.label}>{variant.label}</span>
          </button>
        )
      })}
    </div>
  )
}
