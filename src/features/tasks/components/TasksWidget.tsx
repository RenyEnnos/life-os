import { Widget } from '@/shared/ui/Widget';
import { ListTodo } from 'lucide-react';

export const TasksWidget = () => {
  return (
    <Widget
      title="Active Tasks"
      icon={ListTodo}
      isEmpty={true}
      emptyMessage="All caught up!"
    >
      <div>Tasks Content</div>
    </Widget>
  );
};
