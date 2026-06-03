import { Navigate, useLocation } from 'react-router-dom'
import Spinner from '@/components/common/Spinner/Spinner'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { getRoleSpacesPath } from '@/lib/authRoutes'

/** Hero「시작하기」링크 대상. 로그인 시 Role별 학습방 목록, 미로그인 시 로그인으로. */
export const SPACES_ENTRY_PATH = '/spaces'

export default function SpacesEntryRedirect() {
  const { user, isLoading } = useCurrentUser()
  const location = useLocation()

  if (isLoading) {
    return (
      <main className="bg-background flex flex-1 items-center justify-center">
        <Spinner size="md" color="text-neon-green" />
      </main>
    )
  }

  if (user) {
    return <Navigate to={getRoleSpacesPath(user)} replace />
  }

  return (
    <Navigate
      to="/login"
      replace
      state={{ from: location.pathname, intent: 'spaces' }}
    />
  )
}
