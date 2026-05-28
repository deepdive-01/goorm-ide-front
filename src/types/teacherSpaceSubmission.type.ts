export type TeacherSpaceFeedbackStatus = 'PENDING' | 'COMPLETED'

export type TeacherSpaceSubmissionListItem = {
  id: number
  studentNickname: string
  problemTitle: string
  submittedAt: string
  feedbackStatus: TeacherSpaceFeedbackStatus
  commentCount: number
}
