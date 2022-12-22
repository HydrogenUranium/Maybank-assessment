const cacheName = 'discoverDhl-20221220-1';

//Assets to cache
const assetsToCache = [
  '/discover/en-global/offline',
  '/discover/en-global/saved-articles',
  '/etc.clientlibs/dhl/clientlibs/discover.css',
  '/etc.clientlibs/dhl/clientlibs/discover.js',
  '/etc.clientlibs/dhl/clientlibs/discover/resources/img/checkboxcheck.svg',
  '/etc.clientlibs/dhl/clientlibs/discover/resources/img/externallinkicon.svg',
  '/etc.clientlibs/dhl/clientlibs/discover/resources/img/formerroricon.svg',
  '/etc.clientlibs/dhl/clientlibs/discover/resources/img/formsuccessicon.svg',
  '/etc.clientlibs/dhl/clientlibs/discover/resources/img/linkarrow.png',
  '/etc.clientlibs/dhl/clientlibs/discover/resources/img/linkarrowwhite.svg',
  '/etc.clientlibs/dhl/clientlibs/discover/resources/img/linkarrowyellow.svg',
  '/etc.clientlibs/dhl/clientlibs/discover/resources/img/logo.svg',
  '/etc.clientlibs/dhl/clientlibs/discover/resources/img/new-logo.svg',
  '/etc.clientlibs/dhl/clientlibs/discover/resources/img/searchicon.svg',
  '/etc.clientlibs/dhl/clientlibs/discover/resources/img/socialiconsfacebook.svg',
  '/etc.clientlibs/dhl/clientlibs/discover/resources/img/socialiconsinstagram.svg',
  '/etc.clientlibs/dhl/clientlibs/discover/resources/img/socialiconslinkedin.svg',
  '/etc.clientlibs/dhl/clientlibs/discover/resources/img/socialiconstwitter.svg',
  '/etc.clientlibs/dhl/clientlibs/discover/resources/img/socialiconsyoutube.svg',
  '/etc.clientlibs/dhl/clientlibs/discover/resources/img/socialiconsemail.svg',
  '/etc.clientlibs/dhl/clientlibs/discover/resources/img/redcloseicon.svg',
  '/etc.clientlibs/dhl/clientlibs/discover/resources/img/backtotoparrow.svg'
];

self.addEventListener('install', (event) => {
  // waitUntil() ensures that the Service Worker will not
  // install until the code inside has successfully occurred
  event.waitUntil(
    // Create cache with the name supplied above and
    // return a promise for it
    caches.open(cacheName).then((cache) => {
      // Important to `return` the promise here to have `skipWaiting()`
      // fire after the cache has been updated.
      return cache.addAll(assetsToCache);
    }).then(() => {
      // Delete old caches
      return caches.keys().then((cacheNames) => {
        cacheNames.forEach((thisCacheName) => {
          // If the cache name is the sw cache and is not the current one
          if (thisCacheName.indexOf('discoverDhl-') > -1 && thisCacheName != cacheName) {
            // Delete the cache
            caches.delete(thisCacheName);
          }
        });
      });
    }).then(() => {
      // `skipWaiting()` forces the waiting ServiceWorker to become the
      // active ServiceWorker, triggering the `onactivate` event.
      // Together with `Clients.claim()` this allows a worker to take effect
      // immediately in the client(s).
      return self.skipWaiting();
    })
  );
});

// Activate event
// Be sure to call self.clients.claim()
self.addEventListener('activate', (event) => {
  // `claim()` sets this worker as the active worker for all clients that
  // match the workers scope and triggers an `oncontrollerchange` event for
  // the clients.
  return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  // Get current path
  let requestUrl = new URL(event.request.url);

  // Save all resources on origin path only
  if (requestUrl.origin === location.origin) {
    event.respondWith(
      // Go to the network to ask for that resource
      fetch(event.request).then((networkResponse) => {
        // Respond with it
        return networkResponse;
      }).catch(() => {
        // If no internet connection, try to match request
        // to some of our cached resources
        return caches.match(event.request).then((response) => {
          return response || caches.match('/discover/en-global/offline');
        });
      })
    );
  }
});
