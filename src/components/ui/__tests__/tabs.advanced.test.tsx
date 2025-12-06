import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import Tabs from '../Tabs'

describe('Tabs advanced', () => {
  it('renders underline variant', () => {
    const { getByText } = render(<Tabs variant="underline" tabs={[{ id: 'a', label: 'A' }, { id: 'b', label: 'B' }]} />)
    expect(getByText('A')).toBeTruthy()
  })
})
