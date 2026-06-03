import type { Difficulty, Language } from './api.type'

export interface ProblemBankListParams {
  difficulty?: Difficulty
  language?: Language
  source_type?: string
  keyword?: string
  page?: number
  size?: number
}

export interface ProblemBankListItem {
  id: number
  title: string
  difficulty: Difficulty
  language: Language
  source_type: string
  source_url: string | null
  created_at: string
}

export interface ProblemBankList {
  total_count: number
  page: number
  size: number
  problems: ProblemBankListItem[]
}

export interface Testcase {
  id: number | null
  input: string
  expected_output: string
  is_hidden: boolean
  order_num: number
}

export interface ProblemBankDetail {
  id: number
  title: string
  description: string
  difficulty: Difficulty
  language: Language
  starter_code: string
  source_type: string
  source_url: string | null
  testcases: Testcase[]
  created_at: string
}
