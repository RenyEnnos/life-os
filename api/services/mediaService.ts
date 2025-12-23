
import axios from 'axios';
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 3600 }); // 1 hour cache per search

export const MediaService = {
    async searchImages(query: string, page: number = 1) {
        const cacheKey = `unsplash_${query}_${page}`;
        if (cache.has(cacheKey)) return cache.get(cacheKey);

        try {
            const res = await axios.get('https://api.unsplash.com/search/photos', {
                params: {
                    query,
                    page,
                    per_page: 1, // Only need 1 cover
                    orientation: 'landscape'
                },
                headers: {
                    Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`
                },
                timeout: 5000
            });

            type UnsplashImage = { urls?: { regular?: string; small?: string; raw?: string } }
            type UnsplashResponse = { results?: UnsplashImage[]; total?: number }
            const payload = res.data as UnsplashResponse

            const images = (payload.results ?? []).map((img) => {
                const raw = img.urls?.raw ?? ''
                return {
                    regular: img.urls?.regular ?? '',
                    small: img.urls?.small ?? '',
                    // optimize for cover with query param if needed
                    coverUrl: raw ? `${raw}&w=600&fit=max&q=80` : ''
                }
            });

            const result = { images, total: payload.total ?? 0 };
            cache.set(cacheKey, result);
            return result;
        } catch (error) {
            console.error('Unsplash API Error:', error instanceof Error ? error.message : String(error));
            return { images: [], total: 0 };
        }
    }
};
