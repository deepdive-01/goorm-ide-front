import { http, HttpResponse } from 'msw'
import { mockSubmission, mockTeacherSpaceSubmissions } from '../fixtures'

export const submissionHandlers = [
  http.get('*/api/v1/questions/:problemId/submissions', () =>
    HttpResponse.json({
      status: 200,
      code: 'SUBMISSION_LIST_SUCCESS',
      message: '제출 학생 목록을 조회했습니다.',
      data: {
        questionId: 1,
        totalCount: mockTeacherSpaceSubmissions.length,
        submissions: mockTeacherSpaceSubmissions.map((item) => ({
          submissionId: item.id,
          studentId: item.studentId,
          nickname: item.studentNickname,
          status: 'SUCCESS',
          hasFeedback: item.feedbackStatus === 'COMPLETED',
        })),
      },
    }),
  ),

  http.get('*/api/v1/questions/:questionsId/submissions', () =>
    HttpResponse.json({
      status: 200,
      code: 'SUBMISSION_LIST_SUCCESS',
      message: '제출 학생 목록을 조회했습니다.',
      data: {
        questionId: 1,
        totalCount: 1,
        submissions: [mockSubmission],
      },
    }),
  ),
]
