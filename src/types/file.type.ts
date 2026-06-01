import type { Difficulty } from './api.type'

export interface AssignProblemRequest {
  space_id: number
  problem_bank_id: number
  title: string
  description: string
  difficulty?: Difficulty
  starter_code?: string
}

export interface CreateCustomProblemRequest {
  title: string
  description: string
  difficulty?: Difficulty
  starter_code?: string
}

export interface FileProblemDetail {
  problem_id: number
  title: string
  description: string
  language: string
  starter_code: string
  current_code: string
  submitted_code: string | null
  is_final_submitted: boolean
}

export interface UpdateCodeRequest {
  current_code: string
}

export interface UpdateFileProblemRequest {
  title?: string
  description?: string
  difficulty?: Difficulty
  starter_code?: string
}

export interface SubmitCodeRequest {
  problem_id: number
  student_id: number
  saved_code?: string
  submitted_code?: string
  is_final_submit: boolean
}

export interface SubmissionDetail {
  id: number
  problem_id: number
  student_id: number
  saved_code: string | null
  submitted_code: string | null
  status: string
  execution_time_ms: number | null
  execution_memory_kb: number | null
  error_message: string | null
  created_at: string
  updated_at: string
}

export interface UpdateSubmissionRequest {
  problem_id: number
  student_id: number
  saved_code: string
}

export interface AddTestcaseRequest {
  input_data: string
  expected_output: string
}
