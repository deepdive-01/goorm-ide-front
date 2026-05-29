import { useMemo, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { Search } from 'lucide-react'
import Spinner from '@/components/common/Spinner/Spinner'
import JoinSpaceDialog from '@/components/student/JoinSpaceDialog'
import SpaceCard from '@/components/student/SpaceCard'
import { STUDENT_SPACES_COPY } from '@/content/studentSpaces'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { useWorkspaces } from '@/hooks/useWorkspaces'

type SpaceListPageProps = {
  role: 'student' | 'teacher'
}

function SpaceListPage({ role }: SpaceListPageProps) {
  const params = useParams()
  const { user, isLoading: isUserLoading } = useCurrentUser()
  const { workspaces, isLoading } = useWorkspaces()
  const [query, setQuery] = useState('')

  const teacherId = params.teacherId

  const filteredWorkspaces = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return workspaces
    return workspaces.filter(
      (w) =>
        w.name.toLowerCase().includes(q) ||
        w.description.toLowerCase().includes(q) ||
        (w.mentor_name?.toLowerCase().includes(q) ?? false),
    )
  }, [workspaces, query])

  if (role !== 'student') {
    return (
      <main className="text-body1 text-gray-400 px-4 py-16 text-center">
        강사 학습방 관리
        <span className="text-gray-600 mt-2 block text-sm">ID: {teacherId}</span>
      </main>
    )
  }

  if (isUserLoading) {
    return (
      <main className="bg-background flex flex-1 items-center justify-center">
        <Spinner size="md" color="text-neon-green" />
      </main>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return (
    <main className="bg-background text-light-background flex flex-1 px-4 py-10 sm:px-16 lg:px-22">
      <div className="mx-auto flex w-full max-w-[1152px] flex-1 flex-col gap-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <header className="flex flex-col gap-2">
            <h1 className="text-head2 text-white">{STUDENT_SPACES_COPY.title}</h1>
            <p className="text-body2 text-gray-400 max-w-xl">
              {STUDENT_SPACES_COPY.subtitle}
            </p>
          </header>
          <JoinSpaceDialog />
        </div>

        <div className="relative">
          <Search
            className="text-gray-500 pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2"
            aria-hidden
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={STUDENT_SPACES_COPY.searchPlaceholder}
            aria-label={STUDENT_SPACES_COPY.searchPlaceholder}
            className="text-body1 placeholder:text-body2 placeholder:text-gray-400 h-12 w-full rounded-xl border border-gray-800 bg-[#151515] py-3 pr-4 pl-12 text-light-background focus:border-neon-green focus:outline-none"
          />
        </div>

        {isLoading ? (
          <div className="flex min-h-[320px] items-center justify-center">
            <Spinner size="md" color="text-neon-green" />
          </div>
        ) : filteredWorkspaces.length === 0 ? (
          <div className="border-gray-800 flex min-h-[320px] flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-4 text-center">
            <p className="text-head3 text-white">{STUDENT_SPACES_COPY.emptyTitle}</p>
            <p className="text-body2 text-gray-500">
              {query.trim()
                ? '검색 결과가 없습니다.'
                : STUDENT_SPACES_COPY.emptyDescription}
            </p>
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredWorkspaces.map((workspace) => (
              <li key={workspace.id}>
                <SpaceCard workspace={workspace} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  )
}

export default SpaceListPage
