import { useRegisterSW } from 'virtual:pwa-register/react'
import { useEffect } from 'react'
import { toast } from 'sonner'
import { logger } from '@/shared/lib/logger'

export function PWAManager() {
    const {
        needRefresh: [needRefresh, setNeedRefresh],
        updateServiceWorker,
    } = useRegisterSW({
        onRegistered(r: ServiceWorkerRegistration | undefined) {
            void r
            logger.log('Service worker registered')
        },
        onRegisterError(error: Error) {
            void error
            logger.error('Service worker registration failed')
        },
    })

    useEffect(() => {
        if (needRefresh) {
            toast('New content available, click on reload button to update.', {
                duration: Infinity,
                action: {
                    label: 'Reload',
                    onClick: () => {
                        updateServiceWorker(true)
                        setNeedRefresh(false)
                    },
                },
            })
        }
    }, [needRefresh, updateServiceWorker, setNeedRefresh])

    return null
}
