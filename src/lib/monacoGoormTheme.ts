import type { Monaco } from '@monaco-editor/react'

export const GOORM_MONACO_THEME = 'goorm-dark'

export function defineGoormMonacoTheme(monaco: Monaco) {
  monaco.editor.defineTheme(GOORM_MONACO_THEME, {
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
