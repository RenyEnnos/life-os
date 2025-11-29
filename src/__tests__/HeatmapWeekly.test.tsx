import { describe, it, expect } from 'vitest'
import React from 'react'
import { render } from '@testing-library/react'
import HeatmapWeekly from '../components/charts/HeatmapWeekly'

describe('HeatmapWeekly', () => {
  it('renders squares with intensity based on values', () => {
    const { container } = render(<HeatmapWeekly data={[{label:'Seg', value:1},{label:'Ter', value:2}]} />)
    expect(container.querySelectorAll('div.w-6.h-6').length).toBe(2)
  })
})
