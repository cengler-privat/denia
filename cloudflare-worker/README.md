# Cloudflare Worker für Live-Flugpreise (SerpApi Google Flights)

Dieser kleine Proxy ermöglicht echte Live-Flugpreise (**inkl. 1 Handgepäck pro Person**) und direkte Anbieter-Buchungslinks auf `anreise.html`, ohne deinen SerpApi-Key im Frontend offenzulegen.

## Einrichtung in 5 Minuten (0 € im Free Tier)

1. **SerpApi-Key holen:**
   - Kostenlosen Account auf https://serpapi.com anlegen (250 kostenlose Suchen/Monat).
   - Im Dashboard deinen **Private API Key** kopieren.

2. **Cloudflare Worker anlegen:**
   - Auf https://dash.cloudflare.com einloggen (kostenlos, keine Kreditkarte nötig).
   - Links auf **Workers & Pages** → **Create** → **Create Worker** klicken.
   - Namen vergeben, z. B. `denia-flights`, und auf **Deploy** klicken.

3. **Code einfügen:**
   - Auf **Edit code** klicken, den gesamten Inhalt von `cloudflare-worker/worker.js` einfügen und oben rechts auf **Deploy** klicken.

4. **API-Key sicher als Secret hinterlegen:**
   - Im Worker auf **Settings** → **Variables and Secrets** → **+ Add** klicken.
   - **Type:** `Secret`
   - **Variable name:** `SERPAPI_KEY`
   - **Value:** deinen SerpApi-Key einfügen → **Deploy**.

5. **Worker-URL in `anreise.html` eintragen:**
   - Deine Worker-URL kopieren (z. B. `https://denia-flights.<dein-name>.workers.dev`).
   - In `anreise.html` die Zeile:
     ```js
     const FLIGHT_WORKER_URL = '';
     ```
     auf deine URL setzen, z. B.:
     ```js
     const FLIGHT_WORKER_URL = 'https://denia-flights.<dein-name>.workers.dev';
     ```
   - Ab sofort zeigt das Overlay auf `anreise.html` echte Live-Preise inkl. 1 Handgepäck, passende Rückflüge und direkte Buchungslinks zu den Anbietern an!

> **Hinweis:** Durch das eingebaute 4-Stunden-Caching im Worker und den Domain-Schutz (`denia.englers.win` / `cengler-privat.github.io`) wird dein kostenloses Kontingent optimal geschont. Sollte das Limit einmal erreicht sein, fällt `anreise.html` automatisch auf die direkten KAYAK-/Google-Flights-Links zurück.
