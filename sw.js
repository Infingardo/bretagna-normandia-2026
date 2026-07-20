const CACHE = "bretagna-2026-v4";
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
  "./img/day-13.jpg",
  "./img/food/agneau-pre-sale.jpg",
  "./img/food/andouille-guemene.jpg",
  "./img/food/andouille-vire.jpg",
  "./img/food/calvados.jpg",
  "./img/food/camembert.jpg",
  "./img/food/caramel-beurre-sale.jpg",
  "./img/food/cidre.jpg",
  "./img/food/coco-paimpol.jpg",
  "./img/food/coquille-saint-jacques.jpg",
  "./img/food/cotriade.jpg",
  "./img/food/crepe.jpg",
  "./img/food/far-breton.jpg",
  "./img/food/galette-sarrasin.jpg",
  "./img/food/galette-saucisse.jpg",
  "./img/food/gateau-breton.jpg",
  "./img/food/homard-bleu.jpg",
  "./img/food/huitres-cancale.jpg",
  "./img/food/kig-ha-farz.jpg",
  "./img/food/kouign-amann.jpg",
  "./img/food/livarot.jpg",
  "./img/food/moules-bouchot.jpg",
  "./img/food/oignon-roscoff.jpg",
  "./img/food/palet-breton.jpg",
  "./img/food/plateau-fruits-de-mer.jpg",
  "./img/food/pont-leveque.jpg",
  "./img/food/tarte-normande.jpg",
  "./img/food/tripes-caen.jpg",
  "./img/food/trou-normand.jpg"
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

  // Manifest: prima la rete (l'identita della PWA deve essere sempre fresca), cache se offline.
  if (event.request.url.endsWith("manifest.webmanifest")) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(event.request, copy));
          return response;
        })
        .catch(() => caches.match(event.request))
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
