/* ==========================================================================
   Hora Marcada — service worker
   Guarda o app shell em cache para funcionar offline após a primeira visita.
   ========================================================================== */
const CACHE = 'hora-marcada-v6';
const ASSETS = [
  './',
  'index.html',
  'css/styles.css',
  'js/utils.js',
  'js/seed.js',
  'js/themes.js',
  'js/i18n.js',
  'js/store.js',
  'js/ui.js',
  'js/icons.js',
  'js/install.js',
  'js/manual.js',
  'js/modals.js',
  'js/views/dashboard.js',
  'js/views/agenda.js',
  'js/views/waitlist.js',
  'js/views/clients.js',
  'js/views/services.js',
  'js/views/team.js',
  'js/views/finance.js',
  'js/views/reminders.js',
  'js/views/settings.js',
  'js/onboarding.js',
  'js/app.js',
  'manifest.webmanifest',
  'assets/icons/icon-192.png',
  'assets/icons/icon-512.png',
  'assets/icons/icon-maskable-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // Navegação: rede primeiro, cache como reserva (funciona offline).
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then(res => {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
          return res;
        })
        .catch(() => caches.match(req).then(hit => hit || caches.match('index.html')))
    );
    return;
  }

  // Demais arquivos: cache primeiro, atualizando em segundo plano.
  event.respondWith(
    caches.match(req).then(hit => {
      const network = fetch(req).then(res => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
        }
        return res;
      }).catch(() => hit);
      return hit || network;
    })
  );
});
