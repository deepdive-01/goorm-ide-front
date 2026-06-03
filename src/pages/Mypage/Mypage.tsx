import Notification from '@/components/Notification/Notification'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { useStudentSubmissions } from '@/hooks/useStudentSubmissions'
import Profile from './Profile'
import SubmitCheck from './SubmitCheck'

function Mypage() {
  const { user } = useCurrentUser()
  const isStudent = user?.role === 'STUDENT'

  const { data: submissions } = useStudentSubmissions(
    isStudent && user?.id ? user.id : 0,
  )
  const notificationInLeft = isStudent && (submissions ?? []).length >= 4

  return (
    <div className="bg-background flex h-full flex-col gap-9 px-22 pb-9">
      <div className="pt-9">
        <div className="text-head1 text-light-background">마이페이지</div>
        <div className="text-body2 text-gray-600">
          학습 현황과 프로필을 관리하세요
        </div>
      </div>

      <div className="flex gap-9">
        <div className="flex w-[35%] flex-col gap-9">
          <Profile />
          {notificationInLeft && <Notification variant="page" />}
        </div>
        <div className="flex w-[65%] flex-col gap-9">
          {isStudent && <SubmitCheck />}
          {!notificationInLeft && <Notification variant="page" />}
        </div>
      </div>
    </div>
  )
}

export default Mypage
