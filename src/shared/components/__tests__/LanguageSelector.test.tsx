import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LanguageSelector } from '../LanguageSelector';

const mockChangeLanguage = vi.fn();

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    i18n: {
      language: 'pt-BR',
      changeLanguage: mockChangeLanguage,
    },
  }),
}));

vi.mock('lucide-react', () => ({
  Globe: () => <span>Globe</span>,
  Check: () => <span>Check</span>,
  ChevronDown: () => <span>ChevronDown</span>,
}));

vi.mock('@/shared/lib/utils', () => ({
  cn: (...args: any[]) => args.filter(Boolean).join(' '),
}));

describe('LanguageSelector', () => {
  beforeEach(() => {
    mockChangeLanguage.mockClear();
    localStorage.clear();
  });

  it('renders the current language flag', () => {
    render(<LanguageSelector />);
    expect(screen.getByText('\u{1F1E7}\u{1F1F7}')).toBeTruthy();
  });

  it('opens dropdown when button is clicked', () => {
    render(<LanguageSelector />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('English')).toBeTruthy();
    expect(screen.getByText('Español')).toBeTruthy();
  });

  it('calls changeLanguage when a language is selected', () => {
    render(<LanguageSelector />);
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByText('English'));
    expect(mockChangeLanguage).toHaveBeenCalledWith('en');
  });

  it('saves language to localStorage', () => {
    render(<LanguageSelector />);
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByText('Español'));
    expect(localStorage.getItem('i18nextLng')).toBe('es');
  });

  it('closes dropdown after selection', () => {
    render(<LanguageSelector />);
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByText('English'));
    expect(screen.queryByText('Español')).toBeNull();
  });
});
