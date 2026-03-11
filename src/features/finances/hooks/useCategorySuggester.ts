import { useMemo } from 'react';

const CATEGORY_KEYWORDS: Record<string, string[]> = {
    'Alimentação': ['food', 'ifood', 'restaurant', 'market', 'grocery', 'lunch', 'dinner', 'snack', 'coffee', 'supermarket', 'burger', 'pizza'],
    'Transporte': ['uber', '99', 'taxi', 'bus', 'metro', 'gas', 'fuel', 'parking', 'mechanic'],
    'Moradia': ['rent', 'energy', 'water', 'internet', 'cleaning', 'maintenance'],
    'Saúde': ['doctor', 'pharmacy', 'medicine', 'exam', 'gym', 'workout'],
    'Lazer': ['cinema', 'movie', 'game', 'netflix', 'spotify', 'party', 'travel'],
    'Educação': ['course', 'book', 'udemy', 'school', 'university']
};

export function useCategorySuggester(description: string) {
  const suggestedCategory = useMemo<string | null>(() => {
    if (!description || description.length < 3) return null;
    const lower = description.toLowerCase();
    for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
      if (keywords.some(k => lower.includes(k))) {
        return category;
      }
    }
    return null;
  }, [description]);

  const isAnalyzing = false;

  return { suggestedCategory, isAnalyzing };
}
