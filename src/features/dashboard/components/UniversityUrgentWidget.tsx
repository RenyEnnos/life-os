import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card';
import { Clock, BookOpen } from 'lucide-react';
import { formatDistanceToNow, addDays } from 'date-fns';
import { cn } from '@/shared/lib/cn';
import { useNavigate } from 'react-router-dom';

interface UniversityUrgentProps {
    nextDeadline?: {
        title: string;
        courseName: string;
        dueDate: string;
        daysLeft: number;
    } | null;
}

export function UniversityUrgentWidget({ nextDeadline }: UniversityUrgentProps) {
    const navigate = useNavigate();

    // Mock data if none provided (for demo/dev)
    const data = nextDeadline || {
        title: "Anatomy Final Exam",
        courseName: "Human Anatomy",
        dueDate: addDays(new Date(), 2).toISOString(),
        daysLeft: 2
    };

    return (
        <Card
            className="bg-zinc-900/50 border-zinc-800 hover:border-primary/50 transition-colors cursor-pointer"
            onClick={() => navigate('/university')}
        >
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-zinc-400 flex items-center gap-2">
                    <BookOpen size={16} className="text-blue-400" />
                    University Urgent
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-1">
                    <h3 className="text-lg font-bold text-white leading-tight">
                        {data.title}
                    </h3>
                    <p className="text-sm text-zinc-400">{data.courseName}</p>

                    <div className={cn(
                        "mt-3 flex items-center gap-2 text-xs font-bold px-2 py-1 rounded w-fit",
                        data.daysLeft <= 1 ? "bg-red-500/20 text-red-500" : "bg-yellow-500/20 text-yellow-500"
                    )}>
                        <Clock size={12} />
                        <span>Due in {formatDistanceToNow(new Date(data.dueDate))}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
