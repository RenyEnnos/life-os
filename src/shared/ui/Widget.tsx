import React from 'react';
import { BentoCard } from './BentoCard';
import { Skeleton } from './Skeleton';
import { cn } from '@/shared/lib/cn';
import { AlertCircle } from 'lucide-react';

interface WidgetProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode | React.ElementType;
  action?: React.ReactNode;
  isLoading?: boolean;
  isEmpty?: boolean;
  error?: string | null;
  emptyMessage?: string;
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export const Widget = ({
  title,
  subtitle,
  icon,
  action,
  isLoading,
  isEmpty,
  error,
  emptyMessage = 'No data available',
  children,
  className,
  noPadding = false,
}: WidgetProps) => {
  return (
    <BentoCard
      title={title}
      icon={icon}
      action={action}
      className={cn("h-full", className)}
      noPadding={noPadding}
    >
      <div className="h-full flex flex-col">
        {subtitle && !isLoading && !isEmpty && !error && (
          <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-medium mb-4 px-1">
            {subtitle}
          </p>
        )}
        <div className="flex-1">
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-20 w-full" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full py-8 text-center text-destructive opacity-80">
              <AlertCircle className="h-8 w-8 mb-2" />
              <p className="text-xs font-mono uppercase tracking-tighter">{error}</p>
            </div>
          ) : isEmpty ? (
            <div className="flex flex-col items-center justify-center h-full py-12 text-center opacity-40">
              <p className="text-[10px] font-mono uppercase tracking-widest">{emptyMessage}</p>
            </div>
          ) : (
            children
          )}
        </div>
      </div>
    </BentoCard>
  );
};
