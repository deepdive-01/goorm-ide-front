import { FolderOpen } from 'lucide-react'
import { Navigate } from 'react-router-dom'
import Spinner from '@/components/common/Spinner/Spinner'
import CreateSpaceDialog from '@/components/teacher/CreateSpaceDialog'
import TeacherSpaceCard from '@/components/teacher/TeacherSpaceCard'
import { TEACHER_SPACES_COPY } from '@/content/teacherSpaces'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { useWorkspaces } from '@/hooks/useWorkspaces'
import { getRoleSpacesPath } from '@/lib/authRoutes'

function SpaceListPage() {
  const { user, isLoading: isUserLoading } = useCurrentUser()
  const { workspaces, isLoading, error, refetch } = useWorkspaces({
    withProblemCounts: true,
  })

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

  if (user.role !== 'MENTOR') {
    return <Navigate to={getRoleSpacesPath(user)} replace />
  }

  return (
    <main className="bg-background text-light-background flex flex-1 px-4 py-10 sm:px-16 lg:px-22">
      <div className="mx-auto flex w-full max-w-[1152px] flex-1 flex-col gap-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <header className="flex flex-col gap-2">
            <h1 className="text-head2 text-white">{TEACHER_SPACES_COPY.title}</h1>
            <p className="text-body2 text-gray-400 max-w-xl">
              {TEACHER_SPACES_COPY.subtitle(user.nickname || user.name)}
            </p>
          </header>

          <CreateSpaceDialog onCreated={refetch} />
        </div>

        {error ? (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-body2 text-red-400" role="alert">
              {error}
            </p>
          </div>
        ) : isLoading ? (
          <div className="flex flex-1 items-center justify-center">
            <Spinner size="md" color="text-neon-green" />
          </div>
        ) : workspaces.length === 0 ? (
          <section className="flex flex-1 items-center justify-center py-4">
            <div className="border-gray-800 bg-gray-900/40 flex w-full max-w-[32rem] flex-col items-center rounded-2xl border px-8 py-12 text-center">
              <div className="border-neon-green/30 bg-neon-green/10 mb-6 flex size-16 items-center justify-center rounded-full border">
                <FolderOpen className="text-neon-green size-7" aria-hidden />
              </div>
              <p className="text-head3 text-white">{TEACHER_SPACES_COPY.emptyTitle}</p>
              <p className="text-body2 mt-2 text-gray-400">
                {TEACHER_SPACES_COPY.emptyDescription}
              </p>
              <p className="text-body3 mt-6 text-gray-500">
                {TEACHER_SPACES_COPY.emptyHint}
              </p>
            </div>
          </section>
        ) : (
          <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {workspaces.map((workspace) => (
              <li key={workspace.id}>
                <TeacherSpaceCard workspace={workspace} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  )
}

export default SpaceListPage
