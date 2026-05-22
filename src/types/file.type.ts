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
  problemId: number
  [key: string]: unknown
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
  submitted_code: string
}

export interface AddTestcaseRequest {
  input_data: string
  expected_output: string
}
