// Führt das Skript aus, sobald die HTML-Struktur vollständig geladen ist.
document.addEventListener('DOMContentLoaded', () => {

    // Helferfunktion zum Auswählen von Elementen
    const select = (selector) => document.querySelector(selector);
    const selectAll = (selector) => document.querySelectorAll(selector);

    // =========================================
    //   1. Logik für das Burger-Menü & Slide-Panel
    // =========================================
    const burgerMenuBtn = select('#burger-menu-btn');
    const mainMenuPanel = select('#main-menu-panel');

    if (burgerMenuBtn && mainMenuPanel) {
        burgerMenuBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            // Button und Panel gleichzeitig aktivieren/deaktivieren
            burgerMenuBtn.classList.toggle('is-active');
            mainMenuPanel.classList.toggle('is-active');
            
            // Scrollen der Seite verhindern, wenn Menü aktiv ist
            const isActive = mainMenuPanel.classList.contains('is-active');
            document.body.style.overflow = isActive ? 'hidden' : '';
        });

        document.addEventListener('click', (event) => {
            const isClickInsideMenu = mainMenuPanel.contains(event.target);
            const isClickOnTrigger = burgerMenuBtn.contains(event.target);

            if (mainMenuPanel.classList.contains('is-active') && !isClickInsideMenu && !isClickOnTrigger) {
                mainMenuPanel.classList.remove('is-active');
                burgerMenuBtn.classList.remove('is-active'); // Auch Button-Animation zurücksetzen
                document.body.style.overflow = ''; // Scrollen wieder erlauben
            }
        });
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
    //   4. Logik für das Wetter-Overlay (API Call)
    // =========================================
    const weatherOverlay = select('#weather-overlay');
    
    if (weatherOverlay) {
        const apiKey = '55e0ea5d0963adcdb93ec3a43f670a33'; // Ihr API-Schlüssel
        const city = 'Denia';
        const units = 'metric';
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;
        const weatherDetailsUrl = 'https://www.meteoblue.com/de/wetter/woche/denia_spanien_2518878';

        const temperatureSpan = select('#temperature');

        const getWeatherData = async () => {
            try {
                const response = await fetch(apiUrl);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                
                const data = await response.json();

                if (data?.main?.temp) {
                    temperatureSpan.textContent = data.main.temp.toFixed(0);
                    weatherOverlay.style.display = 'block';
                } else {
                    throw new Error('Temperaturdaten nicht im API-Response gefunden.');
                }
            } catch (error) {
                console.error('Fehler beim Abrufen der Wetterdaten:', error);
            }
        };

        weatherOverlay.addEventListener('click', () => {
            window.open(weatherDetailsUrl, '_blank');
        });

        getWeatherData();
        setInterval(getWeatherData, 3600000); // Jede Stunde aktualisieren
    }
});