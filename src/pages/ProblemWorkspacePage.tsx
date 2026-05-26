import { useEffect, useMemo, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import Spinner from '@/components/common/Spinner/Spinner'
import Card from '@/components/common/Card/Card'
import CodeEditorPanel from '@/components/student/problemWorkspace/CodeEditorPanel'
import ProblemCodeCommentsTab from '@/components/student/problemWorkspace/ProblemCodeCommentsTab'
import ProblemDescriptionTab from '@/components/student/problemWorkspace/ProblemDescriptionTab'
import ProblemFeedbackTab from '@/components/student/problemWorkspace/ProblemFeedbackTab'
import ProblemWorkspaceSubHeader from '@/components/student/problemWorkspace/ProblemWorkspaceSubHeader'
import ProblemWorkspaceTabs from '@/components/student/problemWorkspace/ProblemWorkspaceTabs'
import SubmittedCodeReview from '@/components/student/problemWorkspace/SubmittedCodeReview'
import {
  MOCK_PROBLEM_WORKSPACE_CODE_COMMENTS,
  MOCK_PROBLEM_WORKSPACE_FEEDBACK,
  MOCK_SUBMITTED_CODE_REVIEW,
  STUDENT_PROBLEM_WORKSPACE_COPY,
} from '@/content/studentProblemWorkspace'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { useProblem } from '@/hooks/useProblem'
import { useWorkspace } from '@/hooks/useWorkspace'
import type { ProblemWorkspaceTab } from '@/types/studentProblemWorkspace.type'

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
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<ProblemWorkspaceTab>('description')
  const [code, setCode] = useState('')

  const { user, isLoading: isUserLoading } = useCurrentUser()
  const { workspace, isLoading: isWorkspaceLoading } = useWorkspace(spaceId)
  const { problem, isLoading: isProblemLoading } = useProblem(spaceId, problemId)

  const isLoading = isUserLoading || isWorkspaceLoading || isProblemLoading

  useEffect(() => {
    if (problem?.starter_code) {
      setCode(problem.starter_code)
    }
  }, [problem?.starter_code])

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
                />
              )}
            </Card>
          </section>

          <section className="flex flex-col gap-4 lg:col-span-7">
            <CodeEditorPanel
              language={problem.language}
              code={code}
              onChange={setCode}
            />
            <SubmittedCodeReview comments={MOCK_SUBMITTED_CODE_REVIEW} />
          </section>
        </div>
      </main>
    </div>
  )
}

export default ProblemWorkspacePage
