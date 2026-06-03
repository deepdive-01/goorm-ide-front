import { useState, useEffect, useRef } from 'react'
import { useCurrentUser } from './useCurrentUser'
import { useCodeExecution } from './useCodeExecution'
import { gradeCode } from '@/services/codeExecutionService'
import { canCancelSubmission } from '@/lib/apiMapper'
import { queryClient } from '@/lib/queryClient'
import {
  deleteSubmission,
  getSubmission,
  submitCode,
  updateSubmission,
} from '@/services/file'
import type { SubmissionDetail } from '@/types/file.type'
import type {
  Language,
  GradeResult,
  ExecutionResult,
} from '@/types/editor.type'
import type { UserInfo } from '@/types/user.type'

interface UseEditorPageParams {
  problemId: number
  roomId: number
}

interface UseEditorPageResult {
  user: UserInfo | null
  isUserLoading: boolean
  language: Language
  value: string
  isReady: boolean
  isSaving: boolean
  isSubmitting: boolean
  isCancelling: boolean
  canCancelSubmit: boolean
  gradeResult: GradeResult | null
  executionResult: ExecutionResult | null
  isRunning: boolean
  setLanguage: (lang: Language) => void
  onChange: (value: string) => void
  handleRun: (stdin: string) => void
  handleSave: () => Promise<void>
  handleSubmit: () => Promise<void>
  handleCancelSubmit: () => Promise<void>
}

