import Profile from './Profile'
import Notification from '@/components/Notification/Notification'

function Mypage() {
  return (
    <div className="bg-background flex h-full flex-col gap-9 px-22 pb-9">
      {/* Title */}
      <div className="pt-9">
        <div className="text-head1 text-light-background">마이페이지</div>
        <div className="text-body2 text-gray-600">
          학습 현황과 프로필을 관리하세요
        </div>
      </div>

      <div className="flex gap-9">
        <div className="w-[35%]">
          <Profile />
        </div>
        <div className="flex w-[65%] flex-col gap-9">
          <Notification variant="page" />
        </div>
      </div>
    </div>
  )
}

export default Mypage
