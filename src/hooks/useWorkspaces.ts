import { useState, useEffect } from 'react'
import { getWorkspaces } from '@/services/workspace'
import type { WorkspaceListItem } from '@/types/workspace.type'

interface UseWorkspacesResult {
  workspaces: WorkspaceListItem[]
  isLoading: boolean
}

export function useWorkspaces(): UseWorkspacesResult {
  const [workspaces, setWorkspaces] = useState<WorkspaceListItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await getWorkspaces()
        setWorkspaces(data.data)
      } catch {
        setWorkspaces([])
      } finally {
        setIsLoading(false)
      }
    }

    fetch()
  }, [])

  return { workspaces, isLoading }
}
