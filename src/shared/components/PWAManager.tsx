import { useRegisterSW } from 'virtual:pwa-register/react'
import { useEffect } from 'react'
import { toast } from 'react-hot-toast'

export function PWAManager() {
    const {
        needRefresh: [needRefresh, setNeedRefresh],
        updateServiceWorker,
    } = useRegisterSW({
        onRegistered(r) {
            console.log('SW Registered: ' + r)
        },
        onRegisterError(error) {
            console.log('SW registration error', error)
        },
    })

    useEffect(() => {
        if (needRefresh) {
            toast((t) => (
                <div className="flex flex-col gap-2">
                    <span>New content available, click on reload button to update.</span>
                    <button
                        className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
                        onClick={() => {
                            updateServiceWorker(true)
                            setNeedRefresh(false)
                            toast.dismiss(t.id)
                        }}
                    >
                        Reload
                    </button>
                </div>
            ), {
                duration: Infinity,
                position: 'bottom-right',
            })
        }
    }, [needRefresh, updateServiceWorker, setNeedRefresh])

    return null
}
