import api from './api'
import type { ApiResponse } from '@/types/api.type'
import type {
  CreateWorkspaceRequest,
  WorkspaceCreated,
  WorkspaceListItem,
  WorkspaceDetail,
  UpdateWorkspaceRequest,
  WorkspaceUpdated,
  JoinWorkspaceRequest,
  JoinWorkspaceResponse,
  WorkspaceMembersResponse,
  InviteEmailRequest,
  InviteEmailResponse,
} from '@/types/workspace.type'

export const createWorkspace = (body: CreateWorkspaceRequest) =>
  api.post<ApiResponse<WorkspaceCreated>>('/api/v1/spaces', body)

export const getWorkspaces = () =>
  api.get<ApiResponse<WorkspaceListItem[]>>('/api/v1/spaces')

export const getWorkspace = (spaceId: number) =>
  api.get<ApiResponse<WorkspaceDetail>>(`/api/v1/spaces/${spaceId}`)

export const updateWorkspace = (
  spaceId: number,
  body: UpdateWorkspaceRequest,
) => api.patch<ApiResponse<WorkspaceUpdated>>(`/api/v1/spaces/${spaceId}`, body)

export const joinWorkspace = (body: JoinWorkspaceRequest) =>
  api.post<ApiResponse<JoinWorkspaceResponse>>('/api/v1/spaces/join', body)

export const getWorkspaceMembers = (spaceId: number) =>
  api.get<ApiResponse<WorkspaceMembersResponse>>(
    `/api/v1/spaces/${spaceId}/members`,
  )

export const inviteByEmail = (spaceId: number, body: InviteEmailRequest) =>
  api.post<ApiResponse<InviteEmailResponse>>(
    `/api/v1/spaces/${spaceId}/invite/email`,
    body,
  )
