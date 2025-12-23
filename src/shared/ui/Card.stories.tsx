import type { Meta, StoryObj } from '@storybook/react-vite'
import { Card, CardHeader, CardTitle, CardContent } from './Card'

const meta: Meta<typeof Card> = {
  title: 'UI/Card',
  component: Card,
}
export default meta

type Story = StoryObj<typeof Card>

export const Basic: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Card Premium</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-mutedForeground">Superfície elegante com sombra discreta e bordas sutis.</p>
      </CardContent>
    </Card>
  ),
}
