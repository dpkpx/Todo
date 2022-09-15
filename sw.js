

self.addEventListener("install", (event) => {
    event.waitUntil(

        caches
            .open("V2")
            .then(cache => {
                cache.addAll([
                    "index.html",
                    "styles.css",
                    "script.js",
                    "firebase.js",
                    "favicon.png",
                    "manifest.webmanifest",
                    "assets/title.svg",
                    "assets/bx-x.svg",
                    "assets/bx-message-square-x.svg",
                    "assets/bx-message-square-edit.svg",
                    "assets/bx-menu.svg",
                    "assets/bx-chevron-down.svg"
                ])

            })
            .then(() => {
                self.skipWaiting()
            })
    );
});

// self.addEventListener("fetch", (e) => {
//     e.respondWith(fetch(e.request).catch(() => caches.match(e.request)))
// })

const cacheFirst = async (request) => {
    const responseFromCache = await caches.match(request);
    if (responseFromCache) {
        return responseFromCache;
    }
    return fetch(request);
};

self.addEventListener("fetch", (event) => {
    event.respondWith(cacheFirst(event.request));
});