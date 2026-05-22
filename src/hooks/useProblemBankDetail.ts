import { useState, useEffect } from 'react'
import { getProblemBankDetail } from '@/services/problemBank'
import type { ProblemBankDetail } from '@/types/problemBank.type'

interface UseProblemBankDetailResult {
  problem: ProblemBankDetail | null
  isLoading: boolean
}

export function useProblemBankDetail(
  problemBankId: number,
): UseProblemBankDetailResult {
  const [problem, setProblem] = useState<ProblemBankDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await getProblemBankDetail(problemBankId)
        setProblem(data.data)
      } catch {
        setProblem(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetch()
  }, [problemBankId])

  return { problem, isLoading }
}
