import api from './api'
import type { ApiResponse } from '@/types/api.type'
import type {
  NotificationListParams,
  NotificationList,
  ReadAllResponse,
  CreateNotificationRequest,
  NotificationCreated,
} from '@/types/notification.type'

export const getNotifications = (params?: NotificationListParams) =>
  api.get<ApiResponse<NotificationList>>('/api/v1/notification', { params })

export const readNotification = (id: number) =>
  api.patch<ApiResponse<null>>(`/api/v1/notification/${id}/read`)

export const readAllNotifications = () =>
  api.patch<ApiResponse<ReadAllResponse>>('/api/v1/notification/read-all')

export const createNotification = (body: CreateNotificationRequest) =>
  api.post<ApiResponse<NotificationCreated>>('/api/v1/notification', body)
