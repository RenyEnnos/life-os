
import NodeCache from 'node-cache';
import axios from 'axios';

const cache = new NodeCache({ stdTTL: 600 }); // 10 min default

export const ContextGateway = {
    // 1. Market Pulse (CoinGecko)
    async getMarketPulse() {
        const cacheKey = 'market_pulse';
        if (cache.has(cacheKey)) return cache.get(cacheKey);

        try {
            // CoinGecko Free API - Rate Limited (30 calls/min)
            const res = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
                params: {
                    ids: 'bitcoin,ethereum',
                    vs_currencies: 'usd',
                    include_24hr_change: 'true',
                    x_cg_demo_api_key: process.env.COINGECKO_API_KEY
                },
                timeout: 5000
            });

            const data = res.data;
            cache.set(cacheKey, data, 300); // 5 min cache
            return data;
        } catch (error) {
            console.error('Market API Error (CoinGecko):', error instanceof Error ? error.message : String(error));
            return null;
        }
    },

    // 2. Weather (Meteosource)
    async getWeather(lat?: number, lon?: number) {
        // Default to Sao Paulo if no coords provided or during SSR
        const cacheKey = `weather_local_${lat || 'default'}_${lon || 'default'}`;
        if (cache.has(cacheKey)) return cache.get(cacheKey);

        try {
            const latLonQuery = (lat && lon) ? `lat=${lat}&lon=${lon}` : `place_id=sao-paulo`;

            const res = await axios.get(`https://www.meteosource.com/api/v1/free/point?${latLonQuery}&sections=current&language=en&units=metric&key=${process.env.METEOSOURCE_API_KEY}`, {
                timeout: 5000
            });

            const current = res.data?.current;

            const weatherData = {
                temp: current?.temperature,
                condition: current?.icon_num, 
                summary: current?.summary,
                location: 'Local' 
            };

            cache.set(cacheKey, weatherData, 1800); // 30 min cache
            return weatherData;

        } catch (error) {
            console.error('Weather API Error (Meteosource):', error instanceof Error ? error.message : String(error));
            return null;
        }
    },

    // 4. News (NewsAPI)
    async getNews() {
        const cacheKey = 'global_news';
        if (cache.has(cacheKey)) return cache.get(cacheKey);

        try {
            const res = await axios.get('https://newsapi.org/v2/top-headlines', {
                params: {
                    country: 'us',
                    category: 'technology',
                    pageSize: 3,
                    apiKey: process.env.NEWS_API_KEY
                },
                timeout: 5000
            });

            type NewsArticle = { title?: string; source?: { name?: string }; url?: string }
            const payload = res.data as { articles?: NewsArticle[] }
            const articles = (payload.articles ?? []).map((art) => ({
                title: art.title ?? '',
                source: art.source?.name ?? '',
                url: art.url ?? ''
            }));

            cache.set(cacheKey, articles, 3600); // 1 hour cache
            return articles;
        } catch (error) {
            console.error('News API Error:', error instanceof Error ? error.message : String(error));
            return [];
        }
    }
};
