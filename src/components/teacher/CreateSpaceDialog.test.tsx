import userEvent from '@testing-library/user-event'
import { render, screen, waitFor } from '@testing-library/react'
import { createAxiosResponse } from '@/tests/utils'
import { createWorkspace } from '@/services/workspace'
import CreateSpaceDialog from './CreateSpaceDialog'

vi.mock('@/services/workspace', () => ({
  createWorkspace: vi.fn(),
}))

describe('CreateSpaceDialog', () => {
  beforeEach(() => {
    vi.mocked(createWorkspace).mockReset()
  })

  test('새 스페이스를 생성하면 모달을 닫고 목록 갱신 콜백을 호출한다', async () => {
    const user = userEvent.setup()
    const onCreated = vi.fn().mockResolvedValue(undefined)

    vi.mocked(createWorkspace).mockResolvedValue(
      createAxiosResponse({
        status: 201,
        code: 'SPACE_CREATE_SUCCESS',
        message: '워크스페이스가 생성됐습니다.',
        data: {
          id: 6,
          name: '자료구조 스페이스',
          description: '자료구조를 함께 학습하는 공간입니다.',
          is_public: false,
          invite_code: 'SPACE0006',
          is_active: true,
          created_at: new Date().toISOString(),
        },
      }),
    )

    render(<CreateSpaceDialog onCreated={onCreated} />)

    await user.click(screen.getByRole('button', { name: '새 스페이스' }))

    expect(screen.getByRole('dialog')).toBeInTheDocument()

    await user.type(screen.getByLabelText('스페이스 이름'), '자료구조 스페이스')
    await user.type(
      screen.getByLabelText('스페이스 설명'),
      '자료구조를 함께 학습하는 공간입니다.',
    )
    await user.click(screen.getByRole('button', { name: '만들기' }))

    await waitFor(() => {
      expect(createWorkspace).toHaveBeenCalledWith({
        name: '자료구조 스페이스',
        description: '자료구조를 함께 학습하는 공간입니다.',
      })
    })
    await waitFor(() => {
      expect(onCreated).toHaveBeenCalled()
    })

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
