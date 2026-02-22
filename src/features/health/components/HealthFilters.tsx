import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const METRIC_TYPES = [
    { value: '', label: 'All Metrics' },
    { value: 'heart_rate', label: 'Heart Rate' },
    { value: 'weight', label: 'Weight' },
    { value: 'sleep', label: 'Sleep' },
    { value: 'steps', label: 'Steps' },
    { value: 'blood_pressure', label: 'Blood Pressure' },
    { value: 'blood_sugar', label: 'Blood Sugar' },
];

export const HealthFilters = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    // Manage local state to allow typing without immediate URL update
    const [localFilters, setLocalFilters] = useState({
        type: searchParams.get('type') || '',
        startDate: searchParams.get('startDate') || '',
        endDate: searchParams.get('endDate') || '',
        tags: searchParams.get('tags') || '',
    });

    // Synchronize local state with URL when back/forward is used
    useEffect(() => {
        setLocalFilters({
            type: searchParams.get('type') || '',
            startDate: searchParams.get('startDate') || '',
            endDate: searchParams.get('endDate') || '',
            tags: searchParams.get('tags') || '',
        });
    }, [searchParams]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setLocalFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleApplyFilters = () => {
        const params = new URLSearchParams(searchParams);

        Object.entries(localFilters).forEach(([key, value]) => {
            if (value.trim()) {
                params.set(key, value.trim());
            } else {
                params.delete(key);
            }
        });

        // If filtering by something, usually we'd reset pagination if existed
        // But health metrics endpoint doesn't currently mandate cursor
        setSearchParams(params);
    };

    const handleClearFilters = () => {
        const params = new URLSearchParams(searchParams);
        params.delete('type');
        params.delete('startDate');
        params.delete('endDate');
        params.delete('tags');
        setSearchParams(params);
    };

    // If there are applied filters in the URL
    const hasActiveFilters = !!searchParams.get('type') || !!searchParams.get('startDate') || !!searchParams.get('endDate') || !!searchParams.get('tags');

    return (
        <div className="glass p-4 rounded-lg mb-6 flex flex-col md:flex-row gap-4 items-end animate-enter">
            <div className="flex-1 min-w-[150px] w-full">
                <label className="block text-xs font-bold text-white/50 mb-1 uppercase tracking-wider">Metric Type</label>
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-sm text-white/40">monitor_heart</span>
                    <select
                        name="type"
                        value={localFilters.type}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-primary appearance-none cursor-pointer"
                    >
                        {METRIC_TYPES.map(type => (
                            <option key={type.value} value={type.value} className="bg-zinc-900 text-white">
                                {type.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="flex-1 min-w-[140px] w-full">
                <label className="block text-xs font-bold text-white/50 mb-1 uppercase tracking-wider">Start Date</label>
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-sm text-white/40">calendar_today</span>
                    <input
                        type="date"
                        name="startDate"
                        value={localFilters.startDate}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-primary [color-scheme:dark]"
                    />
                </div>
            </div>

            <div className="flex-1 min-w-[140px] w-full">
                <label className="block text-xs font-bold text-white/50 mb-1 uppercase tracking-wider">End Date</label>
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-sm text-white/40">event</span>
                    <input
                        type="date"
                        name="endDate"
                        value={localFilters.endDate}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-primary [color-scheme:dark]"
                    />
                </div>
            </div>

            <div className="flex-1 min-w-[150px] w-full">
                <label className="block text-xs font-bold text-white/50 mb-1 uppercase tracking-wider">Tags</label>
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-sm text-white/40">sell</span>
                    <input
                        type="text"
                        name="tags"
                        placeholder="e.g. morning, fasting"
                        value={localFilters.tags}
                        onChange={handleChange}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleApplyFilters(); }}
                        className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-primary"
                    />
                </div>
            </div>

            <div className="flex gap-2 w-full md:w-auto mt-2 md:mt-0">
                {hasActiveFilters && (
                    <button
                        onClick={handleClearFilters}
                        className="h-[38px] px-4 rounded-lg bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 hover:border-vital-red/30 hover:text-vital-red transition-colors text-sm font-bold flex items-center justify-center flex-1 md:flex-none"
                        aria-label="Clear filters"
                        title="Clear filters"
                    >
                        <span className="material-symbols-outlined text-[18px]">clear_all</span>
                    </button>
                )}
                <button
                    onClick={handleApplyFilters}
                    className="h-[38px] px-5 rounded-lg bg-primary text-black hover:bg-primary/90 transition-colors text-sm font-bold flex items-center justify-center gap-2 flex-1 md:flex-none"
                >
                    <span className="material-symbols-outlined text-[18px]">filter_list</span>
                    Filter
                </button>
            </div>
        </div>
    );
};
