import { useRef, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { getDailyXP, DailyXP } from '@/features/gamification/api/xpService';
import { cn } from '@/shared/lib/cn';
import { motion, AnimatePresence } from 'framer-motion';

interface VisualLegacyProps {
    className?: string;
}

export function VisualLegacy({ className }: VisualLegacyProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const { user } = useAuth();
    const [hoverData, setHoverData] = useState<{ x: number; y: number; data: DailyXP } | null>(null);

    const { data: history } = useQuery({
        queryKey: ['xp_history_legacy', user?.id],
        queryFn: () => getDailyXP(user!.id),
        enabled: !!user,
    });

    useEffect(() => {
        if (!canvasRef.current || !containerRef.current || !history) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Dimensions
        const width = containerRef.current.clientWidth;
        const height = 180; // Fixed height for now

        // Handle high DPI
        const dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;

        // Render Logic
        // Grid: 52 weeks x 7 days
        const cols = 53;
        const rows = 7;
        const cellWidth = width / cols;
        const cellHeight = height / rows;
        const starBaseRadius = Math.min(cellWidth, cellHeight) * 0.15;

        // Generate map for easy lookup
        const historyMap = new Map<string, DailyXP>();
        history.forEach(h => historyMap.set(h.date, h));

        // Start date: 365 days ago
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - 365);

        // Clear
        ctx.clearRect(0, 0, width, height);

        const stars: { x: number, y: number, r: number, data: DailyXP | null }[] = [];

        for (let i = 0; i < 365; i++) {
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + i);
            const dateStr = currentDate.toISOString().split('T')[0];

            // Calculate grid position (GitHub style: columns are weeks, rows are days of week)
            // But aligned to right? Or standard left-to-right? 
            // Standard: Col 0 is 1 year ago.
            // Row depends on day of week (0 = Sunday)
            const dayOfWeek = currentDate.getDay();
            // We need to shift so that the LAST star is today (bottom right? or just right end)
            // Let's simplify: Linear grid left-to-right, wrapping? 
            // No, "Constellation" implies spatial mapping.
            // Let's stick to Week Columns for familiarity but render as stars.

            // Offset logic
            const dayDiff = Math.floor((currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
            const col = Math.floor(dayDiff / 7);
            const row = dayDiff % 7;

            const x = col * cellWidth + cellWidth / 2;
            const y = row * cellHeight + cellHeight / 2;

            const entry = historyMap.get(dateStr);
            const level = entry?.level || 0;
            const hasActivity = level > 0;

            // Visualization
            // Level 0: Tiny dim dot
            // Level 1-4: Growing glowing star
            let radius = starBaseRadius;
            let alpha = 0.1;
            let glow = 0;

            if (hasActivity) {
                radius = starBaseRadius * (1 + level * 0.5);
                alpha = 0.4 + (level * 0.15);
                glow = level * 3;
            }

            // Draw Star
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            if (glow > 0) {
                ctx.shadowBlur = glow;
                ctx.shadowColor = 'rgba(255, 215, 0, 0.5)'; // Gold glow
            } else {
                ctx.shadowBlur = 0;
            }
            ctx.fill();

            // Store for interaction
            stars.push({ x, y, r: Math.max(radius * 2, cellWidth / 2), data: entry ? entry : { date: dateStr, count: 0, level: 0 } });
        }

        // Attach interactive handler refs (hacky but effective for canvas in react without re-render loop)
        (canvas as any).starMap = stars;

    }, [history]);

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const stars = (canvas as any).starMap as { x: number, y: number, r: number, data: DailyXP }[];
        if (!stars) return;

        // Find closest
        const hit = stars.find(s => {
            const dx = s.x - x;
            const dy = s.y - y;
            return Math.sqrt(dx * dx + dy * dy) < s.r; // Hitbox
        });

        if (hit) {
            setHoverData({ x: e.clientX, y: e.clientY, data: hit.data });
        } else {
            setHoverData(null);
        }
    };

    const handleMouseLeave = () => setHoverData(null);

    return (
        <div ref={containerRef} className={cn("w-full relative h-[180px] bg-black/50 rounded-xl border border-secondary/10 backdrop-blur-sm overflow-hidden", className)}>
            <div className="absolute top-4 left-4 z-10">
                <h3 className="text-sm font-medium text-muted-foreground/50 tracking-widest font-mono uppercase">Constelação</h3>
            </div>
            <canvas
                ref={canvasRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="w-full h-full cursor-crosshair opacity-0 animate-[fadeIn_1s_ease-out_forwards]"
            />

            <AnimatePresence>
                {hoverData && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        style={{ position: 'fixed', left: hoverData.x + 10, top: hoverData.y + 10 }}
                        className="pointer-events-none z-50 bg-black/90 border border-yellow-500/30 p-3 rounded-lg shadow-xl backdrop-blur-md min-w-[120px]"
                    >
                        <div className="text-[10px] text-yellow-500 font-mono tracking-widest uppercase mb-1">
                            {hoverData.data.date}
                        </div>
                        <div className="text-lg font-bold text-white flex items-end gap-1">
                            {hoverData.data.count} <span className="text-[10px] text-muted-foreground font-normal mb-1">XP</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
