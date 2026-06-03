import { describe, expect, it, vi } from 'vitest'
import {
  attachSubmissionFeedbackCounts,
  mapSubmissionToTeacherListItem,
  normalizeSubmissionItem,
  normalizeSubmissionList,
} from '@/lib/submissionMapper'
import {
  normalizeWorkspaceDetail,
  normalizeWorkspaceListItem,
} from '@/lib/workspaceMapper'
import { getFeedbacks } from '@/services/feedback'
import { getSubmission } from '@/services/file'

vi.mock('@/services/feedback', () => ({
  getFeedbacks: vi.fn(),
}))

vi.mock('@/services/file', () => ({
  getSubmission: vi.fn(),
}))

const activeSubmissionDetail = {
  saved_code: 'draft',
  submitted_code: 'print(1)',
  status: 'SUCCESS',
  execution_time_ms: null,
  execution_memory_kb: null,
  error_message: null,
  created_at: '2026-06-01T00:00:00Z',
  updated_at: '2026-06-03T10:00:00Z',
}

function mockActiveSubmission(
  overrides: Partial<typeof activeSubmissionDetail> & { id?: number; problem_id?: number; student_id?: number } = {},
) {
  vi.mocked(getSubmission).mockResolvedValue({
    data: {
      data: {
        id: overrides.id ?? 1,
        problem_id: overrides.problem_id ?? 10,
        student_id: overrides.student_id ?? 2,
        ...activeSubmissionDetail,
        ...overrides,
      },
    },
  } as Awaited<ReturnType<typeof getSubmission>>)
}

function mockCancelledSubmission(studentId = 2) {
  vi.mocked(getSubmission).mockResolvedValue({
    data: {
      data: {
        id: 1,
        problem_id: 10,
        student_id: studentId,
        saved_code: 'draft',
        submitted_code: null,
        status: 'DRAFT',
        execution_time_ms: null,
        execution_memory_kb: null,
        error_message: null,
        created_at: '2026-06-01T00:00:00Z',
        updated_at: '2026-06-03T12:00:00Z',
      },
    },
  } as Awaited<ReturnType<typeof getSubmission>>)
}

describe('workspaceMapper', () => {
  it('camelCase 스페이스 목록 응답을 정규화한다', () => {
    expect(
      normalizeWorkspaceListItem({
        id: 1,
        name: '파이썬',
        description: '설명',
        memberCount: 12,
        isActive: true,
        createdAt: '2025-05-11T13:00:00Z',
      }),
    ).toEqual({
      id: 1,
      name: '파이썬',
      description: '설명',
      member_count: 12,
      is_active: true,
      created_at: '2025-05-11T13:00:00Z',
      mentor_name: undefined,
      problem_count: undefined,
      file_count: undefined,
    })
  })

  it('camelCase 스페이스 상세 응답을 정규화한다', () => {
    expect(
      normalizeWorkspaceDetail({
        id: 2,
        name: '알고리즘',
        description: '상세',
        mentor: { id: 9, nickname: '강사' },
        inviteCode: 'ABC123',
        memberCount: 5,
        isPublic: false,
        isActive: true,
        createdAt: '2025-05-11T13:00:00Z',
      }),
    ).toMatchObject({
      id: 2,
      name: '알고리즘',
      invite_code: 'ABC123',
      member_count: 5,
      mentor: { id: 9, nickname: '강사' },
    })
  })
})

