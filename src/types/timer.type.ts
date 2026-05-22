export type TimerStatus = 'RUNNING' | 'STOPPED' | 'EXPIRED'

export interface StartTimerRequest {
  room_id: number
  duration_seconds: number
}

export interface TimerStarted {
  timer_id: number
  room_id: number
  duration_seconds: number
  started_at: string
  expires_at: string
  status: TimerStatus
}

export interface TimerStopped {
  timer_id: number
  status: TimerStatus
  stopped_at: string
}

export interface TimerState {
  timer_id: number
  duration_seconds: number
  remaining_seconds: number
  started_at: string
  expires_at: string
  status: TimerStatus
}
