import { type FormEvent, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import Logo from '@/components/common/Logo'
import Button from '@/components/common/Button/Button'
import { oauthSignup } from '@/services/auth'
import type { UserRole } from '@/types/api.type'

const ROLE_LABEL: Record<UserRole, string> = {
  STUDENT: '학생',
  MENTOR: '강사',
}

const PROVIDER_DESCRIPTION: Record<string, string> = {
  kakao: '카카오 계정으로 가입을 완료하려면 추가 정보를 입력해주세요.',
  google: 'Google 계정으로 가입을 완료하려면 추가 정보를 입력해주세요.',
}

const AUTH_BTN = {
  width: 'w-full',
  size: 'xl' as const,
  textClassName: 'text-body1 font-medium',
  className: 'h-10 py-0',
}

const INPUT_CLASS =
  'text-body1 mt-3 block h-10 w-full rounded-lg border border-gray-800 bg-[#151515] px-3 font-normal text-light-background placeholder:text-body2 placeholder:font-normal placeholder:text-gray-400 focus:border-neon-green focus:outline-none'

function AdditionalInfoPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const tempKey = searchParams.get('temp_key') ?? ''
  const provider = searchParams.get('provider') ?? ''

  const [role, setRole] = useState<UserRole>('STUDENT')
  const [name, setName] = useState('')
  const [nickname, setNickname] = useState('')
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const description =
    PROVIDER_DESCRIPTION[provider] ??
    '소셜 계정으로 가입을 완료하려면 추가 정보를 입력해주세요.'

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!tempKey) {
      setError('유효하지 않은 가입 요청입니다. 다시 소셜 로그인을 시도해 주세요.')
      return
    }

    setIsLoading(true)

    try {
      const { data } = await oauthSignup({
        temp_key: tempKey,
        email,
        name,
        nickname,
        role,
      })
      localStorage.setItem('access_token', data.data.access_token)
      navigate(role === 'STUDENT' ? '/student' : '/teacher')
    } catch {
      setError('가입을 완료하지 못했습니다. 입력 정보를 확인해 주세요.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-[#151515] flex min-h-screen flex-col items-center justify-center gap-5 px-4 py-8">
      <Logo />

      <div className="w-full max-w-[424px] rounded-xl border border-gray-800 bg-[#151515] px-7 py-6">
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-3 text-center">
            <h1 className="text-[26px] leading-normal font-semibold text-light-background">
              추가 정보
            </h1>
            <p className="text-body2 text-gray-400">{description}</p>
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

            <label className="text-body2 font-normal text-gray-400">
              이메일
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="이메일을 입력하세요"
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

          <Button
            type="submit"
            isLoading={isLoading}
            ariaLabel="가입 완료"
            {...AUTH_BTN}
          >
            가입 완료
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
        </form>
      </div>
    </div>
  )
}

export default AdditionalInfoPage
