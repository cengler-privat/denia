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

---

## Belegungskalender (`/calendar`) mit Google Kalender verbinden

Derselbe Worker liefert auf `/calendar` eure anonymisierte Belegung für `verfuegbarkeit.html` (10 Min. Cache, 0 €).

1. **Geheime iCal-Adresse aus Google Kalender kopieren:**
   - Öffne [calendar.google.com](https://calendar.google.com) am Rechner.
   - Fahre links über deinen Casa-Belegungskalender → **⋮ (Drei Punkte)** → **Einstellungen und Freigabe**.
   - Scrolle ganz nach unten zu **Kalender integrieren** → kopiere die **Privatadresse im iCal-Format** (`https://calendar.google.com/calendar/ical/.../basic.ics`).
   - *(Der Kalender muss dafür **nicht** öffentlich gemacht werden!)*

2. **Worker-Code aktualisieren & Secret anlegen:**
   - In Cloudflare den aktuellen Inhalt von `cloudflare-worker/worker.js` einfügen und auf **Deploy** klicken.
   - Unter **Settings → Variables and Secrets → + Add**:
     - **Type:** `Secret`
     - **Variable name:** `GCAL_ICS_URL`
     - **Value:** deine kopierte `.ics`-URL → **Deploy**.
   - **Optional für den Admin-Modus** (zeigt Titel & Notizen nur nach Passwort-Eingabe):
     - Noch ein Secret anlegen: **Name:** `ADMIN_PIN`, **Value:** dein gewünschtes Admin-Passwort → **Deploy**.

3. **Status-Steuerung über den Termin-Titel:**
   - Normale Termine (z. B. `Familie Müller`) erscheinen als **Belegt** (Name wird komplett entfernt!).
   - Termine mit **`Res`**, **`Reserviert`**, **`Anfrage`**, **`Option`**, **`Vorbehalt`** oder **`?`** im Titel erscheinen als **Reserviert / Anfrage** (gelb).
   - Termine, die in Google Kalender als **„Frei“** (`TRANSPARENT`) markiert sind, werden ignoriert.
