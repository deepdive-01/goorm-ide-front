import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import SpacesEntryRedirect, { SPACES_ENTRY_PATH } from '@/pages/SpacesEntryRedirect'

vi.mock('@/hooks/useCurrentUser', () => ({
  useCurrentUser: () => ({ user: null, isLoading: false }),
}))

describe('SpacesEntryRedirect', () => {
  test('비로그인: 로그인으로', async () => {
    const router = createMemoryRouter(
      [
        { path: '/spaces', element: <SpacesEntryRedirect /> },
        { path: '/login', element: <div>login-page</div> },
      ],
      { initialEntries: [SPACES_ENTRY_PATH] },
    )

    render(<RouterProvider router={router} />)

    expect(await screen.findByText('login-page')).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/login')
  })
})
