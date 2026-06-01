import Profile from './Profile'
import Notification from '@/components/Notification/Notification'
import SubmitCheck from '@/pages/MyPage/SubmitCheck'

function Mypage() {
  return (
    <div className="bg-background min-h-screen px-22">
      {/* Title */}
      <div className="pt-9">
        <div className="text-head1 text-light-background">마이페이지</div>
        <div className="text-body2 text-gray-600">
          학습 현황과 프로필을 관리하세요
        </div>
      </div>

      <div className="flex gap-9">
        {/* Left Content */}
        <div className="flex flex-col gap-9 py-9">
          <Profile />
          <Notification variant="page" />
        </div>
        {/* Right Content */}
        <SubmitCheck />
      </div>
    </div>
  )
}

export default Mypage
