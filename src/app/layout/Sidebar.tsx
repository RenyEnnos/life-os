import { NavLink } from 'react-router-dom';
import { cn } from '@/shared/lib/cn';
import { primaryNav, secondaryNav } from './navItems';

export const Sidebar = ({ className }: { className?: string }) => {
    return (
        <div className={cn("flex flex-col items-center gap-8 py-8 w-full h-full", className)}>
            <div className="mb-4 shrink-0">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary/20 via-primary/40 to-primary/10 flex items-center justify-center border border-white/10 shadow-lg cursor-pointer hover:border-primary/50 transition-colors">
                    <span className="text-white text-sm font-bold tracking-widest">OS</span>
                </div>
            </div>

            <nav className="flex flex-col gap-4 w-full px-3 flex-1 overflow-y-auto hide-scrollbar">
                {primaryNav.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => cn(
                            "group flex items-center justify-center p-3 rounded-xl transition-all duration-300 relative border border-transparent",
                            isActive
                                ? "bg-primary/10 text-primary border-primary/30 shadow-[0_0_20px_rgba(48,140,232,0.2)]"
                                : "text-zinc-500 hover:text-white hover:bg-white/5 hover:border-white/10"
                        )}
                    >
                        {({ isActive }) => (
                            <>
                                <item.icon className={cn("h-5 w-5", isActive ? "text-primary" : "text-zinc-400 group-hover:text-white")} />

                                <span className="absolute left-full ml-4 bg-zinc-900/90 backdrop-blur border border-white/10 px-2 py-1 rounded text-[10px] uppercase tracking-wider text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                                    {item.label}
                                </span>
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            <div className="mt-auto flex flex-col gap-4 w-full px-3 shrink-0">
                {secondaryNav.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => cn(
                            "group flex items-center justify-center p-3 rounded-xl transition-all duration-300 relative border border-transparent",
                            isActive
                                ? "bg-primary/10 text-primary border-primary/30 shadow-[0_0_20px_rgba(48,140,232,0.2)]"
                                : "text-zinc-500 hover:text-white hover:bg-white/5 hover:border-white/10"
                        )}
                    >
                        <item.icon className="h-5 w-5 group-hover:text-white" />
                        <span className="absolute left-full ml-4 bg-zinc-900/90 backdrop-blur border border-white/10 px-2 py-1 rounded text-[10px] uppercase tracking-wider text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                            {item.label}
                        </span>
                    </NavLink>
                ))}

                <NavLink
                    to="/profile"
                    className="w-10 h-10 rounded-full bg-center bg-cover border border-white/10 opacity-80 hover:opacity-100 transition-opacity cursor-pointer mx-auto block"
                    style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCVPqcPWDT3hPr01e2HDirC5oJIReGS_I9VQWtVcd9Jeg7-ZvWFgDQfCv6EutPiYTzuE-re3TH5gEjialXzk5Eb8SJ3m82eLKwBuKSLDpWKr4JkJ_yftg1ioQEeRmNNBPiKJhA7IAj11REAjyt_eN6G3ka3T_PoSQNNU9d7cQ6Af9A6u-pdRHLfzCaPzGvoxAzXj6ge63w7ZFJhPW4J6cxpsTQe-UV2JJuJ124QPZ8DgIYXHP4uJji-EBFIe1WQsTDEKAGbz-RlcuI')" }}
                />
            </div>
        </div>
    );
};
