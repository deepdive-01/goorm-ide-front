import { useNavigate } from 'react-router-dom'
import { logout } from '@/services/auth'

export function useLogout() {
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logout()
    } finally {
      localStorage.removeItem('access_token')
      navigate('/login')
    }
  }

  return handleLogout
}
