import { useMemo, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import Spinner from '@/components/common/Spinner/Spinner'
import Card from '@/components/common/Card/Card'
import Editor from '@/components/Editor/Editor'
import ProblemCodeCommentsTab from '@/components/student/problemWorkspace/ProblemCodeCommentsTab'
import ProblemDescriptionTab from '@/components/student/problemWorkspace/ProblemDescriptionTab'
import ProblemFeedbackTab from '@/components/student/problemWorkspace/ProblemFeedbackTab'
import ProblemWorkspaceSubHeader from '@/components/student/problemWorkspace/ProblemWorkspaceSubHeader'
import ProblemWorkspaceTabs from '@/components/student/problemWorkspace/ProblemWorkspaceTabs'
import {
  DEFAULT_STUDENT_WORKSPACE_CODE,
  MOCK_PROBLEM_WORKSPACE_CODE_COMMENTS,
  MOCK_PROBLEM_WORKSPACE_FEEDBACK,
  STUDENT_PROBLEM_WORKSPACE_COPY,
} from '@/content/studentProblemWorkspace'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { useEditorPage } from '@/hooks/useEditorPage'
import { useProblem } from '@/hooks/useProblem'
import { useWorkspace } from '@/hooks/useWorkspace'
import { toEditorLanguage } from '@/lib/problemLanguage'
import type { ProblemDetail } from '@/types/problem.type'
import type { ProblemWorkspaceTab } from '@/types/studentProblemWorkspace.type'
import type { WorkspaceDetail } from '@/types/workspace.type'

function ProblemWorkspacePage() {
  const { spaceId: spaceIdParam, problemId: problemIdParam } = useParams()
  const spaceId = Number(spaceIdParam)
  const problemId = Number(problemIdParam)

  if (
    !Number.isFinite(spaceId) ||
    spaceId <= 0 ||
    !Number.isFinite(problemId) ||
    problemId <= 0
  ) {
    return <Navigate to="/student/spaces" replace />
  }

  return <ProblemWorkspaceContent spaceId={spaceId} problemId={problemId} />
}

function ProblemWorkspaceContent({
  spaceId,
  problemId,
}: {
  spaceId: number
  problemId: number
}) {
  const { user, isLoading: isUserLoading } = useCurrentUser()
  const { workspace, isLoading: isWorkspaceLoading } = useWorkspace(spaceId)
  const { problem, isLoading: isProblemLoading } = useProblem(spaceId, problemId)

  const isLoading = isUserLoading || isWorkspaceLoading || isProblemLoading

  const tabs = useMemo(
    () => [
      {
        id: 'description' as const,
        label: STUDENT_PROBLEM_WORKSPACE_COPY.tabs.description,
      },
      {
        id: 'feedback' as const,
        label: STUDENT_PROBLEM_WORKSPACE_COPY.tabs.feedback,
        count: MOCK_PROBLEM_WORKSPACE_FEEDBACK.length,
      },
      {
        id: 'codeComments' as const,
        label: STUDENT_PROBLEM_WORKSPACE_COPY.tabs.codeComments,
        count: MOCK_PROBLEM_WORKSPACE_CODE_COMMENTS.length,
      },
    ],
    [],
  )

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

  if (!isLoading && (!workspace || !problem)) {
    return (
      <main className="bg-background text-light-background flex flex-1 items-center justify-center px-4">
        <p className="text-body1 text-gray-400">
          {STUDENT_PROBLEM_WORKSPACE_COPY.invalidParams}
        </p>
      </main>
    )
  }

  if (isLoading || !workspace || !problem) {
    return (
      <main className="bg-background flex flex-1 items-center justify-center">
        <Spinner size="md" color="text-neon-green" />
      </main>
    )
  }

  return (
    <ProblemWorkspaceLoaded
      key={problemId}
      spaceId={spaceId}
      problem={problem}
      workspace={workspace}
      tabs={tabs}
    />
  )
}

function ProblemWorkspaceLoaded({
  spaceId,
  problem,
  workspace,
  tabs,
}: {
  spaceId: number
  problem: ProblemDetail
  workspace: WorkspaceDetail
  tabs: {
    id: ProblemWorkspaceTab
    label: string
    count?: number
  }[]
}) {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<ProblemWorkspaceTab>('description')

  const snippetCode = problem.starter_code || DEFAULT_STUDENT_WORKSPACE_CODE
  const problemsPath = `/student/spaces/${spaceId}/problems`

  return (
    <div className="bg-background text-light-background flex flex-1 flex-col">
      <ProblemWorkspaceSubHeader
        problemTitle={problem.title}
        spaceName={workspace.name}
        language={problem.language}
        backLabel={STUDENT_PROBLEM_WORKSPACE_COPY.backToProblems}
        onBack={() => navigate(problemsPath)}
      />

      <main className="mx-auto flex w-full max-w-[1512px] flex-1 flex-col gap-6 px-4 py-6 sm:px-16 lg:px-22 lg:py-8">
        <div className="grid flex-1 gap-6 lg:grid-cols-12">
          <section className="flex flex-col gap-4 lg:col-span-5">
            <ProblemWorkspaceTabs
              tabs={tabs}
              activeTab={activeTab}
              onChange={setActiveTab}
            />
            <Card
              width="w-full"
              className="scrollbar-theme bg-[#0d0d0d] border-gray-800 h-[min(600px,60vh)] overflow-y-auto px-6 py-8 sm:px-10"
            >
              {activeTab === 'description' && (
                <ProblemDescriptionTab problem={problem} />
              )}
              {activeTab === 'feedback' && (
                <ProblemFeedbackTab items={MOCK_PROBLEM_WORKSPACE_FEEDBACK} />
              )}
              {activeTab === 'codeComments' && (
                <ProblemCodeCommentsTab
                  items={MOCK_PROBLEM_WORKSPACE_CODE_COMMENTS}
                  code={snippetCode}
                  language={toEditorLanguage(problem.language)}
                />
              )}
            </Card>
          </section>

          <section className="flex flex-col gap-4 lg:col-span-7">
            <ProblemWorkspaceEditor problemId={problem.id} roomId={spaceId} />
          </section>
        </div>
      </main>
    </div>
  )
}

function ProblemWorkspaceEditor({
  problemId,
  roomId,
}: {
  problemId: number
  roomId: number
}) {
  const {
    language,
    value,
    isReady,
    isSaving,
    isSubmitting,
    isCancelling,
    canCancelSubmit,
    gradeResult,
    executionResult,
    isRunning,
    setLanguage,
    onChange,
    handleRun,
    handleSave,
    handleSubmit,
    handleCancelSubmit,
  } = useEditorPage({ problemId, roomId })

  return (
    <Editor
      language={language}
      value={value}
      onChange={onChange}
      onLanguageChange={setLanguage}
      onRun={handleRun}
      onSave={handleSave}
      onSubmit={handleSubmit}
      onCancelSubmit={() => void handleCancelSubmit()}
      canCancelSubmit={canCancelSubmit}
      cancelSubmitLabel={STUDENT_PROBLEM_WORKSPACE_COPY.editor.cancelSubmit}
      isRunning={isRunning}
      isSaving={isSaving}
      isSubmitting={isSubmitting}
      isCancelling={isCancelling}
      disabled={!isReady}
      executionResult={executionResult}
      gradeResult={gradeResult}
      height="45vh"
      className="w-full"
    />
  )
}

export default ProblemWorkspacePage
