import type { ProblemCreated } from '@/types/problem.type'

type RecordLike = Record<string, unknown>

function asRecord(value: unknown): RecordLike | null {
  if (typeof value !== 'object' || value === null) {
    return null
  }

  return value as RecordLike
}

function readString(record: RecordLike, camelKey: string, snakeKey: string): string {
  const camel = record[camelKey]
  if (typeof camel === 'string') {
    return camel
  }

  const snake = record[snakeKey]
  if (typeof snake === 'string') {
    return snake
  }

  return ''
}

function readNumber(record: RecordLike, camelKey: string, snakeKey: string): number {
  const camel = record[camelKey]
  if (typeof camel === 'number' && Number.isFinite(camel)) {
    return camel
  }

  const snake = record[snakeKey]
  if (typeof snake === 'number' && Number.isFinite(snake)) {
    return snake
  }

  return 0
}

function readBoolean(record: RecordLike, camelKey: string, snakeKey: string): boolean {
  const camel = record[camelKey]
  if (typeof camel === 'boolean') {
    return camel
  }

  const snake = record[snakeKey]
  if (typeof snake === 'boolean') {
    return snake
  }

  return false
}

function readNullableNumber(
  record: RecordLike,
  camelKey: string,
  snakeKey: string,
): number | null {
  const camel = record[camelKey]
  if (camel === null) {
    return null
  }

  if (typeof camel === 'number' && Number.isFinite(camel)) {
    return camel
  }

  const snake = record[snakeKey]
  if (snake === null) {
    return null
  }

  if (typeof snake === 'number' && Number.isFinite(snake)) {
    return snake
  }

  return null
}

/** API 응답 — Swagger(camelCase)와 snake_case 모두 지원 */
export function normalizeProblemCreated(value: unknown): ProblemCreated {
  const record = asRecord(value)

  if (!record) {
    throw new Error('Invalid problem created payload')
  }

  return {
    id: readNumber(record, 'id', 'id'),
    space_id: readNumber(record, 'spaceId', 'space_id'),
    created_by: readNumber(record, 'createdBy', 'created_by'),
    problem_bank_id: readNullableNumber(record, 'problemBankId', 'problem_bank_id'),
    title: readString(record, 'title', 'title'),
    difficulty: readString(record, 'difficulty', 'difficulty') as ProblemCreated['difficulty'],
    language: readString(record, 'language', 'language') as ProblemCreated['language'],
    is_published: readBoolean(record, 'isPublished', 'is_published'),
    created_at: readString(record, 'createdAt', 'created_at'),
  }
}
