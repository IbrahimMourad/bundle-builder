import { describe, expect, it } from 'vitest'
import { useBundleStore } from './useBundleStore'

describe('useBundleStore', () => {
  it('starts on step 1', () => {
    expect(useBundleStore.getState().activeStep).toBe(1)
  })

  it('updates the active step', () => {
    useBundleStore.getState().setActiveStep(2)
    expect(useBundleStore.getState().activeStep).toBe(2)
    useBundleStore.setState({ activeStep: 1 })
  })
})
