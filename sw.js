// Weekflow moved to /deepweek/. Installed copies of the old app keep a service
// worker at /weekflow/ that serves a cached copy forever. When it checks for an
// update it gets this file instead, which retires it and sends open windows to
// the new address.
const NEW_HOME = 'https://briakgodfrey.github.io/deepweek/';

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', event => {
    event.waitUntil((async () => {
        // Caches are shared with the new app on this origin, so only remove
        // files cached for the old /weekflow/ path, never whole caches.
        const scope = new URL(self.registration.scope).pathname;
        for (const name of await caches.keys()) {
            if (!name.startsWith('weekflow-') && !name.startsWith('deepweek-')) continue;
            const cache = await caches.open(name);
            for (const request of await cache.keys()) {
                if (new URL(request.url).pathname.startsWith(scope)) await cache.delete(request);
            }
            if ((await cache.keys()).length === 0) await caches.delete(name);
        }

        await self.clients.claim();
        const windows = await self.clients.matchAll({ type: 'window' });
        await self.registration.unregister();
        windows.forEach(client => client.navigate(NEW_HOME).catch(() => {}));
    })());
});
