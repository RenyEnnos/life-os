import type { Meta, StoryObj } from '@storybook/react'
import { Input, TextArea } from './Input'

const meta: Meta<typeof Input> = {
  title: 'UI/Input',
  component: Input,
}
export default meta

type Story = StoryObj<typeof Input>

export const Fields: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <label className="text-sm text-mutedForeground">Nome</label>
        <Input placeholder="Digite seu nome" />
      </div>
      <div className="space-y-2">
        <label className="text-sm text-mutedForeground">Sobre</label>
        <TextArea rows={4} placeholder="Conte sobre você" />
      </div>
    </div>
  ),
}
