import type { Meta, StoryObj } from '@storybook/react-vite'
import Card from './Card'

const meta = {
  component: Card,
  parameters: {
    backgrounds: {
      default: 'dark',
      values: [{ name: 'dark', value: '#151515' }],
    },
  },
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: '카드 컴포넌트',
  },
}

export const WithLongText: Story = {
  args: {
    children: (
      <>
        Card 컴포넌트 참고
        <br />
        color - background : Background, stroke : gray 800
        <br />
        radius - 12px | p - 가로 28px, 세로 24px 씩
      </>
    ),
  },
}

export const WithWidth: Story = {
  args: {
    children: '고정 너비 카드',
    width: 'w-80',
  },
}

export const Clickable: Story = {
  args: {
    children: '클릭 테스트 카드',
    cursor: 'pointer',
    onClick: () => alert('카드 클릭'),
  },
}
