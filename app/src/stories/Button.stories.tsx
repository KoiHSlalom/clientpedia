import React from 'react'
import { Meta, StoryObj } from '@storybook/react'
import { Button } from '../src/components/Button'

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button
}

export default meta

type Story = StoryObj<typeof Button>

export const Primary: Story = {
  args: { children: 'Primary Button', variant: 'primary' }
}

export const Secondary: Story = {
  args: { children: 'Secondary', variant: 'secondary' }
}
