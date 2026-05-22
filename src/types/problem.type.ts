import type { Difficulty, Language } from './api.type'
import type { Testcase } from './problemBank.type'

export type { Testcase }

export interface CreateTestcase {
  input: string
  expected_output: string
  is_hidden: boolean
  order_num: number
}

export interface CreateProblemRequest {
  problem_bank_id?: number | null
  title: string
  description: string
  difficulty: Difficulty
  language: Language
  starter_code?: string
  testcases: CreateTestcase[]
}

export interface ProblemCreated {
  id: number
  space_id: number
  created_by: number
  problem_bank_id: number | null
  title: string
  difficulty: Difficulty
  language: Language
  is_published: boolean
  created_at: string
}

export interface ProblemListParams {
  page?: number
  size?: number
}

export interface ProblemListItem {
  id: number
  title: string
  difficulty: Difficulty
  language: Language
  is_published: boolean
  created_at: string
}

export interface ProblemList {
  total_count: number
  page: number
  size: number
  problems: ProblemListItem[]
}

export interface ProblemDetail {
  id: number
  space_id: number
  created_by: number
  problem_bank_id: number | null
  title: string
  description: string
  difficulty: Difficulty
  language: Language
  starter_code: string
  is_published: boolean
  testcases: Testcase[]
  created_at: string
  updated_at: string
}

export interface UpdateProblemRequest {
  title?: string
  description?: string
  difficulty?: Difficulty
  language?: Language
  starter_code?: string
  is_published?: boolean
  testcases?: Testcase[]
}

export interface ProblemUpdated {
  id: number
  title: string
  description: string
  difficulty: Difficulty
  language: Language
  is_published: boolean
  updated_at: string
}

export interface ImportProblemRequest {
  problem_bank_id: number
}
