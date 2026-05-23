import { screen, within } from '@testing-library/react'
import { renderWithRouter } from '@/tests/utils'
import { LANDING_COPY } from '@/content/landing'
import App from './App'

vi.mock('@/pages/ExamplePage', () => ({
  default: () => <div>ExamplePage</div>,
}))

vi.mock('@/hooks/useCurrentUser', () => ({
  useCurrentUser: () => ({ user: null, isLoading: false }),
}))

describe('App', () => {
  test('랜딩(/)에서 Hero 섹션을 렌더링한다', () => {
    renderWithRouter(<App />, { route: '/' })

    expect(
      screen.getByRole('heading', {
        name: new RegExp(LANDING_COPY.hero.titleHighlight),
      }),
    ).toBeInTheDocument()

    const main = screen.getByRole('main')
    expect(
      within(main).getByRole('link', { name: LANDING_COPY.hero.ctaPrimary }),
    ).toHaveAttribute('href', '/spaces')
    expect(
      within(main).getByRole('link', { name: LANDING_COPY.hero.ctaSecondary }),
    ).toHaveAttribute('href', '/login')
  })
})
