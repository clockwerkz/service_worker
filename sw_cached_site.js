const cacheName = 'v2';


//Call install event
self.addEventListener('install', (e)=> {
    console.log('Service worker: Installed');
});

//Call Activate event
self.addEventListener('activate', (e)=> {
    console.log('Service worker: Activated');
    //Remove unwanted caches
    e.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cache => {
                        if (cache !== cacheName) {
                            console.log('Service worker: Clearing Old Cache');
                            return caches.delete(cache);
                        }
                    })
                )
            })
    );
});

//Call fetch event
self.addEventListener('fetch', e => {
    console.log('Service Worker: Fetching');
    e.respondWith(
        fetch(e.request)
            .then(res => {
                //Make Copy/Clone of response
                const resClone = res.clone();
                //Open cache
                caches.open(cacheName)
                    .then(cache => {
                        //Add response to cache
                        cache.put(e.request, resClone);
                    });
                return res;
            }).catch(err => caches.match(e.request)).then(res => res)
    )
});