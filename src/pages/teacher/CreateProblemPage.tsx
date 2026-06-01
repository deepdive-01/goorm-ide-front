import { useCallback, useId, useState } from 'react'
import type { FormEvent } from 'react'
import { ChevronDown, Plus, Save, Trash2 } from 'lucide-react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import CodeEditor from '@/components/Editor/CodeEditor'
import Button from '@/components/common/Button/Button'
import Card from '@/components/common/Card/Card'
import PageHeader from '@/components/common/PageHeader/PageHeader'
import Spinner from '@/components/common/Spinner/Spinner'
import { LANGUAGE_LABEL } from '@/constants/problem'
import {
  DEFAULT_STARTER_CODE,
  TEACHER_CREATE_PROBLEM_COPY,
} from '@/content/teacherCreateProblem'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { useProblem } from '@/hooks/useProblem'
import { useWorkspace } from '@/hooks/useWorkspace'
import { getRoleSpacesPath } from '@/lib/authRoutes'
import {
  getCreateProblemErrorMessage,
  validateCreateProblemForm,
} from '@/lib/problemForm'
import { toEditorLanguage } from '@/lib/problemLanguage'
import { createProblem, updateProblemWithTestcases } from '@/services/problem'
import type { Difficulty, Language } from '@/types/api.type'
import type { CreateTestcase, ProblemDetail } from '@/types/problem.type'
import type { UserInfo } from '@/types/user.type'
import type { WorkspaceDetail } from '@/types/workspace.type'

const INPUT_CLASS =
  'text-body1 block h-10 w-full rounded-lg border border-gray-800 bg-[#151515] px-3 font-normal text-light-background placeholder:text-gray-400 focus:border-neon-green focus:outline-none'

const TEXTAREA_CLASS = `${INPUT_CLASS} h-20 resize-none py-2.5`

const SAVE_BTN = {
  size: 'md' as const,
  textClassName: 'text-body1 font-medium',
  className: 'h-9 shrink-0 gap-2 px-3 py-0',
  hoverClassName: 'hover:bg-[#8ef48c] active:brightness-95',
}

const LANGUAGE_OPTIONS: Language[] = ['PYTHON', 'JAVA', 'JAVASCRIPT', 'CPP']

type TestcaseFormItem = {
  localId: string
  input: string
  expected_output: string
  is_hidden: boolean
}

function createTestcaseItem(isHidden = false): TestcaseFormItem {
  return {
    localId: crypto.randomUUID(),
    input: '',
    expected_output: '',
    is_hidden: isHidden,
  }
}

type ProblemFormInitialValues = {
  title: string
  language: Language
  difficulty: Difficulty
  description: string
  starterCode: string
  isPublished: boolean
  testcases: TestcaseFormItem[]
}

function getEmptyFormValues(): ProblemFormInitialValues {
  return {
    title: '',
    language: 'PYTHON',
    difficulty: 'EASY',
    description: '',
    starterCode: DEFAULT_STARTER_CODE.PYTHON,
    isPublished: false,
    testcases: [createTestcaseItem(true)],
  }
}

function mapProblemToFormValues(problem: ProblemDetail): ProblemFormInitialValues {
  return {
    title: problem.title,
    language: problem.language,
    difficulty: problem.difficulty,
    description: problem.description,
    starterCode: problem.starter_code || DEFAULT_STARTER_CODE[problem.language],
    isPublished: problem.is_published,
    testcases:
      problem.testcases.length > 0
        ? problem.testcases.map((testcase) => ({
            localId: crypto.randomUUID(),
            input: testcase.input,
            expected_output: testcase.expected_output,
            is_hidden: testcase.is_hidden,
          }))
        : [createTestcaseItem(true)],
  }
}

function CreateProblemPage() {
  const { spaceId: spaceIdParam, problemId: problemIdParam } = useParams()
  const spaceId = Number(spaceIdParam)
  const problemId = problemIdParam ? Number(problemIdParam) : undefined

  if (!Number.isFinite(spaceId) || spaceId <= 0) {
    return <Navigate to="/teacher/spaces" replace />
  }

  if (
    problemIdParam &&
    (!Number.isFinite(problemId) || !problemId || problemId <= 0)
  ) {
    return <Navigate to={`/teacher/spaces/${spaceId}`} replace />
  }

  return <CreateProblemContent spaceId={spaceId} problemId={problemId} />
}

