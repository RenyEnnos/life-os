import type { LucideIcon } from 'lucide-react';
import {
  GraduationCap,
  Compass,
  Settings,
} from 'lucide-react';

export type NavItem = {
  label: string;
  path: string;
  icon: LucideIcon;
};

export const primaryNav: NavItem[] = [
  { label: 'MVP', path: '/mvp', icon: Compass },
];

export const secondaryNav: NavItem[] = [
  { label: 'Configurações', path: '/settings', icon: Settings },
  { label: 'Interno', path: '/mvp/admin', icon: GraduationCap },
];

// Compact list for the mobile dock
export const mobileNav: NavItem[] = [
  { label: 'MVP', path: '/mvp', icon: Compass },
  { label: 'Ajustes', path: '/settings', icon: Settings },
];
