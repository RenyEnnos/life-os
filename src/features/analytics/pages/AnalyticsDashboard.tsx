import React from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/shared/lib/cn';
import Activity from 'lucide-react/dist/esm/icons/activity';
import RefreshCw from 'lucide-react/dist/esm/icons/refresh-cw';
import Download from 'lucide-react/dist/esm/icons/download';
import { useAnalyticsData } from '../hooks/useAnalyticsData';
import { MetricsTrendChart } from '../components/MetricsTrendChart';
import { HabitConsistencyHeatmap } from '../components/HabitConsistencyHeatmap';
import { CorrelationScatterChart } from '../components/CorrelationScatterChart';
import { LifeScoreForecastChart } from '../components/LifeScoreForecastChart';
import { AIInsightsWidget } from '../components/AIInsightsWidget';

export const AnalyticsDashboard = () => {
    const { t } = useTranslation();
    const { data: metrics = [], isLoading, isFetching, refetch } = useAnalyticsData(30);

    const handleExport = () => {
        if (!metrics.length) return;

        // Convert to CSV
        const headers = ['Date', 'Productivity (Tasks)', 'Habit Adherence (%)', 'Sleep Score'];
        const csvRows = [headers.join(',')];

        metrics.forEach(row => {
            csvRows.push([
                row.date,
                row.productivity || 0,
                row.habitAdherence || 0,
                row.sleepScore || 0
            ].join(','));
        });

        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('hidden', '');
        a.setAttribute('href', url);
        a.setAttribute('download', `lifeos_analytics_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <div className="min-h-screen bg-oled text-white font-display selection:bg-primary/30 pb-24 lg:pb-8">
            <div className="max-w-[1600px] mx-auto p-4 lg:p-8 space-y-8 animate-in fade-in zoom-in-95 duration-500">
                {/* Header */}
                <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
                    <div>
                        <h1 className="text-3xl lg:text-4xl font-black tracking-tight flex items-center gap-3">
                            <Activity className="text-primary h-8 w-8" />
                            Analytics & Insights
                        </h1>
                        <p className="text-white/50 mt-1">
                            Discover patterns, track progress, and view correlations.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => refetch()}
                            disabled={isFetching}
                            className="bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
                        >
                            <RefreshCw size={16} className={cn(isFetching && "animate-spin")} />
                            Refresh Data
                        </button>
                        <button
                            onClick={handleExport}
                            disabled={isLoading || metrics.length === 0}
                            className="bg-primary hover:bg-primary/90 text-black px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-lg shadow-primary/20 flex items-center gap-2 disabled:opacity-50"
                        >
                            <Download size={16} />
                            Export Report
                        </button>
                    </div>
                </header>

                {/* Dashboard Grid Placeholder */}
                {isLoading ? (
                    <div className="min-h-[400px] flex items-center justify-center">
                        <div className="animate-spin text-primary opacity-50"><RefreshCw size={32} /></div>
                    </div>
                ) : metrics.length === 0 ? (
                    <div className="min-h-[400px] glass flex flex-col gap-4 items-center justify-center text-white/50 rounded-2xl border border-white/5">
                        <Activity size={48} className="opacity-20" />
                        <p>No analytics data available yet. Keep logging your habits to generate insights.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Top row cards will go here */}
                        <div className="glass rounded-2xl p-6 lg:col-span-2 min-h-[300px] flex items-center border border-white/5 relative group">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl" />
                            <MetricsTrendChart data={metrics} />
                        </div>

                        <div className="glass rounded-2xl p-6 min-h-[300px] flex items-center border border-white/5 relative group">
                            <div className="absolute inset-0 bg-gradient-to-bl from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl" />
                            <HabitConsistencyHeatmap data={metrics} />
                        </div>

                        <div className="glass rounded-2xl p-6 lg:col-span-3 min-h-[400px] flex items-center border border-white/5 relative group">
                            <div className="absolute inset-0 bg-gradient-to-t from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl" />
                            <CorrelationScatterChart data={metrics} />
                        </div>

                        {/* New Layer: AI Insights & Forecasting */}
                        <div className="lg:col-span-3 grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 glass rounded-2xl p-6 border border-white/5 relative group h-full">
                                <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl" />
                                <LifeScoreForecastChart />
                            </div>
                            <div className="h-full">
                                <AIInsightsWidget />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
