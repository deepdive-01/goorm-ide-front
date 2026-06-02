import { formatApiDateTime } from '@/lib/formatDateTime'
import type {
  StudentCodeCommentItem,
  StudentSubmissionFeedbackItem,
} from '@/types/codeFeedback.type'
import type { FeedbackItem, FeedbackType } from '@/types/feedback.type'
import type { TeacherLineComment } from '@/types/teacherSubmissionReview.type'

type RecordLike = Record<string, unknown>

const FEEDBACK_TYPES: FeedbackType[] = ['COMMENT', 'HIGHLIGHT']

function asRecord(value: unknown): RecordLike | null {
  if (typeof value !== 'object' || value === null) {
    return null
  }

  return value as RecordLike
}

function readString(record: RecordLike, key: string): string {
  const value = record[key]
  return typeof value === 'string' ? value : ''
}

function readNumber(record: RecordLike, key: string): number {
  const value = record[key]
  return typeof value === 'number' && Number.isFinite(value) ? value : 0
}

function normalizeFeedbackType(value: unknown): FeedbackType {
  if (typeof value === 'string' && FEEDBACK_TYPES.includes(value as FeedbackType)) {
    return value as FeedbackType
  }

  return 'COMMENT'
}

/** Swagger snake_case 피드백 항목 정규화 */
export function normalizeFeedbackItem(value: unknown): FeedbackItem {
  const record = asRecord(value)

  if (!record) {
    return {
      feedback_id: 0,
      type: 'COMMENT',
      content: '',
      created_by: '',
      created_at: '',
    }
  }

  return {
    feedback_id: readNumber(record, 'feedback_id'),
    type: normalizeFeedbackType(record.type),
    content: readString(record, 'content'),
    created_by: readString(record, 'created_by'),
    created_at: readString(record, 'created_at'),
    start_line: readNumber(record, 'start_line') || undefined,
    end_line: readNumber(record, 'end_line') || undefined,
    color:
      typeof record.color === 'string'
        ? (record.color as FeedbackItem['color'])
        : undefined,
  }
}

export function normalizeFeedbackList(value: unknown): FeedbackItem[] {
  if (!Array.isArray(value)) {
    return []
  }

  return value.map((item) => normalizeFeedbackItem(item))
}

export function formatFeedbackDateTime(iso: string) {
  return formatApiDateTime(iso)
}

export function mapHighlightToTeacherLineComment(item: FeedbackItem): TeacherLineComment {
  const startLine = item.start_line ?? 1
  const endLine = item.end_line ?? startLine

  return {
    id: String(item.feedback_id),
    startLine,
    endLine,
    message: item.content,
  }
}

export function mapHighlightsToTeacherLineComments(
  feedbacks: FeedbackItem[],
): TeacherLineComment[] {
  return feedbacks
    .filter((item) => item.type === 'HIGHLIGHT')
    .map(mapHighlightToTeacherLineComment)
}

export function findOverallFeedbackComment(
  feedbacks: FeedbackItem[],
): FeedbackItem | undefined {
  return feedbacks.find((item) => item.type === 'COMMENT')
}

export function mapCommentToStudentSubmissionFeedback(
  item: FeedbackItem,
): StudentSubmissionFeedbackItem {
  return {
    id: String(item.feedback_id),
    authorName: item.created_by,
    createdAt: formatFeedbackDateTime(item.created_at),
    message: item.content,
  }
}

export function mapHighlightToStudentCodeComment(
  item: FeedbackItem,
): StudentCodeCommentItem {
  const startLine = item.start_line ?? 1
  const endLine = item.end_line ?? startLine

  return {
    id: String(item.feedback_id),
    authorName: item.created_by,
    lineNumber: startLine,
    endLineNumber: endLine > startLine ? endLine : undefined,
    message: item.content,
    createdAt: formatFeedbackDateTime(item.created_at),
  }
}

export function mapFeedbacksToStudentViews(feedbacks: FeedbackItem[]) {
  const comments = feedbacks.filter((item) => item.type === 'COMMENT')
  const highlights = feedbacks.filter((item) => item.type === 'HIGHLIGHT')

  return {
    submissionFeedback: comments.map(mapCommentToStudentSubmissionFeedback),
    codeComments: highlights.map(mapHighlightToStudentCodeComment),
  }
}
