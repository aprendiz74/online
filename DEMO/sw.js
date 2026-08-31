const CACHE_NAME = 'v1_zoom_v2';
const urlsToCache = [
  './',
  './style.css',
  './script.js',
  './img/logo.png',
  './favicon.ico',
  './img/favicon.png',
  'https://fonts.googleapis.com/icon?family=Material+Icons',
  'https://cdnjs.cloudflare.com/ajax/libs/materialize/0.100.2/css/materialize.min.css',
  'https://code.jquery.com/jquery-3.2.1.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/materialize/0.100.2/js/materialize.min.js'
];

// ===== Instalación: cache solo archivos esenciales =====
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
      .catch(err => console.log('Falló registro de cache', err))
  );
});

// ===== Activación: limpiar caches antiguos =====
self.addEventListener('activate', e => {
  const cacheWhitelist = [CACHE_NAME];
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.map(key => {
          if (!cacheWhitelist.includes(key)) return caches.delete(key);
        })
      ))
      .then(() => self.clients.claim())
  );
});

// ===== Fetch: archivos estáticos por cache, el resto directo a internet =====
self.addEventListener('fetch', e => {
  const requestUrl = new URL(e.request.url);

  // Solo cacheamos los archivos esenciales de la PWA
  if (urlsToCache.includes(requestUrl.pathname) || urlsToCache.includes(e.request.url)) {
    e.respondWith(
      caches.match(e.request)
        .then(res => res || fetch(e.request))
    );
  } else {
    // TV en vivo, radio streaming y videos: siempre online
    e.respondWith(fetch(e.request));
  }
});
