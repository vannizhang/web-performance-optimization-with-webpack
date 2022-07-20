const cacheName = 'v1';

self.addEventListener('install', (evt)=>{
    console.log(`service worker installed`);
})

self.addEventListener('activate', (evt)=>{
    console.log(`service worker activated`)
    // remove old caches

    evt.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.map(key=>{
                    if(key !== cacheName){
                        return caches.delete(keys)
                    }
                })
            )
        })
    )
})

self.addEventListener('fetch', (event)=>{
    
    // Let the browser do its default thing
    // for non-GET requests.
    if (event.request.method != "GET") {
        return;
    };

    // Check if this is a request for a font file
    if (event.request.destination === 'font') {

        // console.log('service worker fetching', event.request)
        event.respondWith(caches.open(cacheName).then((cache) => {
            // Go to the cache first
            return cache.match(event.request.url).then((cachedResponse) => {
                // Return a cached response if we have one
                if (cachedResponse) {
                    return cachedResponse;
                }

                // Otherwise, hit the network
                return fetch(event.request).then((fetchedResponse) => {
                    // Add the network response to the cache for later visits
                    cache.put(event.request, fetchedResponse.clone());

                    // Return the network response
                    return fetchedResponse;
                });
            });
        }));

    } else {
        return;
    }
})