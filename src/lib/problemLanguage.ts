import type { Language as ApiLanguage } from '@/types/api.type'
import type { Language as EditorLanguage } from '@/types/editor.type'

const API_TO_EDITOR: Record<ApiLanguage, EditorLanguage> = {
  PYTHON: 'python',
  JAVA: 'java',
  JAVASCRIPT: 'javascript',
  CPP: 'cpp',
}

export function toEditorLanguage(language: ApiLanguage): EditorLanguage {
  return API_TO_EDITOR[language]
}
