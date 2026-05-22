import api from './api'
import type { ApiResponse } from '@/types/api.type'
import type {
  StartTimerRequest,
  TimerStarted,
  TimerStopped,
  TimerState,
} from '@/types/timer.type'

export const startTimer = (body: StartTimerRequest) =>
  api.post<ApiResponse<TimerStarted>>('/api/v1/timer/start', body)

export const stopTimer = (timerId: number) =>
  api.post<ApiResponse<TimerStopped>>(`/api/v1/timer/${timerId}/stop`)

export const getTimer = (roomId: number) =>
  api.get<ApiResponse<TimerState>>('/api/v1/timer', {
    params: { room_id: roomId },
  })
