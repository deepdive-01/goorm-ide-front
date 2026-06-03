import type { Meta, StoryObj } from '@storybook/react-vite'
import { MemoryRouter } from 'react-router-dom'
import PageHeader from './PageHeader'

const meta = {
  component: PageHeader,
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/student/dashboard']}>
        <Story />
      </MemoryRouter>
    ),
  ],
  parameters: {
    backgrounds: {
      default: 'dark',
      values: [{ name: 'dark', value: '#151515' }],
    },
  },
} satisfies Meta<typeof PageHeader>

export default meta
type Story = StoryObj<typeof meta>

export const FromRoute: Story = {
  name: '경로 기반 제목 (children 없음)',
}

export const Override: Story = {
  name: 'children으로 제목 직접 지정',
  args: {
    children: '직접 입력한 제목',
  },
}

export const Clickable: Story = {
  args: {
    onClick: () => alert('뒤로 가기 클릭'),
  },
}
