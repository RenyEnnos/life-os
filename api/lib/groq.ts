import Groq from 'groq-sdk';

const apiKey = process.env.GROQ_API_KEY;

if (!apiKey) {
    console.warn('GROQ_API_KEY is not set. AI features will not work.');
}

export const groq = new Groq({
    apiKey: apiKey || 'dummy_key',
});

export async function generateAIResponse(
    systemPrompt: string,
    userPrompt: string,
    model = 'llama-3.1-8b-instant'
): Promise<string | null> {
    if (!apiKey) return null;

    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt },
            ],
            model,
            temperature: 0.7,
            max_tokens: 1024,
        });

        return chatCompletion.choices[0]?.message?.content || null;
    } catch (error) {
        console.error('Groq API Error:', error);
        return null;
    }
}
