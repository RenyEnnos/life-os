import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Button } from '../Button'

describe('Button accessibility', () => {
  it('renders with focus-visible ring', () => {
    const { getByText } = render(<Button>Click</Button>)
    const btn = getByText('Click')
    expect(btn.className).toMatch(/focus-visible/)
  })
  it('supports variants without breaking', () => {
    const { getByText } = render(<Button variant="outline">Outline</Button>)
    expect(getByText('Outline')).toBeTruthy()
  })
})
