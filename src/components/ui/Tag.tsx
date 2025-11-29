import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'outline' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md';
}

const Tag = forwardRef<HTMLSpanElement, TagProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    const variants = {
      default: 'bg-muted text-primary border-transparent',
      outline: 'text-primary border-primary',
      success: 'bg-green-900/30 text-green-400 border-green-900',
      warning: 'bg-yellow-900/30 text-yellow-400 border-yellow-900',
      error: 'bg-red-900/30 text-red-400 border-red-900',
    };

    const sizes = {
      sm: 'px-2 py-0.5 text-[10px]',
      md: 'px-2.5 py-0.5 text-xs',
    };

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-full border font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 font-mono',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);
Tag.displayName = 'Tag';

export { Tag };
