import { useMutation, useQueryClient } from '@tanstack/react-query'
import { joinWorkspace } from '@/services/workspace'
import { workspaceQueryKeys } from '@/lib/workspaceQueryKeys'

export function useJoinWorkspace() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (inviteCode: string) =>
      joinWorkspace({ invite_code: inviteCode }).then((res) => res.data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: workspaceQueryKeys.all })
    },
  })
}
