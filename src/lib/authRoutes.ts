import type { UserInfo } from '@/types/user.type'

/** Role별 학습방 목록 경로 (팀 라우팅 규칙) */
export function getRoleSpacesPath(user: UserInfo): string {
  if (user.role === 'MENTOR') {
    return `/teacher/${user.id}/spaces`
  }
  return `/student/${user.id}/spaces`
}
