import { http, HttpResponse } from 'msw'
import { mockNotification, mockNotifications } from '../fixtures'

export const notificationHandlers = [
  http.get('*/api/v1/notification', () =>
    HttpResponse.json({
      status: 200,
      code: 'SUCCESS',
      message: '알림 목록을 조회했습니다.',
      data: {
        notifications: mockNotifications,
        page: 0,
        size: 20,
        totalCount: mockNotifications.length,
        unreadCount: mockNotifications.filter((n) => !n.isRead).length,
      },
    }),
  ),

  http.patch('*/api/v1/notification/read-all', () => {
    const updatedCount = mockNotifications.filter((n) => !n.isRead).length
    mockNotifications.forEach((n) => { n.isRead = true })
    return HttpResponse.json({
      status: 200,
      code: 'NOTIFICATION_ALL_READ_SUCCESS',
      message: '모든 알림을 읽음 처리했습니다.',
      data: { updatedCount },
    })
  }),

  http.patch('*/api/v1/notification/:id/read', ({ params }) => {
    const notification = mockNotifications.find((n) => n.id === Number(params.id))
    if (notification) notification.isRead = true
    return HttpResponse.json({
      status: 200,
      code: 'NOTIFICATION_READ_SUCCESS',
      message: '알림을 읽음 처리했습니다.',
      data: null,
    })
  }),

  http.post('*/api/v1/notification', () =>
    HttpResponse.json({
      status: 201,
      code: 'NOTIFICATION_CREATE_SUCCESS',
      message: '알림이 생성됐습니다.',
      data: {
        id: 2,
        receiverId: 2,
        senderId: 1,
        type: mockNotification.type,
        content: mockNotification.content,
        isRead: false,
        createdAt: new Date().toISOString(),
      },
    }),
  ),
]
