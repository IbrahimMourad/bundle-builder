import {
  getDistinctSelectedCountPerStep,
  getReviewLineItems,
  getTotals,
} from '@/lib/pricing'
import type { CatalogResponse, SelectionKey } from '@/types/catalog'

export interface BundleSelectorState {
  quantities: Record<SelectionKey, number>
}

export function selectReviewLineItems(state: BundleSelectorState, catalog: CatalogResponse) {
  return getReviewLineItems(state.quantities, catalog)
}

export function selectDistinctSelectedCountPerStep(
  state: BundleSelectorState,
  catalog: CatalogResponse,
) {
  return getDistinctSelectedCountPerStep(state.quantities, catalog)
}

export function selectTotals(state: BundleSelectorState, catalog: CatalogResponse) {
  return getTotals(state.quantities, catalog)
}
