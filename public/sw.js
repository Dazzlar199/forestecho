// 숲울림 Service Worker
// 버전: 1.0.0

const CACHE_NAME = 'forestecho-v2';
const OFFLINE_URL = '/offline';

// 캐시할 주요 파일들 (오프라인에서도 작동하게)
const STATIC_CACHE_URLS = [
  '/',
  OFFLINE_URL,
  '/manifest.json',
];

// 설치 이벤트: Service Worker가 처음 설치될 때
self.addEventListener('install', (event) => {
  console.log('[Service Worker] 설치 중...');

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] 주요 파일 캐싱 중...');
      return cache.addAll(STATIC_CACHE_URLS);
    })
  );

  // 새 Service Worker를 즉시 활성화
  self.skipWaiting();
});

// 활성화 이벤트: 오래된 캐시 삭제
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] 활성화 중...');

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] 오래된 캐시 삭제:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );

  // 모든 클라이언트에서 즉시 제어권 가져오기
  self.clients.claim();
});

// Fetch 이벤트: 네트워크 요청 가로채기
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return;
  }

  const { request } = event;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match(request).then((resp) => resp || caches.match(OFFLINE_URL)))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(request)
        .then((response) => {
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });

          return response;
        })
        .catch(() => caches.match(OFFLINE_URL));
    })
  );
});

// 푸시 알림 이벤트 (나중을 위해 준비)
self.addEventListener('push', (event) => {
  console.log('[Service Worker] 푸시 알림 수신:', event);

  const options = {
    body: event.data ? event.data.text() : '새로운 알림이 있습니다.',
    icon: '/icon-192x192.png',
    badge: '/icon-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'open',
        title: '열기',
      },
      {
        action: 'close',
        title: '닫기',
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('숲울림', options)
  );
});

// 알림 클릭 이벤트
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] 알림 클릭:', event.action);

  event.notification.close();

  if (event.action === 'open') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});
