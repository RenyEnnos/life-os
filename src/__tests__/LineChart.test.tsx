import { describe, it, expect, vi } from 'vitest'
import React from 'react'
import { render } from '@testing-library/react'
import LineChart from '@/shared/ui/charts/LineChart'

describe('LineChart', () => {
  it('renders without errors', () => {
    const data = [{ day: '2025-01-01', value: 5 }]
    const { container } = render(<div style={{ width: 400, height: 200 }}><LineChart data={data} xKey="day" yKey="value" /></div>)
    expect(container.querySelector('.recharts-wrapper')).toBeTruthy()
  })
})
vi.mock('recharts', async () => {
  const actual = await vi.importActual<typeof import('recharts')>('recharts')
  return {
    ...actual,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div style={{ width: 400, height: 200 }}>{children}</div>,
  }
})
/** @vitest-environment jsdom */
