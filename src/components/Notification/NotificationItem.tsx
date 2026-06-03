import Badge from '@/components/common/Badge/Badge'
import { MessageSquare, UserPlus, Send } from 'lucide-react'
import type {
  NotificationItem as NotificationItemType,
  NotificationType,
} from '@/types/notification.type'
import { formatRelativeTime } from '@/utils/formatRelativeTime'

const typeConfig: Record<
  NotificationType,
  { icon: React.ReactNode; bgColor: string; textColor: string }
> = {
  FEEDBACK_RECEIVED: {
    icon: <MessageSquare size={20} />,
    bgColor: 'bg-neon-blue',
    textColor: 'text-neon-blue',
  },
  WORKSPACE_INVITED: {
    icon: <UserPlus size={20} />,
    bgColor: 'bg-neon-green',
    textColor: 'text-neon-green',
  },
  SUBMISSION_RECEIVED: {
    icon: <Send size={20} />,
    bgColor: 'bg-neon-blue',
    textColor: 'text-neon-blue',
  },
}

function NotificationItemRow({
  id,
  type,
  content,
  isRead,
  createdAt,
  onRead,
}: NotificationItemType & { onRead?: (id: number) => void }) {
  const { icon, bgColor, textColor } = typeConfig[type]

  return (
    <div
      className="flex cursor-pointer justify-between border-b border-gray-800 px-6 py-4"
      onClick={() => {
        if (!isRead) onRead?.(id)
      }}
    >
      <div className="flex items-center gap-5">
        <div className="relative">
          <Badge
            bgColor={bgColor}
            bgOpacity={30}
            size="sm"
            ariaLabel="알림 아이콘"
            textColor={textColor}
          >
            {icon}
          </Badge>
          {isRead && (
            <div className="absolute inset-0 rounded-full bg-black/50" />
          )}
        </div>

        <div className="flex flex-col">
          <div
            className={`text-body3 ${isRead ? 'text-gray-600' : 'text-light-background'}`}
          >
            {content}
          </div>
          <p className="text-body4 text-gray-600">
            {formatRelativeTime(createdAt)}
          </p>
        </div>
      </div>

      {!isRead && <div className="bg-neon-blue h-2 w-2 rounded-full" />}
    </div>
  )
}

interface NotificationItemProps {
  notifications: NotificationItemType[]
  isScrollable?: boolean
  onRead?: (id: number) => void
}

function NotificationItem({
  notifications,
  isScrollable = false,
  onRead,
}: NotificationItemProps) {
  return (
    <div className="-mx-7">
      {notifications.length === 0 ? (
        <div className="text-body3 py-10 text-center text-gray-600">
          알림이 없습니다.
        </div>
      ) : (
        <div
          className={
            isScrollable
              ? 'max-h-100 overflow-y-auto [&>*:last-child]:border-b-0'
              : ''
          }
        >
          {notifications.map((item) => (
            <NotificationItemRow key={item.id} {...item} onRead={onRead} />
          ))}
        </div>
      )}
    </div>
  )
}

export default NotificationItem
