import { beforeEach, describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { mockCatalog } from '@/test/fixtures/mockCatalog'
import { useBundleStore } from '@/stores/useBundleStore'
import { ProductCard } from './ProductCard'

describe('ProductCard', () => {
  const user = userEvent.setup()
  const product = mockCatalog.products[0]

  beforeEach(() => {
    useBundleStore.getState().reset()
    useBundleStore.getState().hydrateFromCatalog(mockCatalog)
  })

  it('renders product details and badge', () => {
    render(<ProductCard product={product} />)

    expect(screen.getByRole('heading', { name: product.name })).toBeInTheDocument()
    expect(screen.getByText(product.description)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Learn More' })).toHaveAttribute(
      'href',
      product.learnMoreUrl,
    )
    expect(screen.getByText('Save 22%')).toBeInTheDocument()
  })

  it('shows selected styling when any variant has quantity', () => {
    const { container } = render(<ProductCard product={product} />)
    expect(container.querySelector('article')).toHaveClass(/cardSelected/)
  })

  it('isolates quantity per variant', async () => {
    render(<ProductCard product={product} />)

    await user.click(screen.getByRole('radio', { name: 'Black' }))
    await user.click(screen.getByRole('button', { name: 'Increase quantity' }))

    expect(useBundleStore.getState().quantities['prod-cam-v4:var-white']).toBe(1)
    expect(useBundleStore.getState().quantities['prod-cam-v4:var-black']).toBe(1)
  })

  it('updates quantity for the active variant', async () => {
    render(<ProductCard product={product} />)

    await user.click(screen.getByRole('button', { name: 'Increase quantity' }))
    expect(useBundleStore.getState().quantities['prod-cam-v4:var-white']).toBe(2)
  })

  it('disables quantity changes for required products', async () => {
    const requiredProduct = {
      ...product,
      id: 'prod-hub',
      slug: 'sense-hub',
      name: 'Wyze Sense Hub (Required)',
      isRequired: true,
      variants: [],
      price: 0,
      compareAtPrice: 27.99,
      badge: 'FREE',
    }

    useBundleStore.setState({
      quantities: { 'prod-hub:default': 1 },
      requiredSelectionKeys: new Set(['prod-hub:default']),
    })

    render(<ProductCard product={requiredProduct} />)

    expect(screen.getByRole('button', { name: 'Decrease quantity' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Increase quantity' })).toBeDisabled()

    await user.click(screen.getByRole('button', { name: 'Increase quantity' }))
    expect(useBundleStore.getState().quantities['prod-hub:default']).toBe(1)
  })
})
