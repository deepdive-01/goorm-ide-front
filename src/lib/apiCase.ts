/** API 요청 시 camelCase 키를 snake_case로 변환 (백엔드 규약) */
function camelToSnake(key: string): string {
  return key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function toSnakeCaseKeys<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((item) => toSnakeCaseKeys(item)) as T
  }

  if (!isPlainObject(value)) {
    return value
  }

  return Object.fromEntries(
    Object.entries(value).map(([key, nested]) => [
      camelToSnake(key),
      toSnakeCaseKeys(nested),
    ]),
  ) as T
}
