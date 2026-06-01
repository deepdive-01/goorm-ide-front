import { normalizeSubmissionDetail } from '@/lib/apiMapper'
import api from './api'
import type { ApiResponse } from '@/types/api.type'
import type {
  AssignProblemRequest,
  CreateCustomProblemRequest,
  FileProblemDetail,
  UpdateCodeRequest,
  UpdateFileProblemRequest,
  SubmitCodeRequest,
  SubmissionDetail,
  UpdateSubmissionRequest,
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

export const submitCode = (body: SubmitCodeRequest) =>
  api.post<ApiResponse<null>>('/api/v1/files/submissions', body)

export const getSubmission = async (problemId: number, userId: number) => {
  const response = await api.get<ApiResponse<SubmissionDetail>>(
    `/api/v1/files/submissions/${problemId}/${userId}`,
  )

  return {
    ...response,
    data: {
      ...response.data,
      data: normalizeSubmissionDetail(response.data.data),
    },
  }
}

export const updateSubmission = (
  problemId: number,
  userId: number,
  body: UpdateSubmissionRequest,
) =>
  api.put<ApiResponse<null>>(
    `/api/v1/files/submissions/${problemId}/${userId}`,
    body,
  )

export const deleteSubmission = (problemId: number, userId: number) =>
  api.delete<ApiResponse<null>>(
    `/api/v1/files/submissions/${problemId}/${userId}`,
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
