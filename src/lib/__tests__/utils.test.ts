import { describe, it, expect } from 'vitest';
import { cn } from '../utils';

describe('cn utility', () => {
    it('should merge class names correctly', () => {
        expect(cn('bg-red-500', 'text-white')).toBe('bg-red-500 text-white');
    });

    it('should handle conditional classes', () => {
        expect(cn('bg-red-500', true && 'text-white', false && 'hidden')).toBe('bg-red-500 text-white');
    });

    it('should merge tailwind classes correctly', () => {
        expect(cn('p-4', 'p-8')).toBe('p-8');
        expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
    });

    it('should handle undefined and null values', () => {
        expect(cn('bg-red-500', undefined, null, 'text-white')).toBe('bg-red-500 text-white');
    });
});
