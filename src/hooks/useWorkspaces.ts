import { useCallback, useEffect, useState } from 'react'
import { getWorkspaces } from '@/services/workspace'
import type { WorkspaceListItem } from '@/types/workspace.type'

interface UseWorkspacesResult {
  workspaces: WorkspaceListItem[]
  isLoading: boolean
  refetch: () => Promise<void>
}

export function useWorkspaces(): UseWorkspacesResult {
  const [workspaces, setWorkspaces] = useState<WorkspaceListItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const refetch = useCallback(async () => {
    setIsLoading(true)
    try {
      const { data } = await getWorkspaces()
      setWorkspaces(data.data)
    } catch {
      setWorkspaces([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void refetch()
  }, [refetch])

  return { workspaces, isLoading, refetch }
}
