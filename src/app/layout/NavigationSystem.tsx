import { motion } from 'framer-motion';
import { useMediaQuery } from '@/shared/hooks/use-media-query';
import { Sidebar } from './Sidebar';
import { Dock, DockIcon } from '@/shared/ui/premium/Dock';
import { mobileNav } from './navItems';

type NavigationSystemProps = {
    isSanctuaryActive?: boolean;
};

export function NavigationSystem({ isSanctuaryActive = false }: NavigationSystemProps) {
    const isDesktop = useMediaQuery("(min-width: 768px)");

    const slideProps = {
        animate: { x: isSanctuaryActive ? '-100%' : '0%' },
        transition: { ease: 'easeInOut' as const, duration: 0.3 },
        style: { transformStyle: 'preserve-3d' as const }
    };

    if (isDesktop) {
        return (
            <motion.div {...slideProps}>
                <Sidebar className="sticky top-0 h-screen border-r border-white/10" />
            </motion.div>
        );
    }

    return (
        <div className="fixed inset-x-0 z-40 md:hidden flex justify-center pointer-events-none" style={{ bottom: 'calc(1.5rem + env(safe-area-inset-bottom))' }}>
            <motion.div
                {...slideProps}
                className="w-auto max-w-[92vw] pointer-events-auto"
            >
                <Dock className="bg-black/40 border-white/5 shadow-2xl backdrop-blur-xl px-4 py-3 gap-3 overflow-x-auto hide-scrollbar max-w-full justify-center">
                    {mobileNav.map((item) => (
                        <DockIcon key={item.path} href={item.path}>
                            <item.icon className="size-6 text-zinc-300" />
                        </DockIcon>
                    ))}
                </Dock>
            </motion.div>
        </div>
    );
}
