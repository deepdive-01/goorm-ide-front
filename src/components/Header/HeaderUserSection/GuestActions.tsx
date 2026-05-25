import { useNavigate } from 'react-router-dom'
import Button from '@/components/common/Button/Button'

function GuestActions() {
  const navigate = useNavigate()

  return (
    <div className="flex items-center gap-6">
      <div
        className="text-light-background text-body2 cursor-pointer"
        onClick={() => navigate('/login')}
      >
        로그인
      </div>
      <Button onClick={() => navigate('/signup')}>회원가입</Button>
    </div>
  )
}

export default GuestActions
