import type { Language } from '@/types/editor.type'

export interface CodeLineComment {
  id: string
  /** 에디터에서 하이라이트할 줄 (스니펫 뷰에서는 1) */
  lineNumber: number
  /** 여러 줄 코멘트일 때 하이라이트 끝 줄 (미설정 시 lineNumber) */
  endLineNumber?: number
  message: string
  authorName?: string
  /** 팝오버·라벨에 표시할 원본 줄 번호 (미설정 시 lineNumber) */
  labelLineNumber?: number
}

export interface CodeFeedbackEditorProps {
  code: string
  language: Language
  comments: CodeLineComment[]
  height?: string
  readOnly?: boolean
  onChange?: (code: string) => void
  className?: string
  /** 스니펫 뷰 등에서 거터에 표시할 첫 줄 번호 */
  baseLineNumber?: number
  /** 줄 번호 클릭 시 선택 범위 (강사 리뷰) */
  selectedLineRange?: { startLine: number; endLine: number } | null
  onLineNumberClick?: (lineNumber: number, shiftKey: boolean) => void
}

/** 학생 플로우 — 줄별 코드 코멘트 */
export interface StudentCodeCommentItem {
  id: string
  authorName: string
  lineNumber: number
  message: string
  createdAt?: string
}

export interface StudentCodeCommentCardProps {
  comment: StudentCodeCommentItem
  code: string
  language: Language
}

export interface StudentCodeCommentsListProps {
  items: StudentCodeCommentItem[]
  code: string
  language: Language
  emptyMessage?: string
}

/** 학생 플로우 — 제출 전체 피드백 */
export interface StudentSubmissionFeedbackItem {
  id: string
  authorName: string
  createdAt: string
  message: string
}

export interface StudentSubmissionFeedbackCardProps {
  feedback: StudentSubmissionFeedbackItem
}

export interface StudentSubmissionFeedbackListProps {
  items: StudentSubmissionFeedbackItem[]
  emptyMessage?: string
}
