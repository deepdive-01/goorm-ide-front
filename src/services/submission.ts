import api from './api'
import type { ApiResponse } from '@/types/api.type'
import type {
  SubmissionListParams,
  SubmissionList,
} from '@/types/submission.type'

export const getSubmissions = (
  questionsId: number,
  params?: SubmissionListParams,
) =>
  api.get<ApiResponse<SubmissionList>>(
    `/api/v1/questions/${questionsId}/submissions`,
    { params },
  )
