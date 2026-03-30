import React from 'react'
import { Meta, StoryObj } from '@storybook/react'
import { Card } from '../src/components/Card'

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card
}

export default meta

type Story = StoryObj<typeof Card>

export const Default: Story = {
  args: {
    children: <div>Card content goes here</div>
  }
}
