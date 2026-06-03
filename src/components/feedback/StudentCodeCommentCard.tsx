import { CODE_FEEDBACK_COPY } from '@/content/codeFeedback'
import { getCodeFeedbackSnippetHeight } from '@/lib/codeFeedbackEditorLayout'
import { extractCodeLines } from '@/lib/codeSnippet'
import type { CodeLineComment } from '@/types/codeFeedback.type'
import type { StudentCodeCommentCardProps } from '@/types/codeFeedback.type'
import CodeFeedbackEditor from './CodeFeedbackEditor'

function StudentCodeCommentCard({
  comment,
  code,
  language,
}: StudentCodeCommentCardProps) {
  const endLine = comment.endLineNumber ?? comment.lineNumber
  const lineSnippet = extractCodeLines(code, comment.lineNumber, endLine)
  const snippetLineCount = lineSnippet ? lineSnippet.split('\n').length : 0
  const snippetEndLine = endLine - comment.lineNumber + 1

  const editorComments: CodeLineComment[] = [
    {
      id: comment.id,
      lineNumber: 1,
      endLineNumber: snippetEndLine > 1 ? snippetEndLine : undefined,
      labelLineNumber: comment.lineNumber,
      message: comment.message,
      authorName: comment.authorName,
    },
  ]

  return (
    <article className="flex w-full flex-col gap-2.5 overflow-visible rounded-xl bg-gray-900 px-5 py-5">
      <header className="flex flex-wrap items-center gap-3">
        <span className="text-body1 font-semibold text-light-background">
          {comment.authorName}
        </span>
        <span className="text-body3 font-bold text-neon-blue">
          {CODE_FEEDBACK_COPY.lineLabel(comment.lineNumber, comment.endLineNumber)}
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
          height={getCodeFeedbackSnippetHeight(snippetLineCount)}
          readOnly
        />
      ) : (
        <p className="text-body3 text-gray-500">코드 줄을 찾을 수 없습니다.</p>
      )}
    </article>
  )
}

export default StudentCodeCommentCard
