import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './Button'

describe('Button', () => {
  const user = userEvent.setup()

  it('renders primary variant by default', () => {
    render(<Button>Checkout</Button>)
    const button = screen.getByRole('button', { name: 'Checkout' })
    expect(button.className).toMatch(/primary/)
  })

  it('renders outline variant', () => {
    render(<Button variant="outline">Next step</Button>)
    const button = screen.getByRole('button', { name: 'Next step' })
    expect(button.className).toMatch(/outline/)
  })

  it('handles click events', async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Save</Button>)

    await user.click(screen.getByRole('button', { name: 'Save' }))
    expect(onClick).toHaveBeenCalledOnce()
  })
})
