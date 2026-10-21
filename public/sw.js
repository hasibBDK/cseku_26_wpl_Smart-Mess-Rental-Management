const CACHE_NAME = "campusnest-v2";
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET" || !event.request.url.startsWith(self.location.origin)) return;
  event.respondWith(
    fetch(event.request).catch(async () => {
      const cached = await caches.match(event.request);
      if (cached) return cached;
      if (event.request.mode === "navigate") {
        const index = await caches.match("/");
        if (index) return index;
      }
      return new Response("Offline", { status: 503, headers: { "Content-Type": "text/plain" } });
    })
  );
});
