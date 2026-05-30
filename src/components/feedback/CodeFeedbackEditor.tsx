import { useCallback, useEffect, useRef, useState } from 'react'
import MonacoEditor from '@monaco-editor/react'
import type { Monaco } from '@monaco-editor/react'
import type { editor } from 'monaco-editor'
import type { Language } from '@/types/editor.type'
import type {
  CodeFeedbackEditorProps,
  CodeLineComment,
} from '@/types/codeFeedback.type'
import { defineGoormMonacoTheme, GOORM_MONACO_THEME } from '@/lib/monacoGoormTheme'
import CodeFeedbackCommentMarker from './CodeFeedbackCommentMarker'

const HIGHLIGHT_CLASS = 'code-feedback-line-highlight'
const SELECTION_HIGHLIGHT_CLASS = 'code-feedback-line-selection'

const MONACO_LANGUAGE: Record<Language, string> = {
  python: 'python',
  java: 'java',
  javascript: 'javascript',
  cpp: 'cpp',
}

type MarkerLayout = {
  comment: CodeLineComment
  top: number
  lineHeight: number
}

function CodeFeedbackEditor({
  code,
  language,
  comments,
  height = '180px',
  readOnly = true,
  onChange,
  className = '',
  baseLineNumber,
  selectedLineRange = null,
  onLineNumberClick,
}: CodeFeedbackEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)
  const monacoRef = useRef<Monaco | null>(null)
  const decorationIdsRef = useRef<string[]>([])
  const [markerLayouts, setMarkerLayouts] = useState<MarkerLayout[]>([])

  const applyLineHighlights = useCallback(
    (editor: editor.IStandaloneCodeEditor, monaco: Monaco) => {
      const commentDecorations = comments.map((comment) => {
        const endLine = comment.endLineNumber ?? comment.lineNumber

        return {
          range: new monaco.Range(comment.lineNumber, 1, endLine, 1),
          options: {
            isWholeLine: true,
            className: HIGHLIGHT_CLASS,
          },
        }
      })

      const selectionDecorations = selectedLineRange
        ? [
            {
              range: new monaco.Range(
                selectedLineRange.startLine,
                1,
                selectedLineRange.endLine,
                1,
              ),
              options: {
                isWholeLine: true,
                className: SELECTION_HIGHLIGHT_CLASS,
              },
            },
          ]
        : []

      decorationIdsRef.current = editor.deltaDecorations(
        decorationIdsRef.current,
        [...commentDecorations, ...selectionDecorations],
      )
    },
    [comments, selectedLineRange],
  )

  const updateMarkerLayouts = useCallback(() => {
    const editor = editorRef.current
    const monaco = monacoRef.current
    if (!editor || !monaco) return

    const lineHeight = editor.getOption(monaco.editor.EditorOption.lineHeight)
    const layouts: MarkerLayout[] = []

    for (const comment of comments) {
      const lineTop = editor.getTopForLineNumber(comment.lineNumber)
      const scrollTop = editor.getScrollTop()
      const visibleTop = lineTop - scrollTop

      if (visibleTop < 0) continue

      layouts.push({
        comment,
        top: visibleTop,
        lineHeight,
      })
    }

    setMarkerLayouts(layouts)
  }, [comments])

  const handleEditorMount = useCallback(
    (editor: editor.IStandaloneCodeEditor, monaco: Monaco) => {
      editorRef.current = editor
      monacoRef.current = monaco
      applyLineHighlights(editor, monaco)
      updateMarkerLayouts()

      editor.onDidScrollChange(updateMarkerLayouts)
      editor.onDidLayoutChange(updateMarkerLayouts)

      if (onLineNumberClick) {
        editor.onMouseDown((event) => {
          if (
            event.target.type !== monaco.editor.MouseTargetType.GUTTER_LINE_NUMBERS ||
            !event.target.position
          ) {
            return
          }

          event.event.preventDefault()
          event.event.stopPropagation()
          onLineNumberClick(event.target.position.lineNumber, event.event.shiftKey)
        })
      }
    },
    [applyLineHighlights, onLineNumberClick, updateMarkerLayouts],
  )

  useEffect(() => {
    const editor = editorRef.current
    const monaco = monacoRef.current
    if (!editor || !monaco) return

    applyLineHighlights(editor, monaco)
    updateMarkerLayouts()
  }, [applyLineHighlights, code, comments, updateMarkerLayouts])

  useEffect(() => {
    const container = containerRef.current
    if (!container || typeof ResizeObserver === 'undefined') return

    const observer = new ResizeObserver(() => {
      updateMarkerLayouts()
    })

    observer.observe(container)
    return () => observer.disconnect()
  }, [updateMarkerLayouts])

  return (
    <div
      ref={containerRef}
      className={`relative overflow-visible rounded-lg border border-gray-800 ${className}`}
    >
      <div className="overflow-hidden rounded-lg bg-[#060606]">
        <MonacoEditor
          height={height}
          theme={GOORM_MONACO_THEME}
          language={MONACO_LANGUAGE[language]}
          value={code}
          beforeMount={defineGoormMonacoTheme}
          onMount={handleEditorMount}
          onChange={(value) => onChange?.(value ?? '')}
          options={{
            fontSize: 14,
            fontFamily: 'monospace',
            lineHeight: 25,
            lineNumbers:
              baseLineNumber !== undefined
                ? (line) => String(baseLineNumber + line - 1)
                : 'on',
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            automaticLayout: true,
            tabSize: 2,
            readOnly,
            padding: { top: 10, bottom: 10 },
            glyphMargin: false,
            folding: false,
            renderLineHighlight: 'none',
            overviewRulerLanes: 0,
            hideCursorInOverviewRuler: true,
            scrollbar: {
              vertical: 'auto',
              horizontal: 'auto',
            },
          }}
        />
      </div>

      <div className="pointer-events-none absolute inset-0 overflow-visible">
        {markerLayouts.map(({ comment, top, lineHeight }) => (
          <CodeFeedbackCommentMarker
            key={comment.id}
            lineNumber={comment.lineNumber}
            labelLineNumber={comment.labelLineNumber}
            message={comment.message}
            top={top}
            lineHeight={lineHeight}
          />
        ))}
      </div>
    </div>
  )
}

export default CodeFeedbackEditor
