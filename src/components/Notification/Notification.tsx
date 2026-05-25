import { useState } from 'react'
import Card from '@/components/common/Card/Card'
import { CheckCheck } from 'lucide-react'
import { useNotifications } from '@/hooks/useNotifications'
import NotificationItem from './NotificationItem'
import Pagination from './Pagination'

type NotificationTab = 'all' | 'unread'

const PAGE_SIZE = 5

interface NotificationProps {
  variant: 'popup' | 'page'
}

function Notification({ variant }: NotificationProps) {
  const isPopup = variant === 'popup'
  const [activeTab, setActiveTab] = useState<NotificationTab>('all')
  const [currentPage, setCurrentPage] = useState(0)
  const { data, readAll, readOne } = useNotifications()
  const totalCount = data?.totalCount ?? 0
  const unreadCount = data?.unreadCount ?? 0
  const allNotifications = (data?.notifications ?? []).slice().sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )
  const tabFiltered =
    activeTab === 'unread'
      ? allNotifications.filter((n) => !n.isRead)
      : allNotifications

  const totalPages = Math.ceil(tabFiltered.length / PAGE_SIZE)
  const displayedNotifications = isPopup
    ? tabFiltered
    : tabFiltered.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE)

  return (
    <Card width="w-92" className="pb-0">
      {/* Notification Title */}
      <div
        id="notiTitle"
        className="flex w-full items-center justify-between gap-2 whitespace-nowrap"
      >
        <h1 className="text-Head1">알림</h1>
        <div
          className="text-body3 flex cursor-pointer items-center gap-2 text-gray-600"
          onClick={readAll}
        >
          <CheckCheck size={20} />
          <p>모두 읽음</p>
        </div>
      </div>

      {/* Notification Tab */}
      <div id="notiTab" className="text-body3 -mx-7 flex w-[calc(100%+3.5rem)]">
        <div
          className={`flex w-1/2 cursor-pointer justify-center py-3 ${activeTab === 'all' ? 'border-b-neon-green border-b-2 font-semibold' : 'border-b border-b-gray-800'}`}
          onClick={() => {
            setActiveTab('all')
            setCurrentPage(0)
          }}
        >
          <div className="flex items-center gap-2">
            <p>전체</p>
            <span className="text-body4 text-gray-600">{totalCount}</span>
          </div>
        </div>
        <div
          className={`flex w-1/2 cursor-pointer justify-center py-3 ${activeTab === 'unread' ? 'border-b-neon-green border-b-2 font-semibold' : 'border-b border-b-gray-800'}`}
          onClick={() => {
            setActiveTab('unread')
            setCurrentPage(0)
          }}
        >
          <div className="flex items-center gap-2">
            <p>읽지 않음</p>
            <span className="text-body4 text-gray-600">{unreadCount}</span>
          </div>
        </div>
      </div>

      {/* Notification Item */}
      <NotificationItem
        notifications={displayedNotifications}
        isScrollable={isPopup}
        onRead={readOne}
      />

      {/* 페이지네이션 (page 전용) */}
      {!isPopup && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPrev={() => setCurrentPage((p) => Math.max(0, p - 1))}
          onNext={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
        />
      )}
    </Card>
  )
}

export default Notification
