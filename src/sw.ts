import { cleanupOutdatedCaches, precacheAndRoute } from "workbox-precaching";
import { NavigationRoute, registerRoute, Route } from "workbox-routing";
import { CacheFirst, NetworkFirst } from "workbox-strategies";

declare let self: ServiceWorkerGlobalScope;

cleanupOutdatedCaches();

precacheAndRoute(self.__WB_MANIFEST);

self.skipWaiting();

// cache images 
const imageRoute = new Route(
  ({ request, sameOrigin }) => {
    return sameOrigin && request.destination === "image";
  },
  new CacheFirst({
    cacheName: "images",
  })
);
registerRoute(imageRoute);

// cache navigations
const navigationRoute = new NavigationRoute(
  new NetworkFirst({
    cacheName: "navigation",
    networkTimeoutSeconds: 5,
  })
);
registerRoute(navigationRoute)