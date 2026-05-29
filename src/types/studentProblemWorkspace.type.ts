export type ProblemWorkspaceTab = 'description' | 'feedback' | 'codeComments'

export interface SubmittedCodeReviewComment {
  lineNumber: number
  code: string
  authorName: string
  message: string
}
