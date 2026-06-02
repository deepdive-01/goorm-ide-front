import { getSubmission } from '@/services/file'
import { getFeedbacks } from '@/services/feedback'
import {
  filterFeedbacksForSubmission,
  normalizeFeedbackList,
} from '@/lib/feedbackMapper'
import type { SubmissionDetail } from '@/types/file.type'
import type {
  SubmissionItem,
  SubmissionList,
  SubmissionStatus,
} from '@/types/submission.type'
import type { TeacherSpaceSubmissionListItem } from '@/types/teacherSpaceSubmission.type'

type RecordLike = Record<string, unknown>

function asRecord(value: unknown): RecordLike | null {
  if (typeof value !== 'object' || value === null) {
    return null
  }

  return value as RecordLike
}

function readString(record: RecordLike, camelKey: string, snakeKey: string): string {
  const camel = record[camelKey]
  if (typeof camel === 'string') {
    return camel
  }

  const snake = record[snakeKey]
  if (typeof snake === 'string') {
    return snake
  }

  return ''
}

function readNumber(record: RecordLike, camelKey: string, snakeKey: string): number {
  const camel = record[camelKey]
  if (typeof camel === 'number' && Number.isFinite(camel)) {
    return camel
  }

  const snake = record[snakeKey]
  if (typeof snake === 'number' && Number.isFinite(snake)) {
    return snake
  }

  return 0
}

function readBoolean(record: RecordLike, camelKey: string, snakeKey: string): boolean {
  const camel = record[camelKey]
  if (typeof camel === 'boolean') {
    return camel
  }

  const snake = record[snakeKey]
  if (typeof snake === 'boolean') {
    return snake
  }

  return false
}

const SUBMISSION_STATUSES: SubmissionStatus[] = [
  'PENDING',
  'SUCCESS',
  'FAIL',
  'ERROR',
]

function normalizeSubmissionStatus(value: unknown): SubmissionStatus {
  if (typeof value === 'string' && SUBMISSION_STATUSES.includes(value as SubmissionStatus)) {
    return value as SubmissionStatus
  }

  return 'PENDING'
}

/** API 응답 — Swagger(camelCase)와 snake_case 모두 지원 */
export function normalizeSubmissionItem(value: unknown): SubmissionItem {
  const record = asRecord(value)

  if (!record) {
    return {
      submission_id: 0,
      student_id: 0,
      nickname: '',
      status: 'PENDING',
      has_feedback: false,
    }
  }

  return {
    submission_id: readNumber(record, 'submissionId', 'submission_id'),
    student_id: readNumber(record, 'studentId', 'student_id'),
    nickname: readString(record, 'nickname', 'nickname'),
    status: normalizeSubmissionStatus(record.status),
    has_feedback: readBoolean(record, 'hasFeedback', 'has_feedback'),
    submitted_at: readString(record, 'submittedAt', 'submitted_at') || undefined,
  }
}

export function normalizeSubmissionList(value: unknown): SubmissionList {
  const record = asRecord(value)

  if (!record) {
    return {
      question_id: 0,
      total_count: 0,
      submissions: [],
    }
  }

  const submissions = Array.isArray(record.submissions)
    ? record.submissions.map((item) => normalizeSubmissionItem(item))
    : []

  return {
    question_id: readNumber(record, 'questionId', 'question_id'),
    total_count: readNumber(record, 'totalCount', 'total_count'),
    submissions,
  }
}

export function mapSubmissionToTeacherListItem(
  submission: SubmissionItem,
  problemId: number,
  problemTitle: string,
): TeacherSpaceSubmissionListItem {
  return {
    id: submission.submission_id,
    problemId,
    studentId: submission.student_id,
    studentNickname: submission.nickname,
    problemTitle,
    submittedAt: submission.submitted_at ?? '',
    feedbackStatus: submission.has_feedback ? 'COMPLETED' : 'PENDING',
    commentCount: 0,
  }
}

function countValidFeedbacks(data: unknown, submittedAt: string): number {
  return filterFeedbacksForSubmission(normalizeFeedbackList(data), submittedAt).length
}

/** 제출 상세 updated_at을 우선해 현재 제출 회차 기준 시각을 구한다 */
export function resolveSubmissionFeedbackCutoff(
  detail: SubmissionDetail,
  listSubmittedAt: string,
): string {
  if (!detail.submitted_code) {
    return ''
  }

  return detail.updated_at || listSubmittedAt
}

async function resolveSubmissionFeedbackCutoffForListItem(
  submission: TeacherSpaceSubmissionListItem,
): Promise<string> {
  try {
    const { data } = await getSubmission(submission.problemId, submission.studentId)
    return resolveSubmissionFeedbackCutoff(data.data, submission.submittedAt)
  } catch {
    return submission.submittedAt
  }
}

function resolveFeedbackStatus(
  apiStatus: TeacherSpaceSubmissionListItem['feedbackStatus'],
  validCommentCount: number,
): TeacherSpaceSubmissionListItem['feedbackStatus'] {
  return apiStatus === 'COMPLETED' && validCommentCount > 0 ? 'COMPLETED' : 'PENDING'
}

/** 제출별 피드백 목록 API로 댓글 수·상태를 보강한다 (재제출은 submitted_at 기준으로 판별) */
export async function attachSubmissionFeedbackCounts(
  submissions: TeacherSpaceSubmissionListItem[],
): Promise<TeacherSpaceSubmissionListItem[]> {
  if (submissions.length === 0) {
    return []
  }

  const submissionsToEnrich = submissions.filter(
    (submission) => submission.feedbackStatus === 'COMPLETED',
  )
  const uniqueSubmissionIds = [
    ...new Set(submissionsToEnrich.map((item) => item.id)),
  ]
  const validCommentCountBySubmissionId = new Map<number, number>()

  await Promise.all(
    uniqueSubmissionIds.map(async (submissionId) => {
      const submission = submissionsToEnrich.find((item) => item.id === submissionId)
      if (!submission) {
        return
      }

      const cutoffAt = await resolveSubmissionFeedbackCutoffForListItem(submission)

      try {
        const { data } = await getFeedbacks(submissionId)
        validCommentCountBySubmissionId.set(
          submissionId,
          countValidFeedbacks(data.data, cutoffAt),
        )
      } catch {
        validCommentCountBySubmissionId.set(submissionId, 0)
      }
    }),
  )

  return submissions.map((submission) => {
    if (submission.feedbackStatus === 'PENDING') {
      return {
        ...submission,
        commentCount: 0,
      }
    }

    const validCommentCount = validCommentCountBySubmissionId.get(submission.id) ?? 0
    const feedbackStatus = resolveFeedbackStatus(submission.feedbackStatus, validCommentCount)

    return {
      ...submission,
      feedbackStatus,
      commentCount: feedbackStatus === 'COMPLETED' ? validCommentCount : 0,
    }
  })
}
