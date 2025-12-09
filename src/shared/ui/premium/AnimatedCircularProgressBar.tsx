import { cn } from '@/shared/lib/cn';

// Adapting the ProgressCircle to AnimatedCircularProgressBar
interface AnimatedCircularProgressBarProps extends React.ComponentProps<'div'> {
    value?: number;
    max?: number;
    min?: number;
    gaugePrimaryColor?: string;
    gaugeSecondaryColor?: string;
    className?: string;
}

export function AnimatedCircularProgressBar({
    max = 100,
    min = 0,
    value = 0,
    gaugePrimaryColor = "#22c55e", // Green-500 equivalent
    gaugeSecondaryColor = "#3f3f46", // Zinc-700 equivalent
    className,
    ...props
}: AnimatedCircularProgressBarProps) {
    const circumference = 2 * Math.PI * 45; // radius 45
    const percent = value / max;
    const strokeDasharray = `${circumference} ${circumference}`;
    const strokeDashoffset = circumference - percent * circumference;

    return (
        <div
            className={cn("relative size-40 text-2xl font-semibold", className)}
            style={
                {
                    "--circle-progress": `${percent * 100}%`,
                    "--circle-color": gaugePrimaryColor,
                } as React.CSSProperties
            }
            {...props}
        >
            <svg
                className="size-full rotate-90 transform"
                viewBox="0 0 100 100"
            >
                <circle
                    className="text-muted-foreground/20"
                    strokeWidth="10"
                    stroke="currentColor"
                    fill="transparent"
                    r="45"
                    cx="50"
                    cy="50"
                    style={{ stroke: gaugeSecondaryColor }}
                />
                <circle
                    className="text-primary transition-all duration-1000 ease-in-out"
                    strokeWidth="10"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="45"
                    cx="50"
                    cy="50"
                    style={{
                        stroke: gaugePrimaryColor,
                        transformOrigin: "center",
                        transform: "rotate(-90deg)" // Reset rotation for drawing start
                    }}
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-current">
                {Math.round(value)}%
            </div>
        </div>
    );
}
