import { render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router'
import routes from './route'

describe('App', () => {
  it('renders the home page at /', () => {
    render(<RouterProvider router={createMemoryRouter(routes)} />)
    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument()
  })
})
