/** Swagger SubmissionItem.status */
export type SubmissionStatus = 'PENDING' | 'SUCCESS' | 'FAIL' | 'ERROR'

export interface SubmissionListParams {
  status?: SubmissionStatus
}

export interface SubmissionItem {
  submission_id: number
  student_id: number
  nickname: string
  status: SubmissionStatus
  has_feedback: boolean
  submitted_at?: string
}

export interface SubmissionList {
  question_id: number
  total_count: number
  submissions: SubmissionItem[]
}
