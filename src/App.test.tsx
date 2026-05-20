import { screen } from '@testing-library/react'
import { renderWithRouter } from '@/tests/utils'
import App from './App'

vi.mock('@/pages/ExamplePage', () => ({
  default: () => <div>ExamplePage</div>,
}))

describe('App', () => {
  test('기본 라우트(/)에서 ExamplePage를 렌더링한다', () => {
    renderWithRouter(<App />)

    expect(screen.getByText('ExamplePage')).toBeInTheDocument()
  })
})
