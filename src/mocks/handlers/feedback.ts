import { http, HttpResponse } from 'msw'
import { mockFeedback } from '../fixtures'

export const feedbackHandlers = [
  http.post('*/api/v1/feedback/comments', () =>
    HttpResponse.json({
      status: 201,
      code: 'FEEDBACK_CREATED',
      message: '피드백이 등록되었습니다.',
      data: {
        ...mockFeedback,
        type: 'COMMENT' as const,
        created_at: new Date().toISOString(),
      },
    }),
  ),

  http.post('*/api/v1/feedback/highlights', () =>
    HttpResponse.json({
      status: 201,
      code: 'FEEDBACK_CREATED',
      message: '피드백이 등록되었습니다.',
      data: {
        ...mockFeedback,
        feedback_id: 2,
        type: 'HIGHLIGHT' as const,
        start_line: 5,
        end_line: 8,
        color: 'YELLOW',
        created_at: new Date().toISOString(),
      },
    }),
  ),

  http.get('*/api/v1/feedback', ({ request }) => {
    const url = new URL(request.url)
    const submissionId = Number(url.searchParams.get('submission_id'))

    const data =
      submissionId === 1
        ? [
            {
              ...mockFeedback,
              feedback_id: 1,
              type: 'HIGHLIGHT' as const,
              content: 'map 함수를 사용해 깔끔하게 처리했네요!',
              start_line: 2,
              end_line: 2,
              color: 'YELLOW' as const,
            },
          ]
        : submissionId === 2
          ? [
              {
                ...mockFeedback,
                feedback_id: 2,
                type: 'COMMENT' as const,
                content: '전반적으로 잘 작성했습니다.',
              },
            ]
          : [mockFeedback]

    return HttpResponse.json({
      status: 200,
      code: 'FEEDBACK_LIST_SUCCESS',
      message: '피드백 목록을 조회했습니다.',
      data,
    })
  }),

  http.put('*/api/v1/feedback/:feedbackId', () =>
    HttpResponse.json({
      status: 200,
      code: 'FEEDBACK_UPDATED',
      message: '피드백이 수정되었습니다.',
      data: { ...mockFeedback, created_at: new Date().toISOString() },
    }),
  ),

  http.delete('*/api/v1/feedback/:feedbackId', () =>
    HttpResponse.json({
      status: 200,
      code: 'FEEDBACK_DELETED',
      message: '피드백이 삭제되었습니다.',
      data: null,
    }),
  ),
]
