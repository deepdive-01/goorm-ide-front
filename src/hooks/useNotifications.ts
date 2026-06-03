import { useState, useEffect } from 'react'
import {
  getNotifications,
  readNotification,
  readAllNotifications,
} from '@/services/notification'
import type {
  NotificationListParams,
  NotificationList,
} from '@/types/notification.type'

interface UseNotificationsResult {
  data: NotificationList | null
  isLoading: boolean
  refetch: () => void
  readOne: (id: number) => Promise<void>
  readAll: () => Promise<void>
}

export function useNotifications(
  params?: NotificationListParams,
): UseNotificationsResult {
  const [data, setData] = useState<NotificationList | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [trigger, setTrigger] = useState(0)
  const paramsKey = JSON.stringify(params)

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data: res } = await getNotifications(params)
        setData(res.data)
      } catch {
        setData(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetch()
  }, [paramsKey, trigger]) // eslint-disable-line react-hooks/exhaustive-deps

  const refetch = () => setTrigger((n) => n + 1)

  const readOne = async (id: number) => {
    try {
      await readNotification(id)
      refetch()
    } catch {
      // silent
    }
  }

  const readAll = async () => {
    try {
      await readAllNotifications()
      refetch()
    } catch {
      // silent
    }
  }

  return { data, isLoading, refetch, readOne, readAll }
}
