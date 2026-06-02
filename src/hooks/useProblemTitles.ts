import { useQuery } from '@tanstack/react-query'
import { getProblem } from '@/services/problem'
import { getWorkspace } from '@/services/workspace'

interface ProblemInfo {
  title: string
  spaceId: number
  spaceName: string
}

export function useProblemTitles(problemIds: number[]) {
  return useQuery({
    queryKey: ['problemTitles', problemIds],
    enabled: problemIds.length > 0,
    queryFn: async () => {
      const problems = await Promise.all(
        problemIds.map(async (id) => {
          const { data } = await getProblem(0, id)
          return { id, title: data.data.title, spaceId: data.data.space_id }
        }),
      )

      const uniqueSpaceIds = [...new Set(problems.map((p) => p.spaceId))]
      const workspaces = await Promise.all(
        uniqueSpaceIds.map(async (spaceId) => {
          const { data } = await getWorkspace(spaceId)
          return [spaceId, data.data.name] as const
        }),
      )
      const workspaceNameMap = Object.fromEntries(workspaces)

      const entries = problems.map(
        ({ id, title, spaceId }) =>
          [
            id,
            { title, spaceId, spaceName: workspaceNameMap[spaceId] ?? '' },
          ] as const,
      )
      return Object.fromEntries(entries) as Record<number, ProblemInfo>
    },
  })
}
