import { http, HttpResponse } from 'msw'
import {
  mockProblem,
  mockProblemBank,
  mockProblemList,
  mockProblemsById,
} from '../fixtures'

export const problemHandlers = [
  http.post('*/api/v1/spaces/:spaceId/problems/import', () =>
    HttpResponse.json({
      status: 201,
      code: 'PROBLEM_IMPORTED',
      message: '문제 은행에서 문항을 가져왔습니다.',
      data: {
        id: 2,
        space_id: mockProblem.space_id,
        created_by: mockProblem.created_by,
        problem_bank_id: mockProblemBank.id,
        title: mockProblemBank.title,
        difficulty: mockProblemBank.difficulty,
        language: mockProblemBank.language,
        is_published: false,
        created_at: new Date().toISOString(),
      },
    }),
  ),

  http.post('*/api/v1/spaces/:spaceId/problems', () =>
    HttpResponse.json({
      status: 201,
      code: 'PROBLEM_CREATED',
      message: '문항이 생성됐습니다.',
      data: {
        id: mockProblem.id,
        space_id: mockProblem.space_id,
        created_by: mockProblem.created_by,
        problem_bank_id: mockProblem.problem_bank_id,
        title: mockProblem.title,
        difficulty: mockProblem.difficulty,
        language: mockProblem.language,
        is_published: false,
        created_at: new Date().toISOString(),
      },
    }),
  ),

  http.get('*/api/v1/spaces/:spaceId/problems', () =>
    HttpResponse.json({
      status: 200,
      code: 'SUCCESS',
      message: '문항 목록을 조회했습니다.',
      data: {
        total_count: mockProblemList.length,
        page: 0,
        size: 20,
        problems: mockProblemList,
      },
    }),
  ),

  http.get('*/api/v1/files/problems/space/:spaceId', () =>
    HttpResponse.json({
      status: 200,
      code: 'SUCCESS',
      message: '워크스페이스 문제 목록 조회에 성공하였습니다.',
      data: mockProblemList,
    }),
  ),

  http.get('*/api/v1/spaces/:spaceId/problems/:problemId', ({ params }) => {
    const problemId = Number(params.problemId)
    const problem =
      mockProblemsById[problemId as keyof typeof mockProblemsById] ??
      mockProblem

    return HttpResponse.json({
      status: 200,
      code: 'SUCCESS',
      message: '문항 상세 정보를 조회했습니다.',
      data: problem,
    })
  }),

  http.get('*/api/v1/files/problems/:problemId', ({ params }) => {
    const problemId = Number(params.problemId)
    const problem =
      mockProblemsById[problemId as keyof typeof mockProblemsById] ??
      mockProblem
    const { testcases: _testcases, ...problemWithoutTestcases } = problem

    return HttpResponse.json({
      status: 200,
      code: 'SUCCESS',
      message: '문항 상세 정보를 조회했습니다.',
      data: problemWithoutTestcases,
    })
  }),

  http.get('*/api/v1/files/problems/:problemId/testcases', ({ params }) => {
    const problemId = Number(params.problemId)
    const problem =
      mockProblemsById[problemId as keyof typeof mockProblemsById] ??
      mockProblem

    return HttpResponse.json({
      status: 200,
      code: 'SUCCESS',
      message: '문항 테스트케이스를 조회했습니다.',
      data: problem.testcases,
    })
  }),

  http.patch('*/api/v1/spaces/:spaceId/problems/:problemId', () =>
    HttpResponse.json({
      status: 200,
      code: 'PROBLEM_UPDATED',
      message: '문항이 수정됐습니다.',
      data: {
        id: mockProblem.id,
        title: mockProblem.title,
        description: mockProblem.description,
        difficulty: mockProblem.difficulty,
        language: mockProblem.language,
        is_published: mockProblem.is_published,
        updated_at: new Date().toISOString(),
      },
    }),
  ),

  http.delete('*/api/v1/spaces/:spaceId/problems/:problemId', () =>
    HttpResponse.json({
      status: 200,
      code: 'PROBLEM_DELETED',
      message: '문항이 삭제됐습니다.',
      data: null,
    }),
  ),
]
