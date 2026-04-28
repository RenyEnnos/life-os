import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ConflictResolutionModal } from '../ConflictResolutionModal';
import { useSyncConflictStore } from '../../stores/useSyncConflictStore';
import type { SyncConflict } from '../../stores/useSyncConflictStore';

vi.mock('@/shared/api/http', () => ({
  apiClient: {
    put: vi.fn().mockResolvedValue({}),
  },
}));

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

vi.mock('lucide-react', () => ({
  AlertTriangle: () => <span>AlertTriangle</span>,
  Server: () => <span>Server</span>,
  Smartphone: () => <span>Smartphone</span>,
}));

vi.mock('@/shared/ui/Button', () => ({
  Button: ({ children, onClick, className }: any) => (
    <button onClick={onClick} className={className}>{children}</button>
  ),
}));

const createConflict = (overrides: Partial<SyncConflict> = {}): SyncConflict => ({
  id: 'conflict-1',
  itemId: 'item-1',
  table: 'tasks',
  localData: { title: 'Local version' },
  serverData: { title: 'Server version' },
  endpoint: '/api/tasks/item-1',
  method: 'PUT',
  ...overrides,
});

describe('ConflictResolutionModal', () => {
  beforeEach(() => {
    useSyncConflictStore.setState({ conflicts: [] });
  });

  it('renders nothing when there are no conflicts', () => {
    const { container } = render(<ConflictResolutionModal />);
    expect(container.firstChild).toBeNull();
  });

  it('renders the modal when there is a conflict', () => {
    useSyncConflictStore.setState({ conflicts: [createConflict()] });
    render(<ConflictResolutionModal />);
    expect(screen.getByText('Conflito de Sincronização')).toBeTruthy();
    expect(screen.getByText('Manter Minha Versão')).toBeTruthy();
    expect(screen.getByText('Usar Versão do Servidor')).toBeTruthy();
  });

  it('displays conflict data for local and server versions', () => {
    useSyncConflictStore.setState({ conflicts: [createConflict()] });
    render(<ConflictResolutionModal />);
    expect(screen.getByText(/Local version/)).toBeTruthy();
    expect(screen.getByText(/Server version/)).toBeTruthy();
  });

  it('calls resolveConflict when accepting local version', async () => {
    const conflict = createConflict();
    useSyncConflictStore.setState({ conflicts: [conflict] });
    render(<ConflictResolutionModal />);

    fireEvent.click(screen.getByText('Manter Minha Versão'));
    // resolveConflict should be called after API call
    await vi.dynamicImportSettled();
    expect(useSyncConflictStore.getState().conflicts).toHaveLength(0);
  });

  it('calls resolveConflict when accepting server version', () => {
    const conflict = createConflict();
    useSyncConflictStore.setState({ conflicts: [conflict] });
    render(<ConflictResolutionModal />);

    fireEvent.click(screen.getByText('Usar Versão do Servidor'));
    expect(useSyncConflictStore.getState().conflicts).toHaveLength(0);
  });

  it('shows conflict count in footer', () => {
    useSyncConflictStore.setState({
      conflicts: [createConflict({ id: 'c1' }), createConflict({ id: 'c2', itemId: 'item-2' })],
    });
    render(<ConflictResolutionModal />);
    expect(screen.getByText(/2 conflito\(s\) pendente\(s\)/)).toBeTruthy();
  });
});
