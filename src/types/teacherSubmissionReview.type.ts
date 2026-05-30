export type TeacherLineComment = {
  id: string
  startLine: number
  endLine: number
  message: string
}

export type TeacherSubmissionReviewDetail = {
  submissionId: number
  problemId: number
  studentNickname: string
  submittedAt: string
  code: string
  lineComments: TeacherLineComment[]
  overallFeedback: string
}
