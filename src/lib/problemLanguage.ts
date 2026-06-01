import type { Language } from '@/types/api.type'

/** API·에디터 공통 Language(PYTHON 등) — 별도 변환 없이 그대로 사용 */
export function toEditorLanguage(language: Language): Language {
  return language
}
