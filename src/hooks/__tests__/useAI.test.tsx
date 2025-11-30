/** @vitest-environment jsdom */
import { describe, it, expect, vi } from 'vitest'
import React from 'react'
import { renderHook, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import * as api from '../../lib/api'
import { useAI } from '../../hooks/useAI'

describe('useAI hook', () => {
  it('calls /api/ai/summary and returns data', async () => {
    const spy = vi.spyOn(api, 'apiFetch').mockResolvedValue({ summary: ['a','b'] } as any)
    const qc = new QueryClient()
    const wrapper = ({ children }: any) => <QueryClientProvider client={qc}>{children}</QueryClientProvider>
    const { result } = renderHook(() => useAI(), { wrapper })
    const res = await result.current.generateDailySummary('texto')
    expect(Array.isArray(res)).toBe(true)
    spy.mockRestore()
  })
})
