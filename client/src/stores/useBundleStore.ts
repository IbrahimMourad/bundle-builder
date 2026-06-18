import { create } from 'zustand'
import { reconcileSelections } from '@/lib/reconcileSelections'
import {
  buildRequiredSelectionKeys,
  enforceRequiredQuantities,
  isRequiredSelectionKey,
} from '@/lib/requiredProducts'
import { getDefaultVariant, normalizeVariantSelections } from '@/lib/variants'
import { loadBundle, saveBundle, type SavedBundle } from '@/lib/storage'
import type { CatalogResponse, SelectionKey } from '@/types/catalog'

interface BundleState {
  hasHydrated: boolean
  activeStep: number
  selectedVariantByProduct: Record<string, string>
  quantities: Record<SelectionKey, number>
  requiredSelectionKeys: ReadonlySet<SelectionKey>
  isCheckoutOpen: boolean
  saveToastVisible: boolean

  hydrateFromCatalog: (data: CatalogResponse) => void
  hydrateFromStorage: (saved: SavedBundle, catalog: CatalogResponse) => void
  setActiveStep: (step: number) => void
  setSelectedVariant: (productId: string, variantId: string) => void
  setQuantity: (key: SelectionKey, qty: number) => void
  saveToStorage: () => void
  dismissSaveToast: () => void
  openCheckout: () => void
  closeCheckout: () => void
  reset: () => void
}

const initialState = {
  hasHydrated: false,
  activeStep: 1,
  selectedVariantByProduct: {},
  quantities: {},
  requiredSelectionKeys: new Set<SelectionKey>(),
  isCheckoutOpen: false,
  saveToastVisible: false,
}

function buildInitialVariantSelection(
  catalog: CatalogResponse,
): Record<string, string> {
  const selectedVariantByProduct: Record<string, string> = {}

  for (const product of catalog.products) {
    if (product.variants.length === 0) continue

    const variantFromSelections = product.variants.find((variant) => {
      const key = `${product.id}:${variant.id}` as SelectionKey
      return (catalog.initialSelections[key] ?? 0) > 0
    })

    selectedVariantByProduct[product.id] =
      variantFromSelections?.id ?? getDefaultVariant(product)!.id
  }

  return selectedVariantByProduct
}

export const useBundleStore = create<BundleState>((set, get) => ({
  ...initialState,

  hydrateFromCatalog: (data) => {
    if (get().hasHydrated) return

    const saved = loadBundle()
    if (saved) {
      get().hydrateFromStorage(saved, data)
      set({ hasHydrated: true })
      return
    }

    set({
      hasHydrated: true,
      activeStep: data.activeStep,
      quantities: enforceRequiredQuantities(
        normalizeVariantSelections({ ...data.initialSelections }, data),
        data,
      ),
      selectedVariantByProduct: buildInitialVariantSelection(data),
      requiredSelectionKeys: buildRequiredSelectionKeys(data),
    })
  },

  hydrateFromStorage: (saved, catalog) => {
    const reconciled = reconcileSelections(saved, catalog)

    set({
      activeStep: saved.activeStep,
      quantities: reconciled.quantities,
      selectedVariantByProduct: reconciled.selectedVariantByProduct,
      requiredSelectionKeys: buildRequiredSelectionKeys(catalog),
    })
  },

  setActiveStep: (step) => set({ activeStep: step }),

  setSelectedVariant: (productId, variantId) =>
    set((state) => ({
      selectedVariantByProduct: {
        ...state.selectedVariantByProduct,
        [productId]: variantId,
      },
    })),

  setQuantity: (key, qty) =>
    set((state) => {
      if (isRequiredSelectionKey(key, state.requiredSelectionKeys)) {
        return state
      }

      const quantities = { ...state.quantities }

      if (qty <= 0) {
        delete quantities[key]
      } else {
        quantities[key] = qty
      }

      return { quantities }
    }),

  saveToStorage: () => {
    const { activeStep, quantities, selectedVariantByProduct } = get()
    saveBundle({ activeStep, quantities, selectedVariantByProduct })
    set({ saveToastVisible: true })
  },

  dismissSaveToast: () => set({ saveToastVisible: false }),

  openCheckout: () => set({ isCheckoutOpen: true }),
  closeCheckout: () => set({ isCheckoutOpen: false }),

  reset: () => set(initialState),
}))
