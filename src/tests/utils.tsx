import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import type { ReactElement } from 'react'

interface RenderWithRouterOptions {
  route?: string
}

export const renderWithRouter = (
  ui: ReactElement,
  { route = '/' }: RenderWithRouterOptions = {},
) =>
  render(<MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>)
