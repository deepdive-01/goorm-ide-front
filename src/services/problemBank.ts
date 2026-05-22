import api from './api'
import type { ApiResponse } from '@/types/api.type'
import type {
  ProblemBankListParams,
  ProblemBankList,
  ProblemBankDetail,
} from '@/types/problemBank.type'

export const getProblemBankList = (params?: ProblemBankListParams) =>
  api.get<ApiResponse<ProblemBankList>>('/api/v1/problem-bank', { params })

export const getProblemBankDetail = (problemBankId: number) =>
  api.get<ApiResponse<ProblemBankDetail>>(`/api/v1/problem-bank/${problemBankId}`)
