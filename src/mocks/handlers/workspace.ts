import { http, HttpResponse } from 'msw'
import { mockWorkspace, mockMembers, mockWorkspaceList } from '../fixtures'

export const workspaceHandlers = [
  http.post('*/api/v1/spaces', () =>
    HttpResponse.json({
      status: 201,
      code: 'SPACE_CREATE_SUCCESS',
      message: '워크스페이스가 생성됐습니다.',
      data: {
        id: mockWorkspace.id,
        name: mockWorkspace.name,
        description: mockWorkspace.description,
        is_public: mockWorkspace.is_public,
        invite_code: mockWorkspace.invite_code,
        is_active: mockWorkspace.is_active,
        created_at: new Date().toISOString(),
      },
    }),
  ),

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
