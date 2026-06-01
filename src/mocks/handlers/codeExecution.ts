import { http, HttpResponse, delay } from 'msw'

interface GradeRequestBody {
  problemId: number
  language: string
  code: string
}

export const codeExecutionHandlers = [
  http.post('*/api/v1/code/grade', async ({ request }) => {
    const body = (await request.json()) as GradeRequestBody

    await delay(800)

    if (!body.code.trim()) {
      return HttpResponse.json(
        {
          status: 400,
          code: 'INVALID_INPUT',
          message: '입력값이 올바르지 않습니다.',
          data: null,
        },
        { status: 400 },
      )
    }

    return HttpResponse.json({
      status: 200,
      code: 'SUCCESS',
      message: '채점 완료',
      data: {
        status: 'PASS',
        pass_count: 2,
        total_count: 2,
        results: [
          {
            order_num: 1,
            passed: true,
            input: '3 5',
            expected_output: '8',
            actual_output: '8',
          },
          {
            order_num: 2,
            passed: true,
            input: '10 20',
            expected_output: '30',
            actual_output: '30',
          },
        ],
      },
    })
  }),
]
