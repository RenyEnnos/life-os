import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'outline' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md';
}

const Tag = forwardRef<HTMLSpanElement, TagProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    const variants = {
      default: 'bg-muted text-foreground border-border',
      outline: 'text-primary border-primary',
      success: 'bg-success/10 text-success border-success/30',
      warning: 'bg-warning/10 text-warning border-warning/30',
      error: 'bg-destructive/10 text-destructive border-destructive/30',
    };

    const sizes = {
      sm: 'px-2 py-0.5 text-[10px]',
      md: 'px-2.5 py-0.5 text-xs',
    };

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-full border font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary font-sans',
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
