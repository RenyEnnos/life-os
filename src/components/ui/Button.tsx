import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const variants = {
      primary: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_10px_rgba(13,242,13,0.3)] hover:shadow-[0_0_20px_rgba(13,242,13,0.5)] border border-transparent',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-transparent',
      outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground shadow-[0_0_5px_rgba(13,242,13,0.2)]',
      ghost: 'hover:bg-primary/10 text-primary hover:text-primary',
      destructive: 'bg-destructive text-white hover:bg-destructive/90 border border-destructive',
    };

    const sizes = {
      sm: 'h-8 px-3 text-xs',
      md: 'h-10 px-4 py-2',
      lg: 'h-12 px-8 text-lg',
      icon: 'h-10 w-10 p-2 flex items-center justify-center',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-sm font-mono font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50 uppercase tracking-wider active:scale-95',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button };