export function useEditorPage({
  problemId,
  roomId,
}: UseEditorPageParams): UseEditorPageResult {
  const { user, isLoading: isUserLoading } = useCurrentUser()

  const [language, setLanguage] = useState<Language>('PYTHON')
  const [value, setValue] = useState('')

  // isReady를 직접 state로 두면 useEffect 내에서 setIsReady(false)를 동기 호출해야 하는데,
  // 이는 React Compiler 룰(effect 내 직접 setState 금지)에 위반됩니다.
  // 대신 "마지막으로 데이터를 불러온 문제-유저 조합 키"를 저장하고,
  // 현재 키와 일치할 때만 isReady=true로 파생합니다.
  // problemId 또는 user가 바뀌면 currentKey가 달라져 isReady가 자동으로 false가 됩니다.
  const [loadedKey, setLoadedKey] = useState<string | null>(null)

  const [submission, setSubmission] = useState<SubmissionDetail | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCancelling, setIsCancelling] = useState(false)
  const [gradeResult, setGradeResult] = useState<GradeResult | null>(null)

  const canCancelSubmit = canCancelSubmission(submission)

  const { run, isRunning, executionResult } = useCodeExecution({ roomId })

  // 실행 요청 시점의 언어와 코드를 캡처합니다.
  // executionResult는 WebSocket으로 비동기 수신되므로,
  // 결과가 도착할 때 state가 이미 변경됐을 수 있어 ref로 고정합니다.
  // useEffect deps에 language, value를 넣지 않아도 되므로 eslint-disable 없이 사용 가능합니다.
  const runParamsRef = useRef({ language, code: value })

  const currentKey = user ? `${problemId}-${user.id}` : null
  const isReady = loadedKey !== null && loadedKey === currentKey

  const applySubmissionDetail = (detail: SubmissionDetail) => {
    setSubmission(detail)
    setValue(detail.saved_code ?? detail.submitted_code ?? '')
  }

  const fetchSubmissionDetail = async (studentId: number) => {
    const { data } = await getSubmission(problemId, studentId)
    return data.data
  }

  const syncStudentSubmissionsCache = (
    studentId: number,
    nextSubmission: SubmissionDetail,
  ) => {
    const queryKey = ['studentSubmissions', studentId] as const

    queryClient.setQueryData<SubmissionDetail[]>(queryKey, (prev = []) => {
      const next = [...prev]
      const index = next.findIndex((item) => item.problem_id === nextSubmission.problem_id)
      if (index >= 0) {
        next[index] = nextSubmission
      } else {
        next.push(nextSubmission)
      }
      return next
    })

    void queryClient.invalidateQueries({ queryKey })
  }

  const buildFallbackSubmission = (studentId: number): SubmissionDetail => ({
    id: submission?.id ?? 0,
    problem_id: problemId,
    student_id: studentId,
    saved_code: value || submission?.saved_code || null,
    submitted_code: submission?.submitted_code ?? null,
    status: submission?.status ?? 'DRAFT',
    execution_time_ms: submission?.execution_time_ms ?? null,
    execution_memory_kb: submission?.execution_memory_kb ?? null,
    error_message: submission?.error_message ?? null,
    created_at: submission?.created_at ?? new Date().toISOString(),
    updated_at: new Date().toISOString(),
  })

  // 문제 ID나 사용자가 바뀔 때마다 해당 제출 정보를 불러와 에디터 초기값을 설정합니다.
  useEffect(() => {
    if (!user) return
    const key = `${problemId}-${user.id}`
    let cancelled = false

    getSubmission(problemId, user.id)
      .then(({ data }) => {
        if (cancelled) return
        applySubmissionDetail(data.data)
      })
      .catch(() => {
        if (!cancelled) {
          setSubmission(null)
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoadedKey(key)
        }
      })

    return () => {
      cancelled = true
    }
  }, [problemId, user])

  // 실행 결과가 SUCCESS일 때만 자동 채점합니다.
  // ERROR인 경우는 아래의 displayGradeResult에서 파생값(FAIL)으로 처리합니다.
  useEffect(() => {
    if (!executionResult || executionResult.status !== 'SUCCESS') return
    gradeCode({
      problemId,
      language: runParamsRef.current.language,
      code: runParamsRef.current.code,
    })
      .then(setGradeResult)
      .catch(() => {})
  }, [executionResult, problemId])

  // 실행 결과가 ERROR면 채점 API를 호출하지 않고 FAIL로 고정합니다.
  // gradeResult state를 직접 setGradeResult하면 effect 내 동기 setState가 되어
  // React Compiler 룰에 위반되므로, 렌더 시점에 파생값으로 계산합니다.
  const EXECUTION_FAIL_GRADE: GradeResult = {
    status: 'FAIL',
    pass_count: 0,
    total_count: 0,
    results: [],
  }
  const displayGradeResult =
    executionResult?.status === 'ERROR' ? EXECUTION_FAIL_GRADE : gradeResult

  const handleRun = (stdin: string) => {
    if (!value.trim()) return
    // 채점 effect가 사용할 언어/코드를 실행 직전에 고정합니다.
    runParamsRef.current = { language, code: value }
    run({ language, code: value, stdin })
  }

  const handleSave = async () => {
    if (!value.trim() || !user) return
    setIsSaving(true)
    try {
      await updateSubmission(problemId, user.id, {
        problem_id: problemId,
        student_id: user.id,
        saved_code: value,
      })
    } catch (e: unknown) {
      console.error('[save] 오류:', e)
    } finally {
      setIsSaving(false)
    }
  }

  // 제출은 submitCode만 호출합니다. 채점은 실행(handleRun) 흐름에서만 이루어집니다.
  const handleSubmit = async () => {
    if (!value.trim() || !user) return
    setIsSubmitting(true)
    const optimistic = {
      ...buildFallbackSubmission(user.id),
      submitted_code: value,
      status: 'PENDING',
      updated_at: new Date().toISOString(),
    }
    applySubmissionDetail(optimistic)
    syncStudentSubmissionsCache(user.id, optimistic)

    try {
      await submitCode({
        problem_id: problemId,
        student_id: user.id,
        submitted_code: value,
        is_final_submit: true,
      })
      const confirmed = await fetchSubmissionDetail(user.id)
      applySubmissionDetail(confirmed)
      syncStudentSubmissionsCache(user.id, confirmed)
    } catch (e: unknown) {
      console.error('[submit] 응답 오류:', e)
      try {
        const latest = await fetchSubmissionDetail(user.id)
        applySubmissionDetail(latest)
        syncStudentSubmissionsCache(user.id, latest)
      } catch {}
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancelSubmit = async () => {
    if (!user || !canCancelSubmit) return
    setIsCancelling(true)
    const optimistic = {
      ...buildFallbackSubmission(user.id),
      submitted_code: null,
      status: 'DRAFT',
      updated_at: new Date().toISOString(),
    }
    applySubmissionDetail(optimistic)
    syncStudentSubmissionsCache(user.id, optimistic)

    try {
      await deleteSubmission(problemId, user.id)
      const confirmed = await fetchSubmissionDetail(user.id)
      applySubmissionDetail(confirmed)
      syncStudentSubmissionsCache(user.id, confirmed)
    } catch (e: unknown) {
      console.error('[cancel submit] 응답 오류:', e)
      try {
        const latest = await fetchSubmissionDetail(user.id)
        applySubmissionDetail(latest)
        syncStudentSubmissionsCache(user.id, latest)
      } catch {}
    } finally {
      setIsCancelling(false)
    }
  }

  return {
    user,
    isUserLoading,
    language,
    value,
    isReady,
    isSaving,
    isSubmitting,
    isCancelling,
    canCancelSubmit,
    gradeResult: displayGradeResult,
    executionResult,
    isRunning,
    setLanguage,
    onChange: setValue,
    handleRun,
    handleSave,
    handleSubmit,
    handleCancelSubmit,
  }
}
