import { useState, useEffect } from 'react'
import { getProblemBankList } from '@/services/problemBank'
import type { ProblemBankListItem, ProblemBankListParams } from '@/types/problemBank.type'

interface UseProblemBankListResult {
  problems: ProblemBankListItem[]
  isLoading: boolean
}

export function useProblemBankList(params?: ProblemBankListParams): UseProblemBankListResult {
  const [problems, setProblems] = useState<ProblemBankListItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const paramsKey = JSON.stringify(params)

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await getProblemBankList(params)
        setProblems(data.data.problems)
      } catch {
        setProblems([])
      } finally {
        setIsLoading(false)
      }
    }

    fetch()
  }, [paramsKey]) // eslint-disable-line react-hooks/exhaustive-deps

  return { problems, isLoading }
}
