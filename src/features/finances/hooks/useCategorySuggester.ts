import { useState, useEffect } from 'react';

const CATEGORY_KEYWORDS: Record<string, string[]> = {
    'Alimentação': ['food', 'ifood', 'restaurant', 'market', 'grocery', 'lunch', 'dinner', 'snack', 'coffee', 'supermarket', 'burger', 'pizza'],
    'Transporte': ['uber', '99', 'taxi', 'bus', 'metro', 'gas', 'fuel', 'parking', 'mechanic'],
    'Moradia': ['rent', 'energy', 'water', 'internet', 'cleaning', 'maintenance'],
    'Saúde': ['doctor', 'pharmacy', 'medicine', 'exam', 'gym', 'workout'],
    'Lazer': ['cinema', 'movie', 'game', 'netflix', 'spotify', 'party', 'travel'],
    'Educação': ['course', 'book', 'udemy', 'school', 'university']
};

export function useCategorySuggester(description: string) {
    const [suggestedCategory, setSuggestedCategory] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    useEffect(() => {
        if (!description || description.length < 3) {
            setSuggestedCategory(null);
            return;
        }

        const analyze = async () => {
            setIsAnalyzing(true);
            // Simulate AI delay
            await new Promise(r => setTimeout(r, 800));

            const lowerDesc = description.toLowerCase();
            let foundCategory: string | null = null;

            for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
                if (keywords.some(k => lowerDesc.includes(k))) {
                    foundCategory = category;
                    break;
                }
            }

            setSuggestedCategory(foundCategory);
            setIsAnalyzing(false);
        };

        const timeout = setTimeout(analyze, 500); // Debounce
        return () => clearTimeout(timeout);
    }, [description]);

    return { suggestedCategory, isAnalyzing };
}
