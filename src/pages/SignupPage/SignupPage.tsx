import { type FormEvent, useState } from 'react'
import { Link } from 'react-router-dom'
import Logo from '@/components/common/Logo'
import Button from '@/components/common/Button/Button'
import type { UserRole } from '@/types/api.type'

const ROLE_LABEL: Record<UserRole, string> = {
  STUDENT: '학생',
  MENTOR: '강사',
}

const ROLE_DESCRIPTION: Record<UserRole, string> = {
  STUDENT: '학생 계정으로 가입하고, 문제 풀이와 피드백을 받아보세요.',
  MENTOR: '강사 계정으로 가입하고, 수업과 문제를 관리해보세요.',
}

const AUTH_BTN = {
  width: 'w-full',
  size: 'xl' as const,
  textClassName: 'text-body1 font-medium',
  className: 'h-10 py-0',
}

const INPUT_CLASS =
  'text-body1 mt-3 block h-10 w-full rounded-lg border border-gray-800 bg-[#151515] px-3 font-normal text-light-background placeholder:text-body2 placeholder:font-normal placeholder:text-gray-400 focus:border-neon-green focus:outline-none'

const INPUT_CLASS_INLINE =
  'text-body1 min-w-0 flex-1 rounded-lg border border-gray-800 bg-[#151515] px-3 py-2.5 font-normal text-light-background placeholder:text-body2 placeholder:font-normal placeholder:text-gray-400 focus:border-neon-green focus:outline-none'

function SignupPage() {
  const [role, setRole] = useState<UserRole>('STUDENT')
  const [name, setName] = useState('')
  const [nickname, setNickname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.')
      return
    }
  }

  return (
    <div className="bg-[#151515] flex min-h-screen flex-col items-center justify-center gap-5 px-4 py-8">
      <Logo />

      <div className="w-full max-w-[424px] rounded-xl border border-gray-800 bg-[#151515] px-7 py-6">
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-3 text-center">
            <h1 className="text-[26px] leading-normal font-semibold text-light-background">
              회원가입
            </h1>
            <p className="text-body2 text-gray-400">{ROLE_DESCRIPTION[role]}</p>
          </div>

          <div className="flex h-10 w-full rounded-lg bg-gray-900 p-1">
            {(['STUDENT', 'MENTOR'] as const).map((item) => (
              <button
                key={item}
                type="button"
                aria-pressed={role === item}
                onClick={() => setRole(item)}
                className={`text-body2 flex-1 cursor-pointer rounded-md font-normal outline-none transition-colors focus:outline-none focus-visible:outline-none ${
                  role === item
                    ? 'bg-[#151515] text-light-background'
                    : 'text-gray-400'
                }`}
              >
                {ROLE_LABEL[item]}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-body2 font-normal text-gray-400">
              이름
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="이름을 입력하세요"
                required
                className={INPUT_CLASS}
              />
            </label>

            <label className="text-body2 font-normal text-gray-400">
              닉네임
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="닉네임을 입력하세요"
                required
                className={INPUT_CLASS}
              />
            </label>

            <div className="flex flex-col gap-3">
              <label
                htmlFor="signup-email"
                className="text-body2 font-normal text-gray-400"
              >
                이메일
              </label>
              <div className="flex items-stretch gap-2">
                <input
                  id="signup-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="이메일을 입력하세요"
                  required
                  className={INPUT_CLASS_INLINE}
                />
                <button
                  type="button"
                  aria-label="인증하기"
                  disabled={!email.trim()}
                  className="text-body2 shrink-0 cursor-pointer rounded-lg border border-gray-800 px-3.5 font-medium whitespace-nowrap text-neon-green transition-colors hover:border-neon-green/50 hover:bg-neon-green/5 active:bg-neon-green/10 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-gray-800 disabled:hover:bg-transparent"
                >
                  인증하기
                </button>
              </div>
            </div>

            <label className="text-body2 font-normal text-gray-400">
              비밀번호
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호를 입력하세요"
                required
                className={INPUT_CLASS}
              />
            </label>

            <label className="text-body2 font-normal text-gray-400">
              비밀번호 확인
              <input
                type="password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                placeholder="비밀번호를 다시 입력하세요"
                required
                className={INPUT_CLASS}
              />
            </label>
          </div>

          {error && (
            <p className="text-body3 text-red-400" role="alert">
              {error}
            </p>
          )}

          <Button type="submit" ariaLabel="회원가입" {...AUTH_BTN}>
            회원가입
          </Button>

          <p className="text-body2 flex items-center justify-center gap-1 text-gray-400">
            이미 계정이 있으신가요?
            <Link
              to="/login"
              className="text-neon-green font-medium hover:underline"
            >
              로그인
            </Link>
          </p>

          <hr className="border-gray-800" />

          <div className="flex flex-col gap-5">
            <Button
              bgColor="bg-white"
              hoverClassName="hover:bg-gray-100 active:bg-gray-200"
              ariaLabel="Google로 시작하기"
              {...AUTH_BTN}
            >
              Google로 시작하기
            </Button>
            <Button
              bgColor="bg-[#ffe500]"
              hoverClassName="hover:bg-[#f0d900] active:bg-[#e6cf00]"
              ariaLabel="카카오로 시작하기"
              {...AUTH_BTN}
            >
              카카오로 시작하기
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SignupPage
