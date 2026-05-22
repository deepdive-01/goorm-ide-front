import type { UserInfo } from '@/types/user.type'
import NotificationButton from './NotificationButton'
import ProfileBadge from './ProfileBadge'

interface UserActionsProps {
  user: UserInfo
}

function UserActions({ user }: UserActionsProps) {
  return (
    <div className="flex items-center gap-6">
      <div className="text-body2">스페이스</div>
      <NotificationButton />
      <ProfileBadge name={user.nickname} />
    </div>
  )
}

export default UserActions
