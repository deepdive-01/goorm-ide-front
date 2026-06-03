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
  input_case?: string
  output_case?: string
  is_hidden?: boolean
  is_example?: boolean
  order_num?: number
}

type RecordLike = Record<string, unknown>

function asRecord(value: unknown): RecordLike | null {
  if (typeof value !== 'object' || value === null) {
    return null
  }

  return value as RecordLike
}

function readString(record: RecordLike, key: string): string {
  const value = record[key]
  return typeof value === 'string' ? value : ''
}

function readNumber(record: RecordLike, key: string): number {
  const value = record[key]
  return typeof value === 'number' && Number.isFinite(value) ? value : 0
}

function readBoolean(record: RecordLike, key: string): boolean {
  const value = record[key]
  return typeof value === 'boolean' ? value : false
}

function readNullableNumber(record: RecordLike, key: string): number | null {
  const value = record[key]
  if (value === null) {
    return null
  }

  return typeof value === 'number' && Number.isFinite(value) ? value : null
}

function normalizeProblemCreated(value: unknown): ProblemCreated {
  const record = asRecord(value)

  if (!record) {
    throw new Error('Invalid problem created payload')
  }

  return {
    id: readNumber(record, 'id'),
    space_id: readNumber(record, 'space_id'),
    created_by: readNumber(record, 'created_by'),
    problem_bank_id: readNullableNumber(record, 'problem_bank_id'),
    title: readString(record, 'title'),
    difficulty: readString(record, 'difficulty') as ProblemCreated['difficulty'],
    language: readString(record, 'language') as ProblemCreated['language'],
    is_published: readBoolean(record, 'is_published'),
    created_at: readString(record, 'created_at'),
  }
}

export function normalizeTestcase(raw: TestcaseApiItem): Testcase {
  const isExample = raw.is_example

  return {
    id: raw.id ?? null,
    input: raw.input_case ?? '',
    expected_output: raw.output_case ?? '',
    is_hidden:
      raw.is_hidden ?? (typeof isExample === 'boolean' ? !isExample : false),
    order_num: raw.order_num ?? 0,
  }
}

function normalizeTestcases(data: unknown): Testcase[] {
  if (!Array.isArray(data)) return []
  return data.map((item) => normalizeTestcase(item as TestcaseApiItem))
}

function readCreatedProblemId(value: unknown): number | null {
  const record = asRecord(value)
  if (!record) {
    return null
  }

  const id = record.id
  return typeof id === 'number' && Number.isFinite(id) ? id : null
}

function toProblemCreatePayload(
  spaceId: number,
  userId: number,
  body: Omit<CreateProblemRequest, 'testcases'>,
) {
  return {
    space_id: spaceId,
    created_by: userId,
    problem_bank_id: body.problem_bank_id ?? null,
    title: body.title,
    description: body.description,
    difficulty: body.difficulty,
    language: body.language,
    starter_code: body.starter_code,
    is_published: false,
  }
}

export function toTestcaseCreatePayload(testcases: CreateProblemRequest['testcases']) {
  return testcases.map((testcase) => ({
    input_case: testcase.input,
    output_case: testcase.expected_output,
    is_example: !testcase.is_hidden,
  }))
}

function toProblemUpdatePayload(body: UpdateProblemRequest) {
  return {
    title: body.title,
    description: body.description,
    difficulty: body.difficulty,
    language: body.language,
    starter_code: body.starter_code,
    is_published: body.is_published,
  }
}

export const createProblem = async (
  spaceId: number,
  userId: number,
  body: CreateProblemRequest,
) => {
  const { testcases, ...problemBody } = body

  const response = await api.post<ApiResponse<unknown>>(
    '/api/v1/files/problems',
    toProblemCreatePayload(spaceId, userId, problemBody),
  )

  const raw = response.data?.data
  const problemId =
    readCreatedProblemId(raw) ??
    (typeof raw === 'number' && Number.isFinite(raw) ? raw : null)

  if (problemId && testcases.length > 0) {
    await api.post(`/api/v1/files/problems/${problemId}/testcases`, toTestcaseCreatePayload(testcases))
  }

  if (raw && typeof raw === 'object') {
    try {
      return {
        ...response,
        data: {
          ...response.data,
          data: normalizeProblemCreated(raw),
        },
      }
    } catch {
      // 응답 스키마가 달라도 생성 API 성공은 유지 (페이지는 응답 body를 사용하지 않음)
    }
  }

  return response
}

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

export const updateProblem = (problemId: number, body: UpdateProblemRequest) =>
  api.put<ApiResponse<ProblemUpdated>>(
    `/api/v1/files/problems/${problemId}`,
    toProblemUpdatePayload(body),
  )

export const saveProblemTestcases = (
  problemId: number,
  testcases: CreateProblemRequest['testcases'],
) =>
  api.post<ApiResponse<null>>(
    `/api/v1/files/problems/${problemId}/testcases`,
    toTestcaseCreatePayload(testcases),
  )

export const updateProblemWithTestcases = async (
  problemId: number,
  body: CreateProblemRequest & Pick<UpdateProblemRequest, 'is_published'>,
) => {
  const { testcases, problem_bank_id: _problemBankId, ...problemBody } = body

  await updateProblem(problemId, problemBody)

  if (testcases.length > 0) {
    await saveProblemTestcases(problemId, testcases)
  }
}

export const deleteProblem = (spaceId: number, problemId: number) =>
  api.delete<ApiResponse<null>>(
    `/api/v1/spaces/${spaceId}/problems/${problemId}`,
  )

export const importProblem = (spaceId: number, body: ImportProblemRequest) =>
  api.post<ApiResponse<ProblemCreated>>(
    `/api/v1/spaces/${spaceId}/problems/import`,
    body,
  )
