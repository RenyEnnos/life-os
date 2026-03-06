import React, { useEffect } from 'react';
import { useThemeStore } from '@/shared/stores/themeStore';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove old themes
    root.classList.remove('light', 'dark');
    
    // Add current theme
    root.classList.add(theme);
    
    // Set color scheme for browser/OS integration
    root.style.colorScheme = theme;
  }, [theme]);

  return <>{children}</>;
}
