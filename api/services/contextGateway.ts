
import NodeCache from 'node-cache';
import axios from 'axios';

const cache = new NodeCache({ stdTTL: 600 }); // 10 min default

// Mock Data for development failure modes
const MOCKS = {
    crypto: { bitcoin: { usd: 64230, change_24h: 2.4 }, ethereum: { usd: 3450, change_24h: -1.2 } },
    wakatime: { total_hours: '6 hrs 42 mins', languages: [{ name: 'TypeScript', percent: 65 }, { name: 'Rust', percent: 20 }] },
    weather: { temp: 22, condition: 'rain', location: 'São Paulo' },
    news: [
        { title: "AI Revolutionizes Productivity", source: "TechDaily", url: "#" },
        { title: "Global Markets Rally", source: "FinanceNow", url: "#" }
    ]
};

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
            return MOCKS.crypto;
        }
    },

    // 2. Dev Stats (WakaTime) - Placeholder for now until user connects OAuth
    async getDevStats() {
        const cacheKey = 'dev_stats';
        if (cache.has(cacheKey)) return cache.get(cacheKey);

        try {
            // In a real implementation, this would call WakaTime API with user token
            const data = MOCKS.wakatime;
            cache.set(cacheKey, data, 3600); // 1 hour cache
            return data;
        } catch (error) {
            console.error('WakaTime API Error:', error instanceof Error ? error.message : String(error));
            return MOCKS.wakatime;
        }
    },

    // 3. Weather (Meteosource)
    async getWeather(lat?: number, lon?: number) {
        // Default to Sao Paulo if no coords provided or during SSR
        const cacheKey = `weather_local_${lat || 'default'}_${lon || 'default'}`;
        if (cache.has(cacheKey)) return cache.get(cacheKey);

        try {
            // Meteosource API
            const placeId = (lat && lon) ? { lat, lon } : 'sao-paulo';
            // If we had a paid plan with lat/lon:
            // const url = `https://www.meteosource.com/api/v1/free/point?lat=${lat}&lon=${lon}&sections=current&key=${process.env.METEOSOURCE_API_KEY}`;

            // Free tier often requires place_id or limited endpoints. 
            // Assuming 'point' endpoint works with lat/lon for free tier or falling back to a fixed location.
            // NOTE: Meteosource free tier usually restricts to 'closest place' logic.

            // Let's assume we use coordinates if available, else fallback.
            const latLonQuery = (lat && lon) ? `lat=${lat}&lon=${lon}` : `place_id=sao-paulo`;

            const res = await axios.get(`https://www.meteosource.com/api/v1/free/point?${latLonQuery}&sections=current&language=en&units=metric&key=${process.env.METEOSOURCE_API_KEY}`, {
                timeout: 5000
            });

            const current = res.data?.current;

            const weatherData = {
                temp: current?.temperature,
                condition: current?.icon_num, // Map this to Lucide icons later
                summary: current?.summary,
                location: 'Local' // The free API might not return city name directly in 'current'
            };

            cache.set(cacheKey, weatherData, 1800); // 30 min cache
            return weatherData;

        } catch (error) {
            console.error('Weather API Error (Meteosource):', error instanceof Error ? error.message : String(error));
            return MOCKS.weather;
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

            const articles = res.data.articles.map((art: any) => ({
                title: art.title,
                source: art.source.name,
                url: art.url
            }));

            cache.set(cacheKey, articles, 3600); // 1 hour cache
            return articles;
        } catch (error) {
            console.error('News API Error:', error instanceof Error ? error.message : String(error));
            return MOCKS.news;
        }
    }
};
