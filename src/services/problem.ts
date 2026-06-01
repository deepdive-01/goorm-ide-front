import api from './api'
import type { ApiResponse } from '@/types/api.type'
import type { Testcase } from '@/types/problemBank.type'
import type {
  CreateProblemRequest,
  ProblemCreated,
  ProblemListItem,
  ProblemListParams,
  ProblemDetail,
  UpdateProblemRequest,
  ProblemUpdated,
  ImportProblemRequest,
} from '@/types/problem.type'

type TestcaseApiItem = {
  id?: number | null
  input?: string
  expected_output?: string
  expectedOutput?: string
  is_hidden?: boolean
  isHidden?: boolean
  order_num?: number
  orderNum?: number
}

export function normalizeTestcase(raw: TestcaseApiItem): Testcase {
  return {
    id: raw.id ?? null,
    input: raw.input ?? '',
    expected_output: raw.expected_output ?? raw.expectedOutput ?? '',
    is_hidden: raw.is_hidden ?? raw.isHidden ?? false,
    order_num: raw.order_num ?? raw.orderNum ?? 0,
  }
}

function normalizeTestcases(data: unknown): Testcase[] {
  if (!Array.isArray(data)) return []
  return data.map((item) => normalizeTestcase(item as TestcaseApiItem))
}

export const createProblem = (spaceId: number, body: CreateProblemRequest) =>
  api.post<ApiResponse<ProblemCreated>>(
    `/api/v1/spaces/${spaceId}/problems`,
    body,
  )

export const getProblems = (spaceId: number, params?: ProblemListParams) =>
  api.get<ApiResponse<ProblemListItem[]>>(`/api/v1/files/problems/space/${spaceId}`, {
    params,
  })

export const getProblem = (_spaceId: number, problemId: number) =>
  api.get<ApiResponse<ProblemDetail>>(`/api/v1/files/problems/${problemId}`)

export const getProblemTestcases = (problemId: number) =>
  api
    .get<ApiResponse<TestcaseApiItem[]>>(
      `/api/v1/files/problems/${problemId}/testcases`,
    )
    .then((response) => ({
      ...response,
      data: {
        ...response.data,
        data: normalizeTestcases(response.data.data),
      },
    }))

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
