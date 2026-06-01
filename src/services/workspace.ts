import {
  normalizeWorkspaceCreated,
  normalizeWorkspaceDetail,
  normalizeWorkspaceList,
  normalizeWorkspaceMembersResponse,
  normalizeWorkspaceUpdated,
} from '@/lib/workspaceMapper'
import api from './api'
import type { ApiResponse } from '@/types/api.type'
import type {
  CreateWorkspaceRequest,
  WorkspaceListItem,
  UpdateWorkspaceRequest,
  JoinWorkspaceRequest,
  JoinWorkspaceResponse,
  InviteEmailRequest,
  InviteEmailResponse,
} from '@/types/workspace.type'

export const createWorkspace = async (body: CreateWorkspaceRequest) => {
  const response = await api.post<ApiResponse<unknown>>('/api/v1/spaces', body)

  return {
    ...response,
    data: {
      ...response.data,
      data: normalizeWorkspaceCreated(response.data.data),
    },
  }
}

export const getWorkspaces = async () => {
  const response = await api.get<ApiResponse<unknown>>('/api/v1/spaces')

  return {
    ...response,
    data: {
      ...response.data,
      data: normalizeWorkspaceList(response.data.data),
    },
  }
}

export const getWorkspace = async (spaceId: number) => {
  const response = await api.get<ApiResponse<unknown>>(`/api/v1/spaces/${spaceId}`)

  return {
    ...response,
    data: {
      ...response.data,
      data: normalizeWorkspaceDetail(response.data.data),
    },
  }
}

export const updateWorkspace = async (
  spaceId: number,
  body: UpdateWorkspaceRequest,
) => {
  const response = await api.patch<ApiResponse<unknown>>(
    `/api/v1/spaces/${spaceId}`,
    body,
  )

  return {
    ...response,
    data: {
      ...response.data,
      data: normalizeWorkspaceUpdated(response.data.data),
    },
  }
}

export const joinWorkspace = (body: JoinWorkspaceRequest) =>
  api.post<ApiResponse<JoinWorkspaceResponse>>('/api/v1/spaces/join', body)

export const getWorkspaceMembers = async (spaceId: number) => {
  const response = await api.get<ApiResponse<unknown>>(
    `/api/v1/spaces/${spaceId}/members`,
  )

  return {
    ...response,
    data: {
      ...response.data,
      data: normalizeWorkspaceMembersResponse(response.data.data),
    },
  }
}

export const inviteByEmail = (spaceId: number, body: InviteEmailRequest) =>
  api.post<ApiResponse<InviteEmailResponse>>(
    `/api/v1/spaces/${spaceId}/invite/email`,
    body,
  )

export async function enrichWorkspacesWithProblemCounts(
  workspaces: WorkspaceListItem[],
): Promise<WorkspaceListItem[]> {
  if (workspaces.length === 0) {
    return []
  }

  const { getProblems } = await import('./problem')

  return Promise.all(
    workspaces.map(async (workspace) => {
      try {
        const { data } = await getProblems(workspace.id)
        const problems = Array.isArray(data.data) ? data.data : []

        return {
          ...workspace,
          problem_count: problems.length,
          file_count: problems.length,
        }
      } catch {
        return {
          ...workspace,
          problem_count: workspace.problem_count ?? 0,
          file_count: workspace.problem_count ?? 0,
        }
      }
    }),
  )
}
