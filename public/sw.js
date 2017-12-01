const appCacheName = 'Compass_appShell_cache_V1'
console.log('[SERVICEWORKER, STARTUP] this = ', this)
this.addEventListener('install', event => {
  event.waitUntil(
    caches.open(appCacheName).then(cache => {
      return cache.addAll([
        '/css/main.css',
        '/resources/Compass.png',
        '/resources/needle.svg',
        '/resources/404Error.png',
        '/resources/noConnection.png',
        '/favicon.ico',
        '/script/main.js',
        'index.html'
      ])
    })
  )
})

this.addEventListener('fetch', event => {
  console.log('event.request = ', event.request)
  event.respondWith(
    caches.match(event.request).then(res => {
      return res || fetch(event.request).then(response => {
        if (response.status === 404) {
          console.log('404.........')
          return fetch('/resources/404Error.png')
        }
        return caches.open(appCacheName)
          .then(cache => {
            cache.put(event.request.url, response.clone())
            return response
          })
      })
      .catch(err => {
        console.log('error while fetching...')
        fetch('/resources/noConnection.png')
      })
    })
  )
})

this.addEventListener('update', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== appCacheName) return caches.delete(cacheName)
        })
      )
    })
  )
})
