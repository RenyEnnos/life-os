import { Widget } from '@/shared/ui/Widget';
import { Activity } from 'lucide-react';

export const HabitsWidget = () => {
  return (
    <Widget
      title="Daily Habits"
      icon={Activity}
      isEmpty={true}
      emptyMessage="No habits tracked today"
    >
      <div>Habits Content</div>
    </Widget>
  );
};
