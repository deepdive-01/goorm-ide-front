import api from './api'
import type { ApiResponse } from '@/types/api.type'
import type { ExecutionResult, Language } from '@/types/editor.type'

interface ExecuteParams {
  roomId: number
  language: Language
  code: string
}

export async function executeCode(params: ExecuteParams): Promise<ExecutionResult> {
  const response = await api.post<ApiResponse<ExecutionResult>>(
    '/api/v1/code/execute',
    params,
  )
  return response.data.data
}
