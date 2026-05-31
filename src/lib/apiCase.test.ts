import { describe, expect, it } from 'vitest'
import { toSnakeCaseKeys } from './apiCase'

describe('toSnakeCaseKeys', () => {
  it('camelCase 키를 snake_case로 변환한다', () => {
    expect(
      toSnakeCaseKeys({
        roomId: 1,
        durationSeconds: 60,
        tempKey: 'abc',
      }),
    ).toEqual({
      room_id: 1,
      duration_seconds: 60,
      temp_key: 'abc',
    })
  })

  it('이미 snake_case인 키는 그대로 둔다', () => {
    expect(
      toSnakeCaseKeys({
        submission_id: 10,
        temp_key: 'abc',
        email: 'a@b.com',
      }),
    ).toEqual({
      submission_id: 10,
      temp_key: 'abc',
      email: 'a@b.com',
    })
  })
})
