import { useState, useEffect } from 'react'
import { getProblem } from '@/services/problem'
import type { ProblemDetail } from '@/types/problem.type'

interface UseProblemResult {
  problem: ProblemDetail | null
  isLoading: boolean
}

export function useProblem(
  spaceId: number,
  problemId: number,
): UseProblemResult {
  const [problem, setProblem] = useState<ProblemDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await getProblem(spaceId, problemId)
        setProblem(data.data)
      } catch {
        setProblem(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetch()
  }, [spaceId, problemId])

  return { problem, isLoading }
}
