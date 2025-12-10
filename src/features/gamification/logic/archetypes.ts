import { Hammer, BookOpen, Dumbbell, Leaf, Compass, LucideIcon } from 'lucide-react';
import type { XPAttributes } from '../api/types';

export interface Archetype {
    id: 'maker' | 'scholar' | 'titan' | 'monk' | 'aspirant';
    name: string;
    color: string;       // Tailwind text color class
    bgColor: string;     // Tailwind bg color class
    strokeColor: string; // For SVG strokes
    icon: LucideIcon;
    description: string;
}

export const ARCHETYPES: Record<Archetype['id'], Archetype> = {
    maker: {
        id: 'maker',
        name: 'The Maker',
        color: 'text-amber-500',
        bgColor: 'bg-amber-500/10',
        strokeColor: '#f59e0b',
        icon: Hammer,
        description: 'Builders and creators who shape the world.',
    },
    scholar: {
        id: 'scholar',
        name: 'The Scholar',
        color: 'text-blue-500',
        bgColor: 'bg-blue-500/10',
        strokeColor: '#3b82f6',
        icon: BookOpen,
        description: 'Seekers of knowledge and wisdom.',
    },
    titan: {
        id: 'titan',
        name: 'The Titan',
        color: 'text-rose-500',
        bgColor: 'bg-rose-500/10',
        strokeColor: '#f43f5e',
        icon: Dumbbell,
        description: 'Warriors of physical excellence.',
    },
    monk: {
        id: 'monk',
        name: 'The Monk',
        color: 'text-emerald-500',
        bgColor: 'bg-emerald-500/10',
        strokeColor: '#10b981',
        icon: Leaf,
        description: 'Masters of inner peace and reflection.',
    },
    aspirant: {
        id: 'aspirant',
        name: 'The Aspirant',
        color: 'text-gray-400',
        bgColor: 'bg-gray-500/10',
        strokeColor: '#9ca3af',
        icon: Compass,
        description: 'A balanced soul, ready to find their path.',
    },
};

const ATTRIBUTE_TO_ARCHETYPE: Record<keyof XPAttributes, Archetype['id']> = {
    output: 'maker',
    mind: 'scholar',
    body: 'titan',
    spirit: 'monk',
};

/**
 * Determines the user's archetype based on their dominant XP attribute.
 * Returns "The Aspirant" if all values are equal or zero.
 */
export function getArchetype(attributes: XPAttributes | null | undefined): Archetype {
    if (!attributes) {
        return ARCHETYPES.aspirant;
    }

    const entries = Object.entries(attributes) as [keyof XPAttributes, number][];
    const maxValue = Math.max(...entries.map(([, v]) => v));

    // If all values are zero, return Aspirant
    if (maxValue === 0) {
        return ARCHETYPES.aspirant;
    }

    // Find all attributes with max value (tie detection)
    const maxAttributes = entries.filter(([, v]) => v === maxValue);

    // If there's a tie (more than one max), return Aspirant
    if (maxAttributes.length > 1) {
        return ARCHETYPES.aspirant;
    }

    const dominantAttribute = maxAttributes[0][0];
    const archetypeId = ATTRIBUTE_TO_ARCHETYPE[dominantAttribute];

    return ARCHETYPES[archetypeId];
}

/**
 * Gets the dominant attribute and its value from the XP attributes.
 */
export function getDominantAttribute(attributes: XPAttributes | null | undefined): { attribute: keyof XPAttributes; value: number } | null {
    if (!attributes) return null;

    const entries = Object.entries(attributes) as [keyof XPAttributes, number][];
    const maxValue = Math.max(...entries.map(([, v]) => v));

    if (maxValue === 0) return null;

    const maxEntry = entries.find(([, v]) => v === maxValue);
    return maxEntry ? { attribute: maxEntry[0], value: maxEntry[1] } : null;
}
