import { getFeedbacks } from '@/services/feedback'
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

function countFeedbacksPayload(data: unknown): number {
  if (!Array.isArray(data)) {
    return 0
  }

  return data.length
}

/** 제출별 피드백 목록 API로 댓글 수·피드백 상태를 보강한다 */
export async function attachSubmissionFeedbackCounts(
  submissions: TeacherSpaceSubmissionListItem[],
): Promise<TeacherSpaceSubmissionListItem[]> {
  if (submissions.length === 0) {
    return []
  }

  const uniqueSubmissionIds = [...new Set(submissions.map((item) => item.id))]
  const commentCountBySubmissionId = new Map<number, number>()

  await Promise.all(
    uniqueSubmissionIds.map(async (submissionId) => {
      try {
        const { data } = await getFeedbacks(submissionId)
        commentCountBySubmissionId.set(
          submissionId,
          countFeedbacksPayload(data.data),
        )
      } catch {
        commentCountBySubmissionId.set(submissionId, 0)
      }
    }),
  )

  return submissions.map((submission) => {
    const commentCount = commentCountBySubmissionId.get(submission.id) ?? 0

    return {
      ...submission,
      commentCount,
      feedbackStatus: commentCount > 0 ? 'COMPLETED' : 'PENDING',
    }
  })
}
