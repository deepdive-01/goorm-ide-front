import { normalizeSubmissionList } from '@/lib/submissionMapper'
import api from './api'
import type { ApiResponse } from '@/types/api.type'
import type { SubmissionListParams } from '@/types/submission.type'

export const getSubmissions = async (
  problemId: number,
  params?: SubmissionListParams,
) => {
  const response = await api.get<ApiResponse<unknown>>(
    `/api/v1/questions/${problemId}/submissions`,
    { params },
  )

  return {
    ...response,
    data: {
      ...response.data,
      data: normalizeSubmissionList(response.data.data),
    },
  }
}
