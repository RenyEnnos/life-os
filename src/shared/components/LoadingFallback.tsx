import { Loader } from '@/shared/ui/Loader';

interface LoadingFallbackProps {
  text?: string;
  fullScreen?: boolean;
}

export function LoadingFallback({ 
  text = 'Loading...', 
  fullScreen = false 
}: LoadingFallbackProps) {
  const containerClasses = fullScreen 
    ? 'min-h-screen flex items-center justify-center bg-background' 
    : 'w-full h-full flex items-center justify-center py-12';

  return (
    <div className={containerClasses}>
      <Loader text={text} />
    </div>
  );
}

// Skeleton component for widgets/cards
export function WidgetSkeleton() {
  return (
    <div className="glass-panel rounded-xl p-6 animate-pulse">
      <div className="h-4 bg-white/10 rounded w-1/3 mb-4" />
      <div className="h-8 bg-white/5 rounded w-1/2 mb-3" />
      <div className="h-32 bg-white/5 rounded" />
    </div>
  );
}

// Page skeleton for full page loading states
export function PageSkeleton() {
  return (
    <div className="min-h-screen p-8 space-y-8 animate-pulse">
      <div className="h-8 bg-white/10 rounded w-1/4" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <WidgetSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
