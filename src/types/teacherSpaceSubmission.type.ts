export type TeacherSpaceFeedbackStatus = 'PENDING' | 'COMPLETED'

export type TeacherSpaceSubmissionListItem = {
  id: number
  problemId: number
  studentId: number
  studentNickname: string
  problemTitle: string
  submittedAt: string
  feedbackStatus: TeacherSpaceFeedbackStatus
  commentCount: number
}
