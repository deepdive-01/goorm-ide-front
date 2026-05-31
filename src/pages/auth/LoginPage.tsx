import { type FormEvent, useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import Logo from '@/components/common/Logo'
import Button from '@/components/common/Button/Button'
import {
  clearAccessToken,
  getLoginErrorMessage,
  getRoleHomePath,
  saveAccessToken,
  startSocialAuth,
  validateEmail,
  validatePassword,
} from '@/lib/auth'
import { login } from '@/services/auth'
import { getMe } from '@/services/user'
import type { UserRole } from '@/types/api.type'
import type { OAuthProvider } from '@/types/auth.type'

const ROLE_LABEL: Record<UserRole, string> = {
  STUDENT: '학생',
  MENTOR: '강사',
}

const ROLE_DESCRIPTION: Record<UserRole, string> = {
  STUDENT: '학생 계정으로 로그인하고, 문제 풀이와 피드백을 받아보세요.',
  MENTOR: '강사 계정으로 로그인하고, 수업과 문제를 관리해보세요.',
}

const LOGIN_BTN = {
  width: 'w-full',
  size: 'xl' as const,
  textClassName: 'text-body1 font-medium',
  className: 'h-10 py-0',
}

const SOCIAL_LOGIN_LABEL: Record<OAuthProvider, string> = {
  google: 'Google로 로그인',
  kakao: '카카오 로그인',
}

function getOauthErrorMessage(errorCode: string | null): string | null {
  if (!errorCode || errorCode === 'oauth_cancelled') {
    return null
  }

  if (errorCode === 'oauth_role_mismatch') {
    return '선택한 사용자 유형이 올바르지 않습니다'
  }

  return '인증에 실패했습니다. 다시 시도해주세요.'
}

function LoginPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [role, setRole] = useState<UserRole>('STUDENT')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const oauthErrorMessage = useMemo(
    () => getOauthErrorMessage(searchParams.get('error')),
    [searchParams],
  )

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    const emailError = validateEmail(email)
    if (emailError) {
      setError(emailError)
      return
    }

    const passwordError = validatePassword(password)
    if (passwordError) {
      setError(passwordError)
      return
    }

    setError(null)
    setIsLoading(true)

    try {
      const { data } = await login({
        email: email.trim(),
        password,
        role,
      })
      saveAccessToken(data.data.access_token)

      const { data: meResponse } = await getMe()
      const userRole = meResponse.data.role

      if (userRole !== role) {
        clearAccessToken()
        setError('선택한 사용자 유형이 올바르지 않습니다')
        return
      }

      navigate(getRoleHomePath(userRole))
    } catch (submitError) {
      clearAccessToken()
      setError(getLoginErrorMessage(submitError))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-[#151515] flex min-h-screen flex-col items-center justify-center gap-5 px-4 py-8">
      <Logo />

      <div className="w-full max-w-[424px] rounded-xl border border-gray-800 bg-[#151515] px-7 py-6">
        <form className="flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
          <div className="flex flex-col gap-3 text-center">
            <h1 className="text-[26px] leading-normal font-semibold text-light-background">
              로그인
            </h1>
            <p className="text-body2 text-gray-400">{ROLE_DESCRIPTION[role]}</p>
          </div>

          <div className="flex h-10 w-full rounded-lg bg-gray-900 p-1">
            {(['STUDENT', 'MENTOR'] as const).map((item) => (
                <button
                  key={item}
                  type="button"
                  aria-pressed={role === item}
                    onClick={() => {
                      setRole(item)
                      setError(null)
                    }}
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
              이메일
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setError(null)
                }}
                placeholder="이메일을 입력하세요"
                required
                className="text-body1 mt-3 block h-10 w-full rounded-lg border border-gray-800 bg-[#151515] px-3 font-normal text-light-background placeholder:text-body2 placeholder:font-normal placeholder:text-gray-400 focus:border-neon-green focus:outline-none"
              />
            </label>

            <label className="text-body2 font-normal text-gray-400">
              비밀번호
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setError(null)
                }}
                placeholder="비밀번호를 입력하세요"
                required
                className="text-body1 mt-3 block h-10 w-full rounded-lg border border-gray-800 bg-[#151515] px-3 font-normal text-light-background placeholder:text-body2 placeholder:font-normal placeholder:text-gray-400 focus:border-neon-green focus:outline-none"
              />
            </label>
          </div>

          {(error ?? oauthErrorMessage) && (
            <p className="text-body3 text-red-400" role="alert">
              {error ?? oauthErrorMessage}
            </p>
          )}

          <Button
            type="submit"
            isLoading={isLoading}
            ariaLabel="로그인"
            {...LOGIN_BTN}
          >
            로그인
          </Button>

          <p className="text-body2 flex items-center justify-center gap-1 text-gray-400">
            계정이 없으신가요?
            <Link
              to="/signup"
              className="text-neon-green font-medium hover:underline"
            >
              회원가입
            </Link>
          </p>

          <hr className="border-gray-800" />

          <div className="flex flex-col gap-5">
            <Button
              bgColor="bg-white"
              hoverClassName="hover:bg-gray-100 active:bg-gray-200"
              ariaLabel={SOCIAL_LOGIN_LABEL.google}
              disabled={isLoading}
              onClick={() =>
                startSocialAuth({
                  intent: 'login',
                  provider: 'google',
                  role,
                })
              }
              {...LOGIN_BTN}
            >
              {SOCIAL_LOGIN_LABEL.google}
            </Button>
            <Button
              bgColor="bg-[#ffe500]"
              hoverClassName="hover:bg-[#f0d900] active:bg-[#e6cf00]"
              ariaLabel={SOCIAL_LOGIN_LABEL.kakao}
              disabled={isLoading}
              onClick={() =>
                startSocialAuth({
                  intent: 'login',
                  provider: 'kakao',
                  role,
                })
              }
              {...LOGIN_BTN}
            >
              {SOCIAL_LOGIN_LABEL.kakao}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LoginPage
