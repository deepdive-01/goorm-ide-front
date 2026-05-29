import { screen } from '@testing-library/react'
import { render } from '@testing-library/react'
import StudentSubmissionFeedbackCard from './StudentSubmissionFeedbackCard'

describe('StudentSubmissionFeedbackCard', () => {
  test('제출 피드백 내용을 렌더링한다', () => {
    render(
      <StudentSubmissionFeedbackCard
        feedback={{
          id: 'fb-1',
          authorName: '김강사',
          createdAt: '2026-05-14 18:00',
          message: '잘 작성했습니다! 전체적으로 간결한 코드입니다.',
        }}
      />,
    )

    expect(screen.getByText('김강사')).toBeInTheDocument()
    expect(screen.getByText('2026-05-14 18:00')).toBeInTheDocument()
    expect(screen.getByText('잘 작성했습니다! 전체적으로 간결한 코드입니다.')).toBeInTheDocument()
  })
})
