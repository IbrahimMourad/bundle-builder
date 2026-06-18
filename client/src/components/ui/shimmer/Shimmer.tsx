import styles from './Shimmer.module.css'

interface ShimmerProps {
  className?: string
}

export function Shimmer({ className }: ShimmerProps) {
  return <span className={className ? `${styles.shimmer} ${className}` : styles.shimmer} aria-hidden="true" />
}
