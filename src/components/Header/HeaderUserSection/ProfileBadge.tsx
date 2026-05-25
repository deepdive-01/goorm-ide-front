import { useRef, useState, useEffect } from 'react'
import Badge from '@/components/common/Badge/Badge'
import ProfileDrop from './ProfileDrop'

interface ProfileBadgeProps {
  name: string
}

function ProfileBadge({ name }: ProfileBadgeProps) {
  const initial = name[0]
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <div
        className="flex cursor-pointer items-center gap-3"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <Badge ariaLabel={`${name}의 프로필`} size="sm">
          {initial}
        </Badge>
        <div className="text-light-background text-body2">{name}</div>
      </div>
      {isOpen && (
        <div className="absolute top-full right-0 z-50 mt-2">
          <ProfileDrop />
        </div>
      )}
    </div>
  )
}

export default ProfileBadge
