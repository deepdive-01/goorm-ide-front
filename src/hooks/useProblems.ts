import { useState, useEffect } from 'react'
import { getProblems } from '@/services/problem'
import type { ProblemListItem, ProblemListParams } from '@/types/problem.type'

interface UseProblemsResult {
  problems: ProblemListItem[]
  isLoading: boolean
}

export function useProblems(spaceId: number, params?: ProblemListParams): UseProblemsResult {
  const [problems, setProblems] = useState<ProblemListItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const paramsKey = JSON.stringify(params)

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await getProblems(spaceId, params)
        setProblems(data.data.problems)
      } catch {
        setProblems([])
      } finally {
        setIsLoading(false)
      }
    }

    fetch()
  }, [spaceId, paramsKey]) // eslint-disable-line react-hooks/exhaustive-deps

  return { problems, isLoading }
}
