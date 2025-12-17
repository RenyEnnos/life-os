import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
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

  it('renders accessible close button', () => {
    const onClose = vi.fn()
    const { getByRole } = render(
      <Modal open onClose={onClose} title="Title">
        <div>content</div>
      </Modal>
    )

    const closeButton = getByRole('button', { name: /close modal/i })
    expect(closeButton).toBeTruthy()

    fireEvent.click(closeButton)
    expect(onClose).toHaveBeenCalled()
  })
})
