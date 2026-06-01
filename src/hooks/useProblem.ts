import { useState, useEffect } from 'react'
import { getProblem, getProblemTestcases } from '@/services/problem'
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
        const [{ data: detail }, testcasesResult] = await Promise.all([
          getProblem(spaceId, problemId),
          getProblemTestcases(problemId).catch(() => null),
        ])

        const testcasesFromDetail = detail.data.testcases ?? []
        const testcases =
          testcasesResult?.data.data ??
          (Array.isArray(testcasesFromDetail) ? testcasesFromDetail : [])

        setProblem({
          ...detail.data,
          testcases,
        })
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
