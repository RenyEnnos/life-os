import { describe, it, expect } from 'vitest';
import { normalizeEmail, normalizeName } from '../normalize';

describe('normalizeEmail utility', () => {
    it('should convert email to lowercase', () => {
        expect(normalizeEmail('USER@EXAMPLE.COM')).toBe('user@example.com');
        expect(normalizeEmail('Test.Email@Domain.COM')).toBe('test.email@domain.com');
    });

    it('should trim whitespace from email', () => {
        expect(normalizeEmail('  user@example.com  ')).toBe('user@example.com');
        expect(normalizeEmail('\tuser@example.com\n')).toBe('user@example.com');
    });

    it('should normalize unicode characters', () => {
        expect(normalizeEmail('uśer@exämple.com')).toBe('uśer@exämple.com');
        expect(normalizeEmail('test@exämple.com')).toBe('test@exämple.com');
    });

    it('should handle empty string', () => {
        expect(normalizeEmail('')).toBe('');
    });

    it('should handle undefined gracefully', () => {
        expect(normalizeEmail(undefined as any)).toBe('');
    });

    it('should handle whitespace only', () => {
        expect(normalizeEmail('   ')).toBe('');
    });
});

describe('normalizeName utility', () => {
    it('should trim whitespace from name', () => {
        expect(normalizeName('  John Doe  ')).toBe('John Doe');
        expect(normalizeName('\tJane Smith\n')).toBe('Jane Smith');
    });

    it('should preserve case', () => {
        expect(normalizeName('John Doe')).toBe('John Doe');
        expect(normalizeName('JOHN DOE')).toBe('JOHN DOE');
        expect(normalizeName('john doe')).toBe('john doe');
    });

    it('should normalize unicode characters', () => {
        expect(normalizeName('José García')).toBe('José García');
        expect(normalizeName('Müller')).toBe('Müller');
    });

    it('should handle empty string', () => {
        expect(normalizeName('')).toBe('');
    });

    it('should handle undefined gracefully', () => {
        expect(normalizeName(undefined as any)).toBe('');
    });

    it('should handle whitespace only', () => {
        expect(normalizeName('   ')).toBe('');
    });

    it('should preserve special characters in names', () => {
        expect(normalizeName("O'Neil")).toBe("O'Neil");
        expect(normalizeName('Smith-Jones')).toBe('Smith-Jones');
    });
});
