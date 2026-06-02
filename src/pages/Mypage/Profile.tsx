import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserRound } from 'lucide-react'
import Card from '@/components/common/Card/Card'
import Badge from '@/components/common/Badge/Badge'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { deleteMe } from '@/services/user'

const ROLE_LABEL: Record<string, string> = {
  STUDENT: '학생',
  MENTOR: '강사',
}

function Profile() {
  const { user, isLoading } = useCurrentUser()
  const navigate = useNavigate()
  const [isWithdrawing, setIsWithdrawing] = useState(false)

  const handleWithdraw = async () => {
    if (!confirm('정말 탈퇴하시겠습니까?')) return
    setIsWithdrawing(true)
    try {
      await deleteMe()
    } finally {
      localStorage.removeItem('access_token')
      navigate('/login')
    }
  }

  if (isLoading || !user) return null

  return (
    <Card width="w-full">
      <div className="flex items-center justify-between">
        <div className="text-head3 text-light-background">프로필</div>
        <button
          onClick={handleWithdraw}
          disabled={isWithdrawing}
          className="text-body3 bg-neon-green cursor-pointer rounded-sm px-3 py-1 font-medium text-black disabled:opacity-50"
        >
          회원 탈퇴하기
        </button>
      </div>

      <div className="flex flex-col items-center gap-4 py-6">
        <Badge ariaLabel="프로필" size="lg" children />

        <div className="flex flex-col items-center gap-2">
          <div className="text-head3 text-light-background">
            {user.nickname}
          </div>
          <div className="text-body3 text-gray-600">{user.email}</div>
          <div
            className={`text-body3 rounded-full px-3 py-0.5 font-medium text-black opacity-70 ${user.role === 'MENTOR' ? 'bg-neon-blue' : 'bg-neon-green'}`}
          >
            {ROLE_LABEL[user.role]}
          </div>
        </div>
      </div>

      <div className="w-full border-b border-gray-800" />

      <div className="flex flex-col gap-3 pt-6">
        <div className="flex gap-3">
          <div className="text-body3 flex gap-1 text-gray-600">
            <UserRound size={15} />
            역할 :{' '}
          </div>
          <div className="text-body3 font-medium text-gray-300">
            {ROLE_LABEL[user.role]}
          </div>
        </div>

        <div className="flex gap-3">
          <div className="text-body3 flex gap-1 text-gray-600">
            <UserRound size={15} />
            이메일 :{' '}
          </div>
          <div className="text-body3 font-medium text-gray-300">
            {user.email}
          </div>
        </div>

        <div className="flex gap-3">
          <div className="text-body3 flex gap-1 text-gray-600">
            <UserRound size={15} />
            가입일 :{' '}
          </div>
          <div className="text-body3 font-medium text-gray-300">
            {user.created_at.slice(0, 10)}
          </div>
        </div>
      </div>
    </Card>
  )
}

export default Profile
