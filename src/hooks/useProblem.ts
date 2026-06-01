import { useState, useEffect } from 'react'
import { getProblem, getProblemTestcases } from '@/services/problem'
import type { ProblemDetail } from '@/types/problem.type'

interface UseProblemResult {
  problem: ProblemDetail | null
  isLoading: boolean
}

function isValidProblemId(problemId: number): boolean {
  return Number.isFinite(problemId) && problemId > 0
}

export function useProblem(
  spaceId: number,
  problemId: number,
): UseProblemResult {
  const isEnabled = isValidProblemId(problemId)
  const [problem, setProblem] = useState<ProblemDetail | null>(null)
  const [isLoading, setIsLoading] = useState(isEnabled)

  useEffect(() => {
    if (!isEnabled) {
      return
    }

    let isMounted = true

    const fetch = async () => {
      setIsLoading(true)

      try {
        const [{ data: detail }, testcasesResult] = await Promise.all([
          getProblem(spaceId, problemId),
          getProblemTestcases(problemId).catch(() => null),
        ])

        if (!isMounted) {
          return
        }

        const testcasesFromDetail = detail.data.testcases ?? []
        const testcases =
          testcasesResult?.data.data ??
          (Array.isArray(testcasesFromDetail) ? testcasesFromDetail : [])

        setProblem({
          ...detail.data,
          testcases,
        })
      } catch {
        if (isMounted) {
          setProblem(null)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    fetch()

    return () => {
      isMounted = false
    }
  }, [isEnabled, problemId, spaceId])

  return {
    problem: isEnabled ? problem : null,
    isLoading: isEnabled && isLoading,
  }
}
