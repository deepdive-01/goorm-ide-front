import MonacoEditor from '@monaco-editor/react'
import type { Monaco } from '@monaco-editor/react'
import type { Language, CodeEditorProps } from '@/types/editor.type'

function defineGoormTheme(monaco: Monaco) {
  monaco.editor.defineTheme('goorm-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [],
    colors: {
      'editor.background': '#060606',
      'editor.lineHighlightBackground': '#0d0d0d',
      'editorLineNumber.foreground': '#4b5563',
      'editorLineNumber.activeForeground': '#9ca3af',
    },
  })
}

const MONACO_LANGUAGE_MAP: Record<Language, string> = {
  PYTHON: 'python',
  JAVA: 'java',
  JAVASCRIPT: 'javascript',
  CPP: 'cpp',
}

function CodeEditor({
  value,
  language,
  height = '100%',
  onChange,
  readOnly = false,
}: CodeEditorProps) {
  return (
    <MonacoEditor
      height={height}
      theme="goorm-dark"
      language={MONACO_LANGUAGE_MAP[language]}
      value={value}
      beforeMount={defineGoormTheme}
      onChange={(v) => onChange(v ?? '')}
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
        readOnly,
      }}
    />
  )
}

export default CodeEditor
