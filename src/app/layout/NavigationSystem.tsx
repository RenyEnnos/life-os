import { useMediaQuery } from '@/shared/hooks/use-media-query';
import { Sidebar } from './Sidebar';
import { Dock, DockIcon } from '@/shared/ui/premium/Dock';
import {
    LayoutDashboard, CheckSquare, Book, Settings,
    PlusCircle, DollarSign, GraduationCap, FolderKanban, ListTodo
} from 'lucide-react';

export function NavigationSystem() {
    const isDesktop = useMediaQuery("(min-width: 768px)");

    if (isDesktop) {
        return <Sidebar className="sticky top-0 h-screen border-r border-white/10" />;
    }

    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 md:hidden w-max max-w-[95vw]">
            <Dock className="bg-black/40 border-white/5 shadow-2xl backdrop-blur-xl px-4 py-3 gap-3">
                <DockIcon href="/" onClick={() => { }}><LayoutDashboard className="size-6 text-zinc-300" /></DockIcon>
                <DockIcon href="/tasks" onClick={() => { }}><ListTodo className="size-6 text-zinc-300" /></DockIcon>
                <DockIcon href="/habits" onClick={() => { }}><CheckSquare className="size-6 text-zinc-300" /></DockIcon>
                <DockIcon href="/finances" onClick={() => { }}><DollarSign className="size-6 text-zinc-300" /></DockIcon>
                <DockIcon onClick={() => { }} className="bg-white/10 border-white/20"><PlusCircle className="size-8 text-zinc-100" /></DockIcon>
                <DockIcon href="/university" onClick={() => { }}><GraduationCap className="size-6 text-zinc-300" /></DockIcon>
                <DockIcon href="/projects" onClick={() => { }}><FolderKanban className="size-6 text-zinc-300" /></DockIcon>
                <DockIcon href="/journal" onClick={() => { }}><Book className="size-6 text-zinc-300" /></DockIcon>
                <DockIcon href="/settings" onClick={() => { }}><Settings className="size-6 text-zinc-300" /></DockIcon>
            </Dock>
        </div>
    );
}
