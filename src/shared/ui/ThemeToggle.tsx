import { useTheme } from '@/shared/hooks/useTheme'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const nextThemeLabel = theme === 'dark' ? 'claro' : 'escuro'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Alternar tema"
      title="Alternar tema"
      className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
    >
      <span aria-hidden="true">{theme === 'dark' ? 'Lua' : 'Sol'}</span>
      <span>Alternar tema ({nextThemeLabel})</span>
    </button>
  )
}

export default ThemeToggle
