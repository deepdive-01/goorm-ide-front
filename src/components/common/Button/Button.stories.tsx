import type { Meta, StoryObj } from '@storybook/react-vite'
import Button from './Button'
import Spinner from '../Spinner/Spinner'

const meta = {
  component: Button,
  parameters: {
    backgrounds: {
      default: 'dark',
      values: [{ name: 'dark', value: '#151515' }],
    },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Small: Story = {
  args: {
    children: '버튼',
    size: 'sm',
    bgColor: 'bg-neon-green',
    textColor: 'text-black',
  },
}

export const Medium: Story = {
  args: {
    children: '버튼',
    size: 'md',
    bgColor: 'bg-neon-green',
    textColor: 'text-black',
  },
}

export const Large: Story = {
  args: {
    children: '버튼',
    size: 'lg',
    bgColor: 'bg-neon-green',
    textColor: 'text-black',
  },
}

export const XLarge: Story = {
  args: {
    children: '버튼',
    size: 'xl',
    bgColor: 'bg-neon-green',
    textColor: 'text-black',
  },
}

export const FixedWidth: Story = {
  args: {
    children: '버튼',
    size: 'lg',
    width: 'w-40',
    bgColor: 'bg-neon-green',
    textColor: 'text-black',
  },
}

export const Loading: Story = {
  args: {
    children: '로그인',
    size: 'lg',
    bgColor: 'bg-neon-green',
    textColor: 'text-black',
    isLoading: true,
  },
}

export const LoadingWithCustomIndicator: Story = {
  args: {
    children: '로그인',
    size: 'lg',
    bgColor: 'bg-neon-green',
    textColor: 'text-black',
    isLoading: true,
    loadingIndicator: <Spinner />,
  },
}

export const Disabled: Story = {
  args: {
    children: '버튼',
    size: 'lg',
    bgColor: 'bg-neon-green',
    textColor: 'text-black',
    disabled: true,
  },
}

export const Clickable: Story = {
  args: {
    children: '클릭 테스트 버튼',
    size: 'lg',
    width: 'w-fit',
    bgColor: 'bg-neon-green',
    textColor: 'text-black',
    onClick: () => alert('버튼 클릭'),
  },
}
