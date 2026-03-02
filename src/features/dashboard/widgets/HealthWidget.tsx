import { Widget } from '@/shared/ui/Widget';
import { HeartPulse } from 'lucide-react';

export function HealthWidget() {
  return (
    <Widget
      title="Saúde"
      icon={HeartPulse}
      className="col-span-1 row-span-1"
      isEmpty={true}
      emptyMessage="Sincronize seus dados"
    >
      <div>Health Content</div>
    </Widget>
  );
}
