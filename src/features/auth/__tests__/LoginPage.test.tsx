/** @vitest-environment jsdom */
import { describe, it, expect } from 'vitest'
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import LoginPage from '../LoginPage'
import { AuthProvider } from '../../../contexts/AuthContext'
import { BrowserRouter } from 'react-router-dom'

describe('LoginPage UI', () => {
  it('toggles password visibility', () => {
    render(<BrowserRouter><AuthProvider><LoginPage /></AuthProvider></BrowserRouter>)
    const pwd = screen.getByLabelText('Senha') as HTMLInputElement
    expect(pwd.type).toBe('password')
    const eyeBtn = screen.getByRole('button', { name: /exibir senha|ocultar senha/i })
    fireEvent.click(eyeBtn)
    expect((screen.getByLabelText('Senha') as HTMLInputElement).type).toBe('text')
  })

  it('shows strength meter as user types', () => {
    render(<BrowserRouter><AuthProvider><LoginPage /></AuthProvider></BrowserRouter>)
    const pwd = screen.getByLabelText('Senha') as HTMLInputElement
    fireEvent.change(pwd, { target: { value: 'abc' } })
    expect(!!screen.getByText(/FORÇA DA SENHA/i)).toBe(true)
  })
})
