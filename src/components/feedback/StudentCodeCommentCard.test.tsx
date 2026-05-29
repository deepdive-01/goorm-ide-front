import { screen } from '@testing-library/react'
import { render } from '@testing-library/react'
import { MOCK_CODE_FEEDBACK_SAMPLE } from '@/content/codeFeedback'
import StudentCodeCommentCard from './StudentCodeCommentCard'

vi.mock('@monaco-editor/react', () => ({
  default: () => <div data-testid="monaco-editor" />,
}))

describe('StudentCodeCommentCard', () => {
  test('줄별 코멘트와 에디터를 렌더링한다', () => {
    render(
      <StudentCodeCommentCard
        comment={{
          id: 'cc-1',
          authorName: '김강사',
          lineNumber: 1,
          message: 'map 함수를 사용해 깔끔하게 처리했네요!',
        }}
        code={MOCK_CODE_FEEDBACK_SAMPLE}
        language="python"
      />,
    )

    expect(screen.getByText('김강사')).toBeInTheDocument()
    expect(screen.getByText('줄 1')).toBeInTheDocument()
    expect(screen.getByText('map 함수를 사용해 깔끔하게 처리했네요!')).toBeInTheDocument()
    expect(screen.getByTestId('monaco-editor')).toBeInTheDocument()
  })
})
