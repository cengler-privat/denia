/**
 * Cloudflare Worker: Casa Englers Live-Flugsuche & Belegungskalender
 *
 * Routen:
 *   GET /calendar                  (anonymisierte Belegung, 2 Min. Cache)
 *   GET /calendar?refresh=1        (Cache umgehen & sofort frisch von Google laden)
 *   GET /calendar?admin=1          (nur mit Header X-Admin-Key: <ADMIN_PIN>, liefert Titel & Notizen)
 *   GET /search?from=FRA,STR,FKB&to=ALC,VLC&out=YYYY-MM-DD&ret=YYYY-MM-DD&adults=1&nonstop=1
 *   GET /returns?from=...&to=...&out=...&ret=...&adults=1&departure_token=...
 *   GET /booking?from=...&to=...&out=...&ret=...&adults=1&booking_token=...
 *
 * Secrets in Cloudflare hinterlegen:
 *   SERPAPI_KEY  = <dein SerpApi API-Key>
 *   GCAL_ICS_URL = <geheime iCal-Adresse (.ics) aus Google Kalender>
 *   ADMIN_PIN    = <dein geheimes Admin-Passwort für Details auf verfuegbarkeit.html>
 */

const ALLOWED_ORIGINS = [
    'https://denia.englers.win',
    'https://cengler-privat.github.io',
    'http://localhost:8080',
    'http://127.0.0.1:8080'
];

const VALID_DEPARTURES = new Set(['FRA', 'STR', 'FKB']);
const VALID_ARRIVALS = new Set(['ALC', 'VLC']);
const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function corsHeaders(request) {
    const origin = request.headers.get('Origin') || '';
    const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
    return {
        'Access-Control-Allow-Origin': allowed,
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Key',
        'Vary': 'Origin'
    };
}

function jsonResponse(data, status, request, cacheSeconds = 0) {
    const headers = {
        'Content-Type': 'application/json; charset=utf-8',
        ...corsHeaders(request)
    };
    if (cacheSeconds > 0) {
        headers['Cache-Control'] = `public, max-age=${cacheSeconds}`;
    } else {
        headers['Cache-Control'] = 'no-store';
    }
    return new Response(JSON.stringify(data), { status, headers });
}

function sanitizeAirports(raw, allowSet) {
    const list = (raw || '')
        .split(',')
        .map(s => s.trim().toUpperCase())
        .filter(code => allowSet.has(code));
    return [...new Set(list)];
}

function normalizeItinerary(item) {
    const legs = (item.flights || []).map(leg => ({
        airline: leg.airline || '',
        airline_logo: leg.airline_logo || item.airline_logo || '',
        flight_number: leg.flight_number || '',
        dep_code: leg.departure_airport?.id || '',
        dep_name: leg.departure_airport?.name || '',
        dep_time: leg.departure_airport?.time || '',
        arr_code: leg.arrival_airport?.id || '',
        arr_name: leg.arrival_airport?.name || '',
        arr_time: leg.arrival_airport?.time || '',
        duration: leg.duration || 0
    }));

    return {
        price: item.price ?? null,
        total_duration: item.total_duration || 0,
        stops: Math.max(0, legs.length - 1),
        airline_logo: item.airline_logo || legs[0]?.airline_logo || '',
        airlines: [...new Set(legs.map(l => l.airline).filter(Boolean))],
        legs,
        departure_token: item.departure_token || null,
        booking_token: item.booking_token || null
    };
}

