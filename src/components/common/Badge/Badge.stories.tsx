import type { Meta, StoryObj } from '@storybook/react-vite'
import { Code2 } from 'lucide-react'
import Badge from './Badge'

const meta = {
  component: Badge,
  parameters: {
    backgrounds: {
      default: 'dark',
      values: [{ name: 'dark', value: '#060606' }],
    },
  },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

// circle + text
export const CircleSm: Story = {
  args: {
    children: '최',
    size: 'sm',
    shape: 'circle',
    bgColor: 'bg-neon-green',
    textColor: 'text-black',
    ariaLabel: '최',
  },
}

export const CircleMd: Story = {
  args: {
    children: '최',
    size: 'md',
    shape: 'circle',
    bgColor: 'bg-neon-green',
    textColor: 'text-black',
    ariaLabel: '최',
  },
}

export const CircleLg: Story = {
  args: {
    children: '최',
    size: 'lg',
    shape: 'circle',
    bgColor: 'bg-neon-green',
    textColor: 'text-black',
    ariaLabel: '최',
  },
}

// square + text
export const SquareSm: Story = {
  args: {
    children: '최',
    size: 'sm',
    shape: 'square',
    bgColor: 'bg-neon-green',
    textColor: 'text-black',
    ariaLabel: '최',
  },
}

export const SquareMd: Story = {
  args: {
    children: '최',
    size: 'md',
    shape: 'square',
    bgColor: 'bg-neon-green',
    textColor: 'text-black',
    ariaLabel: '최',
  },
}

export const SquareLg: Story = {
  args: {
    children: '최',
    size: 'lg',
    shape: 'square',
    bgColor: 'bg-neon-green',
    textColor: 'text-black',
    ariaLabel: '최',
  },
}

export const WithIconCircle: Story = {
  args: {
    children: <Code2 size={20} />,
    size: 'md',
    shape: 'circle',
    bgColor: 'bg-neon-green',
    textColor: 'text-black',
    ariaLabel: '코드 아이콘 뱃지',
  },
}

export const WithIconSquare: Story = {
  args: {
    children: <Code2 size={20} />,
    size: 'md',
    shape: 'square',
    bgColor: 'bg-neon-green',
    textColor: 'text-black',
    ariaLabel: '코드 아이콘 뱃지',
  },
}

export const WithIconLg: Story = {
  args: {
    children: <Code2 size={40} />,
    size: 'lg',
    shape: 'circle',
    bgColor: 'bg-neon-green',
    textColor: 'text-black',
    ariaLabel: '코드 아이콘 뱃지',
  },
}

// bgOpacity
export const WithOpacity50: Story = {
  args: {
    children: '최',
    size: 'md',
    shape: 'circle',
    bgColor: 'bg-neon-green',
    bgOpacity: 50,
    textColor: 'text-black',
    ariaLabel: '최',
  },
}

export const WithOpacity20: Story = {
  args: {
    children: '최',
    size: 'md',
    shape: 'circle',
    bgColor: 'bg-neon-green',
    bgOpacity: 20,
    textColor: 'text-black',
    ariaLabel: '최',
  },
}
