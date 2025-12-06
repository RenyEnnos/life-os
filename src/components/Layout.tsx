import { Outlet } from 'react-router-dom';
import { FloatingDock } from '@/components/ui/FloatingDock';

export default function Layout() {
  return (
    <div className="min-h-screen animated-gradient-bg text-foreground font-sans selection:bg-primary/30">
      {/* Global Background Elements */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '3s' }} />
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 pb-32 px-4 md:px-8 max-w-7xl mx-auto pt-8">
        <Outlet />
      </div>

      {/* Navigation */}
      <FloatingDock />
    </div>
  );
}