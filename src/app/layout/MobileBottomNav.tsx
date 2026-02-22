import { NavLink } from 'react-router-dom';
import { cn } from '@/shared/lib/cn';
import { mobileNav } from './navItems';

export const MobileBottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/5 dark:bg-zinc-900/90 backdrop-blur-xl border-t border-white/10 pb-safe">
      <div className="flex justify-around items-center h-16 px-4">
        {mobileNav.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex flex-col items-center justify-center gap-1 w-full h-full transition-colors",
              isActive ? "text-primary" : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            {({ isActive }) => (
              <>
                <item.icon className={cn("h-6 w-6", isActive && "fill-current/20")} strokeWidth={isActive ? 2.5 : 1.5} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