async function fetchSerpApiCached(params, env, ttlSeconds) {
    const cacheUrl = new URL('https://cache.denia.internal/serpapi');
    for (const [k, v] of Object.entries(params)) {
        if (v !== undefined && v !== null && v !== '') {
            cacheUrl.searchParams.set(k, String(v));
        }
    }

    const cache = caches.default;
    const cacheKey = new Request(cacheUrl.toString(), { method: 'GET' });
    const cachedResp = await cache.match(cacheKey);
    if (cachedResp) {
        const data = await cachedResp.json();
        return { data, cached: true };
    }

    const apiUrl = new URL('https://serpapi.com/search.json');
    for (const [k, v] of Object.entries(params)) {
        if (v !== undefined && v !== null && v !== '') {
            apiUrl.searchParams.set(k, String(v));
        }
    }
    apiUrl.searchParams.set('api_key', env.SERPAPI_KEY);

    const resp = await fetch(apiUrl.toString());
    if (!resp.ok) {
        const txt = await resp.text();
        throw new Error(`SerpApi HTTP ${resp.status}: ${txt.slice(0, 200)}`);
    }
    const data = await resp.json();
    if (data.error) {
        throw new Error(`SerpApi: ${data.error}`);
    }

    const toStore = new Response(JSON.stringify(data), {
        headers: {
            'Content-Type': 'application/json',
            'Cache-Control': `public, max-age=${ttlSeconds}`
        }
    });
    await cache.put(cacheKey, toStore);
    return { data, cached: false };
}

/* =========================================================
   Google-Kalender iCal (.ics) Parser + Admin-Modus
========================================================= */
function timingSafeEqual(a, b) {
    const enc = new TextEncoder();
    const ba = enc.encode(String(a || ''));
    const bb = enc.encode(String(b || ''));
    const len = Math.max(ba.length, bb.length);
    let diff = ba.length ^ bb.length;
    for (let i = 0; i < len; i++) {
        diff |= (ba[i] || 0) ^ (bb[i] || 0);
    }
    return diff === 0 && ba.length > 0;
}

function unescapeIcsText(raw) {
    return (raw || '')
        .replace(/\\n/gi, '\n')
        .replace(/\\,/g, ',')
        .replace(/\\;/g, ';')
        .replace(/\\\\/g, '\\')
        .trim();
}

function shiftIsoDate(iso, deltaDays) {
    const [y, m, d] = iso.split('-').map(Number);
    const dt = new Date(Date.UTC(y, m - 1, d + deltaDays));
    return dt.toISOString().slice(0, 10);
}

function parseIcsDate(params, value) {
    const v = (value || '').trim();
    const isAllDay = /VALUE=DATE\b/i.test(params || '') || /^\d{8}$/.test(v);
    const match = v.match(/^(\d{4})(\d{2})(\d{2})/);
    if (!match) return null;
    return {
        iso: `${match[1]}-${match[2]}-${match[3]}`,
        isAllDay
    };
}

function parseIcsBookings(rawIcs) {
    const unfolded = rawIcs.replace(/\r?\n[ \t]/g, '');
    const blocks = unfolded.split(/BEGIN:VEVENT\r?\n/i).slice(1);

    const now = new Date();
    const minIso = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 45))
        .toISOString().slice(0, 10);
    const maxIso = new Date(Date.UTC(now.getUTCFullYear() + 2, now.getUTCMonth(), now.getUTCDate()))
        .toISOString().slice(0, 10);

    const bookings = [];

    for (const block of blocks) {
        const eventBody = block.split(/END:VEVENT/i)[0] || '';
        const lines = eventBody.split(/\r?\n/);

        let dtStart = null;
        let dtEnd = null;
        let summary = '';
        let description = '';
        let statusVal = '';
        let transpVal = '';

        for (const line of lines) {
            const colonIdx = line.indexOf(':');
            if (colonIdx === -1) continue;
            const left = line.slice(0, colonIdx);
            const val = line.slice(colonIdx + 1).trim();
            const semiIdx = left.indexOf(';');
            const name = (semiIdx === -1 ? left : left.slice(0, semiIdx)).toUpperCase();
            const params = semiIdx === -1 ? '' : left.slice(semiIdx + 1);

            if (name === 'DTSTART') dtStart = parseIcsDate(params, val);
            else if (name === 'DTEND') dtEnd = parseIcsDate(params, val);
            else if (name === 'SUMMARY') summary = unescapeIcsText(val);
            else if (name === 'DESCRIPTION') description = unescapeIcsText(val);
            else if (name === 'STATUS') statusVal = val.toUpperCase();
            else if (name === 'TRANSP') transpVal = val.toUpperCase();
        }

        if (!dtStart) continue;
        if (statusVal === 'CANCELLED') continue;
        if (transpVal === 'TRANSPARENT') continue; // In Google Kalender als "Frei" markierte Notizen ignorieren

        const start = dtStart.iso;
        let end = start;
        if (dtEnd) {
            // Bei Ganztagesterminen ist DTEND laut RFC 5545 exklusiv (+1 Tag)
            end = dtStart.isAllDay ? shiftIsoDate(dtEnd.iso, -1) : dtEnd.iso;
            if (end < start) end = start;
        }

        if (end < minIso || start > maxIso) continue;

        const isPending =
            statusVal === 'TENTATIVE' ||
            /\b(res\.?|reserviert|anfrage|option|vorbehalt|tentative)\b/i.test(summary) ||
            summary.includes('?');

        bookings.push({
            start,
            end,
            status: isPending ? 'pending' : 'booked',
            title: summary || '(Ohne Titel)',
            notes: description
        });
    }

    bookings.sort((a, b) => a.start.localeCompare(b.start) || a.end.localeCompare(b.end));
    return bookings;
}

