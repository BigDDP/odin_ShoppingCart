import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { useCart, type CartLine } from '@/hooks/use-cart'
import { gelPen, stapler } from '@/test/items'
import { CartRow, CartSummary } from './cart'

vi.mock('@/hooks/use-cart', () => ({ useCart: vi.fn() }))

const setCart = vi.fn()
const removeFromCart = vi.fn()

const mockCart = (uniqueItems: CartLine[] = []) =>
  vi.mocked(useCart).mockReturnValue({
    uniqueItems,
    totalCount: uniqueItems.reduce((sum, line) => sum + line.count, 0),
    setCart,
    removeFromCart,
  })

beforeEach(() => {
  setCart.mockReset()
  removeFromCart.mockReset()
  mockCart()
})

describe('CartRow', () => {
  const line = { item: stapler, count: 2 }

  it('shows the count, stock and line total', () => {
    render(<CartRow line={line} />)

    expect(screen.getByLabelText('Stapler quantity')).toHaveValue(2)
    expect(screen.getByText('/ 18')).toBeInTheDocument()
    expect(screen.getByText('$24.00')).toBeInTheDocument()
  })

  it.each([
    ['5', 5],
    ['99', 18],
    ['-4', 0],
    ['', 0],
  ])('sets the cart count when the input changes to "%s"', (value, expected) => {
    render(<CartRow line={line} />)

    fireEvent.change(screen.getByLabelText('Stapler quantity'), {
      target: { value },
    })

    expect(setCart).toHaveBeenCalledWith(stapler, expected)
  })

  it('removes the item', async () => {
    const user = userEvent.setup()
    render(<CartRow line={line} />)

    await user.click(screen.getByRole('button', { name: 'Remove' }))

    expect(removeFromCart).toHaveBeenCalledWith(stapler)
  })
})

describe('CartSummary', () => {
  it('lists each item and the total', () => {
    mockCart([
      { item: gelPen, count: 2 },
      { item: stapler, count: 1 },
    ])
    render(<CartSummary />)

    expect(screen.getByText('Gel Pen × 2')).toBeInTheDocument()
    expect(screen.getByText('Stapler × 1')).toBeInTheDocument()
    expect(screen.getByText('3 items')).toBeInTheDocument()
    expect(screen.getByText('Total').parentElement).toHaveTextContent('$17.00')
  })

  it('disables Pay now when the cart is empty', () => {
    render(<CartSummary />)

    expect(screen.getByRole('button', { name: 'Pay now' })).toBeDisabled()
  })

  it('alerts the payment amount on Pay now', async () => {
    const user = userEvent.setup()
    const alert = vi.spyOn(window, 'alert').mockImplementation(() => {})
    mockCart([{ item: gelPen, count: 2 }])
    render(<CartSummary />)

    await user.click(screen.getByRole('button', { name: 'Pay now' }))

    expect(alert).toHaveBeenCalledWith('Payment of $5.00 received!')
    alert.mockRestore()
  })
})
