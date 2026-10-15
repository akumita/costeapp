/*
 * CosteApp · Service Worker (contenedor PWA)
 * Guarda en caché la pantalla de inicio y los íconos.
 * Desarrollado por AkumaNet. Todos los derechos reservados.
 * Autor: Juan Carlos Ojeda Huanca.
 */
const CACHE = 'costeapp-v1';
const ARCHIVOS = ['./', 'index.html', 'manifest.json', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/apple-touch-icon.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ARCHIVOS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(claves => Promise.all(claves.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

// Solo archivos propios: primero red, si falla usa caché. La app de Apps Script siempre va por red.
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== self.location.origin) return;
  e.respondWith(
    fetch(e.request)
      .then(r => { const copia = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copia)); return r; })
      .catch(() => caches.match(e.request, { ignoreSearch: true }).then(r => r || caches.match('index.html')))
  );
});
