import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/react'
import CodeFeedbackCommentMarker from './CodeFeedbackCommentMarker'

describe('CodeFeedbackCommentMarker', () => {
  test('아이콘 hover 시 피드백 내용을 표시한다', async () => {
    const user = userEvent.setup()

    render(
      <CodeFeedbackCommentMarker
        lineNumber={1}
        message="map 함수를 사용해 깔끔하게 처리했네요!"
        top={32}
        lineHeight={25}
      />,
    )

    await user.hover(screen.getByRole('button', { name: '줄 1 피드백 보기' }))
    expect(await screen.findByText('줄 1')).toBeInTheDocument()
    expect(screen.getByText('map 함수를 사용해 깔끔하게 처리했네요!')).toBeInTheDocument()
  })
})
