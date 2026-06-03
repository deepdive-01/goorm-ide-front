import { useState, type ReactNode } from 'react'
import { BadgeCheck, Clock3, FileText, Plus, Send, Users } from 'lucide-react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import Badge from '@/components/common/Badge/Badge'
import Button from '@/components/common/Button/Button'
import Card from '@/components/common/Card/Card'
import PageHeader from '@/components/common/PageHeader/PageHeader'
import Spinner from '@/components/common/Spinner/Spinner'
import { TEACHER_SPACE_DETAIL_COPY } from '@/content/teacherSpaceDetail'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { useProblems } from '@/hooks/useProblems'
import { useSpaceSubmissions } from '@/hooks/useSpaceSubmissions'
import { useWorkspace } from '@/hooks/useWorkspace'
import { getRoleSpacesPath } from '@/lib/authRoutes'
import { formatApiDateTime } from '@/lib/formatDateTime'
import type { StudentProblemListItem } from '@/types/studentProblem.type'
import type { TeacherSpaceSubmissionListItem } from '@/types/teacherSpaceSubmission.type'

type SpaceDetailTab = 'problems' | 'submissions'

const HEADER_ACTION_BTN = {
  size: 'md' as const,
  textClassName: 'text-body1 font-medium',
  className: 'h-9 gap-2 px-3 py-0',
  hoverClassName: 'hover:bg-[#8ef48c] active:brightness-95',
}

type SummaryCardProps = {
  label: string
  value: number
  icon: ReactNode
}

type ProblemManagementRowProps = {
  index: number
  problem: StudentProblemListItem
  spaceId: number
}

function formatSubmittedAt(iso: string) {
  return formatApiDateTime(iso)
}

function getNicknameInitial(nickname: string) {
  return nickname.trim().charAt(0) || '?'
}

function SummaryCard({ label, value, icon }: SummaryCardProps) {
  return (
    <Card width="w-full" className="bg-[#0d0d0d] px-7 py-6">
      <div className="flex min-h-[10rem] flex-col justify-between gap-6">
        <div className="flex items-start gap-3">
          <p className="text-body1 flex-1 text-light-background">{label}</p>
          <div className="text-gray-500 shrink-0">{icon}</div>
        </div>

        <p className="text-head2 text-white">{value}</p>
      </div>
    </Card>
  )
}

function ProblemActionChip({
  label,
  accent = false,
  greenOnHover = false,
  variant,
  muted = false,
  onClick,
}: {
  label: string
  accent?: boolean
  greenOnHover?: boolean
  variant?: 'pending' | 'completed'
  muted?: boolean
  onClick?: () => void
}) {
  const isInteractive = Boolean(onClick) || greenOnHover

  const className = (() => {
    if (greenOnHover) {
      return 'cursor-pointer border-gray-800 text-light-background transition-colors hover:border-neon-green hover:text-neon-green'
    }
    if (variant === 'pending') {
      return 'border-neon-blue text-neon-blue'
    }
    if (variant === 'completed' || muted) {
      return 'border-gray-800 text-gray-400'
    }
    if (accent) {
      return 'border-neon-green text-neon-green'
    }
    return 'border-gray-800 text-light-background'
  })()

  return (
    <button
      type="button"
      onClick={onClick}
      aria-disabled={isInteractive ? undefined : true}
      className={`text-body3 inline-flex items-center justify-center rounded-lg border px-3 py-2 font-bold ${isInteractive ? 'cursor-pointer' : 'cursor-default'} ${className}`}
    >
      {label}
    </button>
  )
}

