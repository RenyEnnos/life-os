import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import Modal from '../Modal'

describe('Modal accessibility', () => {
  it('renders dialog with aria attributes', () => {
    const { getByRole } = render(
      <Modal open onClose={() => {}} title="Title">
        <div>content</div>
      </Modal>
    )
    const dlg = getByRole('dialog')
    expect(dlg).toBeTruthy()
  })
})
