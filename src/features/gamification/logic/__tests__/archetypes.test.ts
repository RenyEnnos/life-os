import { describe, it, expect } from 'vitest';
import { ARCHETYPES, getArchetype, getDominantAttribute } from '../archetypes';
import type { XPAttributes } from '../../api/types';

describe('ARCHETYPES constant', () => {
    it('should have all required archetypes', () => {
        expect(ARCHETYPES.maker).toBeDefined();
        expect(ARCHETYPES.scholar).toBeDefined();
        expect(ARCHETYPES.titan).toBeDefined();
        expect(ARCHETYPES.monk).toBeDefined();
        expect(ARCHETYPES.aspirant).toBeDefined();
    });

    it('should have correct properties for each archetype', () => {
        const archetypes = Object.values(ARCHETYPES);

        archetypes.forEach(archetype => {
            expect(archetype).toHaveProperty('id');
            expect(archetype).toHaveProperty('name');
            expect(archetype).toHaveProperty('color');
            expect(archetype).toHaveProperty('bgColor');
            expect(archetype).toHaveProperty('strokeColor');
            expect(archetype).toHaveProperty('icon');
            expect(archetype).toHaveProperty('description');
        });
    });

    it('should have The Maker with correct values', () => {
        expect(ARCHETYPES.maker.id).toBe('maker');
        expect(ARCHETYPES.maker.name).toBe('The Maker');
        expect(ARCHETYPES.maker.color).toBe('text-amber-500');
        expect(ARCHETYPES.maker.bgColor).toBe('bg-amber-500/10');
        expect(ARCHETYPES.maker.strokeColor).toBe('#f59e0b');
    });

    it('should have The Scholar with correct values', () => {
        expect(ARCHETYPES.scholar.id).toBe('scholar');
        expect(ARCHETYPES.scholar.name).toBe('The Scholar');
        expect(ARCHETYPES.scholar.color).toBe('text-blue-500');
        expect(ARCHETYPES.scholar.bgColor).toBe('bg-blue-500/10');
        expect(ARCHETYPES.scholar.strokeColor).toBe('#3b82f6');
    });

    it('should have The Titan with correct values', () => {
        expect(ARCHETYPES.titan.id).toBe('titan');
        expect(ARCHETYPES.titan.name).toBe('The Titan');
        expect(ARCHETYPES.titan.color).toBe('text-rose-500');
        expect(ARCHETYPES.titan.bgColor).toBe('bg-rose-500/10');
        expect(ARCHETYPES.titan.strokeColor).toBe('#f43f5e');
    });

    it('should have The Monk with correct values', () => {
        expect(ARCHETYPES.monk.id).toBe('monk');
        expect(ARCHETYPES.monk.name).toBe('The Monk');
        expect(ARCHETYPES.monk.color).toBe('text-emerald-500');
        expect(ARCHETYPES.monk.bgColor).toBe('bg-emerald-500/10');
        expect(ARCHETYPES.monk.strokeColor).toBe('#10b981');
    });

    it('should have The Aspirant with correct values', () => {
        expect(ARCHETYPES.aspirant.id).toBe('aspirant');
        expect(ARCHETYPES.aspirant.name).toBe('The Aspirant');
        expect(ARCHETYPES.aspirant.color).toBe('text-gray-400');
        expect(ARCHETYPES.aspirant.bgColor).toBe('bg-gray-500/10');
        expect(ARCHETYPES.aspirant.strokeColor).toBe('#9ca3af');
    });
});

