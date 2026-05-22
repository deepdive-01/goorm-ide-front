import api from './api'
import type { ApiResponse } from '@/types/api.type'
import type {
  CreateProblemRequest,
  ProblemCreated,
  ProblemListParams,
  ProblemList,
  ProblemDetail,
  UpdateProblemRequest,
  ProblemUpdated,
  ImportProblemRequest,
} from '@/types/problem.type'

export const createProblem = (spaceId: number, body: CreateProblemRequest) =>
  api.post<ApiResponse<ProblemCreated>>(
    `/api/v1/spaces/${spaceId}/problems`,
    body,
  )

export const getProblems = (spaceId: number, params?: ProblemListParams) =>
  api.get<ApiResponse<ProblemList>>(`/api/v1/spaces/${spaceId}/problems`, {
    params,
  })

export const getProblem = (spaceId: number, problemId: number) =>
  api.get<ApiResponse<ProblemDetail>>(
    `/api/v1/spaces/${spaceId}/problems/${problemId}`,
  )

export const updateProblem = (
  spaceId: number,
  problemId: number,
  body: UpdateProblemRequest,
) =>
  api.patch<ApiResponse<ProblemUpdated>>(
    `/api/v1/spaces/${spaceId}/problems/${problemId}`,
    body,
  )

export const deleteProblem = (spaceId: number, problemId: number) =>
  api.delete<ApiResponse<null>>(
    `/api/v1/spaces/${spaceId}/problems/${problemId}`,
  )

export const importProblem = (spaceId: number, body: ImportProblemRequest) =>
  api.post<ApiResponse<ProblemCreated>>(
    `/api/v1/spaces/${spaceId}/problems/import`,
    body,
  )
