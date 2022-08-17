export const registerServiceWorker =
    async (): Promise<ServiceWorkerRegistration> => {
        if ('serviceWorker' in navigator) {
            try {
                const register = await navigator.serviceWorker.register(
                    './sw.js'
                )
                console.log('Service worker successfully registered.')
                return register
            } catch (err) {
                console.error('Unable to register service worker.', err)
                return null
            }
        }
    }
