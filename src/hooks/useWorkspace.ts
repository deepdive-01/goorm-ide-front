import { useState, useEffect } from 'react'
import { getWorkspace } from '@/services/workspace'
import type { WorkspaceDetail } from '@/types/workspace.type'

interface UseWorkspaceResult {
  workspace: WorkspaceDetail | null
  isLoading: boolean
  error: string | null
}

export function useWorkspace(spaceId: number): UseWorkspaceResult {
  const [workspace, setWorkspace] = useState<WorkspaceDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const fetch = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const { data } = await getWorkspace(spaceId)
        if (isMounted) {
          setWorkspace(data.data)
        }
      } catch {
        if (isMounted) {
          setWorkspace(null)
          setError('스페이스 정보를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    fetch()

    return () => {
      isMounted = false
    }
  }, [spaceId])

  return { workspace, isLoading, error }
}
