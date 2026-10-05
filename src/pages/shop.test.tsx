import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { useCart, type CartLine } from '@/hooks/use-cart'
import { gelPen, stapler, washiTape } from '@/test/items'
import { ItemCard } from './shop'

vi.mock('@/hooks/use-cart', () => ({ useCart: vi.fn() }))

const setCart = vi.fn()

const mockCart = (uniqueItems: CartLine[] = []) =>
  vi.mocked(useCart).mockReturnValue({
    uniqueItems,
    totalCount: uniqueItems.reduce((sum, line) => sum + line.count, 0),
    setCart,
    removeFromCart: vi.fn(),
  })

beforeEach(() => {
  setCart.mockReset()
  mockCart()
})

describe('ItemCard', () => {
  it('starts at 1 out of the full stock', () => {
    render(<ItemCard item={stapler} />)

    expect(screen.getByLabelText('Stapler quantity')).toHaveValue(1)
    expect(screen.getByText('/ 18')).toBeInTheDocument()
    expect(screen.getByText('$12.00')).toBeInTheDocument()
  })

  it('starts at 0 with Add disabled when out of stock', () => {
    render(<ItemCard item={washiTape} />)

    expect(screen.getByLabelText('Washi Tape quantity')).toHaveValue(0)
    expect(screen.getByText('/ 0')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Add' })).toBeDisabled()
  })

  it('limits the quantity to the stock remaining after the cart', async () => {
    const user = userEvent.setup()
    mockCart([{ item: stapler, count: 10 }])
    render(<ItemCard item={stapler} />)

    const input = screen.getByLabelText('Stapler quantity')
    expect(screen.getByText('/ 8')).toBeInTheDocument()

    await user.clear(input)
    await user.type(input, '99')

    expect(input).toHaveValue(8)
  })

  it('disables Add when the quantity is 0', async () => {
    const user = userEvent.setup()
    render(<ItemCard item={gelPen} />)

    await user.clear(screen.getByLabelText('Gel Pen quantity'))

    expect(screen.getByRole('button', { name: 'Add' })).toBeDisabled()
  })

  it('adds the quantity on top of what is already in the cart', async () => {
    const user = userEvent.setup()
    mockCart([{ item: gelPen, count: 5 }])
    render(<ItemCard item={gelPen} />)

    const input = screen.getByLabelText('Gel Pen quantity')
    await user.clear(input)
    await user.type(input, '3')
    await user.click(screen.getByRole('button', { name: 'Add' }))

    expect(setCart).toHaveBeenCalledWith(gelPen, 8)
    expect(input).toHaveValue(1)
  })
})
