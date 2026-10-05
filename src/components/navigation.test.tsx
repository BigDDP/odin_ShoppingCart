import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router'

import Navigation from './navigation'

const renderNavigation = (totalCount: number, path = '/') =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Navigation totalCount={totalCount} />
    </MemoryRouter>,
  )

describe('Navigation', () => {
  it('links to home, shop and cart', () => {
    renderNavigation(0)

    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: 'Shop' })).toHaveAttribute('href', '/shop')
    expect(screen.getByRole('link', { name: /^cart/i })).toHaveAttribute('href', '/cart')
  })

  it('hides the cart pill when the cart is empty', () => {
    renderNavigation(0)

    expect(screen.getByRole('link', { name: /^cart/i })).toHaveTextContent(/^Cart$/)
  })

  it('shows the cart count in the pill', () => {
    renderNavigation(12)

    const cartLink = screen.getByRole('link', { name: /^cart/i })
    expect(within(cartLink).getByText('12')).toBeInTheDocument()
  })

  it('marks the current page link as active', () => {
    renderNavigation(0, '/shop')

    expect(screen.getByRole('link', { name: 'Shop' })).toHaveAttribute('data-active')
    expect(screen.getByRole('link', { name: 'Home' })).not.toHaveAttribute('data-active')
  })
})
