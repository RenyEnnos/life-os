import { useState, useMemo, useEffect } from 'react';
import { PageTitle } from '@/shared/ui/PageTitle';
import { useTasks } from '@/features/tasks/hooks/useTasks';
import { FullScreenCalendar, CalendarData, Event } from './components/FullScreenCalendar';
import { CreateTaskDialog } from '@/features/tasks/components/CreateTaskDialog';
import { Loader } from '@/shared/ui/Loader';
import { Calendar as CalendarIcon, Check } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { apiFetch } from '@/shared/api/http';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export default function CalendarPage() {
    const { tasks, isLoading: tasksLoading, createTask, updateTask } = useTasks();
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [isConnecting, setIsConnecting] = useState(false);

    // Handle OAuth Callback
    useEffect(() => {
        const code = searchParams.get('code');
        const error = searchParams.get('error');

        if (error) {
            toast.error('Failed to connect Google Calendar');
            navigate('/calendar', { replace: true });
            return;
        }

        if (code) {
            const connect = async () => {
                setIsConnecting(true);
                try {
                    await apiFetch('/api/calendar/connect', {
                        method: 'POST',
                        body: JSON.stringify({ code })
                    });
                    toast.success('Google Calendar connected!');
                    // Refresh functionality or reload events would happen here
                } catch (err) {
                    toast.error('Error connecting calendar');
                    console.error(err);
                } finally {
                    setIsConnecting(false);
                    // Clear code from URL
                    navigate('/calendar', { replace: true });
                }
            };
            connect();
        }
    }, [searchParams, navigate]);

    const handleConnect = async () => {
        try {
            const { url } = await apiFetch<{ url: string }>('/api/calendar/auth-url');
            window.location.href = url;
        } catch (err) {
            toast.error('Could not initiate connection');
        }
    };

    // Transform tasks into CalendarData
    const calendarData: CalendarData[] = useMemo(() => {
        if (!tasks) return [];
        // ... (Task logic remains same)
        const eventsByDay = new Map<string, Event[]>();

        tasks.forEach(task => {
            if (task.due_date) {
                const dateKey = new Date(task.due_date).toDateString();
                const event: Event = {
                    id: task.id,
                    name: task.title,
                    time: new Date(task.due_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    datetime: task.due_date,
                    color: task.completed ? 'green' : (new Date(task.due_date) < new Date() ? 'red' : 'blue')
                };
                const existing = eventsByDay.get(dateKey) || [];
                eventsByDay.set(dateKey, [...existing, event]);
            }
        });

        const data: CalendarData[] = [];
        eventsByDay.forEach((events, dateString) => {
            data.push({ day: new Date(dateString), events: events });
        });
        return data;
    }, [tasks]);

    const isLoading = tasksLoading || isConnecting;

    return (
        <div className="h-[calc(100vh-2rem)] flex flex-col pb-4">
            {/* Header moved inside FullScreenCalendar for cleaner UI */}

            {isLoading ? (
                <div className="flex justify-center py-20">
                    <Loader text="CARREGANDO AGENDA..." />
                </div>
            ) : (
                <div className="flex-1 overflow-hidden">
                    <FullScreenCalendar
                        data={calendarData}
                        onAddEvent={() => setIsCreateOpen(true)}
                        onEventClick={(event) => {
                            const task = tasks?.find(t => t.id === event.id);
                            if (task) {
                                updateTask.mutate({
                                    id: task.id,
                                    updates: { completed: !task.completed }
                                });
                            }
                        }}
                    // We can pass a search handler if we want to filter at page level,
                    // but FullScreenCalendar handles basic filtering internally now.
                    />
                </div>
            )}

            <CreateTaskDialog
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                onSubmit={createTask.mutate}
            />
        </div>
    );
}
