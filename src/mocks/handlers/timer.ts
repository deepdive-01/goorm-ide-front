import { http, HttpResponse } from 'msw'
import { mockTimer } from '../fixtures'

export const timerHandlers = [
  http.post('*/api/v1/timer/start', () =>
    HttpResponse.json({
      status: 200,
      code: 'TIMER_STARTED',
      message: '타이머가 시작되었습니다.',
      data: {
        timer_id: mockTimer.timer_id,
        room_id: mockTimer.room_id,
        duration_seconds: mockTimer.duration_seconds,
        started_at: new Date().toISOString(),
        expires_at: new Date(
          Date.now() + mockTimer.duration_seconds * 1000,
        ).toISOString(),
        status: 'RUNNING' as const,
      },
    }),
  ),

  http.post('*/api/v1/timer/:timerId/stop', () =>
    HttpResponse.json({
      status: 200,
      code: 'TIMER_STOPPED',
      message: '타이머가 종료되었습니다.',
      data: {
        timer_id: mockTimer.timer_id,
        status: 'STOPPED' as const,
        stopped_at: new Date().toISOString(),
      },
    }),
  ),

  http.get('*/api/v1/timer', () =>
    HttpResponse.json({
      status: 200,
      code: 'TIMER_FOUND',
      message: '타이머 정보를 조회했습니다.',
      data: mockTimer,
    }),
  ),
]