describe('getArchetype', () => {
    it('should return Aspirant for null attributes', () => {
        const result = getArchetype(null);
        expect(result.id).toBe('aspirant');
    });

    it('should return Aspirant for undefined attributes', () => {
        const result = getArchetype(undefined);
        expect(result.id).toBe('aspirant');
    });

    it('should return Aspirant for all zero values', () => {
        const attributes: XPAttributes = { body: 0, mind: 0, spirit: 0, output: 0 };
        const result = getArchetype(attributes);
        expect(result.id).toBe('aspirant');
    });

    it('should return Maker when output is dominant', () => {
        const attributes: XPAttributes = { body: 10, mind: 15, spirit: 20, output: 100 };
        const result = getArchetype(attributes);
        expect(result.id).toBe('maker');
        expect(result.name).toBe('The Maker');
    });

    it('should return Scholar when mind is dominant', () => {
        const attributes: XPAttributes = { body: 10, mind: 100, spirit: 20, output: 15 };
        const result = getArchetype(attributes);
        expect(result.id).toBe('scholar');
        expect(result.name).toBe('The Scholar');
    });

    it('should return Titan when body is dominant', () => {
        const attributes: XPAttributes = { body: 100, mind: 15, spirit: 20, output: 10 };
        const result = getArchetype(attributes);
        expect(result.id).toBe('titan');
        expect(result.name).toBe('The Titan');
    });

    it('should return Monk when spirit is dominant', () => {
        const attributes: XPAttributes = { body: 10, mind: 15, spirit: 100, output: 20 };
        const result = getArchetype(attributes);
        expect(result.id).toBe('monk');
        expect(result.name).toBe('The Monk');
    });

    it('should return Aspirant when there is a tie for max value', () => {
        const attributes: XPAttributes = { body: 100, mind: 100, spirit: 50, output: 50 };
        const result = getArchetype(attributes);
        expect(result.id).toBe('aspirant');
    });

    it('should return Aspirant when all values are equal and non-zero', () => {
        const attributes: XPAttributes = { body: 50, mind: 50, spirit: 50, output: 50 };
        const result = getArchetype(attributes);
        expect(result.id).toBe('aspirant');
    });

    it('should return Aspirant when three attributes tie for max', () => {
        const attributes: XPAttributes = { body: 100, mind: 100, spirit: 100, output: 50 };
        const result = getArchetype(attributes);
        expect(result.id).toBe('aspirant');
    });

    it('should return correct archetype when only one attribute has value', () => {
        const attributes: XPAttributes = { body: 0, mind: 0, spirit: 0, output: 1 };
        const result = getArchetype(attributes);
        expect(result.id).toBe('maker');
    });

    it('should handle negative values by treating them as is', () => {
        const attributes: XPAttributes = { body: -10, mind: -5, spirit: -20, output: -1 };
        const result = getArchetype(attributes);
        expect(result.id).toBe('maker');
    });
});

describe('getDominantAttribute', () => {
    it('should return null for null attributes', () => {
        const result = getDominantAttribute(null);
        expect(result).toBeNull();
    });

    it('should return null for undefined attributes', () => {
        const result = getDominantAttribute(undefined);
        expect(result).toBeNull();
    });

    it('should return null for all zero values', () => {
        const attributes: XPAttributes = { body: 0, mind: 0, spirit: 0, output: 0 };
        const result = getDominantAttribute(attributes);
        expect(result).toBeNull();
    });

    it('should return the dominant attribute when one is clearly highest', () => {
        const attributes: XPAttributes = { body: 10, mind: 15, spirit: 20, output: 100 };
        const result = getDominantAttribute(attributes);
        expect(result).toEqual({ attribute: 'output', value: 100 });
    });

    it('should return body as dominant when it is highest', () => {
        const attributes: XPAttributes = { body: 100, mind: 50, spirit: 25, output: 10 };
        const result = getDominantAttribute(attributes);
        expect(result).toEqual({ attribute: 'body', value: 100 });
    });

    it('should return mind as dominant when it is highest', () => {
        const attributes: XPAttributes = { body: 10, mind: 100, spirit: 25, output: 50 };
        const result = getDominantAttribute(attributes);
        expect(result).toEqual({ attribute: 'mind', value: 100 });
    });

    it('should return spirit as dominant when it is highest', () => {
        const attributes: XPAttributes = { body: 10, mind: 50, spirit: 100, output: 25 };
        const result = getDominantAttribute(attributes);
        expect(result).toEqual({ attribute: 'spirit', value: 100 });
    });

    it('should return the first max attribute when there is a tie', () => {
        const attributes: XPAttributes = { body: 100, mind: 100, spirit: 50, output: 50 };
        const result = getDominantAttribute(attributes);
        expect(result).toEqual({ attribute: 'body', value: 100 });
    });

    it('should handle single non-zero value correctly', () => {
        const attributes: XPAttributes = { body: 0, mind: 0, spirit: 0, output: 1 };
        const result = getDominantAttribute(attributes);
        expect(result).toEqual({ attribute: 'output', value: 1 });
    });

    it('should return the max value even with negative values present', () => {
        const attributes: XPAttributes = { body: -10, mind: 100, spirit: -5, output: -20 };
        const result = getDominantAttribute(attributes);
        expect(result).toEqual({ attribute: 'mind', value: 100 });
    });
});
