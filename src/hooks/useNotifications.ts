import { useState, useEffect } from 'react'
import { getNotifications } from '@/services/notification'
import type {
  NotificationListParams,
  NotificationList,
} from '@/types/notification.type'

interface UseNotificationsResult {
  data: NotificationList | null
  isLoading: boolean
}

export function useNotifications(
  params?: NotificationListParams,
): UseNotificationsResult {
  const [data, setData] = useState<NotificationList | null>(null)
  const [isLoading, setIsLoading] = useState(true)
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
  }, [paramsKey]) // eslint-disable-line react-hooks/exhaustive-deps

  return { data, isLoading }
}
