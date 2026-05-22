import { useState, useEffect } from 'react'
import { getMe } from '@/services/user'
import type { UserInfo } from '@/types/user.type'

interface UseCurrentUserResult {
  user: UserInfo | null
  isLoading: boolean
}

export function useCurrentUser(): UseCurrentUserResult {
  const [user, setUser] = useState<UserInfo | null>(null)
  // 토큰이 있을 때만 로딩 상태로 시작 — effect 내부 동기 setState 방지
  const [isLoading, setIsLoading] = useState(
    () => !!localStorage.getItem('access_token'),
  )

  useEffect(() => {
    if (!localStorage.getItem('access_token')) return

    const fetchUser = async () => {
      try {
        const { data } = await getMe()
        setUser(data.data)
      } catch {
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()
  }, [])

  return { user, isLoading }
}
