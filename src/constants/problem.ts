import type { Difficulty, Language } from '@/types/api.type'

export const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  EASY: 'Easy',
  MEDIUM: 'Medium',
  HARD: 'Hard',
}

export const DIFFICULTY_CLASS: Record<Difficulty, string> = {
  EASY: 'text-neon-green border-neon-green/40 bg-neon-green/10',
  MEDIUM: 'text-neon-blue border-neon-blue/40 bg-neon-blue/10',
  HARD: 'text-gray-300 border-gray-600 bg-gray-800',
}

export const LANGUAGE_LABEL: Record<Language, string> = {
  PYTHON: 'Python',
  JAVA: 'Java',
  JAVASCRIPT: 'JavaScript',
  CPP: 'C++',
}
