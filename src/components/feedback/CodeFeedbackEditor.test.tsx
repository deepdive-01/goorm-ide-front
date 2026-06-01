import { screen } from '@testing-library/react'
import { render } from '@testing-library/react'
import {
  MOCK_CODE_FEEDBACK_SAMPLE,
  MOCK_CODE_LINE_COMMENTS,
} from '@/content/codeFeedback'
import CodeFeedbackEditor from './CodeFeedbackEditor'

vi.mock('@monaco-editor/react', () => ({
  default: () => <div data-testid="monaco-editor" />,
}))

describe('CodeFeedbackEditor', () => {
  test('에디터와 코멘트 마커를 렌더링한다', () => {
    render(
      <CodeFeedbackEditor
        code={MOCK_CODE_FEEDBACK_SAMPLE}
        language="PYTHON"
        comments={[...MOCK_CODE_LINE_COMMENTS]}
        height="180px"
      />,
    )

    expect(screen.getByTestId('monaco-editor')).toBeInTheDocument()
  })
})
