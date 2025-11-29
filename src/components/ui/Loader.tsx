import { cn } from '@/lib/utils';

interface LoaderProps {
    text?: string;
    className?: string;
}

export function Loader({ text = "LOADING SYSTEM...", className }: LoaderProps) {
    return (
        <div className={cn("flex flex-col items-center justify-center p-8 space-y-4", className)}>
            <div className="relative w-16 h-16">
                <div className="absolute inset-0 border-4 border-primary/20 rounded-full animate-pulse"></div>
                <div className="absolute inset-0 border-t-4 border-primary rounded-full animate-spin"></div>
                <div className="absolute inset-4 bg-primary/10 rounded-full animate-pulse"></div>
            </div>
            <div className="font-mono text-primary font-bold tracking-widest animate-pulse text-sm">
                {text}
                <span className="inline-block w-1 h-4 ml-1 bg-primary animate-bounce"></span>
            </div>
        </div>
    );
}
