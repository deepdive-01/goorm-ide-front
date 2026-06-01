import { useState, useEffect } from 'react'
import { getSubmissions } from '@/services/submission'
import type { SubmissionItem, SubmissionListParams } from '@/types/submission.type'

interface UseSubmissionsResult {
  submissions: SubmissionItem[]
  isLoading: boolean
}

export function useSubmissions(
  problemId: number,
  params?: SubmissionListParams,
): UseSubmissionsResult {
  const [submissions, setSubmissions] = useState<SubmissionItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const paramsKey = JSON.stringify(params)

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await getSubmissions(problemId, params)
        setSubmissions(data.data.submissions)
      } catch {
        setSubmissions([])
      } finally {
        setIsLoading(false)
      }
    }

    fetch()
  }, [problemId, paramsKey]) // eslint-disable-line react-hooks/exhaustive-deps

  return { submissions, isLoading }
}
