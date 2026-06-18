import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { CatalogVariant } from '@/types/catalog'
import { VariantSelector } from './VariantSelector'

const variants: CatalogVariant[] = [
  {
    id: 'var-white',
    slug: 'white',
    label: 'White',
    swatchColor: '#ffffff',
    imageUrl: null,
    sortOrder: 1,
  },
  {
    id: 'var-black',
    slug: 'black',
    label: 'Black',
    swatchColor: '#000000',
    imageUrl: null,
    sortOrder: 2,
  },
]

describe('VariantSelector', () => {
  const user = userEvent.setup()

  it('renders variant options in a radiogroup', () => {
    render(
      <VariantSelector
        variants={variants}
        selectedVariantId="var-white"
        onSelect={vi.fn()}
        name="Wyze Cam v4"
      />,
    )

    expect(screen.getByRole('radiogroup', { name: 'Wyze Cam v4 color' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'White' })).toHaveAttribute('aria-checked', 'true')
    expect(screen.getByRole('radio', { name: 'Black' })).toHaveAttribute('aria-checked', 'false')
  })

  it('calls onSelect when a variant is clicked', async () => {
    const onSelect = vi.fn()
    render(
      <VariantSelector
        variants={variants}
        selectedVariantId="var-white"
        onSelect={onSelect}
        name="Wyze Cam v4"
      />,
    )

    await user.click(screen.getByRole('radio', { name: 'Black' }))
    expect(onSelect).toHaveBeenCalledWith('var-black')
  })
})
