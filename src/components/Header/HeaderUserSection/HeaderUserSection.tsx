import Spinner from '@/components/common/Spinner/Spinner'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import GuestActions from './GuestActions'
import UserActions from './UserActions'

function HeaderUserSection() {
  const { user, isLoading } = useCurrentUser()

  if (isLoading) return <Spinner size="sm" />
  if (!user) return <GuestActions />
  return <UserActions user={user} />
}

export default HeaderUserSection
