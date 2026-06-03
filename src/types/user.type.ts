import type { UserRole } from './api.type'

export interface UserInfo {
  id: number
  email: string
  name: string
  nickname: string
  role: UserRole
  profile_image_url: string | null
  created_at: string
}
