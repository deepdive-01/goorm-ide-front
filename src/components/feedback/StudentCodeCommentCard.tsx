import { CODE_FEEDBACK_COPY } from '@/content/codeFeedback'
import { extractCodeLine } from '@/lib/codeSnippet'
import type { CodeLineComment } from '@/types/codeFeedback.type'
import type { StudentCodeCommentCardProps } from '@/types/codeFeedback.type'
import CodeFeedbackEditor from './CodeFeedbackEditor'

const SNIPPET_EDITOR_HEIGHT = '52px'

function StudentCodeCommentCard({
  comment,
  code,
  language,
}: StudentCodeCommentCardProps) {
  const lineSnippet = extractCodeLine(code, comment.lineNumber)

  const editorComments: CodeLineComment[] = [
    {
      id: comment.id,
      lineNumber: 1,
      labelLineNumber: comment.lineNumber,
      message: comment.message,
      authorName: comment.authorName,
    },
  ]

  return (
    <article className="flex w-full flex-col gap-2.5 overflow-visible rounded-xl bg-gray-900 px-7 py-6">
      <header className="flex flex-wrap items-center gap-3">
        <span className="text-body1 font-semibold text-light-background">
          {comment.authorName}
        </span>
        <span className="text-body3 font-bold text-neon-blue">
          {CODE_FEEDBACK_COPY.lineLabel(comment.lineNumber)}
        </span>
        {comment.createdAt && (
          <time className="text-body3 ml-auto text-gray-500" dateTime={comment.createdAt}>
            {comment.createdAt}
          </time>
        )}
      </header>

      <p className="text-body3 leading-relaxed text-light-background">{comment.message}</p>

      {lineSnippet ? (
        <CodeFeedbackEditor
          code={lineSnippet}
          language={language}
          comments={editorComments}
          baseLineNumber={comment.lineNumber}
          height={SNIPPET_EDITOR_HEIGHT}
          readOnly
        />
      ) : (
        <p className="text-body3 text-gray-500">코드 줄을 찾을 수 없습니다.</p>
      )}
    </article>
  )
}

export default StudentCodeCommentCard
