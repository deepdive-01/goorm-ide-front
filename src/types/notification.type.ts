export type NotificationType =
  | 'FEEDBACK_RECEIVED'
  | 'SUBMISSION_RECEIVED'
  | 'WORKSPACE_INVITED'

export interface NotificationListParams {
  isRead?: boolean
  page?: number
  size?: number
  sort?: string[]
}

export interface NotificationItem {
  id: number
  type: NotificationType
  content: string
  isRead: boolean
  createdAt: string
}

export interface NotificationList {
  notifications: NotificationItem[]
  page: number
  size: number
  totalCount: number
  unreadCount: number
}

export interface ReadAllResponse {
  updatedCount: number
}

export interface CreateNotificationRequest {
  receiver_id: number
  type: NotificationType
  content: string
}

export interface NotificationCreated {
  id: number
  receiverId: number
  senderId: number
  type: NotificationType
  content: string
  isRead: boolean
  createdAt: string
}
