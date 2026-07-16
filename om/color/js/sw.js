// sw.js
const CACHE_NAME = "font-picker-assets";

self.addEventListener("install", (event) => {
  // 새로운 서비스 워커가 발견되면 대기하지 않고 즉시 활성화
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  // 제어권을 즉시 획득하여 첫 로드 시에도 캐싱 탐지 가능하게 처리
  event.waitUntil(self.clients.claim());
});

// 가상 API 경로 (/api/fonts/...) 요청 발생 시 캐시 저장소에서 직접 꺼내 반환
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  if (url.pathname.startsWith("/api/")) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const matchedResponse = await cache.match(event.request);
        if (matchedResponse) {
          return matchedResponse;
        }
        // 캐시에 없는 가상 경로 요청 시 404 처리
        return new Response("Not Found", { status: 404 });
      })
    );
  }
});
