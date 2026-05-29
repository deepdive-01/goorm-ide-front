import MonacoEditor from '@monaco-editor/react'
import { defineGoormMonacoTheme, GOORM_MONACO_THEME } from '@/lib/monacoGoormTheme'
import type { Language, CodeEditorProps } from '@/types/editor.type'

const MONACO_LANGUAGE_MAP: Record<Language, string> = {
  python: 'python',
  java: 'java',
  javascript: 'javascript',
  cpp: 'cpp',
}

function CodeEditor({
  code,
  language,
  height = '100%',
  onChange,
}: CodeEditorProps) {
  return (
    <MonacoEditor
      height={height}
      theme={GOORM_MONACO_THEME}
      language={MONACO_LANGUAGE_MAP[language]}
      value={code}
      beforeMount={defineGoormMonacoTheme}
      onChange={(value) => onChange(value ?? '')}
      options={{
        fontSize: 14,
        fontFamily: 'monospace',
        lineNumbers: 'on',
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        wordWrap: 'on',
        automaticLayout: true,
        tabSize: 2,
        padding: { top: 16 },
      }}
    />
  )
}

export default CodeEditor
