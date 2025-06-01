//asignar un nombre y versión al cache
const CACHE_NAME = 'v1_zoom',
  urlsToCache = [
    './',
    'http://ibizaglobalradio.streaming-pro.com:8024/;?type=http&nocache=14583',
    'https://fonts.googleapis.com/icon?family=Material+Icons',
    'https://cdnjs.cloudflare.com/ajax/libs/materialize/0.100.2/css/materialize.min.css',
    'https://img.icons8.com/ios-filled/50/ffffff/vinyl.png',
  'https://blogger.googleusercontent.com/img/a/AVvXsEhobSdCEj3wpR-qMr1nbwVmfqnbyo8Tzx8iMirm4BnQmfNq41VrFlBMnH_H86fzI3SSSEyBGmzJGdm1Y5Bgi0p6RDRbn3BDHB3cYLWgEBqV-txWdrfOCWf9b113fbYkoFDFfSvB0y97WZluGsJvtCQAjFP8oAn9jm2Rlgc7-wtE9ikn3OrOQXtC69IYObo=s600',
  'https://stream.zeno.fm/dfxxkhvkxs8uv?cb=12345',
  'https://img.icons8.com/ios-filled/50/ffffff/low-volume.png',
  'https://img.icons8.com/ios-filled/50/ffffff/no-audio--v1.png',
  'https://img.icons8.com/ios-filled/50/ffffff/medium-volume.png',
  'https://img.icons8.com/ios-filled/50/ffffff/high-volume.png'
    './style.css',
    'https://code.jquery.com/jquery-3.2.1.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/materialize/0.100.2/js/materialize.min.js',
    './script.js',
    './img/logo.png',
    './favicon.ico',
    './img/favicon.png'
  ]

//durante la fase de instalación, generalmente se almacena en caché los activos estáticos
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache)
          .then(() => self.skipWaiting())
      })
      .catch(err => console.log('Falló registro de cache', err))
  )
})

//una vez que se instala el SW, se activa y busca los recursos para hacer que funcione sin conexión
self.addEventListener('activate', e => {
  const cacheWhitelist = [CACHE_NAME]

  e.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            //Eliminamos lo que ya no se necesita en cache
            if (cacheWhitelist.indexOf(cacheName) === -1) {
              return caches.delete(cacheName)
            }
          })
        )
      })
      // Le indica al SW activar el cache actual
      .then(() => self.clients.claim())
  )
})

//para cuando el navegador recupera una url
self.addEventListener('fetch', e => {
  //Responder ya sea con el objeto en caché o continuar y buscar la url real
  e.respondWith(
    caches.match(e.request)
      .then(res => {
        if (res) {
          //recuperar cache
          return res
        }
        //recuperar de la petición a la url
        return fetch(e.request)
      })
  )
})
