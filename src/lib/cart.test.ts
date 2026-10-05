import { clampCount, formatPrice } from './cart'

describe('clampCount', () => {
  it('keeps values within range unchanged', () => {
    expect(clampCount(5, 10)).toBe(5)
  })

  it('clamps values above the max to the max', () => {
    expect(clampCount(99, 18)).toBe(18)
  })

  it('clamps negative values to 0', () => {
    expect(clampCount(-3, 10)).toBe(0)
  })

  it('treats NaN from a cleared input as 0', () => {
    expect(clampCount(Number.NaN, 10)).toBe(0)
  })

  it('returns 0 when the max is 0', () => {
    expect(clampCount(1, 0)).toBe(0)
  })
})

describe('formatPrice', () => {
  it('formats to two decimal places with a dollar sign', () => {
    expect(formatPrice(2.5)).toBe('$2.50')
    expect(formatPrice(0)).toBe('$0.00')
    expect(formatPrice(24.99)).toBe('$24.99')
  })
})
