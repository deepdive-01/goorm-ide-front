import { http, HttpResponse } from 'msw'
import type { CreateProblemRequest } from '@/types/problem.type'
import {
  applyMockCancelSubmit,
  applyMockSubmit,
  createMockProblem,
  getMockSubmissionDetail,
  mockFileProblemDetail,
  mockProblem,
  mockProblemsById,
  replaceMockProblemTestcases,
  updateMockProblem,
} from '../fixtures'

function readNumberField(body: Record<string, unknown>, snakeKey: string, camelKey: string): number {
  const snake = body[snakeKey]
  if (typeof snake === 'number' && Number.isFinite(snake)) {
    return snake
  }

  const camel = body[camelKey]
  if (typeof camel === 'number' && Number.isFinite(camel)) {
    return camel
  }

  return 0
}

function readStringField(body: Record<string, unknown>, key: string): string {
  const value = body[key]
  return typeof value === 'string' ? value : ''
}

export const fileHandlers = [
  http.post('*/api/v1/files/problems/custom', () =>
    HttpResponse.json({
      status: 201,
      code: 'CREATED',
      message: '맞춤형 문제 생성 성공',
      data: 2,
    }),
  ),

  http.post('*/api/v1/files/submissions', async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>
    const problemId = readNumberField(body, 'problem_id', 'problemId')
    const submittedCode = readStringField(body, 'submitted_code') ||
      readStringField(body, 'submittedCode')

    if (problemId > 0 && submittedCode) {
      applyMockSubmit(problemId, submittedCode)
    }

    return HttpResponse.json({
      status: 200,
      code: 'OK',
      message: '코드가 성공적으로 제출되었습니다.',
      data: null,
    })
  }),

  http.get('*/api/v1/files/submissions/:problemId/:userId', ({ params }) => {
    const problemId = Number(params.problemId)

    return HttpResponse.json({
      status: 200,
      code: 'OK',
      message: '제출 정보를 조회했습니다.',
      data: getMockSubmissionDetail(problemId),
    })
  }),

  http.put('*/api/v1/files/submissions/:problemId/:userId', () =>
    HttpResponse.json({
      status: 200,
      code: 'OK',
      message: '임시 저장 코드가 수정되었습니다.',
      data: null,
    }),
  ),

  http.delete('*/api/v1/files/submissions/:problemId/:userId', ({ params }) => {
    const problemId = Number(params.problemId)
    applyMockCancelSubmit(problemId)

    return HttpResponse.json({
      status: 200,
      code: 'OK',
      message: '제출이 취소되었습니다.',
      data: null,
    })
  }),

  http.delete('*/api/v1/files/problems/:problemId/reset', () =>
    HttpResponse.json({
      status: 200,
      code: 'OK',
      message: '코드 초기화 성공',
      data: null,
    }),
  ),

  http.post('*/api/v1/files/problems/:problemId/testcases', async ({ request, params }) => {
    const body = (await request.json()) as Array<Record<string, unknown>>
    const problemId = Number(params.problemId)
    replaceMockProblemTestcases(problemId, body)

    return HttpResponse.json({
      status: 200,
      code: 'SUCCESS',
      message: '테스트케이스 저장 성공',
      data: null,
    })
  }),

  http.post('*/api/v1/files/problems', async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>
    const payload: CreateProblemRequest & { spaceId: number; createdBy: number } = {
      spaceId: readNumberField(body, 'space_id', 'spaceId'),
      createdBy: readNumberField(body, 'created_by', 'createdBy'),
      title: readStringField(body, 'title'),
      description: readStringField(body, 'description'),
      difficulty: readStringField(body, 'difficulty') as CreateProblemRequest['difficulty'],
      language: readStringField(body, 'language') as CreateProblemRequest['language'],
      starter_code: readStringField(body, 'starter_code') || readStringField(body, 'starterCode'),
      testcases: [],
    }

    const created = createMockProblem(payload)

    return HttpResponse.json({
      status: 200,
      code: 'SUCCESS',
      message: '문항이 생성됐습니다.',
      data: created,
    })
  }),

  http.patch('*/api/v1/files/problems/:problemId/code', () =>
    HttpResponse.json({
      status: 200,
      code: 'OK',
      message: '코드 임시 저장 성공',
      data: null,
    }),
  ),

  http.put('*/api/v1/files/problems/:problemId', async ({ request, params }) => {
    const body = (await request.json()) as Record<string, unknown>
    const problemId = Number(params.problemId)

    updateMockProblem(problemId, {
      title: readStringField(body, 'title'),
      description: readStringField(body, 'description'),
      difficulty: readStringField(body, 'difficulty') as CreateProblemRequest['difficulty'],
      language: readStringField(body, 'language') as CreateProblemRequest['language'],
      starter_code: readStringField(body, 'starter_code') || readStringField(body, 'starterCode'),
      is_published:
        typeof body.is_published === 'boolean'
          ? body.is_published
          : typeof body.isPublished === 'boolean'
            ? body.isPublished
            : undefined,
    })

    const problem = mockProblemsById[problemId] ?? mockProblem

    return HttpResponse.json({
      status: 200,
      code: 'SUCCESS',
      message: '문항이 수정됐습니다.',
      data: {
        id: problem.id,
        space_id: problem.space_id,
        created_by: problem.created_by,
        problem_bank_id: problem.problem_bank_id,
        title: problem.title,
        difficulty: problem.difficulty,
        language: problem.language,
        is_published: problem.is_published,
        created_at: problem.created_at,
      },
    })
  }),

  http.patch('*/api/v1/files/problems/:problemId', () =>
    HttpResponse.json({
      status: 200,
      code: 'OK',
      message: '문제 수정 성공',
      data: null,
    }),
  ),

  http.get('*/api/v1/files/problems/:problemId', () =>
    HttpResponse.json({
      status: 200,
      code: 'OK',
      message: '문제 상세 정보 로드 성공',
      data: mockFileProblemDetail,
    }),
  ),

  http.delete('*/api/v1/files/problems/:problemId', () =>
    HttpResponse.json({
      status: 200,
      code: 'OK',
      message: '문제 삭제 성공',
      data: null,
    }),
  ),

  http.delete('*/api/v1/files/testcases/:testCaseId', () =>
    HttpResponse.json({
      status: 200,
      code: 'OK',
      message: '테스트케이스 삭제 성공',
      data: null,
    }),
  ),
]
