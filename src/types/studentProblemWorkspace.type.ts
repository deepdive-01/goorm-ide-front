export type ProblemWorkspaceTab = 'description' | 'feedback' | 'codeComments'

export interface ProblemFeedbackItem {
  id: string
  authorName: string
  createdAt: string
  message: string
  codeSnippet?: string
}

export interface ProblemCodeCommentItem {
  id: string
  authorName: string
  lineNumber: number
  message: string
  createdAt: string
}

export interface SubmittedCodeReviewComment {
  lineNumber: number
  code: string
  authorName: string
  message: string
}
