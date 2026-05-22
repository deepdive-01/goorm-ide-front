export interface ApiResponse<T = null> {
  status: number
  code: string
  message: string
  data: T
}

export type UserRole = 'MENTOR' | 'STUDENT'
export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD'
export type Language = 'PYTHON' | 'JAVA' | 'JAVASCRIPT' | 'CPP'
