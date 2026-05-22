import { http, HttpResponse } from 'msw'
import { mockProblemBank } from '../fixtures'

export const problemBankHandlers = [
  http.get('*/api/v1/problem-bank', () =>
    HttpResponse.json({
      status: 200,
      code: 'SUCCESS',
      message: '문제 은행 목록을 조회했습니다.',
      data: {
        total_count: 1,
        page: 0,
        size: 20,
        problems: [
          {
            id: mockProblemBank.id,
            title: mockProblemBank.title,
            difficulty: mockProblemBank.difficulty,
            language: mockProblemBank.language,
            source_type: mockProblemBank.source_type,
            source_url: mockProblemBank.source_url,
            created_at: mockProblemBank.created_at,
          },
        ],
      },
    }),
  ),

  http.get('*/api/v1/problem-bank/:problemBankId', () =>
    HttpResponse.json({
      status: 200,
      code: 'SUCCESS',
      message: '문제 은행 상세 정보를 조회했습니다.',
      data: mockProblemBank,
    }),
  ),
]
