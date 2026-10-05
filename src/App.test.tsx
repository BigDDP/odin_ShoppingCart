import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router'

import { items } from '@/test/items'
import routes from './route'

const renderApp = (path = '/') => {
  const user = userEvent.setup()
  render(
    <RouterProvider router={createMemoryRouter(routes, { initialEntries: [path] })} />,
  )
  return user
}

const cardFor = async (title: string) => {
  const input = await screen.findByLabelText(`${title} quantity`)
  return input.closest<HTMLElement>('[data-slot="card"]')!
}

const cartLink = () => screen.getByRole('link', { name: /^cart/i })

const summary = () =>
  screen.getByText('Summary').closest<HTMLElement>('[data-slot="card"]')!

const addToCart = async (
  user: ReturnType<typeof userEvent.setup>,
  title: string,
  quantity: string,
) => {
  const card = await cardFor(title)
  const input = within(card).getByLabelText(`${title} quantity`)
  await user.clear(input)
  await user.type(input, quantity)
  await user.click(within(card).getByRole('button', { name: 'Add' }))
}

beforeEach(() => {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({ ok: true, json: async () => items }),
  )
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('App', () => {
  it('renders the home page at /', () => {
    renderApp()

    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument()
  })

  it('adds items in the shop and shows them in the nav and cart', async () => {
    const user = renderApp('/shop')

    await addToCart(user, 'Gel Pen', '2')

    expect(cartLink()).toHaveTextContent('2')

    await user.click(cartLink())

    expect(screen.getByRole('heading', { name: 'Shopping Cart' })).toBeInTheDocument()
    expect(screen.getByLabelText('Gel Pen quantity')).toHaveValue(2)
    expect(within(summary()).getByText('Gel Pen × 2')).toBeInTheDocument()
    expect(within(summary()).getByText('Total').parentElement).toHaveTextContent('$5.00')
  })

  it('updates the summary and nav when a cart quantity changes', async () => {
    const user = renderApp('/shop')
    await addToCart(user, 'Gel Pen', '2')
    await user.click(cartLink())

    const input = screen.getByLabelText('Gel Pen quantity')
    await user.clear(input)
    await user.type(input, '4')

    expect(within(summary()).getByText('Total').parentElement).toHaveTextContent('$10.00')
    expect(cartLink()).toHaveTextContent('4')
  })

  it('removes an item and shows the empty cart', async () => {
    const user = renderApp('/shop')
    await addToCart(user, 'Gel Pen', '2')
    await user.click(cartLink())

    await user.click(screen.getByRole('button', { name: 'Remove' }))

    expect(screen.getByText('Your cart is empty.')).toBeInTheDocument()
    expect(cartLink()).toHaveTextContent(/^Cart$/)
    expect(screen.getByRole('button', { name: 'Pay now' })).toBeDisabled()
  })

  it('keeps the stock limit after leaving and returning to the shop', async () => {
    const user = renderApp('/shop')
    await addToCart(user, 'Stapler', '99')

    let card = await cardFor('Stapler')
    expect(within(card).getByText('/ 0')).toBeInTheDocument()
    expect(within(card).getByRole('button', { name: 'Add' })).toBeDisabled()

    await user.click(cartLink())
    expect(screen.getByLabelText('Stapler quantity')).toHaveValue(18)
    await user.click(screen.getByRole('link', { name: 'Shop' }))

    card = await cardFor('Stapler')
    expect(within(card).getByLabelText('Stapler quantity')).toHaveValue(0)
    expect(within(card).getByRole('button', { name: 'Add' })).toBeDisabled()
  })

  it('goes back to the shop from Add more to cart', async () => {
    const user = renderApp('/cart')

    await user.click(screen.getByRole('button', { name: 'Add more to cart' }))

    expect(await screen.findByRole('heading', { name: 'Shop' })).toBeInTheDocument()
  })
})
