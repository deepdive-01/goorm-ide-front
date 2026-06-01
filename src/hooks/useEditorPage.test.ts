import { renderHook, act, waitFor } from '@testing-library/react'
import { useEditorPage } from './useEditorPage'
import { mockStudentUser } from '@/mocks/fixtures'
import { createAxiosResponse } from '@/tests/utils'
import type { ExecutionResult, GradeResult } from '@/types/editor.type'

const mockRun = vi.fn()
let mockExecutionResult: ExecutionResult | null = null

vi.mock('./useCurrentUser', () => ({
  useCurrentUser: () => ({ user: mockStudentUser, isLoading: false }),
}))

vi.mock('./useCodeExecution', () => ({
  useCodeExecution: () => ({
    run: mockRun,
    isRunning: false,
    executionResult: mockExecutionResult,
  }),
}))

vi.mock('@/services/file', () => ({
  getSubmission: vi.fn(),
  updateSubmission: vi.fn(),
  submitCode: vi.fn(),
  deleteSubmission: vi.fn(),
}))

vi.mock('@/services/codeExecutionService', () => ({
  gradeCode: vi.fn(),
}))

import {
  deleteSubmission,
  getSubmission,
  submitCode,
  updateSubmission,
} from '@/services/file'
import { gradeCode } from '@/services/codeExecutionService'

const mockGetSubmission = vi.mocked(getSubmission)
const mockUpdateSubmission = vi.mocked(updateSubmission)
const mockSubmitCode = vi.mocked(submitCode)
const mockDeleteSubmission = vi.mocked(deleteSubmission)
const mockGradeCode = vi.mocked(gradeCode)

const makeSubmissionResponse = (
  saved_code: string | null = null,
  submitted_code: string | null = null,
  submissionStatus: string = submitted_code ? 'PENDING' : 'DRAFT',
) =>
  createAxiosResponse({
    status: 200,
    code: 'OK',
    message: '제출 정보를 조회했습니다.',
    data: {
      id: 1,
      problem_id: 3,
      student_id: mockStudentUser.id,
      saved_code,
      submitted_code,
      status: submissionStatus,
      execution_time_ms: null,
      execution_memory_kb: null,
      error_message: null,
      created_at: '2026-06-01T00:00:00Z',
      updated_at: '2026-06-01T00:00:00Z',
    },
  })

const makeNullResponse = () =>
  createAxiosResponse({ status: 200, code: 'OK', message: 'OK', data: null })

const passGradeResult: GradeResult = {
  status: 'PASS',
  pass_count: 2,
  total_count: 2,
  results: [],
}

const defaultParams = { problemId: 3, roomId: 1 }

