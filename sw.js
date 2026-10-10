const SHELL_CACHE = 'tb-shell-v1';
const FONT_CACHE = 'tb-fonts';
const SHELL = ['./', './index.html', './manifest.webmanifest', './icon-180.png', './icon-192.png', './icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(SHELL_CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k.startsWith('tb-') && k !== SHELL_CACHE && k !== FONT_CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin === location.origin) {
    // The page itself: network first so updates arrive, cached copy when offline.
    if (req.mode === 'navigate' || url.pathname.endsWith('/') || url.pathname.endsWith('/index.html')) {
      e.respondWith(fetch(req).then(res => {
        if (res.ok) { const copy = res.clone(); caches.open(SHELL_CACHE).then(c => c.put('./index.html', copy)); }
        return res;
      }).catch(() => caches.match('./index.html')));
      return;
    }
    e.respondWith(caches.match(req).then(hit => hit || fetch(req)));
    return;
  }
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    e.respondWith(caches.open(FONT_CACHE).then(c => c.match(req).then(hit => hit || fetch(req).then(res => {
      if (res.ok || res.type === 'opaque') c.put(req, res.clone());
      return res;
    }))));
  }
  // api.github.com is never cached here; the app keeps its own last-synced copy.
});
