import { Button } from '@/shared/ui/Button'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '@/shared/hooks/useTheme'
import { useAuth } from '@/features/auth/contexts/AuthContext'

export function ThemeToggle({ inline = false }: { inline?: boolean }) {
  const { isDark, toggleTheme } = useTheme()
  const { updateThemePreference } = useAuth()

  const handleToggle = () => {
    const next = isDark ? 'light' : 'dark'
    toggleTheme()
    updateThemePreference(next)
  }

  return (
    <div className={inline ? '' : 'bg-surface border border-border rounded-md p-1 flex items-center gap-1 transition-colors transition-all duration-300'}>
      <Button
        variant="outline"
        size={inline ? 'icon' : 'icon'}
        aria-label="Alternar tema"
        aria-pressed={!isDark}
        onClick={handleToggle}
        className="transition-colors transition-all duration-300"
      >
        {isDark ? <Sun size={16} /> : <Moon size={16} />}
      </Button>
    </div>
  )
}

export default ThemeToggle
