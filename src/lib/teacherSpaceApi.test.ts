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

vi.mock('@/services/feedback', () => ({
  getFeedbacks: vi.fn(),
}))

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

  it('피드백 목록 API 결과로 댓글 수와 피드백 상태를 보강한다', async () => {
    vi.mocked(getFeedbacks).mockImplementation(async (submissionId) => {
      if (submissionId === 1) {
        return { data: { data: [{ feedback_id: 1 }] } } as Awaited<
          ReturnType<typeof getFeedbacks>
        >
      }

      return { data: { data: [] } } as Awaited<ReturnType<typeof getFeedbacks>>
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

    expect(result[0]?.commentCount).toBe(1)
    expect(result[0]?.feedbackStatus).toBe('COMPLETED')
    expect(result[1]?.commentCount).toBe(0)
    expect(result[1]?.feedbackStatus).toBe('PENDING')
  })
})
