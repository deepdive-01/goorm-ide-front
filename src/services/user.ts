import api from './api'
import type { ApiResponse } from '@/types/api.type'
import type { UserInfo } from '@/types/user.type'

export const getMe = () => api.get<ApiResponse<UserInfo>>('/api/v1/users/me')

export const deleteMe = () => api.delete('/api/v1/users/me')