describe('submissionMapper', () => {
  it('camelCase 제출 목록 응답을 정규화한다', () => {
    expect(
      normalizeSubmissionList({
        questionId: 10,
        totalCount: 1,
        submissions: [
          {
            submissionId: 3,
            studentId: 7,
            nickname: '학생A',
            status: 'SUCCESS',
            hasFeedback: true,
          },
        ],
      }),
    ).toEqual({
      question_id: 10,
      total_count: 1,
      submissions: [
        {
          submission_id: 3,
          student_id: 7,
          nickname: '학생A',
          status: 'SUCCESS',
          has_feedback: true,
          submitted_at: undefined,
        },
      ],
    })
  })

  it('제출 항목을 강사 제출 목록 UI 모델로 변환한다', () => {
    expect(
      mapSubmissionToTeacherListItem(
        normalizeSubmissionItem({
          submissionId: 1,
          studentId: 2,
          nickname: '최학생',
          status: 'PENDING',
          hasFeedback: false,
        }),
        99,
        '두 수의 합',
      ),
    ).toEqual({
      id: 1,
      problemId: 99,
      studentId: 2,
      studentNickname: '최학생',
      problemTitle: '두 수의 합',
      submittedAt: '',
      feedbackStatus: 'PENDING',
      commentCount: 0,
    })
  })

  it('제출 중인 항목도 피드백 API를 조회해 전체 피드백 여부를 보강한다', async () => {
    vi.mocked(getFeedbacks).mockClear()
    mockActiveSubmission({ student_id: 2 })
    vi.mocked(getFeedbacks).mockImplementation(async (submissionId) => {
      if (submissionId === 1) {
        return {
          data: {
            data: [{ feedback_id: 1, type: 'COMMENT', created_at: '2026-06-01T10:00:00Z' }],
          },
        } as Awaited<ReturnType<typeof getFeedbacks>>
      }

      return { data: { data: [] } } as unknown as Awaited<
        ReturnType<typeof getFeedbacks>
      >
    })

    const result = await attachSubmissionFeedbackCounts([
      {
        id: 1,
        problemId: 10,
        studentId: 2,
        studentNickname: '최학생',
        problemTitle: '문제',
        submittedAt: '',
        feedbackStatus: 'PENDING',
        commentCount: 0,
      },
      {
        id: 2,
        problemId: 10,
        studentId: 3,
        studentNickname: '정학생',
        problemTitle: '문제',
        submittedAt: '',
        feedbackStatus: 'PENDING',
        commentCount: 0,
      },
    ])

    expect(getFeedbacks).toHaveBeenCalledTimes(2)
    expect(result[0]?.commentCount).toBe(0)
    expect(result[0]?.feedbackStatus).toBe('PENDING')
    expect(result[1]?.commentCount).toBe(0)
    expect(result[1]?.feedbackStatus).toBe('PENDING')
  })

  it('현재 제출 회차 줄 코멘트 수만 댓글 수에 반영한다', async () => {
    vi.mocked(getFeedbacks).mockClear()
    vi.mocked(getSubmission).mockImplementation(async (_problemId, studentId) => {
      if (studentId === 3) {
        return {
          data: {
            data: {
              id: 2,
              problem_id: 10,
              student_id: 3,
              ...activeSubmissionDetail,
            },
          },
        } as Awaited<ReturnType<typeof getSubmission>>
      }

      return {
        data: {
          data: {
            id: 1,
            problem_id: 10,
            student_id: 2,
            ...activeSubmissionDetail,
          },
        },
      } as Awaited<ReturnType<typeof getSubmission>>
    })

    vi.mocked(getFeedbacks).mockImplementation(async (submissionId) => {
      if (submissionId === 2) {
        return {
          data: {
            data: [
              {
                feedback_id: 1,
                type: 'COMMENT',
                created_at: '2026-06-01T09:00:00Z',
              },
              {
                feedback_id: 4,
                type: 'COMMENT',
                created_at: '2026-06-03T11:00:00Z',
              },
              {
                feedback_id: 2,
                type: 'HIGHLIGHT',
                created_at: '2026-06-03T12:00:00Z',
                start_line: 1,
                end_line: 1,
              },
              {
                feedback_id: 3,
                type: 'HIGHLIGHT',
                created_at: '2026-06-01T10:00:00Z',
                start_line: 2,
                end_line: 2,
              },
            ],
          },
        } as Awaited<ReturnType<typeof getFeedbacks>>
      }

      return { data: { data: [] } } as unknown as Awaited<
        ReturnType<typeof getFeedbacks>
      >
    })

    const result = await attachSubmissionFeedbackCounts([
      {
        id: 1,
        problemId: 10,
        studentId: 2,
        studentNickname: '최학생',
        problemTitle: '문제',
        submittedAt: '',
        feedbackStatus: 'PENDING',
        commentCount: 0,
      },
      {
        id: 2,
        problemId: 10,
        studentId: 3,
        studentNickname: '정학생',
        problemTitle: '문제',
        submittedAt: '2026-06-03T10:00:00Z',
        feedbackStatus: 'COMPLETED',
        commentCount: 0,
      },
    ])

    expect(getFeedbacks).toHaveBeenCalledTimes(2)
    expect(getFeedbacks).toHaveBeenCalledWith(2)
    expect(result[0]?.commentCount).toBe(0)
    expect(result[0]?.feedbackStatus).toBe('PENDING')
    expect(result[1]?.commentCount).toBe(1)
    expect(result[1]?.feedbackStatus).toBe('COMPLETED')
  })

  it('재제출 후 이전 전체 피드백만 있으면 대기 중으로 표시하고 줄 코멘트는 0이다', async () => {
    vi.mocked(getFeedbacks).mockClear()
    mockActiveSubmission({ id: 99, student_id: 2 })
    vi.mocked(getFeedbacks).mockResolvedValue({
      data: {
        data: [
          {
            feedback_id: 1,
            type: 'COMMENT',
            content: '이전 제출 피드백',
            created_at: '2026-06-01T10:00:00Z',
          },
          {
            feedback_id: 2,
            type: 'HIGHLIGHT',
            content: '이전 제출 줄 코멘트',
            created_at: '2026-06-01T11:00:00Z',
            start_line: 1,
            end_line: 1,
          },
        ],
      },
    } as Awaited<ReturnType<typeof getFeedbacks>>)

    const [item] = await attachSubmissionFeedbackCounts([
      {
        id: 99,
        problemId: 10,
        studentId: 2,
        studentNickname: '최학생',
        problemTitle: '문제',
        submittedAt: '2026-06-03T10:00:00Z',
        feedbackStatus: 'COMPLETED',
        commentCount: 0,
      },
    ])

    expect(item?.commentCount).toBe(0)
    expect(item?.feedbackStatus).toBe('PENDING')
  })

  it('목록 submitted_at이 갱신되지 않아도 제출 상세 updated_at으로 줄 코멘트 회차를 판별한다', async () => {
    vi.mocked(getFeedbacks).mockClear()
    mockActiveSubmission({ id: 99, student_id: 2 })
    vi.mocked(getFeedbacks).mockResolvedValue({
      data: {
        data: [
          {
            feedback_id: 1,
            type: 'HIGHLIGHT',
            created_at: '2026-06-02T10:00:00Z',
            start_line: 1,
            end_line: 1,
          },
        ],
      },
    } as Awaited<ReturnType<typeof getFeedbacks>>)

    const [item] = await attachSubmissionFeedbackCounts([
      {
        id: 99,
        problemId: 10,
        studentId: 2,
        studentNickname: '최학생',
        problemTitle: '문제',
        submittedAt: '2026-06-01T10:00:00Z',
        feedbackStatus: 'COMPLETED',
        commentCount: 0,
      },
    ])

    expect(item?.feedbackStatus).toBe('PENDING')
    expect(item?.commentCount).toBe(0)
  })

  it('재제출 후 has_feedback이 false이고 현재 회차 피드백이 없으면 대기 중으로 표시한다', async () => {
    vi.mocked(getFeedbacks).mockClear()
    mockActiveSubmission({ id: 99, student_id: 2 })
    vi.mocked(getFeedbacks).mockResolvedValue({
      data: {
        data: [
          {
            feedback_id: 1,
            type: 'COMMENT',
            content: '이전 제출 피드백',
            created_at: '2026-01-01T00:00:00Z',
          },
          { feedback_id: 2, type: 'HIGHLIGHT', created_at: '2026-01-02T00:00:00Z', start_line: 1, end_line: 1 },
        ],
      },
    } as Awaited<ReturnType<typeof getFeedbacks>>)

    const [item] = await attachSubmissionFeedbackCounts([
      {
        id: 99,
        problemId: 10,
        studentId: 2,
        studentNickname: '최학생',
        problemTitle: '문제',
        submittedAt: '2026-01-01',
        feedbackStatus: 'PENDING',
        commentCount: 0,
      },
    ])

    expect(getFeedbacks).toHaveBeenCalledWith(99)
    expect(item?.commentCount).toBe(0)
    expect(item?.feedbackStatus).toBe('PENDING')
  })

  it('제출 취소 후에는 제출 현황 목록에서 제외한다', async () => {
    vi.mocked(getFeedbacks).mockClear()
    mockCancelledSubmission(2)

    const result = await attachSubmissionFeedbackCounts([
      {
        id: 99,
        problemId: 10,
        studentId: 2,
        studentNickname: '최학생',
        problemTitle: '문제',
        submittedAt: '2026-06-01T10:00:00Z',
        feedbackStatus: 'COMPLETED',
        commentCount: 0,
      },
    ])

    expect(getFeedbacks).not.toHaveBeenCalled()
    expect(result).toEqual([])
  })
})
