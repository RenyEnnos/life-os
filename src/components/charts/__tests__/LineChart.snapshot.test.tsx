/** @vitest-environment jsdom */
import { describe, it, expect, vi } from 'vitest'
import React from 'react'
import { render } from '@testing-library/react'
import LineChart from '../LineChart'

vi.mock('recharts', async () => {
  const actual = await vi.importActual<any>('recharts')
  return { ...actual, ResponsiveContainer: ({ children }: any) => <div style={{ width: 400, height: 200 }}>{children}</div> }
})

describe('LineChart snapshot', () => {
  it('matches snapshot', () => {
    const data = [{ day: 'D1', value: 10 }, { day: 'D2', value: 20 }]
    const { container } = render(<LineChart data={data} xKey="day" yKey="value" />)
    expect(container).toMatchSnapshot()
  })
})
