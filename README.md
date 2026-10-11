# Weekflow → Deepweek

Weekflow was renamed **Deepweek** and moved to **https://briakgodfrey.github.io/deepweek/** ([source](https://github.com/briakgodfrey/deepweek)).

This repo only keeps the old address working:

- `index.html` and `404.html` send anyone visiting `briakgodfrey.github.io/weekflow/...` to the new address.
- `sw.js` replaces the old app's offline service worker, so installed copies of Weekflow stop serving a frozen offline version and open Deepweek instead.

Planner data is kept by the browser per site (`briakgodfrey.github.io`), so it carries over to the new address automatically. The one exception is the iPhone/iPad Home Screen app, which keeps its own copy: export a backup from the old app and import it into Deepweek.
