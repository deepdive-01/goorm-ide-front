import api from './api'
import type { ApiResponse } from '@/types/api.type'
import type { Language, GradeResult } from '@/types/editor.type'

interface GradeParams {
  problemId: number
  language: Language
  code: string
}

export async function gradeCode(params: GradeParams): Promise<GradeResult> {
  const body = {
    problem_id: params.problemId,
    language: params.language.toLowerCase(),
    code: params.code,
  }
  console.log('[grade] req body:', body)
  const response = await api.post<ApiResponse<GradeResult>>(
    '/api/v1/code/grade',
    body,
  )
  return response.data.data
}
