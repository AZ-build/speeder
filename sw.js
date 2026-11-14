// Speeder service worker: lets the game load offline once it has been opened.
// When you change the game, bump CACHE so phones pick up the new files.
const CACHE = 'speeder-v0.12.6';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png',
  './audio/music.mp3',
  './audio/engine.wav',
  './audio/shoot1.mp3',
  './audio/shoot2.mp3',
  './audio/shoot3.mp3',
  './audio/hit.mp3',
  './audio/pop.mp3',
  './audio/boom1.mp3',
  './audio/boom2.mp3',
  './audio/wreck.mp3',
  './audio/hurt.mp3',
  './audio/shield.mp3',
  './audio/zap.mp3',
  './audio/jump.mp3',
  './audio/land.mp3',
  './audio/power.mp3',
  './audio/swarm.mp3',
  './audio/launch.mp3',
  './audio/pass.mp3',
  './audio/fanfare.mp3',
  './audio/ui.mp3'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // The page itself: try the network first so updates show up, fall back to the cached copy offline.
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put('./index.html', copy));
          return res;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  // Leaderboard traffic (Firestore) always goes straight to the network.
  if (url.hostname === 'firestore.googleapis.com') return;

  // Google Fonts and the Firebase library files: use the cached copy, refresh it in the background.
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com' ||
      (url.hostname === 'www.gstatic.com' && url.pathname.startsWith('/firebasejs/'))) {
    event.respondWith(
      caches.open(CACHE).then((c) =>
        c.match(req).then((hit) => {
          const net = fetch(req).then((res) => { c.put(req, res.clone()); return res; }).catch(() => hit);
          return hit || net;
        })
      )
    );
    return;
  }

  // Everything else from our own site: cache first.
  if (url.origin === self.location.origin) {
    event.respondWith(caches.match(req).then((hit) => hit || fetch(req)));
  }
});
