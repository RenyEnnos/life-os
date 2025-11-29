import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { Button } from '../Button';
import '@testing-library/jest-dom';

describe('Button Component', () => {
    afterEach(() => {
        cleanup();
    });

    it('renders correctly with default props', () => {
        render(<Button>Click me</Button>);
        const button = screen.getByRole('button', { name: /click me/i });
        expect(button).toBeInTheDocument();
        expect(button).toHaveClass('bg-primary');
    });

    it('renders with different variants', () => {
        const { rerender } = render(<Button variant="secondary">Secondary</Button>);
        expect(screen.getByRole('button', { name: /secondary/i })).toHaveClass('bg-secondary');

        rerender(<Button variant="destructive">Destructive</Button>);
        expect(screen.getByRole('button', { name: /destructive/i })).toHaveClass('bg-destructive');

        rerender(<Button variant="outline">Outline</Button>);
        expect(screen.getByRole('button', { name: /outline/i })).toHaveClass('border-primary');
    });

    it('renders with different sizes', () => {
        const { rerender } = render(<Button size="sm">Small</Button>);
        expect(screen.getByRole('button', { name: /small/i })).toHaveClass('h-8');

        rerender(<Button size="lg">Large</Button>);
        expect(screen.getByRole('button', { name: /large/i })).toHaveClass('h-12');
    });

    it('applies custom className', () => {
        render(<Button className="custom-class">Custom</Button>);
        expect(screen.getByRole('button', { name: /custom/i })).toHaveClass('custom-class');
    });
});
