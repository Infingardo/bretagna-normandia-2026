const CACHE = "bretagna-2026-v2";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icon-180.png",
  "./icon-192.png",
  "./icon-512.png",
  "./img/day-1.jpg",
  "./img/day-2.jpg",
  "./img/day-3.jpg",
  "./img/day-4.jpg",
  "./img/day-5.jpg",
  "./img/day-6.jpg",
  "./img/day-7.jpg",
  "./img/day-8.jpg",
  "./img/day-9.jpg",
  "./img/day-10.jpg",
  "./img/day-11.jpg",
  "./img/day-12.jpg",
  "./img/day-13.jpg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  // Pagina: prima la rete (per ricevere aggiornamenti), cache se offline.
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put("./index.html", copy));
          return response;
        })
        .catch(() => caches.match("./index.html"))
    );
    return;
  }

  // Asset: prima la cache, rete come riempimento.
  event.respondWith(
    caches.match(event.request).then((hit) =>
      hit || fetch(event.request).then((response) => {
        const copy = response.clone();
        caches.open(CACHE).then((cache) => cache.put(event.request, copy));
        return response;
      })
    )
  );
});
