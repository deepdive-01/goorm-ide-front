import userEvent from '@testing-library/user-event'
import { screen } from '@testing-library/react'
import { renderWithRouter } from '@/tests/utils'
import ResultPanel from './ResultPanel'
import type { ExecutionResult, GradeResult } from '@/types/editor.type'

const defaultProps = {
  stdin: '',
  onStdinChange: vi.fn(),
  activeTab: '실행결과' as const,
  onTabChange: vi.fn(),
}

const successResult: ExecutionResult = {
  status: 'SUCCESS',
  output: '8\n',
  stderr: '',
}

const errorResult: ExecutionResult = {
  status: 'ERROR',
  output: '',
  stderr: 'Traceback (most recent call last):\n  line 1\nNameError: name undefined',
}

const passGradeResult: GradeResult = {
  status: 'PASS',
  pass_count: 2,
  total_count: 2,
  results: [
    { order_num: 1, passed: true, input: '3 5', expected_output: '8', actual_output: '8' },
    { order_num: 2, passed: true, input: '10 20', expected_output: '30', actual_output: '30' },
  ],
}

const failGradeResult: GradeResult = {
  status: 'FAIL',
  pass_count: 1,
  total_count: 2,
  results: [
    { order_num: 1, passed: true, input: '3 5', expected_output: '8', actual_output: '8' },
    { order_num: 2, passed: false, input: '10 20', expected_output: '30', actual_output: '0' },
  ],
}

describe('ResultPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('실행결과/테스트케이스/에러 탭을 렌더링한다', () => {
    renderWithRouter(<ResultPanel {...defaultProps} />)

    expect(screen.getByRole('button', { name: /실행 결과/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /테스트 케이스/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /에러/ })).toBeInTheDocument()
  })

  test('탭 클릭 시 onTabChange를 호출한다', async () => {
    const user = userEvent.setup()
    renderWithRouter(<ResultPanel {...defaultProps} />)

    await user.click(screen.getByRole('button', { name: /테스트 케이스/ }))

    expect(defaultProps.onTabChange).toHaveBeenCalledWith('테스트케이스')
  })

  describe('실행결과 탭', () => {
    test('실행 성공 시 STDOUT을 표시한다', () => {
      renderWithRouter(
        <ResultPanel {...defaultProps} executionResult={successResult} />,
      )

      expect(screen.getByText('8')).toBeInTheDocument()
    })

    test('실행 결과가 없을 때 빈 출력 placeholder를 표시한다', () => {
      renderWithRouter(<ResultPanel {...defaultProps} />)

      expect(screen.getByText('__')).toBeInTheDocument()
    })

    test('STDIN 입력 시 onStdinChange를 호출한다', async () => {
      const user = userEvent.setup()
      renderWithRouter(<ResultPanel {...defaultProps} />)

      await user.type(screen.getByPlaceholderText('입력값을 입력하세요'), '3 5')

      expect(defaultProps.onStdinChange).toHaveBeenCalled()
    })
  })

  describe('에러 탭', () => {
    test('stderr가 있을 때 에러 내용을 표시한다', () => {
      renderWithRouter(
        <ResultPanel
          {...defaultProps}
          activeTab="에러"
          executionResult={errorResult}
        />,
      )

      expect(screen.getByText(/NameError/)).toBeInTheDocument()
    })

    test('stderr가 없을 때 빈 placeholder를 표시한다', () => {
      renderWithRouter(<ResultPanel {...defaultProps} activeTab="에러" />)

      expect(screen.getByText('__')).toBeInTheDocument()
    })
  })

  describe('채점 결과 배지', () => {
    test('PASS 시 PASS 배지를 표시한다', () => {
      renderWithRouter(
        <ResultPanel {...defaultProps} gradeResult={passGradeResult} />,
      )

      expect(screen.getByText('PASS')).toBeInTheDocument()
    })

    test('FAIL 시 FAIL 배지를 표시한다', () => {
      renderWithRouter(
        <ResultPanel {...defaultProps} gradeResult={failGradeResult} />,
      )

      expect(screen.getByText('FAIL')).toBeInTheDocument()
    })

    test('채점 결과가 없을 때 배지를 표시하지 않는다', () => {
      renderWithRouter(<ResultPanel {...defaultProps} />)

      expect(screen.queryByText('PASS')).not.toBeInTheDocument()
      expect(screen.queryByText('FAIL')).not.toBeInTheDocument()
    })
  })

  describe('테스트케이스 탭', () => {
    test('PASS 채점 결과의 각 테스트케이스를 표시한다', () => {
      renderWithRouter(
        <ResultPanel
          {...defaultProps}
          activeTab="테스트케이스"
          gradeResult={passGradeResult}
        />,
      )

      expect(screen.getByText('TC 1')).toBeInTheDocument()
      expect(screen.getByText('TC 2')).toBeInTheDocument()
      expect(screen.getByText('(2/2)')).toBeInTheDocument()
      expect(screen.getAllByText('통과').length).toBeGreaterThanOrEqual(1)
    })

    test('FAIL 채점 결과에서 실패한 케이스를 표시한다', () => {
      renderWithRouter(
        <ResultPanel
          {...defaultProps}
          activeTab="테스트케이스"
          gradeResult={failGradeResult}
        />,
      )

      expect(screen.getByText('(1/2)')).toBeInTheDocument()
      expect(screen.getByText('실제: 0')).toBeInTheDocument()
    })

    test('채점/실행 결과가 없을 때 안내 문구를 표시한다', () => {
      renderWithRouter(
        <ResultPanel {...defaultProps} activeTab="테스트케이스" />,
      )

      expect(screen.getByText('실행 결과가 없습니다.')).toBeInTheDocument()
    })
  })
})
