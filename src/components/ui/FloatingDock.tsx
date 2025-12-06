import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, MotionValue } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    CheckSquare,
    Book,
    Settings,
    PlusCircle
} from 'lucide-react';
import { QuickActionModal } from './QuickActionModal';

export function FloatingDock() {
    const mouseX = useMotionValue(Infinity);
    const location = useLocation();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const items = [
        { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
        { icon: CheckSquare, label: 'Hábitos', href: '/habits' },
        { icon: PlusCircle, label: 'Novo', href: '#', special: true, onClick: () => setIsModalOpen(true) },
        { icon: Book, label: 'Diário', href: '/journal' },
        { icon: Settings, label: 'Ajustes', href: '/settings' },
    ];

    return (
        <>
            <QuickActionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
                <div
                    onMouseMove={(e: React.MouseEvent<HTMLDivElement>) => mouseX.set(e.pageX)}
                    onMouseLeave={() => mouseX.set(Infinity)}
                    className="flex h-16 items-end gap-4 rounded-2xl border border-white/10 bg-black/20 px-4 pb-3 backdrop-blur-md shadow-2xl"
                >
                    {items.map((item) => (
                        <DockIcon
                            key={item.label}
                            mouseX={mouseX}
                            item={item}
                            isActive={location.pathname === item.href}
                        />
                    ))}
                </div>
            </div>
        </>
    );
}

function DockIcon({
    mouseX,
    item,
    isActive
}: {
    mouseX: MotionValue;
    item: any;
    isActive: boolean
}) {
    const ref = useRef<HTMLDivElement>(null);

    const distance = useTransform(mouseX, (val) => {
        const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
        return val - bounds.x - bounds.width / 2;
    });

    const widthSync = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
    const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });

    const content = (
        <motion.div
            ref={ref}
            style={{ width }}
            className={cn(
                "aspect-square rounded-full flex items-center justify-center relative group transition-colors",
                isActive ? "bg-primary/20 border border-primary/50" : "bg-white/5 border border-white/10 hover:bg-white/10",
                item.special && "bg-primary text-black hover:bg-primary/90 border-none"
            )}
        >
            <item.icon className={cn(
                "w-full h-full p-2 transition-all duration-200",
                isActive ? "text-primary" : "text-gray-400 group-hover:text-white",
                item.special && "text-black"
            )} />

            {/* Tooltip */}
            <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10 backdrop-blur-sm pointer-events-none">
                {item.label}
            </span>

            {/* Active Indicator Dot */}
            {isActive && !item.special && (
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
            )}
        </motion.div>
    );

    if (item.onClick) {
        return (
            <button onClick={item.onClick} className="focus:outline-none">
                {content}
            </button>
        );
    }

    return (
        <Link to={item.href}>
            {content}
        </Link>
    );
}
