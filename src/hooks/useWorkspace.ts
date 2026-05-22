import { useState, useEffect } from 'react'
import { getWorkspace } from '@/services/workspace'
import type { WorkspaceDetail } from '@/types/workspace.type'

interface UseWorkspaceResult {
  workspace: WorkspaceDetail | null
  isLoading: boolean
}

export function useWorkspace(spaceId: number): UseWorkspaceResult {
  const [workspace, setWorkspace] = useState<WorkspaceDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await getWorkspace(spaceId)
        setWorkspace(data.data)
      } catch {
        setWorkspace(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetch()
  }, [spaceId])

  return { workspace, isLoading }
}
