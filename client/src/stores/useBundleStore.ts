import { create } from 'zustand'

interface BundleState {
  activeStep: number
  setActiveStep: (step: number) => void
}

export const useBundleStore = create<BundleState>((set) => ({
  activeStep: 1,
  setActiveStep: (step) => set({ activeStep: step }),
}))
