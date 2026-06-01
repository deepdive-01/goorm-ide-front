import userEvent from '@testing-library/user-event'
import { screen } from '@testing-library/react'
import { renderWithRouter } from '@/tests/utils'
import EditorToolbar from './EditorToolbar'
import type { Language } from '@/types/editor.type'

const defaultProps = {
  language: 'PYTHON' as Language,
  onLanguageChange: vi.fn(),
  onRun: vi.fn(),
  onSave: vi.fn(),
  onSubmit: vi.fn(),
}

describe('EditorToolbar', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('현재 언어와 Run/Save/제출 버튼을 렌더링한다', () => {
    renderWithRouter(<EditorToolbar {...defaultProps} />)

    expect(screen.getByText('Python')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'run' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'save' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'submit' })).toBeInTheDocument()
  })

  test('언어 버튼 클릭 시 언어 목록이 열린다', async () => {
    const user = userEvent.setup()
    renderWithRouter(<EditorToolbar {...defaultProps} />)

    await user.click(screen.getByRole('button', { name: 'select-language' }))

    expect(screen.getByRole('button', { name: 'Python' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Java' })).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'JavaScript' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'C++' })).toBeInTheDocument()
  })

  test('언어 선택 시 onLanguageChange를 호출하고 드롭다운을 닫는다', async () => {
    const user = userEvent.setup()
    renderWithRouter(<EditorToolbar {...defaultProps} />)

    await user.click(screen.getByRole('button', { name: 'select-language' }))
    await user.click(screen.getByRole('button', { name: 'Java' }))

    expect(defaultProps.onLanguageChange).toHaveBeenCalledWith('JAVA')
    expect(
      screen.queryByRole('button', { name: 'Java' }),
    ).not.toBeInTheDocument()
  })

  test('Run 버튼 클릭 시 onRun을 호출한다', async () => {
    const user = userEvent.setup()
    renderWithRouter(<EditorToolbar {...defaultProps} />)

    await user.click(screen.getByRole('button', { name: 'run' }))

    expect(defaultProps.onRun).toHaveBeenCalledTimes(1)
  })

  test('Save 버튼 클릭 시 onSave를 호출한다', async () => {
    const user = userEvent.setup()
    renderWithRouter(<EditorToolbar {...defaultProps} />)

    await user.click(screen.getByRole('button', { name: 'save' }))

    expect(defaultProps.onSave).toHaveBeenCalledTimes(1)
  })

  test('제출 버튼 클릭 시 onSubmit을 호출한다', async () => {
    const user = userEvent.setup()
    renderWithRouter(<EditorToolbar {...defaultProps} />)

    await user.click(screen.getByRole('button', { name: 'submit' }))

    expect(defaultProps.onSubmit).toHaveBeenCalledTimes(1)
  })

  test('disabled=true 일 때 Save/제출 버튼이 비활성화된다', () => {
    renderWithRouter(<EditorToolbar {...defaultProps} disabled />)

    expect(screen.getByRole('button', { name: 'save' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'submit' })).toBeDisabled()
  })

  test('disabled=true 여도 Run 버튼은 활성화 상태를 유지한다', () => {
    renderWithRouter(<EditorToolbar {...defaultProps} disabled />)

    expect(screen.getByRole('button', { name: 'run' })).not.toBeDisabled()
  })

  test('드롭다운 외부 클릭 시 드롭다운이 닫힌다', async () => {
    const user = userEvent.setup()
    renderWithRouter(<EditorToolbar {...defaultProps} />)

    await user.click(screen.getByRole('button', { name: 'select-language' }))
    expect(screen.getByRole('button', { name: 'Java' })).toBeInTheDocument()

    await user.click(document.body)
    expect(
      screen.queryByRole('button', { name: 'Java' }),
    ).not.toBeInTheDocument()
  })
})
