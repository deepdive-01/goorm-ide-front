import type { CodeLineComment } from '@/types/codeFeedback.type'
import type { TeacherLineComment } from '@/types/teacherSubmissionReview.type'
import { TEACHER_SUBMISSION_REVIEW_COPY } from '@/content/teacherSubmissionReview'

export type TeacherLineSelection = {
  anchorLine: number
  startLine: number
  endLine: number
}

export function formatTeacherLineLabel(startLine: number, endLine: number) {
  return TEACHER_SUBMISSION_REVIEW_COPY.lineRangeLabel(startLine, endLine)
}

export function buildTeacherLineSelection(
  previous: TeacherLineSelection | null,
  lineNumber: number,
  shiftKey: boolean,
): TeacherLineSelection {
  if (shiftKey && previous) {
    const anchorLine = previous.anchorLine
    return {
      anchorLine,
      startLine: Math.min(anchorLine, lineNumber),
      endLine: Math.max(anchorLine, lineNumber),
    }
  }

  return {
    anchorLine: lineNumber,
    startLine: lineNumber,
    endLine: lineNumber,
  }
}

export function toEditorLineComments(
  comments: TeacherLineComment[],
): CodeLineComment[] {
  return comments.map((comment) => ({
    id: comment.id,
    lineNumber: comment.startLine,
    endLineNumber: comment.endLine,
    labelLineNumber: comment.startLine,
    message: comment.message,
  }))
}

export function formatSubmissionDateTime(iso: string) {
  const date = new Date(iso)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  return `${year}-${month}-${day} ${hours}:${minutes}`
}
