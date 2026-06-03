import { normalizeUserInfo } from '@/lib/apiMapper'
import api from './api'
import type { ApiResponse } from '@/types/api.type'
import type { UserInfo } from '@/types/user.type'

export const getMe = async () => {
  const response = await api.get<ApiResponse<UserInfo>>('/api/v1/users/me')

  return {
    ...response,
    data: {
      ...response.data,
      data: normalizeUserInfo(response.data.data),
    },
  }
}

export const deleteMe = () => api.delete('/api/v1/users/me')
