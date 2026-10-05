import { renderHook, waitFor } from '@testing-library/react'

import { items } from '@/test/items'
import { useFetch } from './fetch'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('useFetch', () => {
  it('starts loading then returns the data', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, json: async () => items }),
    )

    const { result } = renderHook(() => useFetch('/mock/items.json'))
    expect(result.current.loading).toBe(true)

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.data).toEqual(items)
    expect(result.current.error).toBeNull()
  })

  it('returns an error for a non-OK response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500 }))

    const { result } = renderHook(() => useFetch('/mock/items.json'))

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.error?.message).toBe('Request failed: 500')
    expect(result.current.data).toBeNull()
  })

  it('aborts the request on unmount', () => {
    const fetchMock = vi.fn().mockReturnValue(new Promise(() => {}))
    vi.stubGlobal('fetch', fetchMock)

    const { unmount } = renderHook(() => useFetch('/mock/items.json'))
    const { signal } = fetchMock.mock.calls[0][1] as RequestInit

    expect(signal?.aborted).toBe(false)
    unmount()
    expect(signal?.aborted).toBe(true)
  })
})
