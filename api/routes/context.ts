/**
 * Context API routes
 * Handle external context data (market, weather, news)
 */
import { Router, type Request, type Response } from 'express'
import { ContextGateway } from '../services/contextGateway'

const router = Router()

/**
 * Get synapse briefing (market, weather, news)
 * GET /api/context/synapse-briefing
 */
router.get('/synapse-briefing', async (req: Request, res: Response): Promise<void> => {
  try {
    const lat = req.query.lat ? Number(req.query.lat) : undefined
    const lon = req.query.lon ? Number(req.query.lon) : undefined

    const [market, weather, news] = await Promise.all([
      ContextGateway.getMarketPulse(),
      ContextGateway.getWeather(lat, lon),
      ContextGateway.getNews()
    ])

    res.json({
      success: true,
      data: {
        market,
        weather,
        news,
        avatar_url: `https://robohash.org/${(req.query.user as string) || 'commander'}?set=set4&bgset=bg2&size=200x200`
      }
    })
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Context Grid Offline'
    res.status(500).json({ success: false, error: msg, code: 'CONTEXT_ERROR' })
  }
})

/**
 * Get weather data
 * GET /api/context/weather
 */
router.get('/weather', async (req: Request, res: Response): Promise<void> => {
  try {
    const lat = req.query.lat ? Number(req.query.lat) : undefined
    const lon = req.query.lon ? Number(req.query.lon) : undefined
    const weather = await ContextGateway.getWeather(lat, lon)
    res.json(weather)
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Weather Service Unavailable'
    res.status(500).json({ error: msg, code: 'WEATHER_ERROR' })
  }
})

export default router
