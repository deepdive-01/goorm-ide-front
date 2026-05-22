import Button from '@/components/common/Button/Button'

function GuestActions() {
  return (
    <div className="flex items-center gap-6">
      <div className="text-light-background text-body2">로그인</div>
      <Button>회원가입</Button>
    </div>
  )
}

export default GuestActions
