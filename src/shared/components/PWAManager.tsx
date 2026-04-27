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
            logger.log('SW Registered: ' + r)
        },
        onRegisterError(error: Error) {
            logger.log('SW registration error', error)
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
