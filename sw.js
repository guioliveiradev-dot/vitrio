/* ===== Vitrio – service worker =====
   Guarda os arquivos do app para funcionar offline.
   Sempre que mudar algum arquivo, aumente o número da versão abaixo. */
const VERSION = 'vitrio-v4';
const ARQUIVOS = [
  './',
  'index.html',
  'style.css',
  'script.js',
  'manifest.json',
  'assets/logo.png',
  'assets/icons/icon-192.png',
  'assets/icons/icon-512.png'
];

// Instalação: baixa e guarda os arquivos principais
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(ARQUIVOS)).then(() => self.skipWaiting()));
});

// Ativação: apaga caches de versões antigas
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((chaves) => Promise.all(chaves.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Requisições: responde do cache na hora e atualiza em segundo plano
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;

  e.respondWith(
    caches.match(req).then((guardado) => {
      const rede = fetch(req)
        .then((resp) => {
          if (resp.ok) { const copia = resp.clone(); caches.open(VERSION).then((c) => c.put(req, copia)); }
          return resp;
        })
        .catch(() => guardado || caches.match('index.html'));
      return guardado || rede;
    })
  );
});