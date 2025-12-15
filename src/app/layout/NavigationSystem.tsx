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
        <motion.div
            {...slideProps}
            className="fixed left-1/2 -translate-x-1/2 z-40 md:hidden w-max max-w-[95vw]"
            style={{
                ...(slideProps.style || {}),
                bottom: 'calc(2rem + env(safe-area-inset-bottom))'
            }}
        >
            <Dock className="bg-black/40 border-white/5 shadow-2xl backdrop-blur-xl px-4 py-3 gap-3">
                {mobileNav.map((item) => (
                    <DockIcon key={item.path} href={item.path}>
                        <item.icon className="size-6 text-zinc-300" />
                    </DockIcon>
                ))}
            </Dock>
        </motion.div>
    );
}
