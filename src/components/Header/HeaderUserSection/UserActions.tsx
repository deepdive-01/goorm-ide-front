import { Link } from 'react-router-dom'
import type { UserInfo } from '@/types/user.type'
import NotificationButton from './NotificationButton'
import ProfileBadge from './ProfileBadge'

interface UserActionsProps {
  user: UserInfo
}

function UserActions({ user }: UserActionsProps) {
  const spaceHref = user.role === 'MENTOR' ? '/teacher/spaces' : '/student/spaces'

  return (
    <div className="flex items-center gap-6">
      <Link to={spaceHref} className="text-body2">스페이스</Link>
      <NotificationButton />
      <ProfileBadge name={user.nickname} />
    </div>
  )
}

export default UserActions
