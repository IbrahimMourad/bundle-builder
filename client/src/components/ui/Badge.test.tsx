import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Badge } from './Badge'

describe('Badge', () => {
  it('renders discount text', () => {
    render(<Badge>Save 22%</Badge>)
    expect(screen.getByText('Save 22%')).toBeInTheDocument()
  })
})
