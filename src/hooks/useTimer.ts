import { useState, useEffect } from 'react'
import { getTimer } from '@/services/timer'
import type { TimerState } from '@/types/timer.type'

interface UseTimerResult {
  timer: TimerState | null
  isLoading: boolean
}

export function useTimer(roomId: number): UseTimerResult {
  const [timer, setTimer] = useState<TimerState | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await getTimer(roomId)
        setTimer(data.data)
      } catch {
        setTimer(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetch()
  }, [roomId])

  return { timer, isLoading }
}
