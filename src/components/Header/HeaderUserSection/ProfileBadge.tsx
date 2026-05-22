import Badge from '@/components/common/Badge/Badge'

interface ProfileBadgeProps {
  name: string
}

function ProfileBadge({ name }: ProfileBadgeProps) {
  const initial = name[0]

  return (
    <div className="flex items-center gap-3">
      <Badge ariaLabel={`${name}의 프로필`} size="sm">
        {initial}
      </Badge>
      <div className="text-light-background text-body2">{name}</div>
    </div>
  )
}

export default ProfileBadge
