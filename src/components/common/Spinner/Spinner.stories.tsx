import type { Meta, StoryObj } from '@storybook/react-vite'
import Spinner from './Spinner'

const meta = {
  component: Spinner,
  parameters: {
    backgrounds: {
      default: 'dark',
      values: [{ name: 'dark', value: '#060606' }],
    },
  },
} satisfies Meta<typeof Spinner>

export default meta
type Story = StoryObj<typeof meta>

export const Small: Story = {
  args: { size: 'sm', color: 'text-neon-green' },
}

export const Medium: Story = {
  args: { size: 'md', color: 'text-neon-green' },
}

export const Large: Story = {
  args: { size: 'lg', color: 'text-neon-green' },
}

export const XLarge: Story = {
  args: { size: 'xl', color: 'text-neon-green' },
}

export const NeonBlue: Story = {
  args: { size: 'md', color: 'text-neon-blue' },
}

export const White: Story = {
  args: { size: 'md', color: 'text-light-background' },
}
