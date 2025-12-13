
import { Router } from 'express';
import { ContextGateway } from '../services/contextGateway';

const router = Router();

// Rota unificada para o "Heads-Up Display" da Sinapse
router.get('/synapse-briefing', async (req, res) => {
    try {
        const lat = req.query.lat ? Number(req.query.lat) : undefined;
        const lon = req.query.lon ? Number(req.query.lon) : undefined;

        const [market, weather, news] = await Promise.all([
            ContextGateway.getMarketPulse(),
            ContextGateway.getWeather(lat, lon),
            ContextGateway.getNews()
        ]);

        res.json({
            success: true,
            data: {
                market,
                weather,
                news,
                // RoboHash Avatar Generator
                avatar_url: `https://robohash.org/${(req.query.user as string) || 'commander'}?set=set4&bgset=bg2&size=200x200`
            }
        });
    } catch (error) {
        console.error('Context Grid Error:', error);
        // Graceful degradation - sends partial empty data rather than 500 if possible, 
        // but here we stick to the Polidor's request:
        res.status(500).json({ success: false, error: 'Context Grid Offline' });
    }
});

// Weather specific endpoint for WeatherCard detailed view if needed later
router.get('/weather', async (req, res) => {
    try {
        const lat = req.query.lat ? Number(req.query.lat) : undefined;
        const lon = req.query.lon ? Number(req.query.lon) : undefined;
        const weather = await ContextGateway.getWeather(lat, lon);
        res.json(weather);
    } catch (error) {
        res.status(500).json({ error: 'Weather Service Unavailable' });
    }
});

export default router;
