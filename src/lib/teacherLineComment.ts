import { TEACHER_SUBMISSION_REVIEW_COPY } from '@/content/teacherSubmissionReview'
import { formatApiDateTime } from '@/lib/formatDateTime'
import type { CodeLineComment } from '@/types/codeFeedback.type'
import type { TeacherLineComment } from '@/types/teacherSubmissionReview.type'

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
    endLineNumber:
      comment.endLine !== comment.startLine ? comment.endLine : undefined,
    labelLineNumber: comment.startLine,
    message: comment.message,
  }))
}

export function formatSubmissionDateTime(iso: string) {
  return formatApiDateTime(iso)
}
