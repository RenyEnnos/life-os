import type { LucideIcon } from 'lucide-react';
import {
  LayoutDashboard,
  CheckCircle2, // ListTodo -> CheckCircle2 for cleaner look
  CalendarDays, // CalendarClock -> CalendarDays
  Flame,
  Activity, // HeartPulse -> Activity
  Wallet, // Wallet2 -> Wallet
  FolderGit2, // FolderKanban -> FolderGit2 or just Folder
  Book, // BookOpen -> Book

  GraduationCap,
  Settings,
} from 'lucide-react';

export type NavItem = {
  label: string;
  path: string;
  icon: LucideIcon;
};

export const primaryNav: NavItem[] = [
  { label: 'Dashboard', path: '/', icon: LayoutDashboard },
  { label: 'Tarefas', path: '/tasks', icon: CheckCircle2 },
  { label: 'Calendário', path: '/calendar', icon: CalendarDays },
  { label: 'Hábitos', path: '/habits', icon: Flame },
  { label: 'Saúde', path: '/health', icon: Activity },
  { label: 'Finanças', path: '/finances', icon: Wallet },
  { label: 'Projetos', path: '/projects', icon: FolderGit2 },
  { label: 'Jornal', path: '/journal', icon: Book },

  { label: 'Universidade', path: '/university', icon: GraduationCap },
];

export const secondaryNav: NavItem[] = [
  { label: 'Configurações', path: '/settings', icon: Settings },
];

// Compact list for the mobile dock
export const mobileNav: NavItem[] = [
  { label: 'Dashboard', path: '/', icon: LayoutDashboard },
  { label: 'Tarefas', path: '/tasks', icon: CheckCircle2 },
  { label: 'Calendário', path: '/calendar', icon: CalendarDays },
  { label: 'Hábitos', path: '/habits', icon: Flame },
  { label: 'Finanças', path: '/finances', icon: Wallet },
];
