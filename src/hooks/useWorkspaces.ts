import { useQuery } from '@tanstack/react-query'
import { getWorkspaces } from '@/services/workspace'
import { workspaceQueryKeys } from '@/lib/workspaceQueryKeys'
import type { WorkspaceListItem } from '@/types/workspace.type'

interface UseWorkspacesResult {
  workspaces: WorkspaceListItem[]
  isLoading: boolean
  refetch: () => Promise<unknown>
}

export function useWorkspaces(): UseWorkspacesResult {
  const query = useQuery({
    queryKey: workspaceQueryKeys.all,
    queryFn: async () => {
      const { data } = await getWorkspaces()
      return data.data
    },
  })

  return {
    workspaces: query.data ?? [],
    isLoading: query.isLoading,
    refetch: query.refetch,
  }
}