function CreateProblemContent({
  spaceId,
  problemId,
}: {
  spaceId: number
  problemId?: number
}) {
  const isEditMode = problemId != null && problemId > 0
  const { user, isLoading: isUserLoading } = useCurrentUser()
  const { workspace, isLoading: isWorkspaceLoading } = useWorkspace(spaceId)
  const { problem, isLoading: isProblemLoading } = useProblem(spaceId, problemId ?? 0)

  const isPageLoading =
    isUserLoading || isWorkspaceLoading || (isEditMode && isProblemLoading)

  if (isPageLoading) {
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

  if (!workspace) {
    return (
      <main className="bg-background text-light-background flex flex-1 px-4 py-10 sm:px-16 lg:px-22">
        <div className="mx-auto w-full max-w-[1104px]">
          <p className="text-body1 text-center text-gray-400">
            {TEACHER_CREATE_PROBLEM_COPY.invalidSpace}
          </p>
        </div>
      </main>
    )
  }

  if (isEditMode && !problem) {
    return (
      <main className="bg-background text-light-background flex flex-1 px-4 py-10 sm:px-16 lg:px-22">
        <div className="mx-auto w-full max-w-[1104px]">
          <p className="text-body1 text-center text-gray-400">
            {TEACHER_CREATE_PROBLEM_COPY.problemNotFound}
          </p>
        </div>
      </main>
    )
  }

  const initialValues =
    isEditMode && problem ? mapProblemToFormValues(problem) : getEmptyFormValues()

  return (
    <ProblemFormEditor
      key={isEditMode ? `edit-${problemId}` : 'create'}
      spaceId={spaceId}
      problemId={problemId}
      isEditMode={isEditMode}
      workspace={workspace}
      user={user}
      initialValues={initialValues}
    />
  )
}

function ProblemFormEditor({
  spaceId,
  problemId,
  isEditMode,
  workspace,
  user,
  initialValues,
}: {
  spaceId: number
  problemId?: number
  isEditMode: boolean
  workspace: WorkspaceDetail
  user: UserInfo
  initialValues: ProblemFormInitialValues
}) {
  const navigate = useNavigate()
  const formId = useId()
  const titleFieldId = useId()

  const [title, setTitle] = useState(initialValues.title)
  const [language, setLanguage] = useState(initialValues.language)
  const [difficulty] = useState(initialValues.difficulty)
  const [description, setDescription] = useState(initialValues.description)
  const [starterCode, setStarterCode] = useState(initialValues.starterCode)
  const [isPublished] = useState(initialValues.isPublished)
  const [testcases, setTestcases] = useState(initialValues.testcases)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLanguageChange = (next: Language) => {
    setLanguage(next)
    setStarterCode(DEFAULT_STARTER_CODE[next])
  }

  const addTestcase = () => {
    setTestcases((prev) => [...prev, createTestcaseItem()])
  }

  const removeTestcase = (localId: string) => {
    setTestcases((prev) => {
      if (prev.length <= 1) return prev
      return prev.filter((item) => item.localId !== localId)
    })
  }

  const updateTestcase = (
    localId: string,
    patch: Partial<Pick<TestcaseFormItem, 'input' | 'expected_output' | 'is_hidden'>>,
  ) => {
    setTestcases((prev) =>
      prev.map((item) => (item.localId === localId ? { ...item, ...patch } : item)),
    )
  }

  const handleSubmit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault()
      if (isSaving) return

      const payloadTestcases: CreateTestcase[] = testcases.map((item, index) => ({
        input: item.input,
        expected_output: item.expected_output,
        is_hidden: item.is_hidden,
        order_num: index + 1,
      }))

      const validationError = validateCreateProblemForm({
        title,
        language,
        description,
        testcases: payloadTestcases,
      })

      if (validationError) {
        setError(validationError)
        return
      }

      setIsSaving(true)
      setError(null)

      try {
        const payload = {
          title: title.trim(),
          description: description.trim(),
          difficulty,
          language,
          starter_code: starterCode,
          testcases: payloadTestcases,
        }

        if (isEditMode && problemId) {
          await updateProblemWithTestcases(problemId, {
            ...payload,
            is_published: isPublished,
          })
        } else {
          await createProblem(spaceId, user.id, payload)
        }

        navigate(`/teacher/spaces/${spaceId}`)
      } catch (submitError) {
        setError(getCreateProblemErrorMessage(submitError))
      } finally {
        setIsSaving(false)
      }
    },
    [
      description,
      difficulty,
      isEditMode,
      isPublished,
      isSaving,
      language,
      navigate,
      problemId,
      spaceId,
      starterCode,
      testcases,
      title,
      user,
    ],
  )

  const pageTitle = isEditMode
    ? TEACHER_CREATE_PROBLEM_COPY.editPageTitle
    : TEACHER_CREATE_PROBLEM_COPY.pageTitle

  return (
    <div className="bg-background text-light-background flex flex-1 flex-col">
      <div className="border-b border-gray-800 bg-[#0d0d0d] px-4 py-5 sm:px-16 lg:px-22">
        <div className="mx-auto flex w-full max-w-[1104px] flex-wrap items-center justify-between gap-4">
          <div className="flex min-w-0 flex-wrap items-center gap-6 sm:gap-8">
            <PageHeader
              onClick={() => navigate(`/teacher/spaces/${spaceId}`)}
              className="text-white hover:text-light-background"
            >
              {workspace.name}
            </PageHeader>
            <h1 className="text-head3 text-white">{pageTitle}</h1>
          </div>

          <Button
            type="submit"
            form={formId}
            isLoading={isSaving}
            disabled={isSaving}
            ariaLabel={TEACHER_CREATE_PROBLEM_COPY.save}
            {...SAVE_BTN}
          >
            <Save className="size-4 shrink-0" aria-hidden />
            {isSaving ? TEACHER_CREATE_PROBLEM_COPY.saving : TEACHER_CREATE_PROBLEM_COPY.save}
          </Button>
        </div>
      </div>

      <main className="flex flex-1 px-4 py-8 sm:px-16 lg:px-22">
        <form
          id={formId}
          onSubmit={handleSubmit}
          className="mx-auto grid w-full max-w-[1104px] flex-1 grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-5"
        >
          <div className="flex flex-col gap-5">
            <Card width="w-full" className="bg-[#0d0d0d] px-5 py-6 sm:px-7">
              <section className="flex flex-col gap-5">
                <header className="flex flex-col gap-1.5">
                  <h2 className="text-head3 text-white">
                    {TEACHER_CREATE_PROBLEM_COPY.basicInfoTitle}
                  </h2>
                  <p className="text-body2 text-gray-400">
                    {TEACHER_CREATE_PROBLEM_COPY.basicInfoDescription}
                  </p>
                </header>

                <div className="text-body1 text-white">
                  <label htmlFor={titleFieldId}>
                    {TEACHER_CREATE_PROBLEM_COPY.titleLabel}
                  </label>
                  <input
                    id={titleFieldId}
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={TEACHER_CREATE_PROBLEM_COPY.titlePlaceholder}
                    className={`${INPUT_CLASS} mt-2.5`}
                  />
                </div>

                <div>
                  <span className="text-body1 text-white">
                    {TEACHER_CREATE_PROBLEM_COPY.languageLabel}
                  </span>
                  <div className="relative mt-2.5 w-fit min-w-[8rem]">
                    <select
                      value={language}
                      onChange={(e) => handleLanguageChange(e.target.value as Language)}
                      className={`${INPUT_CLASS} appearance-none pr-10`}
                      aria-label={TEACHER_CREATE_PROBLEM_COPY.languageLabel}
                    >
                      {LANGUAGE_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {LANGUAGE_LABEL[option]}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      className="pointer-events-none absolute top-1/2 right-3 size-5 -translate-y-1/2 text-gray-400"
                      aria-hidden
                    />
                  </div>
                </div>

                <label className="text-body1 block text-white">
                  {TEACHER_CREATE_PROBLEM_COPY.descriptionLabel}
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={TEACHER_CREATE_PROBLEM_COPY.descriptionPlaceholder}
                    className={`${TEXTAREA_CLASS} mt-2.5`}
                  />
                </label>
              </section>
            </Card>

            <Card width="w-full" className="bg-[#0d0d0d] px-5 py-6 sm:px-7">
              <section className="flex flex-col gap-5">
                <header className="flex flex-col gap-1.5">
                  <h2 className="text-head3 text-white">
                    {TEACHER_CREATE_PROBLEM_COPY.starterCodeTitle}
                  </h2>
                  <p className="text-body2 text-gray-400">
                    {TEACHER_CREATE_PROBLEM_COPY.starterCodeDescription}
                  </p>
                </header>

                <div className="overflow-hidden rounded-lg border border-gray-800 bg-gray-900">
                  <CodeEditor
                    code={starterCode}
                    language={toEditorLanguage(language)}
                    height="180px"
                    onChange={setStarterCode}
                  />
                </div>
              </section>
            </Card>
          </div>

          <div className="flex flex-col gap-5">
            <Card width="w-full" className="bg-[#0d0d0d] px-5 py-6 sm:px-7">
              <section className="flex flex-col gap-5">
                <div className="flex items-start justify-between gap-3">
                  <header className="flex flex-col gap-1.5">
                    <h2 className="text-head3 text-white">
                      {TEACHER_CREATE_PROBLEM_COPY.testcasesTitle}
                    </h2>
                    <p className="text-body2 text-gray-400">
                      {TEACHER_CREATE_PROBLEM_COPY.testcasesDescription}
                    </p>
                  </header>
                  <button
                    type="button"
                    onClick={addTestcase}
                    className="text-body3 inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border border-gray-800 bg-background px-3 py-2 font-bold text-light-background transition-colors hover:border-gray-600"
                  >
                    <Plus className="size-3 shrink-0" aria-hidden />
                    {TEACHER_CREATE_PROBLEM_COPY.addTestcase}
                  </button>
                </div>

                <ul className="flex flex-col gap-4">
                  {testcases.map((testcase, index) => (
                    <li
                      key={testcase.localId}
                      className="rounded-xl bg-[#151515] px-5 py-6 sm:px-7"
                    >
                      <div className="mb-5 flex items-center justify-between gap-3">
                        <h3 className="text-body1 text-white">
                          {TEACHER_CREATE_PROBLEM_COPY.testcaseLabel(index + 1)}
                        </h3>
                        <div className="flex shrink-0 items-center gap-3">
                          <button
                            type="button"
                            onClick={() =>
                              updateTestcase(testcase.localId, {
                                is_hidden: !testcase.is_hidden,
                              })
                            }
                            className={`text-body3 cursor-pointer font-bold transition-colors ${
                              testcase.is_hidden
                                ? 'text-neon-green'
                                : 'text-gray-400 hover:text-neon-green'
                            }`}
                          >
                            {testcase.is_hidden
                              ? TEACHER_CREATE_PROBLEM_COPY.hidden
                              : TEACHER_CREATE_PROBLEM_COPY.visible}
                          </button>
                          {testcases.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeTestcase(testcase.localId)}
                              aria-label={TEACHER_CREATE_PROBLEM_COPY.deleteTestcase(index + 1)}
                              className="cursor-pointer rounded p-1 text-gray-400 transition-colors hover:text-red-400"
                            >
                              <Trash2 className="size-4 shrink-0" aria-hidden />
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <label className="text-body3 block font-bold text-white">
                          {TEACHER_CREATE_PROBLEM_COPY.inputLabel}
                          <input
                            type="text"
                            value={testcase.input}
                            onChange={(e) =>
                              updateTestcase(testcase.localId, { input: e.target.value })
                            }
                            placeholder={TEACHER_CREATE_PROBLEM_COPY.inputPlaceholder}
                            className={`${INPUT_CLASS} mt-2.5 font-normal`}
                          />
                        </label>
                        <label className="text-body3 block font-bold text-white">
                          {TEACHER_CREATE_PROBLEM_COPY.expectedOutputLabel}
                          <input
                            type="text"
                            value={testcase.expected_output}
                            onChange={(e) =>
                              updateTestcase(testcase.localId, {
                                expected_output: e.target.value,
                              })
                            }
                            placeholder={
                              TEACHER_CREATE_PROBLEM_COPY.expectedOutputPlaceholder
                            }
                            className={`${INPUT_CLASS} mt-2.5 font-normal`}
                          />
                        </label>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            </Card>

            <Card width="w-full" className="bg-[#0d0d0d] px-5 py-6 sm:px-7">
              <section className="flex flex-col gap-3">
                <h2 className="text-body1 text-white">{TEACHER_CREATE_PROBLEM_COPY.tipsTitle}</h2>
                <ul className="text-body2 flex flex-col gap-2 text-gray-400">
                  {TEACHER_CREATE_PROBLEM_COPY.tips.map((tip) => (
                    <li key={tip}>{tip}</li>
                  ))}
                </ul>
              </section>
            </Card>
          </div>

          {error && (
            <p className="text-body3 text-red-400 lg:col-span-2" role="alert">
              {error}
            </p>
          )}
        </form>
      </main>
    </div>
  )
}

export default CreateProblemPage