async function fetchCalendarCached(env, { ttlSeconds = 120, forceRefresh = false } = {}) {
    const cache = caches.default;
    const cacheKey = new Request('https://cache.denia.internal/gcal-v2', { method: 'GET' });

    if (!forceRefresh) {
        const cachedResp = await cache.match(cacheKey);
        if (cachedResp) {
            const data = await cachedResp.json();
            return { data, cached: true };
        }
    }

    const resp = await fetch(env.GCAL_ICS_URL, {
        headers: { 'Cache-Control': 'no-cache' }
    });
    if (!resp.ok) {
        throw new Error(`Google Kalender HTTP ${resp.status}`);
    }
    const rawIcs = await resp.text();
    const bookings = parseIcsBookings(rawIcs);
    const data = {
        updated: new Date().toISOString(),
        bookings
    };

    const toStore = new Response(JSON.stringify(data), {
        headers: {
            'Content-Type': 'application/json',
            'Cache-Control': `public, max-age=${ttlSeconds}`
        }
    });
    await cache.put(cacheKey, toStore);
    return { data, cached: false };
}

export default {
    async fetch(request, env) {
        if (request.method === 'OPTIONS') {
            return new Response(null, { status: 204, headers: corsHeaders(request) });
        }
        if (request.method !== 'GET') {
            return jsonResponse({ error: 'Method not allowed' }, 405, request);
        }

        const url = new URL(request.url);
        const path = url.pathname.replace(/\/+$/, '') || '/search';

        // 0) Belegungskalender aus Google Kalender (.ics) – strikt nur mit Admin-Passwort!
        if (path === '/calendar') {
            if (!env.GCAL_ICS_URL) {
                return jsonResponse({ error: 'GCAL_ICS_URL ist im Worker nicht konfiguriert.' }, 500, request);
            }
            if (!env.ADMIN_PIN) {
                return jsonResponse({ error: 'ADMIN_PIN ist im Worker noch nicht hinterlegt.' }, 503, request);
            }

            const suppliedKey = request.headers.get('X-Admin-Key') || '';
            if (!timingSafeEqual(suppliedKey, env.ADMIN_PIN)) {
                return jsonResponse({ error: 'Falsches Admin-Passwort.' }, 401, request);
            }

            const forceRefresh = url.searchParams.get('refresh') === '1';

            try {
                const { data, cached } = await fetchCalendarCached(env, {
                    ttlSeconds: 120, // 2 Min. Auto-Cache
                    forceRefresh
                });

                return jsonResponse({
                    admin: true,
                    cached,
                    updated: data.updated,
                    bookings: data.bookings
                }, 200, request, 0);
            } catch (err) {
                return jsonResponse({ error: err.message || 'Fehler beim Laden des Kalenders.' }, 502, request);
            }
        }

        if (!env.SERPAPI_KEY) {
            return jsonResponse({ error: 'SERPAPI_KEY ist im Worker nicht konfiguriert.' }, 500, request);
        }

        const fromList = sanitizeAirports(url.searchParams.get('from') || 'FRA,STR,FKB', VALID_DEPARTURES);
        const toList = sanitizeAirports(url.searchParams.get('to') || 'ALC,VLC', VALID_ARRIVALS);
        const outDate = url.searchParams.get('out') || '';
        const retDate = url.searchParams.get('ret') || '';
        const adults = Math.min(4, Math.max(1, parseInt(url.searchParams.get('adults') || '1', 10) || 1));
        const nonstop = url.searchParams.get('nonstop') === '1';

        if (!fromList.length || !toList.length || !ISO_DATE_RE.test(outDate) || !ISO_DATE_RE.test(retDate)) {
            return jsonResponse({ error: 'Ungültige Suchparameter (Flughäfen oder Datum).' }, 400, request);
        }

        const baseParams = {
            engine: 'google_flights',
            departure_id: fromList.join(','),
            arrival_id: toList.join(','),
            outbound_date: outDate,
            return_date: retDate,
            type: '1',          // Hin- und Rückflug
            adults: String(adults),
            bags: String(adults), // Immer inkl. 1 Handgepäck pro Person!
            currency: 'EUR',
            hl: 'de',
            gl: 'de',
            sort_by: '2'        // Günstigster Preis zuerst
        };

        try {
            // 1) Hinflüge (alle gewählten Flughafen-Kombis gleichzeitig!)
            if (path === '/search') {
                if (nonstop) baseParams.stops = '1'; // 1 = nur Direktflüge bei SerpApi
                const { data, cached } = await fetchSerpApiCached(baseParams, env, 14400); // 4 Std. Cache
                const combined = [...(data.best_flights || []), ...(data.other_flights || [])]
                    .map(normalizeItinerary)
                    .filter(f => f.price !== null)
                    .sort((a, b) => a.price - b.price)
                    .slice(0, 12);

                return jsonResponse({
                    cached,
                    google_flights_url: data.search_metadata?.google_flights_url || null,
                    flights: combined
                }, 200, request, 300);
            }

            // 2) Passende Rückflüge zu einem gewählten Hinflug
            if (path === '/returns') {
                const depToken = url.searchParams.get('departure_token') || '';
                if (!depToken) {
                    return jsonResponse({ error: 'departure_token fehlt.' }, 400, request);
                }
                const { data, cached } = await fetchSerpApiCached({
                    ...baseParams,
                    departure_token: depToken
                }, env, 14400);

                const returns = [...(data.best_flights || []), ...(data.other_flights || [])]
                    .map(normalizeItinerary)
                    .filter(f => f.price !== null)
                    .sort((a, b) => a.price - b.price)
                    .slice(0, 8);

                return jsonResponse({
                    cached,
                    google_flights_url: data.search_metadata?.google_flights_url || null,
                    returns
                }, 200, request, 300);
            }

            // 3) Konkrete Anbieter-Buchungslinks zu Hin- + Rückflug
            if (path === '/booking') {
                const bookToken = url.searchParams.get('booking_token') || '';
                if (!bookToken) {
                    return jsonResponse({ error: 'booking_token fehlt.' }, 400, request);
                }
                const { data, cached } = await fetchSerpApiCached({
                    ...baseParams,
                    booking_token: bookToken
                }, env, 3600); // 1 Std. Cache

                const options = (data.booking_options || []).map(opt => {
                    const entry = opt.together || opt.departing;
                    if (!entry) return null;
                    return {
                        book_with: entry.book_with || 'Anbieter',
                        is_airline: !!entry.airline,
                        option_title: entry.option_title || '',
                        price: entry.price ?? null,
                        separate_tickets: !!opt.separate_tickets,
                        booking_request: entry.booking_request || null
                    };
                }).filter(Boolean).sort((a, b) => (a.price ?? 99999) - (b.price ?? 99999));

                return jsonResponse({
                    cached,
                    google_flights_url: data.search_metadata?.google_flights_url || null,
                    options
                }, 200, request, 300);
            }

            return jsonResponse({ error: 'Unbekannter Endpoint.' }, 404, request);
        } catch (err) {
            return jsonResponse({ error: err.message || 'Fehler bei der Flugsuche.' }, 502, request);
        }
    }
};
