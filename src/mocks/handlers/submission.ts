import { http, HttpResponse } from 'msw'
import { mockSubmission } from '../fixtures'

export const submissionHandlers = [
  http.get('*/api/v1/questions/:questionsId/submissions', () =>
    HttpResponse.json({
      status: 200,
      code: 'SUBMISSION_LIST_SUCCESS',
      message: '제출 학생 목록을 조회했습니다.',
      data: {
        question_id: 1,
        total_count: 1,
        submissions: [mockSubmission],
      },
    }),
  ),
]
