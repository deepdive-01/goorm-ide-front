export interface CreateWorkspaceRequest {
  name: string
  description?: string
}

export interface WorkspaceCreated {
  id: number
  name: string
  description: string
  is_public: boolean
  invite_code: string
  is_active: boolean
  created_at: string
}

export interface WorkspaceListItem {
  id: number
  name: string
  description: string
  member_count: number
  is_active: boolean
  created_at: string
  /** MSW·목 UI — API 스펙 확정 시 백엔드 필드로 교체 */
  mentor_name?: string
  problem_count?: number
  lecture_count?: number
}

export interface WorkspaceDetail {
  id: number
  name: string
  description: string
  mentor: { id: number; nickname: string }
  invite_code?: string
  member_count: number
  is_public: boolean
  is_active: boolean
  created_at: string
}

export interface UpdateWorkspaceRequest {
  name?: string
  description?: string
  is_active?: boolean
}

export interface WorkspaceUpdated {
  id: number
  name: string
  description: string
  updated_at: string
}

export interface JoinWorkspaceRequest {
  invite_code: string
}

export interface JoinWorkspaceResponse {
  space_id: number
  space_name: string
  joined_at: string
}

export interface WorkspaceMember {
  user_id: number
  nickname: string
  profile_image_url: string | null
  joined_at: string
}

export interface WorkspaceMembersResponse {
  space_id: number
  space_name: string
  member_count: number
  members: WorkspaceMember[]
}

export interface InviteEmailRequest {
  emails: string[]
}

export interface InviteEmailResponse {
  space_id: number
  space_name: string
  sent_count: number
}
