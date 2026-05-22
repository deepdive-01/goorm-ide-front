import { http, HttpResponse } from 'msw'
import { mockProblem } from '../fixtures'

export const fileHandlers = [
  http.post('*/api/v1/files/problems/custom', () =>
    HttpResponse.json({
      status: 201,
      code: 'CREATED',
      message: '맞춤형 문제 생성 성공',
      data: 2,
    }),
  ),

  http.post('*/api/v1/files/problems/:problemId/submit', () =>
    HttpResponse.json({
      status: 200,
      code: 'OK',
      message: '코드가 성공적으로 제출되었습니다.',
      data: null,
    }),
  ),

  http.delete('*/api/v1/files/problems/:problemId/reset', () =>
    HttpResponse.json({
      status: 200,
      code: 'OK',
      message: '코드 초기화 성공',
      data: null,
    }),
  ),

  http.post('*/api/v1/files/problems/:problemId/testcases', () =>
    HttpResponse.json({
      status: 201,
      code: 'CREATED',
      message: '테스트케이스 추가 성공',
      data: 101,
    }),
  ),

  http.post('*/api/v1/files/problems', () =>
    HttpResponse.json({
      status: 201,
      code: 'CREATED',
      message: '문제 할당 성공',
      data: 1,
    }),
  ),

  http.patch('*/api/v1/files/problems/:problemId/code', () =>
    HttpResponse.json({
      status: 200,
      code: 'OK',
      message: '코드 임시 저장 성공',
      data: null,
    }),
  ),

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
      data: { problemId: mockProblem.id },
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
