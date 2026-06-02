import { useQuery } from '@tanstack/react-query'
import { getStudentSubmissions } from '@/services/file'

export function useStudentSubmissions(studentId: number) {
  return useQuery({
    queryKey: ['studentSubmissions', studentId] as const,
    enabled: Number.isFinite(studentId) && studentId > 0,
    staleTime: 0,
    queryFn: async () => {
      const { data } = await getStudentSubmissions(studentId)
      return data.data ?? []
    },
  })
}

