import { Code2, Play, Send } from 'lucide-react'
import { useMemo } from 'react'
import Button from '@/components/common/Button/Button'
import Card from '@/components/common/Card/Card'
import { STUDENT_PROBLEM_WORKSPACE_COPY } from '@/content/studentProblemWorkspace'
import type { Language } from '@/types/api.type'

interface CodeEditorPanelProps {
  language: Language
  code: string
  onChange: (code: string) => void
  onRun?: () => void
  onSubmit?: () => void
}

function CodeEditorPanel({
  language,
  code,
  onChange,
  onRun,
  onSubmit,
}: CodeEditorPanelProps) {
  const lineCount = useMemo(() => Math.max(code.split('\n').length, 1), [code])
  const lineNumbers = useMemo(
    () => Array.from({ length: lineCount }, (_, index) => index + 1),
    [lineCount],
  )

  return (
    <Card
      width="w-full"
      className="bg-black border-gray-800 flex min-h-[320px] flex-col gap-4 overflow-hidden p-0"
    >
      <div className="border-gray-800 flex items-center justify-between gap-3 border-b px-5 py-4">
        <div className="flex items-center gap-2">
          <Code2 className="text-neon-green size-5 shrink-0" aria-hidden />
          <h2 className="text-head3 text-white">
            {STUDENT_PROBLEM_WORKSPACE_COPY.editor.title}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <Button
            bgColor="bg-transparent"
            textColor="text-gray-300"
            hoverClassName="hover:bg-gray-900"
            className="border-gray-800 h-9 border"
            size="md"
            onClick={onRun}
          >
            <Play className="size-4" aria-hidden />
            {STUDENT_PROBLEM_WORKSPACE_COPY.editor.run}
          </Button>
          <Button size="md" className="h-9" onClick={onSubmit}>
            <Send className="size-4" aria-hidden />
            {STUDENT_PROBLEM_WORKSPACE_COPY.editor.submit}
          </Button>
        </div>
      </div>

      <div className="relative flex min-h-[240px] flex-1">
        <div
          className="text-body3 text-gray-600 border-gray-800 flex flex-col items-end border-r px-4 py-4 font-mono select-none"
          aria-hidden
        >
          {lineNumbers.map((line) => (
            <span key={line} className="leading-6">
              {line}
            </span>
          ))}
        </div>
        <textarea
          value={code}
          spellCheck={false}
          className="text-body2 text-gray-200 flex-1 resize-none bg-transparent px-4 py-4 font-mono leading-6 outline-none"
          onChange={(event) => onChange(event.target.value)}
        />
        <span className="text-body4 text-neon-green border-gray-800 pointer-events-none absolute right-4 bottom-3 border px-2 py-1 tracking-wider uppercase">
          {language}
        </span>
      </div>
    </Card>
  )
}

export default CodeEditorPanel
