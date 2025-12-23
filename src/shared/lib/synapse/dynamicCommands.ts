import {
    CloudRain,
    Sun,
    TrendingUp,
    TrendingDown,
    Newspaper,
    CloudLightning,
    CloudSnow,
    Cloud,
} from 'lucide-react';
import { SynapseCommand } from './types';

// Tipagem do Briefing que vem da API
type MarketEntry = { usd: number; change_24h: number }
type MarketData = { bitcoin?: MarketEntry; ethereum?: MarketEntry }
type WeatherData = { temp?: number; summary?: string; condition?: string | number; location?: string }
type NewsItem = { title: string; source: string; url: string }

export interface SynapseContext {
    market?: MarketData;
    weather?: WeatherData;
    news?: NewsItem[];
}

function getWeatherIcon(condition: string | number) {
    // Meteosource icon_num mapping or string condition
    // For simplicity, we fallback to Sun/CloudRain.
    // Real mapping would be more extensive.
    if (String(condition).includes('rain')) return CloudRain;
    if (String(condition).includes('cloud')) return Cloud;
    if (String(condition).includes('storm')) return CloudLightning;
    if (String(condition).includes('snow')) return CloudSnow;
    return Sun;
}

export const generateDynamicCommands = (context: SynapseContext | null): SynapseCommand[] => {
    if (!context) return [];

    const commands: SynapseCommand[] = [];

    // 1. Comando Climático
    if (context.weather) {
        const temp = context.weather.temp;
        const cond = context.weather.summary || context.weather.condition;
        // Attempt to parse condition if numeric

        commands.push({
            id: 'weather-status',
            label: `${temp}°C em ${context.weather.location || 'Local'}`,
            description: cond ? `${cond}` : 'Atualização meteorológica',
            icon: getWeatherIcon(context.weather.condition),
            group: 'nexus', // Using 'nexus' group as 'Contexto' wasn't in original types, or we can map it.
            // Original types had: actions, missions, rituals, resources, memory, nexus.
            // Let's use 'nexus' as it fits 'Intelligence'.
            action: () => console.log('Toggle Weather Mode'),
            keywords: ['weather', 'climate', 'temperature', 'rain', 'sun']
        });
    }

    // 2. Comando Financeiro (Crypto Ticker)
    if (context.market?.bitcoin) {
        const btc = context.market.bitcoin;
        const isUp = btc.change_24h > 0;

        commands.push({
            id: 'market-btc',
            label: `Bitcoin: $${btc.usd.toLocaleString()}`,
            description: `24h: ${isUp ? '+' : ''}${btc.change_24h.toFixed(2)}%`,
            icon: isUp ? TrendingUp : TrendingDown,
            group: 'resources',
            action: () => window.location.href = '/finances',
            keywords: ['bitcoin', 'btc', 'crypto', 'money']

        });
    }

    if (context.market?.ethereum) {
        const eth = context.market.ethereum;
        const isUp = eth.change_24h > 0;

        commands.push({
            id: 'market-eth',
            label: `Ethereum: $${eth.usd.toLocaleString()}`,
            description: `24h: ${isUp ? '+' : ''}${eth.change_24h.toFixed(2)}%`,
            icon: isUp ? TrendingUp : TrendingDown,
            group: 'resources',
            action: () => window.location.href = '/finances',
            keywords: ['ethereum', 'eth', 'crypto', 'money']

        });
    }

    // 3. News
    if (context.news && context.news.length > 0) {
        context.news.forEach((article, index) => {
            commands.push({
                id: `news-${index}`,
                label: article.title.substring(0, 50) + (article.title.length > 50 ? '...' : ''),
                description: article.source,
                icon: Newspaper,
                group: 'nexus', // Context/Intel
                action: () => window.open(article.url, '_blank'),
                keywords: ['news', 'headline', 'article']
            });
        });
    }

    return commands;
};
