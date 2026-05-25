import { http, HttpResponse } from 'msw'
import type { CreateWorkspaceRequest } from '@/types/workspace.type'
import {
  createMockWorkspace,
  getMockUserFromAccessToken,
  mockMembers,
  mockWorkspace,
  mockWorkspaceList,
} from '../fixtures'

export const workspaceHandlers = [
  http.post('*/api/v1/spaces', async ({ request }) => {
    const body = (await request.json()) as CreateWorkspaceRequest
    const authorizationHeader = request.headers.get('Authorization')
    const accessToken = authorizationHeader?.replace(/^Bearer\s+/i, '') ?? null
    const user = getMockUserFromAccessToken(accessToken)
    const createdWorkspace = createMockWorkspace({
      name: body.name.trim(),
      description: body.description?.trim(),
      mentorName: `${user.nickname} 강사`,
    })

    return HttpResponse.json(
      {
        status: 201,
        code: 'SPACE_CREATE_SUCCESS',
        message: '워크스페이스가 생성됐습니다.',
        data: {
          id: createdWorkspace.id,
          name: createdWorkspace.name,
          description: createdWorkspace.description,
          is_public: false,
          invite_code: `SPACE${String(createdWorkspace.id).padStart(4, '0')}`,
          is_active: createdWorkspace.is_active,
          created_at: createdWorkspace.created_at,
        },
      },
      { status: 201 },
    )
  }),

  http.get('*/api/v1/spaces', () =>
    HttpResponse.json({
      status: 200,
      code: 'SUCCESS',
      message: '워크스페이스 목록을 조회했습니다.',
      data: mockWorkspaceList,
    }),
  ),

  http.post('*/api/v1/spaces/join', () =>
    HttpResponse.json({
      status: 200,
      code: 'SPACE_JOIN_SUCCESS',
      message: '워크스페이스에 참여했습니다.',
      data: {
        space_id: mockWorkspace.id,
        space_name: mockWorkspace.name,
        joined_at: new Date().toISOString(),
      },
    }),
  ),

  http.get('*/api/v1/spaces/:spaceId/members', () =>
    HttpResponse.json({
      status: 200,
      code: 'SUCCESS',
      message: '멤버 목록을 조회했습니다.',
      data: {
        space_id: mockWorkspace.id,
        space_name: mockWorkspace.name,
        member_count: mockMembers.length,
        members: mockMembers,
      },
    }),
  ),

  http.post('*/api/v1/spaces/:spaceId/invite/email', () =>
    HttpResponse.json({
      status: 200,
      code: 'INVITE_EMAIL_SENT',
      message: '초대 이메일이 발송됐습니다.',
      data: {
        space_id: mockWorkspace.id,
        space_name: mockWorkspace.name,
        sent_count: 1,
      },
    }),
  ),

  http.get('*/api/v1/spaces/:spaceId', () =>
    HttpResponse.json({
      status: 200,
      code: 'SUCCESS',
      message: '워크스페이스를 조회했습니다.',
      data: mockWorkspace,
    }),
  ),

  http.patch('*/api/v1/spaces/:spaceId', () =>
    HttpResponse.json({
      status: 200,
      code: 'SPACE_UPDATE_SUCCESS',
      message: '워크스페이스가 수정됐습니다.',
      data: {
        id: mockWorkspace.id,
        name: mockWorkspace.name,
        description: mockWorkspace.description,
        updated_at: new Date().toISOString(),
      },
    }),
  ),
]
