const Cache_Name = 'v1';
const Cache_Assets = ['index.html', 'about.html', 'css/style.css', 'js/main.js'];

const self = this;

// Call Install Event
self.addEventListener('install', (e) => {
    console.log('Service Worker: Installed');

    e.waitUntil(
        caches
            .open(Cache_Name)
            .then((cache) => {
                console.log('Service Worker: Caching Files');
                return cache.addAll(Cache_Assets);
            })
            // .then(() => self.skipWaiting())
    );
});

self.addEventListener('fetch', (e) => {
    console.log('Service Worker: Fetching');
    e.respondWith(
        fetch(e.request)
            .then((res) => {
                return fetch(e.request)
                    .catch(() => caches.match('offline.html'));
            })
    );
});

// Call Activate Event
self.addEventListener('activate', (e) => {
    console.log('Service Worker: Activated');
    const cacheWhitelist = [];
    cacheWhitelist.push(Cache_Name);
    // Remove unwanted caches
    e.waitUntil(
        caches.keys().then((cacheNames) => Promise.all(
                cacheNames.map((cacheName) => {
                        if(!cacheWhitelist.includes(cacheName)) {
                        console.log('Service Worker: Clearing Old Cache');
                        return caches.delete(cacheName);
                    }
                })
            )
        )
    );
});


