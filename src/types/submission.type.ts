export type SubmissionStatus = 'SUBMITTED' | 'PASSED' | 'FAILED'

export interface SubmissionListParams {
  status?: SubmissionStatus
}

export interface SubmissionItem {
  submission_id: number
  student_id: number
  nickname: string
  status: SubmissionStatus
  submitted_at: string
  has_feedback: boolean
}

export interface SubmissionList {
  question_id: number
  total_count: number
  submissions: SubmissionItem[]
}
