import { useRef, useState, useEffect } from 'react'
import { Bell } from 'lucide-react'
import Notification from '@/components/Notification/Notification'

function NotificationButton() {
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
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative p-1"
      >
        <Bell className="text-light-background" />
      </button>
      {isOpen && (
        <div className="absolute top-full right-0 z-50 mt-2">
          <Notification variant="popup" />
        </div>
      )}
    </div>
  )
}

export default NotificationButton
