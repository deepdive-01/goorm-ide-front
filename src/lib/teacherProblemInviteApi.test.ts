import { describe, expect, it } from 'vitest'
import { getInviteByEmailErrorMessage, validateInviteEmailInput } from '@/lib/inviteForm'
import {
  getCreateProblemErrorMessage,
  validateCreateProblemForm,
} from '@/lib/problemForm'
import { normalizeProblemCreated } from '@/lib/problemMapper'
import { normalizeInviteEmailResponse } from '@/lib/workspaceMapper'
import { createAxiosError } from '@/tests/authTestUtils'

describe('problemMapper', () => {
  it('camelCase 문항 생성 응답을 정규화한다', () => {
    expect(
      normalizeProblemCreated({
        id: 10,
        spaceId: 2,
        createdBy: 1,
        problemBankId: null,
        title: '두 수의 합',
        difficulty: 'EASY',
        language: 'PYTHON',
        isPublished: false,
        createdAt: '2025-05-11T13:00:00Z',
      }),
    ).toEqual({
      id: 10,
      space_id: 2,
      created_by: 1,
      problem_bank_id: null,
      title: '두 수의 합',
      difficulty: 'EASY',
      language: 'PYTHON',
      is_published: false,
      created_at: '2025-05-11T13:00:00Z',
    })
  })
})

describe('workspaceMapper invite', () => {
  it('camelCase 이메일 초대 응답을 정규화한다', () => {
    expect(
      normalizeInviteEmailResponse({
        spaceId: 1,
        spaceName: '파이썬',
        sentCount: 3,
      }),
    ).toEqual({
      space_id: 1,
      space_name: '파이썬',
      sent_count: 3,
    })
  })
})

describe('problemForm', () => {
  it('필수 입력값을 검증한다', () => {
    expect(
      validateCreateProblemForm({
        title: '',
        language: 'PYTHON',
        description: '설명',
        testcases: [{ input: '1', expected_output: '1', is_hidden: false, order_num: 1 }],
      }),
    ).toBe('문항 제목을 입력해주세요')

    expect(
      validateCreateProblemForm({
        title: '제목',
        language: 'PYTHON',
        description: '',
        testcases: [{ input: '1', expected_output: '1', is_hidden: false, order_num: 1 }],
      }),
    ).toBe('문제 설명을 입력해주세요')

    expect(
      validateCreateProblemForm({
        title: '제목',
        language: 'PYTHON',
        description: '설명',
        testcases: [{ input: '', expected_output: '1', is_hidden: false, order_num: 1 }],
      }),
    ).toBe('입력값을 입력해주세요')
  })

  it('API 오류 메시지를 구분한다', () => {
    expect(getCreateProblemErrorMessage(createAxiosError(500, 'INTERNAL_ERROR'))).toBe(
      '잠시 후 다시 시도해주세요.',
    )
    expect(getCreateProblemErrorMessage(createAxiosError(404, 'SPACE_NOT_FOUND'))).toBe(
      '유효한 스페이스를 찾을 수 없습니다.',
    )
    expect(
      getCreateProblemErrorMessage({ isAxiosError: true, response: undefined }),
    ).toBe('네트워크 연결 오류가 발생했습니다. 다시 시도해주세요.')
  })
})

describe('inviteForm', () => {
  it('이메일 입력을 검증한다', () => {
    expect(validateInviteEmailInput('')).toBe('이메일을 입력해주세요')
    expect(validateInviteEmailInput('invalid')).toBe('올바른 이메일 형식이 아닙니다')
    expect(validateInviteEmailInput('student@example.com')).toBeNull()
  })

  it('API 오류 메시지를 구분한다', () => {
    expect(getInviteByEmailErrorMessage(createAxiosError(404, 'USER_NOT_FOUND'))).toBe(
      '등록되지 않은 이메일입니다.',
    )

    expect(
      getInviteByEmailErrorMessage(createAxiosError(409, 'MEMBER_ALREADY_EXISTS')),
    ).toBe('이미 스페이스에 참여 중인 사용자입니다.')
  })
})
