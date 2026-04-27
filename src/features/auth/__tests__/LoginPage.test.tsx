/** @vitest-environment jsdom */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';

import LoginPage from '../components/LoginPage';

const mockAuth = {
  login: vi.fn(),
  resetPassword: vi.fn(),
  user: null,
  loading: false,
};

vi.mock('@/features/auth/contexts/AuthContext', () => ({
  useAuth: () => mockAuth,
}));

function renderLoginPage() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

describe('LoginPage UI', () => {
  beforeEach(() => {
    mockAuth.login.mockReset();
    mockAuth.resetPassword.mockReset();
  });

  it('toggles password visibility', () => {
    renderLoginPage();

    const passwordInput = screen.getByLabelText('Senha') as HTMLInputElement;
    expect(passwordInput.type).toBe('password');

    fireEvent.click(screen.getByRole('button', { name: /exibir senha|ocultar senha/i }));

    expect((screen.getByLabelText('Senha') as HTMLInputElement).type).toBe('text');
  });

  it('preserves meaningful recovery errors from the backend', async () => {
    const backendMessage = 'Desktop auth desabilitado: configure o Supabase para recuperar senha.';
    mockAuth.resetPassword.mockRejectedValueOnce(new Error(backendMessage));

    renderLoginPage();

    fireEvent.click(screen.getByRole('button', { name: 'Esqueci minha senha' }));
    fireEvent.change(screen.getByTestId('recovery-email-input'), {
      target: { value: 'user@example.com' },
    });
    fireEvent.click(screen.getByTestId('recovery-submit-button'));

    await waitFor(() => {
      expect(screen.getByTestId('login-error-message')).toHaveTextContent(backendMessage);
    });
  });

  it('falls back to the generic recovery error when no useful message exists', async () => {
    mockAuth.resetPassword.mockRejectedValueOnce({});

    renderLoginPage();

    fireEvent.click(screen.getByRole('button', { name: 'Esqueci minha senha' }));
    fireEvent.change(screen.getByTestId('recovery-email-input'), {
      target: { value: 'user@example.com' },
    });
    fireEvent.click(screen.getByTestId('recovery-submit-button'));

    await waitFor(() => {
      expect(screen.getByTestId('login-error-message')).toHaveTextContent(
        'Erro ao enviar link. Tente novamente.'
      );
    });
  });
});
