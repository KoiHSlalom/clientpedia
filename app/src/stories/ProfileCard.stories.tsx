import React from 'react'
import { Meta, StoryObj } from '@storybook/react'
import { ProfileCard } from '../src/components/ProfileCard'

const meta: Meta<typeof ProfileCard> = {
  title: 'Components/ProfileCard',
  component: ProfileCard
}

export default meta

type Story = StoryObj<typeof ProfileCard>

export const Default: Story = {
  args: { name: 'Alex Smith', title: 'Senior Consultant', org: 'Acme Corp' }
}