describe('useEditorPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockExecutionResult = null
    mockGetSubmission.mockResolvedValue(makeSubmissionResponse('saved code'))
    mockUpdateSubmission.mockResolvedValue(makeNullResponse())
    mockSubmitCode.mockResolvedValue(makeNullResponse())
    mockDeleteSubmission.mockResolvedValue(makeNullResponse())
    mockGradeCode.mockResolvedValue(passGradeResult)
  })

  test('진입 시 getSubmission으로 saved_code를 로드한다', async () => {
    const { result } = renderHook(() => useEditorPage(defaultParams))

    await waitFor(() => {
      expect(result.current.value).toBe('saved code')
    })
    expect(mockGetSubmission).toHaveBeenCalledWith(3, mockStudentUser.id)
  })

  test('saved_code가 없으면 submitted_code를 폴백으로 로드한다', async () => {
    mockGetSubmission.mockResolvedValue(makeSubmissionResponse(null, 'submitted code'))

    const { result } = renderHook(() => useEditorPage(defaultParams))

    await waitFor(() => {
      expect(result.current.value).toBe('submitted code')
    })
  })

  test('getSubmission 완료 후 isReady가 true가 된다', async () => {
    const { result } = renderHook(() => useEditorPage(defaultParams))

    expect(result.current.isReady).toBe(false)

    await waitFor(() => {
      expect(result.current.isReady).toBe(true)
    })
  })

  test('handleSave 호출 시 updateSubmission을 호출한다', async () => {
    const { result } = renderHook(() => useEditorPage(defaultParams))

    await waitFor(() => expect(result.current.isReady).toBe(true))

    act(() => {
      result.current.onChange('print("hello")')
    })

    await act(async () => {
      await result.current.handleSave()
    })

    expect(mockUpdateSubmission).toHaveBeenCalledWith(3, mockStudentUser.id, {
      problem_id: 3,
      student_id: mockStudentUser.id,
      saved_code: 'print("hello")',
    })
  })

  test('value가 비어있으면 handleSave를 호출해도 updateSubmission을 호출하지 않는다', async () => {
    mockGetSubmission.mockResolvedValue(makeSubmissionResponse(null, null))
    const { result } = renderHook(() => useEditorPage(defaultParams))

    await waitFor(() => expect(result.current.isReady).toBe(true))

    await act(async () => {
      await result.current.handleSave()
    })

    expect(mockUpdateSubmission).not.toHaveBeenCalled()
  })

  test('handleSubmit 호출 시 is_final_submit: true로 submitCode를 호출한다', async () => {
    const { result } = renderHook(() => useEditorPage(defaultParams))

    await waitFor(() => expect(result.current.isReady).toBe(true))

    act(() => {
      result.current.onChange('print("submit")')
    })

    await act(async () => {
      await result.current.handleSubmit()
    })

    expect(mockSubmitCode).toHaveBeenCalledWith({
      problem_id: 3,
      student_id: mockStudentUser.id,
      submitted_code: 'print("submit")',
      is_final_submit: true,
    })
    expect(mockGradeCode).not.toHaveBeenCalled()
    expect(mockGetSubmission).toHaveBeenCalledTimes(2)
  })

  test('status가 PENDING이면 canCancelSubmit이 true이다', async () => {
    mockGetSubmission.mockResolvedValue(
      makeSubmissionResponse('saved', 'submitted code'),
    )

    const { result } = renderHook(() => useEditorPage(defaultParams))

    await waitFor(() => {
      expect(result.current.canCancelSubmit).toBe(true)
    })
  })

  test('status가 DRAFT이면 canCancelSubmit이 false이다', async () => {
    mockGetSubmission.mockResolvedValue(makeSubmissionResponse(null, null))

    const { result } = renderHook(() => useEditorPage(defaultParams))

    await waitFor(() => expect(result.current.isReady).toBe(true))

    expect(result.current.canCancelSubmit).toBe(false)
  })

  test('handleCancelSubmit 호출 시 deleteSubmission 후 제출 상태를 갱신한다', async () => {
    mockGetSubmission
      .mockResolvedValueOnce(makeSubmissionResponse('saved', 'submitted code'))
      .mockResolvedValueOnce(makeSubmissionResponse('saved', null, 'DRAFT'))

    const { result } = renderHook(() => useEditorPage(defaultParams))

    await waitFor(() => expect(result.current.canCancelSubmit).toBe(true))

    await act(async () => {
      await result.current.handleCancelSubmit()
    })

    expect(mockDeleteSubmission).toHaveBeenCalledWith(3, mockStudentUser.id)
    await waitFor(() => {
      expect(result.current.canCancelSubmit).toBe(false)
    })
  })

  test('handleRun 호출 시 run을 호출한다', async () => {
    const { result } = renderHook(() => useEditorPage(defaultParams))

    await waitFor(() => expect(result.current.isReady).toBe(true))

    act(() => {
      result.current.onChange('print("run")')
    })

    act(() => {
      result.current.handleRun('3 5')
    })

    expect(mockRun).toHaveBeenCalledWith({
      language: 'PYTHON',
      code: 'print("run")',
      stdin: '3 5',
    })
  })

  test('executionResult가 SUCCESS이면 gradeCode를 자동으로 호출한다', async () => {
    mockExecutionResult = { status: 'SUCCESS', output: '8\n', stderr: '' }

    const { result } = renderHook(() => useEditorPage(defaultParams))

    // gradeCode 호출 후 .then(setGradeResult) 까지 완료될 때까지 대기
    await waitFor(() => {
      expect(result.current.gradeResult?.status).toBe('PASS')
    })

    expect(mockGradeCode).toHaveBeenCalled()
  })

  test('executionResult가 ERROR이면 gradeCode를 호출하지 않고 gradeResult.status가 FAIL이다', async () => {
    mockExecutionResult = { status: 'ERROR', output: '', stderr: 'error' }

    const { result } = renderHook(() => useEditorPage(defaultParams))

    await waitFor(() => {
      expect(result.current.gradeResult).not.toBeNull()
    })

    expect(result.current.gradeResult?.status).toBe('FAIL')
    expect(mockGradeCode).not.toHaveBeenCalled()
  })
})
