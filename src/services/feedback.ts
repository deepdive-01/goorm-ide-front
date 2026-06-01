import type { AxiosResponse } from 'axios'
import { normalizeFeedbackItem, normalizeFeedbackList } from '@/lib/feedbackMapper'
import api from './api'
import type { ApiResponse } from '@/types/api.type'
import type {
  CreateCommentRequest,
  CreateHighlightRequest,
  FeedbackItem,
  UpdateFeedbackRequest,
} from '@/types/feedback.type'

type FeedbackResponse = AxiosResponse<ApiResponse<FeedbackItem>>
type FeedbackListResponse = AxiosResponse<ApiResponse<FeedbackItem[]>>

export const createComment = async (
  body: CreateCommentRequest,
): Promise<FeedbackResponse> => {
  const response = await api.post<ApiResponse<unknown>>('/api/v1/feedback/comments', body)

  return {
    ...response,
    data: {
      ...response.data,
      data: normalizeFeedbackItem(response.data.data),
    },
  }
}

export const createHighlight = async (
  body: CreateHighlightRequest,
): Promise<FeedbackResponse> => {
  const response = await api.post<ApiResponse<unknown>>(
    '/api/v1/feedback/highlights',
    body,
  )

  return {
    ...response,
    data: {
      ...response.data,
      data: normalizeFeedbackItem(response.data.data),
    },
  }
}

export const getFeedbacks = async (
  submissionId: number,
): Promise<FeedbackListResponse> => {
  const response = await api.get<ApiResponse<unknown>>('/api/v1/feedback', {
    params: { submission_id: submissionId },
  })

  return {
    ...response,
    data: {
      ...response.data,
      data: normalizeFeedbackList(response.data.data),
    },
  }
}

export const updateFeedback = async (
  feedbackId: number,
  body: UpdateFeedbackRequest,
): Promise<FeedbackResponse> => {
  const response = await api.put<ApiResponse<unknown>>(
    `/api/v1/feedback/${feedbackId}`,
    body,
  )

  return {
    ...response,
    data: {
      ...response.data,
      data: normalizeFeedbackItem(response.data.data),
    },
  }
}

export const deleteFeedback = (feedbackId: number) =>
  api.delete<ApiResponse<null>>(`/api/v1/feedback/${feedbackId}`)
