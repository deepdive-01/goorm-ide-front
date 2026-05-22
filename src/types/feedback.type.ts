export type FeedbackType = 'COMMENT' | 'HIGHLIGHT'
export type HighlightColor = 'YELLOW' | 'RED' | 'GREEN' | 'BLUE'

export interface CreateCommentRequest {
  submission_id: number
  content: string
}

export interface FeedbackCreated {
  feedback_id: number
  submission_id: number
  type: FeedbackType
  content: string
  created_by: string
  created_at: string
  start_line?: number
  end_line?: number
  color?: HighlightColor
}

export interface CreateHighlightRequest {
  submission_id: number
  start_line: number
  end_line: number
  color: HighlightColor
  content?: string
}

export interface FeedbackItem {
  feedback_id: number
  type: FeedbackType
  content: string
  created_by: string
  created_at: string
  start_line?: number
  end_line?: number
  color?: HighlightColor
}

export interface UpdateFeedbackRequest {
  content: string
}
