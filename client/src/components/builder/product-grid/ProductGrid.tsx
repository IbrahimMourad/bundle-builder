import type { CatalogProduct } from '@/types/catalog'
import { ProductCard } from '../product-card/ProductCard'
import styles from './ProductGrid.module.css'

interface ProductGridProps {
  products: CatalogProduct[]
}

export function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className={styles.grid}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
