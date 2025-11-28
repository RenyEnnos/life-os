import React from 'react';

export const Card: React.FC<{ title?: string; children: React.ReactNode; className?: string; action?: React.ReactNode }> = ({ title, children, className = "", action }) => (
    <div className={`bg-[#142e14]/40 border border-[#224922] p-6 rounded-sm backdrop-blur-sm ${className}`}>
        {(title || action) && (
            <div className="flex justify-between items-start mb-4">
                {title && <h2 className="text-[#E0E0E0] text-[22px] font-bold leading-tight tracking-tight font-display">{title}</h2>}
                {action}
            </div>
        )}
        {children}
    </div>
);

export const Button: React.FC<{ 
    children: React.ReactNode; 
    variant?: 'primary' | 'secondary' | 'ghost'; 
    icon?: string; 
    onClick?: () => void 
}> = ({ children, variant = 'primary', icon, onClick }) => {
    const baseClass = "flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold tracking-wide rounded-sm transition-all duration-200 border";
    
    const variants = {
        primary: "bg-primary text-black border-primary hover:bg-primary/90 hover:shadow-neon",
        secondary: "bg-[#224922] text-white border-[#224922] hover:bg-[#316831]",
        ghost: "bg-transparent text-primary border-primary/50 hover:bg-primary/10 hover:border-primary",
    };

    return (
        <button className={`${baseClass} ${variants[variant]}`} onClick={onClick}>
            {icon && <span className="material-symbols-outlined text-lg">{icon}</span>}
            {children}
        </button>
    );
};

export const Badge: React.FC<{ children: React.ReactNode; color: 'blue' | 'green' | 'red' | 'purple' | 'orange' | 'gray' }> = ({ children, color }) => {
    const colors = {
        blue: "bg-blue-500/20 text-blue-300 border-blue-500/30",
        green: "bg-green-500/20 text-green-300 border-green-500/30",
        red: "bg-red-500/20 text-red-300 border-red-500/30",
        purple: "bg-purple-500/20 text-purple-300 border-purple-500/30",
        orange: "bg-orange-500/20 text-orange-300 border-orange-500/30",
        gray: "bg-gray-500/20 text-gray-300 border-gray-500/30",
    };

    return (
        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-sm border ${colors[color]}`}>
            {children}
        </span>
    );
};

export const ProgressBar: React.FC<{ progress: number; color?: string; label?: string }> = ({ progress, color = "bg-primary", label }) => (
    <div className="flex flex-col gap-1 w-full">
        {label && <div className="flex justify-between text-xs text-white/60 font-mono"><span>{label}</span><span>{progress}%</span></div>}
        <div className="w-full bg-black/20 h-2 rounded-sm overflow-hidden">
            <div className={`h-full ${color}`} style={{ width: `${progress}%` }}></div>
        </div>
    </div>
);
