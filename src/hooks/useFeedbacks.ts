import { useState, useEffect } from 'react'
import { getFeedbacks } from '@/services/feedback'
import type { FeedbackItem } from '@/types/feedback.type'

interface UseFeedbacksResult {
  feedbacks: FeedbackItem[]
  isLoading: boolean
}

export function useFeedbacks(submissionId: number): UseFeedbacksResult {
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await getFeedbacks(submissionId)
        setFeedbacks(data.data)
      } catch {
        setFeedbacks([])
      } finally {
        setIsLoading(false)
      }
    }

    fetch()
  }, [submissionId])

  return { feedbacks, isLoading }
}
