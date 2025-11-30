/** @vitest-environment jsdom */
import { describe, it, expect, vi } from 'vitest'
import React from 'react'
import { renderHook } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import * as api from '../../lib/api'
import { useAI } from '../../hooks/useAI'

const wrapper = ({ children }: any) => {
  const qc = new QueryClient()
  return <QueryClientProvider client={qc}>{children}</QueryClientProvider>
}

describe('useAI hook extended', () => {
  it('handles error from API gracefully', async () => {
    const spy = vi.spyOn(api, 'apiFetch').mockRejectedValue(new Error('boom'))
    const { result } = renderHook(() => useAI(), { wrapper })
    await expect(result.current.generateSummary.mutateAsync({ context: 'x' })).rejects.toThrow()
    spy.mockRestore()
  })

  it('supports force mode', async () => {
    const spy = vi.spyOn(api, 'apiFetch').mockResolvedValue({ summary: ['ok'] } as any)
    const { result } = renderHook(() => useAI(), { wrapper })
    const res = await result.current.generateSummary.mutateAsync({ context: 'x', force: true })
    expect(res.summary?.[0]).toBe('ok')
    spy.mockRestore()
  })
})
