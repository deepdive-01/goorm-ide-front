import { screen } from '@testing-library/react'
import { renderWithRouter } from '@/tests/utils'
import App from './App'

describe('App', () => {
  test('renders title', () => {
    renderWithRouter(<App />)

    expect(screen.getByText('CodeRun')).toBeInTheDocument()
  })
})