function ProblemManagementRow({ index, problem, spaceId }: ProblemManagementRowProps) {
  const navigate = useNavigate()
  const testcaseCount = problem.testcase_count ?? 0

  return (
    <Card width="w-full" className="bg-[#0d0d0d] px-5 py-6 sm:px-7">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
        <div className="flex min-w-0 flex-1 items-center gap-4 sm:gap-7">
          <Badge
            size="sm"
            shape="circle"
            bgColor="bg-[#1b1b1b]"
            textColor="text-light-background"
            ariaLabel={`문항 ${index + 1}`}
          >
            {index + 1}
          </Badge>

          <div className="min-w-0">
            <h2 className="text-head3 text-white line-clamp-1">{problem.title}</h2>
            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="text-body3 font-bold text-light-background uppercase">
                {problem.language}
              </span>
              {testcaseCount > 0 && (
                <span className="text-body3 text-[#b7b7b7]">
                  {TEACHER_SPACE_DETAIL_COPY.testcaseCount(testcaseCount)}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3">
          <ProblemActionChip
            label={TEACHER_SPACE_DETAIL_COPY.editProblem}
            greenOnHover
            onClick={() =>
              navigate(`/teacher/spaces/${spaceId}/problems/${problem.id}/edit`)
            }
          />
        </div>
      </div>
    </Card>
  )
}

function SubmissionStatusRow({
  spaceId,
  submission,
}: {
  spaceId: number
  submission: TeacherSpaceSubmissionListItem
}) {
  const navigate = useNavigate()
  const isPending = submission.feedbackStatus === 'PENDING'
  const initial = getNicknameInitial(submission.studentNickname)

  const reviewPath = `/teacher/spaces/${spaceId}/submissions/${submission.id}`

  return (
    <Card
      width="w-full"
      cursor="pointer"
      onClick={() => navigate(reviewPath)}
      className={`px-5 py-6 transition-colors sm:px-7 hover:border-neon-green ${
        isPending
          ? 'border-neon-green bg-neon-green/20'
          : 'bg-[#0d0d0d] border-gray-800'
      }`}
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
        <div className="flex min-w-0 flex-1 items-center gap-4 sm:gap-7">
          <Badge
            size="sm"
            shape="circle"
            bgColor="bg-neon-green"
            textColor="text-black"
            ariaLabel={submission.studentNickname}
          >
            {initial}
          </Badge>

          <div className="min-w-0">
            <h2
              className={`text-head3 line-clamp-1 ${isPending ? 'text-white' : 'text-gray-400'}`}
            >
              {submission.studentNickname}
            </h2>
            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span
                className={`text-body3 font-bold ${isPending ? 'text-white' : 'text-gray-400'}`}
              >
                {submission.problemTitle}
              </span>
              {submission.submittedAt && (
                <span className="text-body3 text-[#b7b7b7]">
                  {formatSubmittedAt(submission.submittedAt)}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3">
          <ProblemActionChip
            label={
              isPending
                ? TEACHER_SPACE_DETAIL_COPY.feedbackPending
                : TEACHER_SPACE_DETAIL_COPY.feedbackCompleted
            }
            accent={isPending}
            variant={isPending ? 'pending' : 'completed'}
          />
          <ProblemActionChip
            label={TEACHER_SPACE_DETAIL_COPY.commentCount(submission.commentCount)}
            muted={!isPending}
          />
        </div>
      </div>
    </Card>
  )
}

type SpaceDetailTabsProps = {
  activeTab: SpaceDetailTab
  pendingCount: number
  onTabChange: (tab: SpaceDetailTab) => void
}

function SpaceDetailTabs({ activeTab, pendingCount, onTabChange }: SpaceDetailTabsProps) {
  const activeTabClassName = 'rounded-lg bg-black font-medium text-light-background'

  const problemTabClassName =
    activeTab === 'problems' ? activeTabClassName : 'text-light-background'

  const submissionTabClassName =
    activeTab === 'submissions' ? activeTabClassName : 'text-light-background'

  return (
    <div className="flex items-center gap-2">
      <div
        className="flex h-9 items-center rounded-lg bg-[#1b1b1b] p-0.5"
        role="tablist"
        aria-label="스페이스 상세 탭"
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'problems'}
          className={`text-body2 px-4 py-1.5 transition ${problemTabClassName}`}
          onClick={() => onTabChange('problems')}
        >
          {TEACHER_SPACE_DETAIL_COPY.problemManagement}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'submissions'}
          className={`text-body2 px-4 py-1.5 transition ${submissionTabClassName}`}
          onClick={() => onTabChange('submissions')}
        >
          {TEACHER_SPACE_DETAIL_COPY.submissionStatus}
        </button>
      </div>
      {pendingCount > 0 && (
        <span className="text-body2 font-semibold text-neon-green" aria-label={`대기 중 ${pendingCount}건`}>
          {pendingCount}
        </span>
      )}
    </div>
  )
}

function SpaceDetailPage() {
  const { spaceId: spaceIdParam } = useParams()
  const spaceId = Number(spaceIdParam)

  if (!Number.isFinite(spaceId) || spaceId <= 0) {
    return <Navigate to="/teacher/spaces" replace />
  }

  return <SpaceDetailContent spaceId={spaceId} />
}

function SpaceDetailContent({ spaceId }: { spaceId: number }) {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<SpaceDetailTab>('problems')
  const { user, isLoading: isUserLoading } = useCurrentUser()
  const { workspace, isLoading: isWorkspaceLoading, error: workspaceError } =
    useWorkspace(spaceId)
  const { problems, isLoading: isProblemsLoading } = useProblems(spaceId)
  const {
    submissions: spaceSubmissions,
    isLoading: isSubmissionsLoading,
    error: submissionsError,
  } = useSpaceSubmissions(spaceId, problems, isProblemsLoading)

  const teacherProblems = problems as StudentProblemListItem[]
  const pendingCount = spaceSubmissions.filter(
    (submission) => submission.feedbackStatus === 'PENDING',
  ).length
  const feedbackCompleteCount = spaceSubmissions.filter(
    (submission) => submission.feedbackStatus === 'COMPLETED',
  ).length
  const isProblemsTabLoading = isWorkspaceLoading || isProblemsLoading
  const isSubmissionsTabLoading = isWorkspaceLoading || isProblemsLoading || isSubmissionsLoading

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

  if (!isWorkspaceLoading && !workspace) {
    return (
      <main className="bg-background text-light-background flex flex-1 px-4 py-10 sm:px-16 lg:px-22">
        <div className="mx-auto w-full max-w-[1104px]">
          <p className="text-body1 text-center text-gray-400" role="alert">
            {workspaceError ?? TEACHER_SPACE_DETAIL_COPY.invalidSpace}
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="bg-background text-light-background flex flex-1 px-4 py-10 sm:px-16 lg:px-22">
      <div className="mx-auto flex w-full max-w-[1104px] flex-1 flex-col gap-8">
        <PageHeader
          onClick={() => navigate('/teacher/spaces')}
          className="text-gray-400 hover:text-light-background"
        >
          {TEACHER_SPACE_DETAIL_COPY.backToSpaces}
        </PageHeader>

        {workspace && (
          <section className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <header className="max-w-3xl">
              <h1 className="text-head1 text-white">{workspace.name}</h1>
              <p className="text-body2 mt-3 leading-relaxed text-gray-400">
                {workspace.description}
              </p>
            </header>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                onClick={() => navigate(`/teacher/spaces/${spaceId}/invite`)}
                {...HEADER_ACTION_BTN}
              >
                <Send className="size-5 shrink-0" aria-hidden />
                {TEACHER_SPACE_DETAIL_COPY.inviteStudents}
              </Button>
              <Button
                onClick={() => navigate(`/teacher/spaces/${spaceId}/problems-create`)}
                {...HEADER_ACTION_BTN}
              >
                <Plus className="size-5 shrink-0" aria-hidden />
                {TEACHER_SPACE_DETAIL_COPY.createProblem}
              </Button>
            </div>
          </section>
        )}

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            label={TEACHER_SPACE_DETAIL_COPY.totalProblems}
            value={teacherProblems.length}
            icon={<FileText className="size-4" aria-hidden />}
          />
          <SummaryCard
            label={TEACHER_SPACE_DETAIL_COPY.learners}
            value={workspace?.member_count ?? 0}
            icon={<Users className="size-4" aria-hidden />}
          />
          <SummaryCard
            label={TEACHER_SPACE_DETAIL_COPY.pending}
            value={pendingCount}
            icon={<Clock3 className="size-4" aria-hidden />}
          />
          <SummaryCard
            label={TEACHER_SPACE_DETAIL_COPY.feedbackComplete}
            value={feedbackCompleteCount}
            icon={<BadgeCheck className="size-4" aria-hidden />}
          />
        </section>

        <section className="flex flex-col gap-4">
          <SpaceDetailTabs
            activeTab={activeTab}
            pendingCount={pendingCount}
            onTabChange={setActiveTab}
          />

          {activeTab === 'problems' ? (
            <div id="problem-list" className="flex flex-col gap-4">
              {isProblemsTabLoading ? (
                <div className="flex min-h-[240px] items-center justify-center">
                  <Spinner size="md" color="text-neon-green" />
                </div>
              ) : teacherProblems.length === 0 ? (
                <div className="flex min-h-[240px] flex-col items-center justify-center rounded-xl border border-dashed border-gray-800 px-4 text-center">
                  <p className="text-head3 text-white">{TEACHER_SPACE_DETAIL_COPY.emptyTitle}</p>
                  <p className="text-body2 mt-2 text-gray-500">
                    {TEACHER_SPACE_DETAIL_COPY.emptyDescription}
                  </p>
                </div>
              ) : (
                teacherProblems.map((problem, index) => (
                  <ProblemManagementRow
                    key={problem.id}
                    index={index}
                    problem={problem}
                    spaceId={spaceId}
                  />
                ))
              )}
            </div>
          ) : (
            <div id="submission-list" className="flex flex-col gap-4">
              {isSubmissionsTabLoading ? (
                <div className="flex min-h-[240px] items-center justify-center">
                  <Spinner size="md" color="text-neon-green" />
                </div>
              ) : submissionsError ? (
                <div className="flex min-h-[240px] flex-col items-center justify-center rounded-xl border border-dashed border-gray-800 px-4 text-center">
                  <p className="text-body2 text-red-400" role="alert">
                    {submissionsError}
                  </p>
                </div>
              ) : spaceSubmissions.length === 0 ? (
                <div className="flex min-h-[240px] flex-col items-center justify-center rounded-xl border border-dashed border-gray-800 px-4 text-center">
                  <p className="text-head3 text-white">
                    {TEACHER_SPACE_DETAIL_COPY.emptySubmissionsTitle}
                  </p>
                  <p className="text-body2 mt-2 text-gray-500">
                    {TEACHER_SPACE_DETAIL_COPY.emptySubmissionsDescription}
                  </p>
                </div>
              ) : (
                spaceSubmissions.map((submission) => (
                  <SubmissionStatusRow
                    key={submission.id}
                    spaceId={spaceId}
                    submission={submission}
                  />
                ))
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}

export default SpaceDetailPage
