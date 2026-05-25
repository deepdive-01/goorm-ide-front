import { FileCode2 } from 'lucide-react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import PageHeader from '@/components/common/PageHeader/PageHeader'
import Spinner from '@/components/common/Spinner/Spinner'
import ProblemListRow from '@/components/student/ProblemListRow'
import { STUDENT_PROBLEMS_COPY } from '@/content/studentProblems'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { useProblems } from '@/hooks/useProblems'
import { useWorkspace } from '@/hooks/useWorkspace'

function ProblemListPage() {
  const { spaceId: spaceIdParam } = useParams()
  const spaceId = Number(spaceIdParam)

  if (!Number.isFinite(spaceId) || spaceId <= 0) {
    return <Navigate to="/student/spaces" replace />
  }

  return <ProblemListContent spaceId={spaceId} />
}

function ProblemListContent({ spaceId }: { spaceId: number }) {
  const navigate = useNavigate()

  const { user, isLoading: isUserLoading } = useCurrentUser()
  const { workspace, isLoading: isWorkspaceLoading } = useWorkspace(spaceId)
  const { problems, isLoading: isProblemsLoading } = useProblems(spaceId)

  const isLoading = isUserLoading || isWorkspaceLoading || isProblemsLoading

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

  if (!isLoading && !workspace) {
    return (
      <main className="bg-background text-light-background flex flex-1 px-4 py-10 sm:px-16 lg:px-22">
        <div className="mx-auto w-full max-w-[1152px]">
          <p className="text-body1 text-gray-400 text-center">
            {STUDENT_PROBLEMS_COPY.invalidSpace}
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="bg-background text-light-background flex flex-1 px-4 py-10 sm:px-16 lg:px-22">
      <div className="mx-auto flex w-full max-w-[1152px] flex-1 flex-col gap-10">
        <PageHeader onClick={() => navigate('/student/spaces')}>
          {STUDENT_PROBLEMS_COPY.backToSpaces}
        </PageHeader>

        {workspace && (
          <header className="flex flex-col gap-3">
            <h1 className="text-head1 text-white">{workspace.name}</h1>
            <p className="text-body1 text-neon-green font-medium">
              {STUDENT_PROBLEMS_COPY.mentorLabel(workspace.mentor.nickname)}
            </p>
            <p className="text-body2 text-gray-400 max-w-3xl leading-relaxed">
              {workspace.description}
            </p>
          </header>
        )}

        <section className="flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <FileCode2 className="text-neon-green size-5 shrink-0" aria-hidden />
            <h2 className="text-head3 text-white">{STUDENT_PROBLEMS_COPY.sectionTitle}</h2>
          </div>

          {isLoading ? (
            <div className="flex min-h-[240px] items-center justify-center">
              <Spinner size="md" color="text-neon-green" />
            </div>
          ) : problems.length === 0 ? (
            <div className="border-gray-800 flex min-h-[240px] flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-4 text-center">
              <p className="text-head3 text-white">{STUDENT_PROBLEMS_COPY.emptyTitle}</p>
              <p className="text-body2 text-gray-500">
                {STUDENT_PROBLEMS_COPY.emptyDescription}
              </p>
            </div>
          ) : (
            <ul className="flex flex-col gap-4">
              {problems.map((problem, index) => (
                <li key={problem.id}>
                  <ProblemListRow
                    problem={problem}
                    index={index}
                    onClick={() =>
                      navigate(`/student/spaces/${spaceId}/problems/${problem.id}`)
                    }
                  />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  )
}

export default ProblemListPage
