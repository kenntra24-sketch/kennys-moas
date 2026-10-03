/* KENNY'S MOAS — Service Worker.
   Stratégie (zéro maintenance) :
   - CODE de l'appli (index.html, app.js, app.css, config) : RÉSEAU D'ABORD (revalidation, pas de cache HTTP périmé), cache en secours hors-ligne.
     → une nouvelle version publiée est utilisée dès l'ouverture suivante, sans vider le cache.
   - Fichiers lourds qui ne changent pas (PDF.js, icônes, splash) : CACHE D'ABORD.
   - Version : BUILD_ID est écrit automatiquement par le build (empreinte du code) ; plus rien à incrémenter à la main.
     Un nouveau sw.js est détecté par le navigateur, s'active seul (skipWaiting + claim) et supprime les anciens caches.
   - Les données de l'utilisateur (localStorage / IndexedDB) ne sont JAMAIS dans ces caches : une mise à jour n'y touche pas. */
const BUILD_ID = '5ea9250c56';
const CACHE = 'kennys-moas-' + BUILD_ID;
const BASE = self.registration.scope;   // dossier où vit l'appli (racine du domaine OU sous-dossier GitHub Pages)
const STATIC = ['pdf.min.mjs', 'pdf.worker.min.mjs', 'icon-192.png', 'icon-512.png', 'logo.svg', 'icon-192-maskable.png', 'icon-512-maskable.png',
  'splash/splash-640x1136.png', 'splash/splash-750x1334.png', 'splash/splash-828x1792.png', 'splash/splash-1125x2436.png', 'splash/splash-1170x2532.png',
  'splash/splash-1179x2556.png', 'splash/splash-1242x2688.png', 'splash/splash-1284x2778.png', 'splash/splash-1290x2796.png'].map((p) => new URL(p, BASE).href);
const SHELL = ['./', 'index.html', 'app.js', 'app.css', 'manifest.webmanifest', 'config.local.js'].map((p) => new URL(p, BASE).href);
const isStatic = (href) => STATIC.includes(href);

self.addEventListener('install', (e) =>
  e.waitUntil(caches.open(CACHE).then(async (c) => {
    await c.addAll(STATIC);                                               // indispensables
    await Promise.all(SHELL.map((u) => c.add(new Request(u, { cache: 'reload' })).catch(() => {})));   // code : au mieux
  }).then(() => self.skipWaiting())));

self.addEventListener('activate', (e) =>
  e.waitUntil(caches.keys()
    .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
    .then(() => self.clients.claim())));

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;           // Google APIs, polices : jamais interceptés
  if (isStatic(url.href)) {                               // cache d'abord
    e.respondWith(caches.match(req).then((hit) => hit || fetch(req).then((res) => { if (res.ok) { const cp = res.clone(); caches.open(CACHE).then((c) => c.put(req, cp)); } return res; })));
    return;
  }
  e.respondWith(                                          // réseau d'abord (code et reste)
    fetch(req, { cache: 'no-cache' }).then((res) => {
      if (res && res.ok) { const cp = res.clone(); caches.open(CACHE).then((c) => c.put(req, cp)); }
      return res;
    }).catch(() => caches.match(req).then((hit) => hit || (req.mode === 'navigate' ? caches.match(new URL('index.html', BASE).href) : Response.error())))
  );
});
