// 기존 유저 소셜 로그인 완료 후 accessToken을 받아 앱 로그인 상태를 확정하는 콜백 페이지입니다.
import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import Logo from '@/components/common/Logo'
import Spinner from '@/components/common/Spinner/Spinner'
import {
  clearAccessToken,
  clearOAuthIntendedRole,
  getRoleHomePath,
  resolveOAuthRole,
  saveAccessToken,
} from '@/lib/auth'
import { getMe } from '@/services/user'

function OAuthCallbackPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const accessToken =
    searchParams.get('access_token') ??
    searchParams.get('accessToken') ??
    ''
  const intendedRole = resolveOAuthRole(searchParams.get('role'))
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const completeOAuthLogin = async () => {
      if (!accessToken) {
        setError('로그인 정보가 올바르지 않습니다. 다시 로그인해주세요.')
        return
      }

      saveAccessToken(accessToken)

      try {
        const { data } = await getMe()
        const userRole = data.data.role

        if (!isMounted) {
          return
        }

        if (intendedRole && intendedRole !== userRole) {
          clearAccessToken()
          clearOAuthIntendedRole()
          navigate('/login?error=oauth_role_mismatch', { replace: true })
          return
        }

        clearOAuthIntendedRole()
        navigate(getRoleHomePath(userRole), { replace: true })
      } catch {
        clearAccessToken()
        clearOAuthIntendedRole()

        if (!isMounted) {
          return
        }

        setError('로그인 정보를 불러오지 못했습니다. 다시 로그인해주세요.')
      }
    }

    completeOAuthLogin()

    return () => {
      isMounted = false
    }
  }, [accessToken, intendedRole, navigate])

  return (
    <div className="bg-[#151515] flex min-h-screen flex-col items-center justify-center gap-5 px-4 py-8">
      <Logo />

      <div className="w-full max-w-[424px] rounded-xl border border-gray-800 bg-[#151515] px-7 py-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <h1 className="text-[26px] leading-normal font-semibold text-light-background">
            소셜 로그인
          </h1>

          {error ? (
            <>
              <p className="text-body2 text-red-400" role="alert">
                {error}
              </p>
              <Link
                to="/login"
                className="text-body2 text-neon-green font-medium hover:underline"
              >
                로그인으로 돌아가기
              </Link>
            </>
          ) : (
            <>
              <Spinner color="text-neon-green" />
              <p className="text-body2 text-gray-400">
                로그인 정보를 확인하고 있습니다.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default OAuthCallbackPage
