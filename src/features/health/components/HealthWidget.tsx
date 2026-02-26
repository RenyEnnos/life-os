import { Widget } from '@/shared/ui/Widget';
import { HeartPulse } from 'lucide-react';

export const HealthWidget = () => {
  return (
    <Widget
      title="Health Metrics"
      icon={HeartPulse}
      isEmpty={true}
      emptyMessage="Connect your health data"
    >
      <div>Health Content</div>
    </Widget>
  );
};
