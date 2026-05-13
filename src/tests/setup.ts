import '@testing-library/jest-dom'

// TODO: MSW - API 테스트 (실제 API 연결 후 삭제 예정)
import { afterAll, afterEach, beforeAll, beforeEach } from 'vitest'
import { server } from '../mocks/server'

const MSW_ENABLED = import.meta.env.VITE_MSW_ENABLED === 'true'

if (MSW_ENABLED) {
  // 테스트 시작 전 MSW 서버 실행
  beforeAll(() => server.listen())

  // 각 테스트 후 핸들러 초기화 (테스트 간 격리)
  afterEach(() => server.resetHandlers())

  // 전체 종료 후 서버 닫기
  afterAll(() => server.close())
}

// 인증이 필요한 API 테스트를 위해 access_token 주입
beforeEach(() => {
  localStorage.setItem('access_token', 'mock-token')
})

// 테스트 간 localStorage 상태 격리
afterEach(() => {
  localStorage.clear()
})
