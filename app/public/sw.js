const CACHE_NAME = 'price-checker-cache-v1';
const urlsToCache = [
    '/app/',
    '/app/index.html',
    '/app/main.js',      // замени на свои файлы
    '/styles.css',   // замени на свои файлы
    // ... другие ресурсы для кэширования
];

// Установка SW и кэширование файлов
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
            .then(() => self.skipWaiting())
    );
});

// Активация SW и удаление старых кэшей
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
            )
        ).then(() => self.clients.claim())
    );
});

// Перехват запросов, отдаём из кэша или сети
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => response || fetch(event.request))
    );
});
