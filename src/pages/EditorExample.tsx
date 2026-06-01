// TODO: 이 페이지는 Editor 컴포넌트 동작 확인용 임시 예시 페이지입니다.
// 실제 서비스에서는 학생 문제 풀이 화면(StudentProblemPage 등)에서 Editor를 사용해야 합니다.
// problemId와 roomId는 URL 파라미터로 받으며, 실제 라우팅 구조가 확정되면 이 파일은 제거됩니다.
// 진입 URL 예시: /editorExample/3/1  (problemId=3, roomId=1)
import { Navigate, useParams } from 'react-router-dom'
import Spinner from '@/components/common/Spinner/Spinner'
import Editor from '../components/Editor/Editor'
import { useEditorPage } from '../hooks/useEditorPage'

function EditorExample() {
  // URL 파라미터에서 problemId, roomId를 읽습니다. (임시 라우트: /editorExample/:problemId/:roomId)
  const { problemId: problemIdParam, roomId: roomIdParam } = useParams()
  const problemId = Number(problemIdParam)
  const roomId = Number(roomIdParam)

  if (
    !Number.isFinite(problemId) ||
    problemId <= 0 ||
    !Number.isFinite(roomId) ||
    roomId <= 0
  ) {
    return <Navigate to="/" replace />
  }

  return <EditorExampleContent problemId={problemId} roomId={roomId} />
}

function EditorExampleContent({
  problemId,
  roomId,
}: {
  problemId: number
  roomId: number
}) {
  const {
    user,
    isUserLoading,
    language,
    value,
    isReady,
    isSaving,
    isSubmitting,
    gradeResult,
    executionResult,
    isRunning,
    setLanguage,
    onChange,
    handleRun,
    handleSave,
    handleSubmit,
  } = useEditorPage({ problemId, roomId })

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
    <div className="bg-background h-full w-full">
      {/* 아래 w-150, p-10은 이 예시 페이지의 임시 레이아웃입니다. */}
      <div className="w-150 p-10">
        <Editor
          language={language}
          value={value}
          onChange={onChange}
          onLanguageChange={setLanguage}
          onRun={handleRun}
          onSave={handleSave}
          onSubmit={handleSubmit}
          isRunning={isRunning}
          isSaving={isSaving}
          isSubmitting={isSubmitting}
          disabled={!isReady}
          executionResult={executionResult}
          gradeResult={gradeResult}
          height="30vh" // TODO: 실제 화면 레이아웃에 맞게 조정 필요
          className="w-full"
        />
      </div>
    </div>
  )
}

export default EditorExample
