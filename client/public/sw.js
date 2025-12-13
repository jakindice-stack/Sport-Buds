const CACHE_NAME = 'sport-buds-v1'
const ASSETS = ['/', '/manifest.json', '/icons/icon-192.png', '/icons/icon-512.png']

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)))
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  )
})

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached
      return fetch(event.request)
        .then((response) => {
          const cloned = response.clone()
          caches.open(CACHE_NAME).then((cache) => {
            if (response && response.ok) {
              cache.put(event.request, cloned)
            }
          })
          return response
        })
        .catch(() => cached || new Response('Offline', { status: 503 }))
    })
  )
})
