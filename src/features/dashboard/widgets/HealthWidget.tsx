import { useState, useMemo } from 'react';
import { Widget } from '@/shared/ui/Widget';
import { HeartPulse, Plus, Droplets, Scale, Moon } from 'lucide-react';
import { useHealth } from '@/features/health/hooks/useHealth';
import { Button } from '@/shared/ui/Button';
import { cn } from '@/shared/lib/cn';

type MetricType = 'weight' | 'water' | 'sleep';

export function HealthWidget() {
  const { metrics, createMetric, isLoading } = useHealth();
  const [activeType, setActiveType] = useState<MetricType>('water');
  const [value, setValue] = useState('');

  const today = new Date().toISOString().split('T')[0];

  const latestMetrics = useMemo(() => {
    if (!metrics) return {};
    const map: Record<string, any> = {};
    metrics.forEach(m => {
      if (!map[m.metric_type] || new Date(m.recorded_date) > new Date(map[m.metric_type].recorded_date)) {
        map[m.metric_type] = m;
      }
    });
    return map;
  }, [metrics]);

  const handleAdd = async () => {
    if (!value) return;
    try {
      await createMetric.mutateAsync({
        metric_type: activeType,
        value: Number(value),
        unit: activeType === 'weight' ? 'kg' : activeType === 'water' ? 'ml' : 'h',
        recorded_date: today
      });
      setValue('');
    } catch (error) {
      console.error('Failed to save metric', error);
    }
  };

  const config = {
    water: { icon: Droplets, color: 'text-blue-400', label: 'Água', unit: 'ml', step: 250 },
    weight: { icon: Scale, color: 'text-emerald-400', label: 'Peso', unit: 'kg', step: 0.1 },
    sleep: { icon: Moon, color: 'text-indigo-400', label: 'Sono', unit: 'h', step: 0.5 },
  };

  const currentMetric = latestMetrics[activeType];

  return (
    <Widget
      title="Saúde"
      icon={HeartPulse}
      className="col-span-1 row-span-1"
      isLoading={isLoading}
    >
      <div className="flex flex-col h-full justify-between gap-4">
        {/* Type Selector */}
        <div className="flex gap-2 p-1 bg-black/20 rounded-lg border border-white/5">
          {(['water', 'weight', 'sleep'] as MetricType[]).map((t) => {
            const Icon = config[t].icon;
            return (
              <button
                key={t}
                onClick={() => setActiveType(t)}
                className={cn(
                  "flex-1 flex items-center justify-center py-1.5 rounded-md transition-all",
                  activeType === t ? "bg-white/10 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300"
                )}
              >
                <Icon size={14} />
              </button>
            );
          })}
        </div>

        {/* Display & Control */}
        <div className="flex flex-col items-center justify-center gap-1 py-2">
          <span className="text-xs text-zinc-500 uppercase tracking-widest font-medium">
            Último {config[activeType].label}
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-light text-white tracking-tighter">
              {currentMetric?.value || '--'}
            </span>
            <span className="text-sm text-zinc-500 font-mono">{config[activeType].unit}</span>
          </div>
        </div>

        {/* Quick Add */}
        <div className="flex gap-2">
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={`+ ${config[activeType].unit}`}
            className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors"
          />
          <Button 
            size="sm" 
            onClick={handleAdd}
            disabled={!value || createMetric.isPending}
            className="px-3"
          >
            <Plus size={16} />
          </Button>
        </div>
      </div>
    </Widget>
  );
}
