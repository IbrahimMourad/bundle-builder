import type { SelectionKey } from '@/types/catalog'

export const BUNDLE_STORAGE_KEY = 'wyze-bundle:v1'

export interface SavedBundle {
  version: 1
  activeStep: number
  quantities: Record<SelectionKey, number>
  selectedVariantByProduct: Record<string, string>
}

export interface PersistedBundleState {
  activeStep: number
  quantities: Record<SelectionKey, number>
  selectedVariantByProduct: Record<string, string>
}

export function saveBundle(state: PersistedBundleState): void {
  try {
    const payload: SavedBundle = { version: 1, ...state }
    localStorage.setItem(BUNDLE_STORAGE_KEY, JSON.stringify(payload))
  } catch {
    // Quota exceeded or private browsing — fail silently
  }
}

export function loadBundle(): SavedBundle | null {
  try {
    const raw = localStorage.getItem(BUNDLE_STORAGE_KEY)
    if (!raw) return null

    const parsed: unknown = JSON.parse(raw)
    if (
      typeof parsed !== 'object' ||
      parsed === null ||
      (parsed as SavedBundle).version !== 1
    ) {
      return null
    }

    const saved = parsed as SavedBundle
    if (
      typeof saved.activeStep !== 'number' ||
      typeof saved.quantities !== 'object' ||
      saved.quantities === null ||
      typeof saved.selectedVariantByProduct !== 'object' ||
      saved.selectedVariantByProduct === null
    ) {
      return null
    }

    return saved
  } catch {
    return null
  }
}

export function clearBundle(): void {
  try {
    localStorage.removeItem(BUNDLE_STORAGE_KEY)
  } catch {
    // ignore
  }
}
