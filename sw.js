/* Lyceon – Service Worker */
const CACHE = 'lyceon-v2';
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './i18n.js',
  './app.js',
  './supabase.js',
  './pages/registry.js',
  './pages/dashboard.page.js',
  './pages/courses.page.js',
  './manifest.json',
  './assets/icon.svg',
  './assets/lyceon-icon.svg',
  './assets/icon-192.png',
  './assets/icon-512.png',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).then(res => {
    const clone = res.clone();
    caches.open(CACHE).then(c => c.put(e.request, clone));
    return res;
  })));
});
