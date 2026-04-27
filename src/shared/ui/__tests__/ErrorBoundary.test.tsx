import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

const { captureErrorMock } = vi.hoisted(() => ({
  captureErrorMock: vi.fn(),
}));

vi.mock('@/shared/errors', () => ({
  captureError: captureErrorMock,
}));

import { ErrorBoundary } from '@/shared/ui/ErrorBoundary';

function ExplodingComponent(): JSX.Element {
  throw new Error('boom');
}

describe('ErrorBoundary', () => {
  it('captures render failures for telemetry', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    render(
      <ErrorBoundary>
        <ExplodingComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('Algo deu errado')).toBeInTheDocument();
    expect(captureErrorMock).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'boom' }),
      expect.objectContaining({
        component: 'ErrorBoundary',
        action: 'react_render_failure',
      })
    );

    consoleErrorSpy.mockRestore();
  });
});
