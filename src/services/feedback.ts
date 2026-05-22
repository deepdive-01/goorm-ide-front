import api from './api'
import type { ApiResponse } from '@/types/api.type'
import type {
  CreateCommentRequest,
  FeedbackCreated,
  CreateHighlightRequest,
  FeedbackItem,
  UpdateFeedbackRequest,
} from '@/types/feedback.type'

export const createComment = (body: CreateCommentRequest) =>
  api.post<ApiResponse<FeedbackCreated>>('/api/v1/feedback/comments', body)

export const createHighlight = (body: CreateHighlightRequest) =>
  api.post<ApiResponse<FeedbackCreated>>('/api/v1/feedback/highlights', body)

export const getFeedbacks = (submissionId: number) =>
  api.get<ApiResponse<FeedbackItem[]>>('/api/v1/feedback', {
    params: { submission_id: submissionId },
  })

export const updateFeedback = (
  feedbackId: number,
  body: UpdateFeedbackRequest,
) =>
  api.put<ApiResponse<FeedbackCreated>>(`/api/v1/feedback/${feedbackId}`, body)

export const deleteFeedback = (feedbackId: number) =>
  api.delete<ApiResponse<null>>(`/api/v1/feedback/${feedbackId}`)
