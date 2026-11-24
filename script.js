// Führt das Skript aus, sobald die HTML-Struktur vollständig geladen ist.
document.addEventListener('DOMContentLoaded', () => {

    // Helferfunktion zum Auswählen von Elementen
    const select = (selector) => document.querySelector(selector);
    const selectAll = (selector) => document.querySelectorAll(selector);

    // =========================================
    //   0. Zentrales Menü via Fetch laden
    // =========================================
    const menuContainer = select('#menu-container');
    if (menuContainer) {
        fetch('menu.html', { cache: 'no-cache' })
            .then(response => {
                if (!response.ok) throw new Error('Netzwerkfehler beim Laden des Menüs');
                return response.text();
            })
            .then(data => {
                menuContainer.innerHTML = data;
                initBurgerMenu(); // Burger-Logik erst starten, wenn das Menü da ist!
            })
            .catch(error => console.error('Fehler beim Laden des Menüs:', error));
    } else {
        initBurgerMenu(); // Falls das Menü hartcodiert ist
    }

    // =========================================
    //   1. Logik für das Burger-Menü & Slide-Panel
    // =========================================
    function initBurgerMenu() {
        const burgerMenuBtn = select('#burger-menu-btn');
        const mainMenuPanel = select('#main-menu-panel');

        if (burgerMenuBtn && mainMenuPanel) {
            burgerMenuBtn.addEventListener('click', (event) => {
                event.stopPropagation();
                burgerMenuBtn.classList.toggle('is-active');
                mainMenuPanel.classList.toggle('is-active');
                
                const isActive = mainMenuPanel.classList.contains('is-active');
                document.body.style.overflow = isActive ? 'hidden' : '';
            });

            document.addEventListener('click', (event) => {
                // Prüfen ob Elemente existieren, da Menü dynamisch geladen wird
                const panel = select('#main-menu-panel');
                const btn = select('#burger-menu-btn');
                if (!panel || !btn) return;

                const isClickInsideMenu = panel.contains(event.target);
                const isClickOnTrigger = btn.contains(event.target);

                if (panel.classList.contains('is-active') && !isClickInsideMenu && !isClickOnTrigger) {
                    panel.classList.remove('is-active');
                    btn.classList.remove('is-active');
                    document.body.style.overflow = '';
                }
            });

            // Unauffälliger Admin-Zugang: Doppelklick / Doppeltipp auf „Hauptmenü“
            const secretHeading = mainMenuPanel.querySelector('.menu-section h3');
            if (secretHeading) {
                secretHeading.style.userSelect = 'none';
                secretHeading.addEventListener('dblclick', () => {
                    window.location.href = 'admin.html';
                });
                let lastTap = 0;
                secretHeading.addEventListener('touchend', (e) => {
                    const now = Date.now();
                    if (now - lastTap > 0 && now - lastTap < 400) {
                        e.preventDefault();
                        window.location.href = 'admin.html';
                    }
                    lastTap = now;
                });
            }
        }
    }

    // =========================================
    //   2. Intersection Observer für Scroll-Animationen
    // =========================================
    const animatedSections = selectAll('.content-section, .gallery-section');

    const sectionObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                sectionObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    animatedSections.forEach(section => {
        sectionObserver.observe(section);
    });

    // =================================================================
    //   3. Logik für schwebende Buttons (WhatsApp & Scroll-To-Top)
    // =================================================================
    const whatsappBtn = select('#whatsapp-btn');
    const scrollToTopBtn = select('#scroll-to-top-btn');
    const triggerSection = select('#trigger-whatsapp');

    if (scrollToTopBtn) {
        const toggleScrollToTopButton = () => {
            scrollToTopBtn.classList.toggle('visible', window.scrollY > 300);
        };
        window.addEventListener('scroll', toggleScrollToTopButton);
        scrollToTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
        toggleScrollToTopButton();
    }

    if (whatsappBtn && triggerSection) {
        const whatsappObserver = new IntersectionObserver((entries) => {
            whatsappBtn.classList.toggle('visible', entries[0].isIntersecting);
        }, {
            threshold: 0.1
        });
        whatsappObserver.observe(triggerSection);
    }

    // =========================================
    //   4. Logik für das Wetter-Overlay (Open-Meteo + Dezentes Popover)
    // =========================================
    const weatherOverlay = select('#weather-overlay');
    
    if (weatherOverlay) {
        const apiUrl = 'https://api.open-meteo.com/v1/forecast?latitude=38.8569&longitude=0.0690&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=Europe%2FMadrid&forecast_days=5';
        const weatherDetailsUrl = 'https://www.meteoblue.com/de/wetter/woche/denia_spanien_2518878';

        const temperatureSpan = select('#temperature');
        const WEATHER_CACHE_KEY = 'denia_openmeteo_cache_v1';
        const WEATHER_CACHE_TTL = 15 * 60 * 1000; // 15 Minuten
        let latestWeatherData = null;

        const wmoInfo = (code) => {
            if (code === 0) return { icon: '☀️', text: 'Sonnig' };
            if (code <= 2) return { icon: '🌤️', text: 'Leicht bewölkt' };
            if (code === 3) return { icon: '☁️', text: 'Bewölkt' };
            if (code === 45 || code === 48) return { icon: '🌫️', text: 'Nebel' };
            if (code >= 51 && code <= 67) return { icon: '🌦️', text: 'Regen' };
            if (code >= 71 && code <= 77) return { icon: '❄️', text: 'Schnee' };
            if (code >= 80 && code <= 82) return { icon: '🌧️', text: 'Schauer' };
            if (code >= 95) return { icon: '⛈️', text: 'Gewitter' };
            return { icon: '🌤️', text: 'Wechselhaft' };
        };

        // Dezentes Popover-Element erzeugen
        const weatherPopover = document.createElement('div');
        weatherPopover.className = 'weather-popover';
        weatherPopover.id = 'weather-popover';
        weatherPopover.setAttribute('role', 'dialog');
        weatherPopover.setAttribute('aria-label', 'Wetter in Dénia');
        document.body.appendChild(weatherPopover);

        const renderPopover = (data) => {
            if (!data?.current) return;
            const cur = data.current;
            const curMeta = wmoInfo(cur.weather_code);
            const weekdays = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
            let daysHtml = '';

            if (data.daily?.time) {
                data.daily.time.forEach((dateStr, idx) => {
                    const label = idx === 0 ? 'Heute' : weekdays[new Date(dateStr + 'T12:00:00').getDay()];
                    const dMeta = wmoInfo(data.daily.weather_code[idx]);
                    const tMax = Math.round(data.daily.temperature_2m_max[idx]);
                    const tMin = Math.round(data.daily.temperature_2m_min[idx]);
                    const rain = data.daily.precipitation_probability_max?.[idx] ?? 0;
                    daysHtml += `
                        <li class="weather-pop-day">
                            <span>${label}</span>
                            <span>${dMeta.icon}</span>
                            <span class="weather-pop-rain">${rain >= 15 ? `💧 ${rain}%` : ''}</span>
                            <span class="weather-pop-range"><span>${tMin}° / </span>${tMax}°</span>
                        </li>`;
                });
            }

            weatherPopover.innerHTML = `
                <div class="weather-pop-header">
                    <span class="weather-pop-label">Dénia · Wetter</span>
                    <button type="button" class="weather-pop-close" aria-label="Wetter schließen">✕</button>
                </div>
                <div class="weather-pop-current">
                    <div class="weather-pop-icon">${curMeta.icon}</div>
                    <div>
                        <div class="weather-pop-temp">${Math.round(cur.temperature_2m)}°C</div>
                        <div class="weather-pop-meta">${curMeta.text} · Gefühlt ${Math.round(cur.apparent_temperature)}° · ${Math.round(cur.wind_speed_10m)} km/h</div>
                    </div>
                </div>
                <ul class="weather-pop-days">${daysHtml}</ul>
                <div class="weather-pop-footer">
                    <a class="weather-pop-link" href="${weatherDetailsUrl}" target="_blank" rel="noopener noreferrer">Details bei meteoblue ↗</a>
                </div>
            `;

            const closeBtn = weatherPopover.querySelector('.weather-pop-close');
            if (closeBtn) {
                closeBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    weatherPopover.classList.remove('is-open');
                });
            }
        };

        const applyWeatherData = (data) => {
            if (data?.current?.temperature_2m === undefined) return;
            latestWeatherData = data;
            temperatureSpan.textContent = Math.round(data.current.temperature_2m);
            weatherOverlay.style.display = 'block';
            renderPopover(data);
        };

        const getWeatherData = async () => {
            try {
                const response = await fetch(apiUrl);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();

                if (data?.current?.temperature_2m !== undefined) {
                    applyWeatherData(data);
                    try {
                        sessionStorage.setItem(WEATHER_CACHE_KEY, JSON.stringify({
                            data,
                            timestamp: Date.now()
                        }));
                    } catch (_) {}
                } else {
                    throw new Error('Temperaturdaten nicht im API-Response gefunden.');
                }
            } catch (error) {
                console.error('Fehler beim Abrufen der Wetterdaten:', error);
            }
        };

        weatherOverlay.addEventListener('click', (event) => {
            event.stopPropagation();
            if (!latestWeatherData) getWeatherData();
            weatherPopover.classList.toggle('is-open');
        });

        weatherPopover.addEventListener('click', (event) => {
            event.stopPropagation();
        });

        document.addEventListener('click', () => {
            weatherPopover.classList.remove('is-open');
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                weatherPopover.classList.remove('is-open');
            }
        });

        let hasFreshCache = false;
        try {
            const cachedRaw = sessionStorage.getItem(WEATHER_CACHE_KEY);
            if (cachedRaw) {
                const cached = JSON.parse(cachedRaw);
                if (cached?.data?.current?.temperature_2m !== undefined && (Date.now() - cached.timestamp) < WEATHER_CACHE_TTL) {
                    applyWeatherData(cached.data);
                    hasFreshCache = true;
                }
            }
        } catch (_) {}

        if (!hasFreshCache) {
            getWeatherData();
        }
        setInterval(getWeatherData, 3600000);
    }

    // =========================================
    //   5. Casa-Concierge (KI-Assistent links vom Wetter-Icon)
    // =========================================
    if (!document.getElementById('casa-concierge-script')) {
        const ccScript = document.createElement('script');
        ccScript.id = 'casa-concierge-script';
        ccScript.src = 'concierge.js';
        ccScript.defer = true;
        document.body.appendChild(ccScript);
    }
});
