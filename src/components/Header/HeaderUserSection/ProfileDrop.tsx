import { CircleUserRound, LogOut } from 'lucide-react'
import { useLogout } from '@/hooks/useLogout'

function ProfileDrop() {
  const handleLogout = useLogout()

  return (
    <div className="bg-background flex w-fit flex-col rounded-lg border border-gray-800 text-gray-300">
      <button className="text-body2 flex items-center gap-2 border-b border-b-gray-800 px-4 py-2.5 whitespace-nowrap">
        <CircleUserRound size={16} className="text-neon-green" />
        마이페이지
      </button>
      <button
        className="text-body2 flex items-center gap-2 px-4 py-2.5 whitespace-nowrap text-gray-300"
        onClick={handleLogout}
      >
        <LogOut size={16} className="text-neon-green" />
        로그아웃
      </button>
    </div>
  )
}

export default ProfileDrop
