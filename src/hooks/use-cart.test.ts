import { act, renderHook } from '@testing-library/react'

import { gelPen, stapler } from '@/test/items'
import { useCartState } from './use-cart'

describe('useCartState', () => {
  it('starts empty', () => {
    const { result } = renderHook(() => useCartState())

    expect(result.current.uniqueItems).toEqual([])
    expect(result.current.totalCount).toBe(0)
  })

  it('adds a new item with the given count', () => {
    const { result } = renderHook(() => useCartState())

    act(() => result.current.setCart(gelPen, 3))

    expect(result.current.uniqueItems).toEqual([{ item: gelPen, count: 3 }])
    expect(result.current.totalCount).toBe(3)
  })

  it('replaces the count of an existing item without duplicating it', () => {
    const { result } = renderHook(() => useCartState())

    act(() => result.current.setCart(gelPen, 3))
    act(() => result.current.setCart(gelPen, 7))

    expect(result.current.uniqueItems).toEqual([{ item: gelPen, count: 7 }])
    expect(result.current.totalCount).toBe(7)
  })

  it('sums totalCount across items', () => {
    const { result } = renderHook(() => useCartState())

    act(() => {
      result.current.setCart(gelPen, 2)
      result.current.setCart(stapler, 5)
    })

    expect(result.current.totalCount).toBe(7)
  })

  it('removes only the given item', () => {
    const { result } = renderHook(() => useCartState())

    act(() => {
      result.current.setCart(gelPen, 2)
      result.current.setCart(stapler, 5)
    })
    act(() => result.current.removeFromCart(gelPen))

    expect(result.current.uniqueItems).toEqual([{ item: stapler, count: 5 }])
    expect(result.current.totalCount).toBe(5)
  })

  it('ignores removing an item that is not in the cart', () => {
    const { result } = renderHook(() => useCartState())

    act(() => result.current.setCart(gelPen, 2))
    act(() => result.current.removeFromCart(stapler))

    expect(result.current.uniqueItems).toEqual([{ item: gelPen, count: 2 }])
  })
})
