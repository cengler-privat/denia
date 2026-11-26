/* =========================================================================
   CASA ENGLERS Y AMIGOS – CASA-CONCIERGE (GEMINI 3.8 FLASH + WEB-GROUNDING)
   Wird zentral über script.js auf allen Seiten links vom Wetter-Icon geladen.
   ========================================================================= */
(function () {
    'use strict';

    const CONCIERGE_API_URL = 'https://denia-flights.cf-5a7.workers.dev/concierge';

    const QUICK_PROMPTS = [
        { label: '✨ Empfiehl ein neues Restaurant', action: 'discover-restaurant' },
        { label: '🗑️ Wann darf der Müll raus?', q: 'Wann und wie funktioniert die Müllentsorgung in Dénia?' },
        { label: '🥘 Beste Paella- & Tapas-Tipps?', q: 'Welche Restaurants empfehlt ihr für Paella und Tapas?' },
        { label: '🌅 Höhenweg Montgó?', q: 'Wann startet man am besten zum Höhenweg am Montgó und wo kann man parken?' },
        { label: '🧭 Ausflug ≤ 20 Min.?', q: 'Welche schönen Ausflüge gibt es in maximal 20 Minuten Fahrtzeit ab der Casa?' }
    ];

    function sparkleSvg(size) {
        return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 2.5 14.3 9.2 21 11.5l-6.7 2.3L12 20.5l-2.3-6.7L3 11.5l6.7-2.3L12 2.5Z" fill="#f59e0b" stroke="#d97706" stroke-width="1.2" stroke-linejoin="round"/><path d="M19 3.5 19.7 5.3 21.5 6 19.7 6.7 19 8.5 18.3 6.7 16.5 6 18.3 5.3 19 3.5Z" fill="#38bdf8"/></svg>`;
    }

    function newChatSvg(size) {
        return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>`;
    }

    function injectStyles() {
        if (document.getElementById('casa-concierge-styles')) return;
        const style = document.createElement('style');
        style.id = 'casa-concierge-styles';
        style.textContent = `
            /* Gemeinsame Leiste oben rechts: [Concierge] [Wetter] */
            .top-right-controls {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 999;
                display: flex;
                align-items: center;
                gap: 10px;
            }
            .top-right-controls #weather-overlay {
                position: static !important;
                top: auto !important;
                right: auto !important;
                margin: 0 !important;
            }

            .concierge-trigger-btn {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 38px;
                height: 38px;
                padding: 0;
                background: rgba(255, 255, 255, 0.92);
                backdrop-filter: blur(8px);
                -webkit-backdrop-filter: blur(8px);
                color: #0f172a;
                border: 1px solid rgba(15, 23, 42, 0.08);
                border-radius: 50%;
                cursor: pointer;
                box-shadow: 0 4px 10px rgba(0, 0, 0, 0.12);
                transition: transform 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease;
                animation: fadeInButton 0.35s ease-out 0.1s both;
            }
            body.home-page .concierge-trigger-btn {
                animation: fadeInButton 0.45s ease-out 1.4s both;
            }
            .concierge-trigger-btn:hover {
                background: #ffffff;
                transform: translateY(-1px) scale(1.04);
                box-shadow: 0 6px 16px rgba(15, 23, 42, 0.18);
            }

            /* Chat-Overlay */
            .cc-overlay {
                position: fixed;
                inset: 0;
                z-index: 100010;
                background: rgba(15, 23, 42, 0.62);
                backdrop-filter: blur(5px);
                -webkit-backdrop-filter: blur(5px);
                display: none;
                align-items: flex-end;
                justify-content: flex-end;
                padding: 20px;
                box-sizing: border-box;
            }
            .cc-overlay.open { display: flex; }

            .cc-modal {
                width: 100%;
                max-width: 470px;
                height: min(660px, calc(100vh - 40px));
                background: #f8fafc;
                border-radius: 24px;
                overflow: hidden;
                box-shadow: 0 26px 70px rgba(0, 0, 0, 0.42);
                display: flex;
                flex-direction: column;
                font-family: 'Lato', sans-serif;
            }

            .cc-header {
                background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
                color: #ffffff;
                padding: 15px 18px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 10px;
                flex-shrink: 0;
            }
            .cc-head-left {
                display: flex;
                align-items: center;
                gap: 10px;
                min-width: 0;
            }
            .cc-avatar {
                width: 38px;
                height: 38px;
                border-radius: 12px;
                background: rgba(245, 158, 11, 0.16);
                border: 1px solid rgba(245, 158, 11, 0.4);
                display: inline-flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
            }
            .cc-head-text h2 {
                font-family: 'Playfair Display', serif;
                font-size: 1.18rem;
                margin: 0;
                color: #ffffff;
                line-height: 1.2;
            }
            .cc-head-text span {
                font-size: 0.78rem;
                color: rgba(255, 255, 255, 0.72);
                display: block;
                margin-top: 2px;
            }
            .cc-head-btns {
                display: flex;
                align-items: center;
                gap: 6px;
                flex-shrink: 0;
            }
            .cc-icon-btn {
                background: rgba(255, 255, 255, 0.12);
                color: #ffffff;
                border: 1px solid rgba(255, 255, 255, 0.18);
                height: 34px;
                min-width: 34px;
                padding: 0 10px;
                border-radius: 50px;
                font-family: 'Lato', sans-serif;
                font-size: 13px;
                font-weight: 700;
                cursor: pointer;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                gap: 5px;
                transition: background 0.2s ease;
            }
            .cc-icon-btn:hover { background: rgba(255, 255, 255, 0.24); }

            .cc-messages {
                flex: 1;
                overflow-y: auto;
                padding: 16px;
                display: flex;
                flex-direction: column;
                gap: 12px;
                -webkit-overflow-scrolling: touch;
            }

            .cc-welcome {
                background: #ffffff;
                border: 1px solid rgba(15, 23, 42, 0.08);
                border-radius: 18px;
                padding: 16px;
                box-shadow: 0 6px 18px rgba(15, 23, 42, 0.05);
            }
            .cc-welcome p {
                margin: 0 0 12px 0;
                font-size: 0.92rem;
                color: #334155;
                line-height: 1.5;
            }
            .cc-quick-grid {
                display: flex;
                flex-wrap: wrap;
                gap: 7px;
            }
            .cc-quick-btn {
                background: #f1f5f9;
                border: 1px solid #cbd5e1;
                color: #0f172a;
                padding: 7px 11px;
                border-radius: 14px;
                font-family: 'Lato', sans-serif;
                font-size: 0.82rem;
                font-weight: 700;
                cursor: pointer;
                text-align: left;
                transition: all 0.18s ease;
            }
            .cc-quick-btn:hover {
                background: #0f172a;
                color: #ffffff;
                border-color: #0f172a;
            }
            .cc-privacy-footer {
                font-size: 0.7rem;
                color: #94a3b8;
                text-align: center;
                line-height: 1.35;
                padding: 0 14px 10px 14px;
                background: #ffffff;
                flex-shrink: 0;
            }
            .cc-privacy-footer a {
                color: #64748b;
                text-decoration: underline;
            }
            .cc-privacy-footer a:hover { color: #0f172a; }

            .cc-msg {
                max-width: 88%;
                padding: 11px 14px;
                border-radius: 16px;
                font-size: 0.92rem;
                line-height: 1.52;
                word-wrap: break-word;
            }
            .cc-msg.user {
                align-self: flex-end;
                background: #0f172a;
                color: #ffffff;
                border-bottom-right-radius: 5px;
            }
            .cc-msg.bot {
                align-self: flex-start;
                background: #ffffff;
                color: #1e293b;
                border: 1px solid rgba(15, 23, 42, 0.08);
                border-bottom-left-radius: 5px;
                box-shadow: 0 4px 12px rgba(15, 23, 42, 0.04);
            }
            .cc-msg.error {
                align-self: flex-start;
                background: #fff1f2;
                color: #9f1239;
                border: 1px solid #fecdd3;
            }
            .cc-msg.error a.cc-wa-inline {
                color: #15803d;
                font-weight: 700;
                text-decoration: underline;
            }
            .cc-msg.error a.cc-wa-inline:hover {
                color: #166534;
            }
            .cc-msg.bot p { margin: 0 0 8px 0; }
            .cc-msg.bot p:last-child { margin-bottom: 0; }
            .cc-msg.bot ul { margin: 4px 0 8px 18px; padding: 0; }
            .cc-msg.bot li { margin-bottom: 4px; }
            .cc-msg.bot a { color: #0284c7; font-weight: 700; text-decoration: underline; }
            .cc-msg.bot strong { color: #0f172a; }

            .cc-sources {
                display: flex;
                flex-wrap: wrap;
                gap: 6px;
                margin-top: 9px;
                padding-top: 8px;
                border-top: 1px solid #e2e8f0;
            }
            .cc-source-chip {
                display: inline-flex;
                align-items: center;
                gap: 4px;
                background: #f0f9ff;
                border: 1px solid #bae6fd;
                color: #0369a1 !important;
                text-decoration: none !important;
                padding: 3px 8px;
                border-radius: 10px;
                font-size: 0.75rem;
                font-weight: 700;
                max-width: 100%;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .cc-source-chip:hover { background: #e0f2fe; }

            .cc-typing {
                display: inline-flex;
                align-items: center;
                gap: 6px;
                color: #64748b;
                font-size: 0.86rem;
                font-weight: 700;
            }
            .cc-dots span {
                display: inline-block;
                width: 6px;
                height: 6px;
                border-radius: 50%;
                background: #f59e0b;
                margin: 0 1.5px;
                animation: ccBounce 1.1s infinite ease-in-out;
            }
            .cc-dots span:nth-child(2) { animation-delay: 0.16s; }
            .cc-dots span:nth-child(3) { animation-delay: 0.32s; }
            @keyframes ccBounce {
                0%, 80%, 100% { transform: scale(0.6); opacity: 0.45; }
                40% { transform: scale(1); opacity: 1; }
            }

            .cc-form {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 12px 14px 7px 14px;
                background: #ffffff;
                border-top: 1px solid #e2e8f0;
                flex-shrink: 0;
            }
            .cc-input {
                flex: 1;
                border: 1.5px solid #cbd5e1;
                border-radius: 14px;
                padding: 10px 13px;
                font-family: 'Lato', sans-serif;
                font-size: 0.94rem;
                color: #0f172a;
                background: #f8fafc;
                outline: none;
                min-width: 0;
            }
            .cc-input:focus {
                border-color: #f59e0b;
                background: #ffffff;
            }
            .cc-send-btn {
                background: #0f172a;
                color: #ffffff;
                border: none;
                border-radius: 13px;
                padding: 10px 16px;
                font-family: 'Lato', sans-serif;
                font-size: 0.9rem;
                font-weight: 700;
                cursor: pointer;
                flex-shrink: 0;
                transition: background 0.2s ease;
            }
            .cc-send-btn:hover:not(:disabled) { background: #f59e0b; color: #0f172a; }
            .cc-send-btn:disabled { opacity: 0.5; cursor: not-allowed; }

            @media (max-width: 768px) {
                .top-right-controls { top: 18px; right: 14px; gap: 7px; }
                .concierge-trigger-btn { width: 36px; height: 36px; }
                .cc-overlay { padding: 0; }
                .cc-modal {
                    max-width: none;
                    height: 100dvh;
                    border-radius: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    function escapeHtml(str) {
        return String(str || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function formatMarkdownSafe(rawText, userQuestion) {
        const escaped = escapeHtml(rawText);

        // Links [label](url) sicher umwandeln (nur https://, http://, mailto:, tel: oder lokale .html)
        const withLinks = escaped.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, label, url) => {
            let safeUrl = /^(https?:\/\/|mailto:|tel:|[a-z0-9_-]+\.html(?:#[a-z0-9_-]+)?$)/i.test(url) ? url : '';
            if (!safeUrl) return label;
            // Bei WhatsApp-Links dynamisch behandeln (keine Rohdaten im HTML)
            if (/wa\.me/i.test(safeUrl) || /whatsapp/i.test(safeUrl)) {
                const prefill = userQuestion ? `Hola! Ich habe eine Frage zur Casa Englers y Amigos:\n\n"${userQuestion}"` : '';
                return `<a href="#" class="cc-wa-inline" data-wa="1"${prefill ? ` data-wa-text="${escapeHtml(prefill)}"` : ''}>${label}</a>`;
            }
            const isExt = /^https?:\/\//i.test(safeUrl);
            const attrs = isExt ? ' target="_blank" rel="noopener noreferrer"' : '';
            return `<a href="${safeUrl}"${attrs}>${label}</a>`;
        });

        const withInline = withLinks
            .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
            .replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>');

        const lines = withInline.split(/\r?\n/);
        let html = '';
        let inList = false;

        for (const rawLine of lines) {
            const line = rawLine.trim();
            if (!line) {
                if (inList) { html += '</ul>'; inList = false; }
                continue;
            }
            const bullet = line.match(/^[-*•]\s+(.*)$/);
            if (bullet) {
                if (!inList) { html += '<ul>'; inList = true; }
                html += `<li>${bullet[1]}</li>`;
            } else {
                if (inList) { html += '</ul>'; inList = false; }
                html += `<p>${line}</p>`;
            }
        }
        if (inList) html += '</ul>';
        return html || `<p>${withInline}</p>`;
    }

    let overlayEl = null;
    let messagesEl = null;
    let inputEl = null;
    let sendBtn = null;
    let history = [];
    let isBusy = false;

    function buildWelcomeHtml() {
        const chips = QUICK_PROMPTS.map((p, idx) =>
            `<button type="button" class="cc-quick-btn" data-quick-idx="${idx}">${p.label}</button>`
        ).join('');
        return `
            <div class="cc-welcome" id="cc-welcome-box">
                <p><strong>¡Hola!</strong> Ich bin euer digitaler <strong>Casa-Concierge</strong>. Frag mich alles rund um die Wohnung, unsere Lieblingsrestaurants, Ausflüge – oder auch nach aktuellen Öffnungszeiten &amp; Infos der verlinkten Orte!</p>
                <div class="cc-quick-grid">${chips}</div>
            </div>
        `;
    }

    function bindQuickButtons() {
        if (!messagesEl) return;
        messagesEl.querySelectorAll('[data-quick-idx]').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.dataset.quickIdx, 10);
                const item = QUICK_PROMPTS[idx];
                if (!item) return;
                if (item.action === 'discover-restaurant') {
                    const card = document.getElementById('restaurantDiscoveryCard');
                    if (card && typeof window.discoverNewRestaurant === 'function') {
                        closeConcierge();
                        const discBtn = document.getElementById('btnFilterDiscovery');
                        if (typeof window.filterSpots === 'function' && discBtn) {
                            window.filterSpots('discovery', discBtn);
                        }
                        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        window.discoverNewRestaurant(true);
                    } else {
                        window.location.href = 'kulinarisches.html?discover=1#restaurantDiscoveryCard';
                    }
                    return;
                }
                sendQuestion(item.q);
            });
        });
    }

    function ensureOverlay() {
        if (overlayEl) return;
        overlayEl = document.createElement('div');
        overlayEl.id = 'casa-concierge-overlay';
        overlayEl.className = 'cc-overlay';
        overlayEl.setAttribute('role', 'dialog');
        overlayEl.setAttribute('aria-modal', 'true');
        overlayEl.setAttribute('aria-label', 'Casa-Concierge Chat');

        overlayEl.innerHTML = `
            <div class="cc-modal">
                <div class="cc-header">
                    <div class="cc-head-left">
                        <div class="cc-avatar">${sparkleSvg(20)}</div>
                        <div class="cc-head-text">
                            <h2>Casa-Concierge</h2>
                            <span>Casa-Infos, Tipps &amp; aktuelle Öffnungszeiten</span>
                        </div>
                    </div>
                    <div class="cc-head-btns">
                        <button type="button" class="cc-icon-btn" id="cc-reset-btn" title="Neuen Chat starten">${newChatSvg(14)}<span>Neu</span></button>
                        <button type="button" class="cc-icon-btn" id="cc-close-btn" title="Schließen" aria-label="Schließen">✕</button>
                    </div>
                </div>
                <div class="cc-messages" id="cc-messages">${buildWelcomeHtml()}</div>
                <form class="cc-form" id="cc-form">
                    <input type="text" class="cc-input" id="cc-input" placeholder="Stell deine Frage zur Casa oder Dénia …" maxlength="450" autocomplete="off">
                    <button type="submit" class="cc-send-btn" id="cc-send-btn">Senden</button>
                </form>
                <div class="cc-privacy-footer">
                    Antworten über Google Gemini (inkl. Websuche) · keine sensiblen Daten eingeben · <a href="impressum.html">Datenschutz</a>
                </div>
            </div>
        `;

        document.body.appendChild(overlayEl);
        messagesEl = document.getElementById('cc-messages');
        inputEl = document.getElementById('cc-input');
        sendBtn = document.getElementById('cc-send-btn');

        bindQuickButtons();

        overlayEl.addEventListener('click', (e) => {
            if (e.target === overlayEl) closeConcierge();
        });
        document.getElementById('cc-close-btn').addEventListener('click', closeConcierge);
        document.getElementById('cc-reset-btn').addEventListener('click', () => {
            if (isBusy) return;
            history = [];
            messagesEl.innerHTML = buildWelcomeHtml();
            bindQuickButtons();
            inputEl.focus();
        });
        document.getElementById('cc-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const q = inputEl.value.trim();
            if (q) sendQuestion(q);
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && overlayEl && overlayEl.classList.contains('open')) {
                closeConcierge();
            }
        });
    }

    function openConcierge() {
        ensureOverlay();
        const weatherPop = document.getElementById('weather-popover');
        if (weatherPop) weatherPop.classList.remove('is-open');
        overlayEl.classList.add('open');
        document.body.style.overflow = 'hidden';
        setTimeout(() => inputEl && inputEl.focus(), 120);
    }

    function closeConcierge() {
        if (!overlayEl) return;
        overlayEl.classList.remove('open');
        document.body.style.overflow = '';
    }

    function scrollBottom() {
        if (messagesEl) messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    async function sendQuestion(text) {
        if (isBusy) return;
        isBusy = true;
        inputEl.value = '';
        inputEl.disabled = true;
        sendBtn.disabled = true;

        const welcomeBox = document.getElementById('cc-welcome-box');
        if (welcomeBox) {
            const qGrid = welcomeBox.querySelector('.cc-quick-grid');
            if (qGrid) qGrid.style.display = 'none';
        }

        const userMsg = document.createElement('div');
        userMsg.className = 'cc-msg user';
        userMsg.textContent = text;
        messagesEl.appendChild(userMsg);

        const typingMsg = document.createElement('div');
        typingMsg.className = 'cc-msg bot';
        typingMsg.innerHTML = `<div class="cc-typing"><span>Concierge schaut nach</span><span class="cc-dots"><span></span><span></span><span></span></span></div>`;
        messagesEl.appendChild(typingMsg);
        scrollBottom();

        try {
            const resp = await fetch(CONCIERGE_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: text,
                    history: history.slice(-6)
                })
            });
            const data = await resp.json();
            if (!resp.ok || !data.reply) {
                throw new Error(data.error || `Fehler (HTTP ${resp.status})`);
            }

            let html = formatMarkdownSafe(data.reply, text);
            if (Array.isArray(data.sources) && data.sources.length > 0) {
                const chips = data.sources.map(s =>
                    `<a href="${escapeHtml(s.url)}" target="_blank" rel="noopener noreferrer" class="cc-source-chip">🌐 ${escapeHtml(s.title)} ↗</a>`
                ).join('');
                html += `<div class="cc-sources">${chips}</div>`;
            }

            typingMsg.innerHTML = html;
            history.push({ role: 'user', text });
            history.push({ role: 'model', text: data.reply });
        } catch (err) {
            console.warn('Casa-Concierge Fehler:', err);
            typingMsg.className = 'cc-msg error';
            const msg = String(err.message || '');
            const waText = `Hola! Ich habe eine Frage zur Casa Englers y Amigos:\n\n"${text}"`;
            const waLink = `<a href="#" class="cc-wa-inline" data-wa="1" data-wa-text="${escapeHtml(waText)}">WhatsApp</a>`;
            if (msg.includes('503') || msg.includes('UNAVAILABLE') || msg.includes('429')) {
                typingMsg.innerHTML = `Der Casa-Concierge ist bei Google gerade kurz überlastet – probier es gleich noch einmal oder schreib uns direkt per ${waLink}!`;
            } else {
                typingMsg.innerHTML = `Hoppla – der Casa-Concierge konnte gerade nicht antworten. Probier es kurz nochmal oder schreib uns direkt per ${waLink}!`;
            }
        } finally {
            isBusy = false;
            inputEl.disabled = false;
            sendBtn.disabled = false;
            scrollBottom();
            inputEl.focus();
        }
    }

    function mountTriggerButton() {
        // Auf der geschützten Admin-Seite nicht nötig
        if (window.location.pathname.endsWith('/admin.html') || window.location.pathname === 'admin.html') {
            return;
        }
        injectStyles();

        const weatherEl = document.getElementById('weather-overlay');
        let bar = document.querySelector('.top-right-controls');
        if (!bar) {
            bar = document.createElement('div');
            bar.className = 'top-right-controls';
            document.body.appendChild(bar);
        }

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.id = 'concierge-trigger-btn';
        btn.className = 'concierge-trigger-btn';
        btn.title = 'Casa-Concierge fragen (KI)';
        btn.setAttribute('aria-label', 'Casa-Concierge fragen');
        btn.innerHTML = sparkleSvg(19);
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            openConcierge();
        });

        bar.appendChild(btn);
        if (weatherEl) {
            bar.appendChild(weatherEl);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', mountTriggerButton);
    } else {
        mountTriggerButton();
    }

    window.openCasaConcierge = openConcierge;
})();
