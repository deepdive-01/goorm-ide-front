import { useQuery } from '@tanstack/react-query'
import {
  enrichWorkspacesWithProblemCounts,
  getWorkspaces,
} from '@/services/workspace'
import { workspaceQueryKeys } from '@/lib/workspaceQueryKeys'
import type { WorkspaceListItem } from '@/types/workspace.type'

interface UseWorkspacesOptions {
  withProblemCounts?: boolean
}

interface UseWorkspacesResult {
  workspaces: WorkspaceListItem[]
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useWorkspaces(options?: UseWorkspacesOptions): UseWorkspacesResult {
  const withProblemCounts = options?.withProblemCounts ?? false

  const query = useQuery({
    queryKey: withProblemCounts
      ? [...workspaceQueryKeys.all, 'withProblemCounts']
      : workspaceQueryKeys.all,
    queryFn: async () => {
      const { data } = await getWorkspaces()
      const workspaces = data.data

      if (!withProblemCounts) {
        return workspaces
      }

      return enrichWorkspacesWithProblemCounts(workspaces)
    },
  })

  return {
    workspaces: query.data ?? [],
    isLoading: query.isLoading,
    error: query.isError ? '스페이스 목록을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.' : null,
    refetch: async () => {
      await query.refetch()
    },
  }
}
