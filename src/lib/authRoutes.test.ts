import { describe, expect, test } from 'vitest'
import { getRoleSpacesPath } from '@/lib/authRoutes'

describe('getRoleSpacesPath', () => {
  test('학습자 학습방 목록 경로', () => {
    expect(
      getRoleSpacesPath({
        id: 1,
        email: 'a@b.com',
        name: '최유정',
        nickname: '최유정',
        role: 'STUDENT',
        profile_image_url: null,
        created_at: '',
      }),
    ).toBe('/student/spaces')
  })

  test('강사 학습방 목록 경로', () => {
    expect(
      getRoleSpacesPath({
        id: 2,
        email: 'c@d.com',
        name: '김강사',
        nickname: '김강사',
        role: 'MENTOR',
        profile_image_url: null,
        created_at: '',
      }),
    ).toBe('/teacher/spaces')
  })
})
