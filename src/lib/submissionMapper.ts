import { getSubmission } from '@/services/file'
import { getFeedbacks } from '@/services/feedback'
import {
  filterHighlightsForSubmission,
  normalizeFeedbackList,
  splitOverallFeedbacksForSubmission,
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

function countSubmissionFeedbackSummary(data: unknown, cutoffAt: string) {
  const feedbacks = normalizeFeedbackList(data)
  const { current } = splitOverallFeedbacksForSubmission(feedbacks, cutoffAt)

  return {
    hasCurrentOverallFeedback: current !== undefined,
    lineCommentCount: filterHighlightsForSubmission(feedbacks, cutoffAt).length,
  }
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

function resolveFeedbackStatus(
  hasCurrentOverallFeedback: boolean,
): TeacherSpaceSubmissionListItem['feedbackStatus'] {
  return hasCurrentOverallFeedback ? 'COMPLETED' : 'PENDING'
}

/**
 * 제출 현황 목록 보강 규칙
 * - 제출 취소(submitted_code 없음): 목록에서 제외
 * - 전체 피드백(COMMENT): 현재 제출 회차에 남긴 것만 피드백 완료로 표시
 * - 줄 코멘트(HIGHLIGHT): submitted_at/updated_at 이후만 표시·집계
 */
async function enrichSubmissionListItem(
  submission: TeacherSpaceSubmissionListItem,
): Promise<TeacherSpaceSubmissionListItem | null> {
  try {
    const { data } = await getSubmission(submission.problemId, submission.studentId)
    const detail = data.data

    if (!detail.submitted_code) {
      return null
    }

    const submittedAt = detail.updated_at || submission.submittedAt
    const cutoffAt = resolveSubmissionFeedbackCutoff(detail, submission.submittedAt)

    const summary = await getFeedbacks(submission.id)
      .then(({ data: feedbackData }) =>
        countSubmissionFeedbackSummary(feedbackData.data, cutoffAt),
      )
      .catch(() => ({ hasCurrentOverallFeedback: false, lineCommentCount: 0 }))

    const feedbackStatus = resolveFeedbackStatus(summary.hasCurrentOverallFeedback)

    return {
      ...submission,
      submittedAt,
      feedbackStatus,
      commentCount: summary.lineCommentCount,
    }
  } catch {
    return {
      ...submission,
      commentCount: 0,
    }
  }
}

/** 제출 상세·피드백 API로 제출 현황 목록을 보강한다 */
export async function attachSubmissionFeedbackCounts(
  submissions: TeacherSpaceSubmissionListItem[],
): Promise<TeacherSpaceSubmissionListItem[]> {
  if (submissions.length === 0) {
    return []
  }

  const results = await Promise.all(submissions.map(enrichSubmissionListItem))

  return results.filter((item): item is TeacherSpaceSubmissionListItem => item !== null)
}
