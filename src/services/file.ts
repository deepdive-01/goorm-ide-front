import api from './api'
import type { ApiResponse } from '@/types/api.type'
import type {
  AssignProblemRequest,
  CreateCustomProblemRequest,
  FileProblemDetail,
  UpdateCodeRequest,
  UpdateFileProblemRequest,
  SubmitCodeRequest,
  AddTestcaseRequest,
} from '@/types/file.type'

export const assignProblem = (body: AssignProblemRequest) =>
  api.post<ApiResponse<number>>('/api/v1/files/problems', body)

export const createCustomProblem = (body: CreateCustomProblemRequest) =>
  api.post<ApiResponse<number>>('/api/v1/files/problems/custom', body)

export const getFileProblem = (problemId: number) =>
  api.get<ApiResponse<FileProblemDetail>>(`/api/v1/files/problems/${problemId}`)

export const updateCode = (problemId: number, body: UpdateCodeRequest) =>
  api.patch<ApiResponse<null>>(`/api/v1/files/problems/${problemId}/code`, body)

export const updateFileProblem = (
  problemId: number,
  body: UpdateFileProblemRequest,
) => api.patch<ApiResponse<null>>(`/api/v1/files/problems/${problemId}`, body)

export const deleteFileProblem = (problemId: number) =>
  api.delete<ApiResponse<null>>(`/api/v1/files/problems/${problemId}`)

export const submitCode = (problemId: number, body: SubmitCodeRequest) =>
  api.post<ApiResponse<null>>(
    `/api/v1/files/problems/${problemId}/submit`,
    body,
  )

export const resetCode = (problemId: number) =>
  api.delete<ApiResponse<null>>(`/api/v1/files/problems/${problemId}/reset`)

export const addTestcase = (problemId: number, body: AddTestcaseRequest) =>
  api.post<ApiResponse<number>>(
    `/api/v1/files/problems/${problemId}/testcases`,
    body,
  )

export const deleteTestcase = (testCaseId: number) =>
  api.delete<ApiResponse<null>>(`/api/v1/files/testcases/${testCaseId}`)
