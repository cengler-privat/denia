/* =========================================================================
   CASA ENGLERS Y AMIGOS – ZENTRALE ENTDECKER-KARTE (OVERLAY & DISTANZ-BADGES)
   Wird auf ausfluege.html & kulinarisches.html eingebunden.
   ========================================================================= */
(function () {
    'use strict';

    // Optional: Freigabe-Link aus Google My Maps (nach Import von casa-englers-spots.kml)
    const GOOGLE_MY_MAPS_URL = '';

    const CASA_LAT = 38.85690;
    const CASA_LON = 0.06900;
    const MAP_CONSENT_KEY = 'denia_map_consent';

    const SPOTS = [
        {
            id: 'casa',
            name: 'Casa Englers y Amigos',
            cat: 'casa',
            cats: ['casa', 'kulinarik', 'chiringuito', 'ausflug'],
            catLabel: '🏠 Unsere Ferienwohnung',
            icon: '🏠',
            lat: 38.85690,
            lon: 0.06900,
            driveMin: 0,
            img: 'images/meerblick.jpg',
            tip: 'Urbanización Albatros, Ctra. de les Marines km 3.5 – nur 60 m bis zum Sandstrand!',
            mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Urbanizacion+Albatros+Ctra+de+les+Marines+km+3.5+Denia'
        },

        // CHIRINGUITOS
        {
            id: 'tona',
            name: 'Tona Beach Bar',
            cat: 'chiringuito',
            cats: ['chiringuito', 'kulinarik'],
            catLabel: '🏖️ Chiringuito',
            icon: '🏖️',
            lat: 38.85699,
            lon: 0.07154,
            driveMin: 2,
            tip: 'Nur wenige Meter von der Casa! Unser Tipp für eine schnelle „Caña“, einen Tinto de Verano oder eine Sangría vor oder nach der Siesta.',
            extraLabel: '🌐 Website',
            extraUrl: 'https://tonabeachbar.es/',
            routeLabel: 'Route zur Bar',
            mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Tona+Beach+Bar+Denia'
        },
        {
            id: 'mojito',
            name: 'Chiringuito Mojito Dénia',
            cat: 'chiringuito',
            cats: ['chiringuito', 'kulinarik'],
            catLabel: '🏖️ Chiringuito',
            icon: '🍹',
            lat: 38.86053,
            lon: 0.06258,
            driveMin: 3,
            tip: 'Ca. 10 Min. zu Fuß am Strand entlang – frisch gemixte Mojitos und Drinks direkt im Sand.',
            extraLabel: '📸 Instagram',
            extraUrl: 'https://www.instagram.com/chiringuitomojitodenia/',
            routeLabel: 'Route zur Bar',
            mapsUrl: 'https://www.google.com/maps/place/Chiringuito+Mojito+Denia/@38.8621052,0.0450404,3125m/data=!3m1!1e3!4m10!1m3!11m2!2snWsTd3meFCjRp-hnSywe0MAEadV__g!3e3!3m5!1s0x129e1d20f18a0079:0x431c559091f4ab0e!8m2!3d38.8605295!4d0.062584!16s%2Fg%2F11f90vs39n?hl=de'
        },
        {
            id: 'elchiringuito',
            name: 'El Chiringüito',
            cat: 'chiringuito',
            cats: ['chiringuito', 'kulinarik'],
            catLabel: '🏖️ Chiringuito',
            icon: '🏖️',
            lat: 38.86189,
            lon: 0.05557,
            driveMin: 4,
            img: 'images/kulinarik-chiringuito.jpg',
            tip: 'Authentisches Strandbar-Feeling direkt im Sand – schöner Strandspaziergang Richtung Westen von der Casa.',
            routeLabel: 'Route zur Bar',
            mapsUrl: 'https://www.google.com/maps/place/El+Chiring%C3%BCito/@38.8618908,-0.0810601,31201m/data=!3m1!1e3!4m10!1m3!11m2!2snWsTd3meFCjRp-hnSywe0MAEadV__g!3e3!3m5!1s0x129e1cf552265b01:0x38a17d5c07fea702!8m2!3d38.8618908!4d0.0555747!16s%2Fg%2F1jkxz5249?hl=de'
        },
        {
            id: 'marineta',
            name: 'Chiringuito El de la Marineta',
            cat: 'chiringuito',
            cats: ['chiringuito', 'kulinarik'],
            catLabel: '🏖️ Chiringuito & Frühstück',
            icon: '🥐',
            lat: 38.83415,
            lon: 0.12325,
            driveMin: 12,
            img: 'images/spots/marineta.jpg',
            tip: 'Wohlverdientes Frühstück nach einer Jogging-Runde entlang der Promenade (2–8 km) oder abends zum Sundowner!',
            routeLabel: 'Route zur Bar',
            mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Chiringuito+El+de+la+Marineta+Denia'
        },
        {
            id: 'mandala-beach-bar',
            name: 'Mandala Beach Bar (Cala de la Fustera)',
            cat: 'chiringuito',
            cats: ['chiringuito', 'kulinarik'],
            catLabel: '🏖️ Beach Bar · Benissa',
            icon: '🌴',
            lat: 38.66500,
            lon: 0.08777,
            driveMin: 35,
            img: 'images/spots/fustera.jpg',
            tip: 'Entspannte Boho-Beach-Bar direkt über der malerischen Cala de la Fustera (Benissa) – perfekte Kombi aus Baden, Küstenpfad und Sundowner.',
            routeLabel: 'Route zur Bar',
            mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Mandala+Beach+Bar+Cala+de+la+Fustera+Benissa'
        },

        // RESTAURANTS & FRÜHSTÜCK
        {
            id: 'quique-dacosta',
            name: 'Quique Dacosta Restaurante (3★)',
            cat: 'kulinarik',
            cats: ['kulinarik'],
            catLabel: '⭐⭐⭐ 3 Michelin-Sterne · €€€€€',
            icon: '🌟',
            lat: 38.85380,
            lon: 0.08500,
            driveMin: 4,
            img: 'images/spots/quique-dacosta.jpg',
            tip: 'Vermutlich der beste Koch Spaniens, wenn es etwas wirklich Außergewöhnliches sein soll. Englers konnten sich das bisher nicht leisten 😉 €€€€€',
            extraLabel: '🌐 Website',
            extraUrl: 'https://www.quiquedacosta.es/',
            routeLabel: 'Route zum Lokal',
            mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Quique+Dacosta+Restaurante+Carrer+Rascassa+1+Denia'
        },
        {
            id: 'primera-linea',
            name: 'Restaurante Primera Línea',
            cat: 'kulinarik',
            cats: ['kulinarik'],
            catLabel: '🍽️ Paella & Arroz',
            icon: '🥘',
            lat: 38.85361,
            lon: 0.09257,
            driveMin: 5,
            img: 'images/spots/les-marines-restaurant.jpg',
            tip: 'Englers Top-Tipp für Paella & Arroz Negro direkt in 1. Strandlinie. Achtung: in Spanien nur mittags!',
            extraLabel: '🌐 Website',
            extraUrl: 'https://restaurantprimeralinea.com/',
            routeLabel: 'Route zum Lokal',
            mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Restaurante+Primera+Linea+Denia'
        },
        {
            id: 'dexcaro',
            name: 'Dexcaro Experience',
            cat: 'kulinarik',
            cats: ['kulinarik'],
            catLabel: '🍽️ Außergewöhnliche Küche',
            icon: '✨',
            lat: 38.84080,
            lon: 0.10570,
            driveMin: 10,
            tip: 'Außergewöhnliche, kreative Gourmet- & Fusionsküche von Chef Carlos Moreno (Dexcaro & Ossadía) mitten in Dénia – unbedingt vorab reservieren!',
            extraLabel: '🌐 Website',
            extraUrl: 'https://dexcaro.es/',
            routeLabel: 'Route zum Lokal',
            mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Dexcaro+Experience+Carrer+Abu-S-Salt+1+Denia'
        },
        {
            id: 'pepa-teresa',
            name: 'Pepa Teresa (Calle Loreto)',
            cat: 'kulinarik',
            cats: ['kulinarik'],
            catLabel: '🍽️ Tapas & Altstadt',
            icon: '🍤',
            lat: 38.84150,
            lon: 0.10650,
            driveMin: 10,
            tip: 'Kult-Tapas mitten in der autofreien Schlemmergasse Calle Loreto – am besten kurz vor 20 Uhr kommen.',
            extraLabel: '🍽️ Reservieren',
            extraUrl: 'https://calapepateresa.com/reservar/',
            routeLabel: 'Route zum Lokal',
            mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Pepa+Teresa+Calle+Loreto+Denia'
        },
        {
            id: 'mivilla-carrio',
            name: 'Mi Villa Nº 1 & Bar Carrió',
            cat: 'kulinarik',
            cats: ['kulinarik'],
            catLabel: '☕ Spanisches Frühstück',
            icon: '☕',
            lat: 38.84002,
            lon: 0.10698,
            driveMin: 10,
            img: 'images/spots/marques-campo.jpg',
            tip: 'Calle Marqués de Campo 1 & 3: Typisches spanisches Frühstück mit Café solo/con leche, Zumo & Tostada!',
            routeLabel: 'Route zum Café',
            mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Mi+Villa+Numero+1+Marques+de+Campo+Denia'
        },
        {
            id: 'republic',
            name: 'Republic Dénia (Marina)',
            cat: 'kulinarik',
            cats: ['kulinarik'],
            catLabel: '🍽️ Marina & Cross-Over',
            icon: '🛥️',
            lat: 38.83992,
            lon: 0.12104,
            driveMin: 12,
            img: 'images/kulinarik-republic.jpg',
            tip: 'Stylische Location direkt im Yachthafen mit Blick aufs Wasser, Boote und den Montgó.',
            extraLabel: '🍽️ Reservieren',
            extraUrl: 'https://republicdenia.com/',
            routeLabel: 'Route zum Hafen',
            mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Republic+Marina+de+Denia'
        },
        {
            id: 'mala-vita',
            name: 'Mala Vita (Marina)',
            cat: 'kulinarik',
            cats: ['kulinarik'],
            catLabel: '🍹 Cocktails & Sundowner',
            icon: '🍸',
            lat: 38.83969,
            lon: 0.12135,
            driveMin: 12,
            img: 'images/kulinarik-mala-vita.jpg',
            tip: 'Eher unser Tipp für einen richtig guten Cocktail oder Sundowner am Hafen als fürs Essen – ohne Reservierung!',
            extraLabel: '🌐 Website',
            extraUrl: 'https://malavitadenia.com/',
            routeLabel: 'Route zum Hafen',
            mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Mala+Vita+Marina+de+Denia'
        },
        {
            id: 'sucreria',
            name: 'La Sucreria de la Plaça (Jávea)',
            cat: 'kulinarik',
            cats: ['kulinarik'],
            catLabel: '🍽️ Außerhalb Dénias · Jávea',
            icon: '⭐',
            lat: 38.78928,
            lon: 0.16375,
            driveMin: 22,
            img: 'images/spots/javea-placa.jpg',
            tip: 'Kreative Tapas auf der historischen Plaça de l\'Església in Jávea – abends unbedingt draußen reservieren!',
            extraLabel: '🍽️ Reservieren',
            extraUrl: 'https://widget.thefork.com/es/d4004ab4-2bcf-427d-9eb0-c3b3e2ab154d?step=date&utm_source=google.com',
            routeLabel: 'Route nach Jávea',
            mapsUrl: 'https://www.google.com/maps/search/?api=1&query=La+Sucreria+de+la+Placa+Javea'
        },
        {
            id: 'cala-clemence',
            name: 'Cala Clémence del Portitxol',
            cat: 'kulinarik',
            cats: ['kulinarik', 'ausflug'],
            catLabel: '📸 Insta-Tipp & Traumbucht · Jávea',
            icon: '📸',
            lat: 38.75216,
            lon: 0.22397,
            driveMin: 30,
            img: 'images/kulinarik-cala-clemence.jpg',
            tip: 'Weiß-blaue Postkartenbucht & Beach-Restaurant direkt über dem Meer. Am Wochenende nur mit Reservierung!',
            extraLabel: '🍽️ Website',
            extraUrl: 'https://calaclemence.com/',
            routeLabel: 'Route zur Bucht',
            mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Cala+Clemence+del+Portitxol+Javea'
        },
        {
            id: 'sur',
            name: 'Restaurante Sur (Cala Granadella)',
            cat: 'kulinarik',
            cats: ['kulinarik'],
            catLabel: '🍽️ Außerhalb Dénias · Jávea',
            icon: '🥘',
            lat: 38.72972,
            lon: 0.19587,
            driveMin: 32,
            img: 'images/spots/granadella.jpg',
            tip: 'Traditions-Restaurant seit 50+ Jahren direkt in der Cala Granadella. Reisgerichte 24h vorher bestellen!',
            extraLabel: '🍽️ Reservieren',
            extraUrl: 'https://restaurantesur.com/reservas/',
            routeLabel: 'Route zur Bucht',
            mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Restaurante+Sur+Cala+Granadella+Javea'
        },

        // AUSFLÜGE & BUCHTEN
        {
            id: 'via-verde',
            name: 'Vía Verde de Dénia',
            cat: 'ausflug',
            cats: ['ausflug'],
            catLabel: '🧭 Radfahren & Spazieren',
            icon: '🚲',
            lat: 38.84332,
            lon: 0.08584,
            driveMin: 7,
            img: 'images/spots/via-verde.jpg',
            tip: 'Flacher Rad- und Spazierweg auf einer alten Bahntrasse durch duftende Orangenhaine – Einstieg nah an der Casa.',
            routeLabel: 'Route zum Start',
            mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Via+Verde+de+Denia'
        },
        {
            id: 'castillo',
            name: 'Castillo de Dénia & Baix la Mar',
            cat: 'ausflug',
            cats: ['ausflug'],
            catLabel: '🧭 Altstadt & Kultur',
            icon: '🏰',
            lat: 38.84300,
            lon: 0.10749,
            driveMin: 10,
            img: 'images/ausflug-castillo.jpg',
            tip: 'Historische Burg mit 360°-Blick über Hafen & Meer – beim Abstieg durch das Fischerviertel Baix la Mar bummeln.',
            routeLabel: 'Route zur Burg',
            mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Castillo+de+Denia'
        },
        {
            id: 'jardin-albarda',
            name: 'Jardín de l’Albarda',
            cat: 'ausflug',
            cats: ['ausflug'],
            catLabel: '🧭 Botanischer Garten',
            icon: '🌺',
            lat: 38.80860,
            lon: 0.05790,
            driveMin: 12,
            img: 'images/spots/jardin-albarda.jpg',
            tip: '50.000 m² großer mediterraner Renaissance-Garten (Urb. La Sella, Pedreguer) mit über 700 heimischen Pflanzenarten, Pergolen und herrlicher Ruhe.',
            extraLabel: '🌐 Website',
            extraUrl: 'https://www.jardinalbarda.com/',
            routeLabel: 'Route zum Garten',
            mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Jardin+de+l+Albarda+Pedreguer'
        },
        {
            id: 'hoehenweg-montgo',
            name: 'Höhenweg Montgó (Sunset-Tipp)',
            cat: 'ausflug',
            cats: ['ausflug'],
            catLabel: '🧭 Abendwanderung',
            icon: '🌅',
            lat: 38.81916,
            lon: 0.10711,
            driveMin: 14,
            img: 'images/spots/hoehenweg-montgo.jpg',
            tip: 'Traumhafter Höhenweg am Montgó-Hang mit genialem Abendlicht. Am besten abends starten – mindestens 2 Stunden vor Sonnenuntergang!',
            routeLabel: 'Parkplatz Einstieg',
            isParking: true,
            mapsUrl: 'https://www.google.com/maps/search/?api=1&query=38.819162,0.107109'
        },
        {
            id: 'montgo',
            name: 'Naturpark El Montgó (Start Pare Pere)',
            cat: 'ausflug',
            cats: ['ausflug'],
            catLabel: '🧭 Bergziegen & Natur',
            icon: '⛰️',
            lat: 38.82520,
            lon: 0.11750,
            driveMin: 14,
            img: 'images/spots/montgo.jpg',
            tip: 'Unser 753 m hoher Hausberg! Im Sommer früh starten, viel Wasser & feste Schuhe mitnehmen.',
            routeLabel: 'Route zum Start',
            mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Pare+Pere+Camino+de+la+Colonia+Denia'
        },
        {
            id: 'kite45',
            name: 'Kite45 (Platja de les Deveses)',
            cat: 'ausflug',
            cats: ['ausflug'],
            catLabel: '🧭 Kitesurf & Strand',
            icon: '🪁',
            lat: 38.88331,
            lon: -0.03531,
            driveMin: 15,
            img: 'images/spots/kite45.jpg',
            tip: 'Top Kitesurf- & Wingfoil-Spot am weitläufigen Naturstrand Platja de les Deveses mit zuverlässigem thermischem Garbí-Wind – auch super zum Zuschauen!',
            extraLabel: '🌐 kite45.com',
            extraUrl: 'https://kite45.com/',
            routeLabel: 'Route zum Strand',
            mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Kite45+Platja+de+les+Deveses+Denia'
        },
        {
            id: 'torre-gerro',
            name: 'Les Rotes, Torre del Gerro & Cova Tallada',
            cat: 'ausflug',
            cats: ['ausflug'],
            catLabel: '🧭 Klippen, Turm & Höhle',
            icon: '🗼',
            lat: 38.81985,
            lon: 0.15954,
            driveMin: 18,
            img: 'images/spots/torre-gerro.jpg',
            tip: 'Piraten-Wachturm (16. Jh.) über der Felsküste & Einstieg zur Meereshöhle Cova Tallada (in der Saison Anmeldung nötig!).',
            extraLabel: '🎫 Anmelden',
            extraUrl: 'https://www.covatalladadenia.com/de/reservat-cova-tallada/',
            routeLabel: 'Route zum Turm',
            mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Torre+del+Gerro+Denia'
        },
        {
            id: 'cova-calaveres',
            name: 'Cova de les Calaveres (Benidoleig)',
            cat: 'ausflug',
            cats: ['ausflug'],
            catLabel: '🧭 Tropfsteinhöhle',
            icon: '🦇',
            lat: 38.79320,
            lon: -0.01730,
            driveMin: 18,
            img: 'images/spots/cova-calaveres.jpg',
            tip: 'Eindrucksvolle Tropfsteinhöhle bei Benidoleig mit prähistorischen Funden und kleinem unterirdischem See – ganzjährig angenehm kühl!',
            extraLabel: '🌐 Infos',
            extraUrl: 'https://cuevadelascalaveras.com/',
            routeLabel: 'Route zur Höhle',
            mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Cova+de+les+Calaveres+Benidoleig'
        },
        {
            id: 'marjal-pego',
            name: 'Nationalpark Marjal de Pego-Oliva',
            cat: 'ausflug',
            cats: ['ausflug'],
            catLabel: '🧭 Naturpark & Quelle',
            icon: '🦩',
            lat: 38.87110,
            lon: -0.06420,
            driveMin: 20,
            img: 'images/spots/marjal-pego.jpg',
            tip: 'Naturpark mit glasklarem Fluss (Río Bullent), der warmen Quelle Font Salada zum Baden, Reisfeldern & Wasservögeln – auch super für eine flache Radtour.',
            routeLabel: 'Route zum Park',
            mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Parque+Natural+Marjal+de+Pego-Oliva'
        },
        {
            id: 'cap-de-sant-antoni',
            name: 'Cap de Sant Antoni',
            cat: 'ausflug',
            cats: ['ausflug'],
            catLabel: '🧭 Leuchtturm & Meeresschutzgebiet',
            icon: '🌊',
            lat: 38.80316,
            lon: 0.19730,
            driveMin: 22,
            img: 'images/spots/cap-sant-antoni.jpg',
            tip: 'Spektakuläres Kap zwischen Dénia und Jávea mit weißem Leuchtturm, steilen Kalkklippen und grandiosem Blick über die gesamte Bucht von Jávea!',
            routeLabel: 'Route zum Kap',
            mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Faro+del+Cabo+de+San+Antonio+Javea'
        },
        {
            id: 'cap-de-la-nau',
            name: 'Cap de la Nau',
            cat: 'ausflug',
            cats: ['ausflug'],
            catLabel: '🧭 Östlichstes Kap · Jávea',
            icon: '⚓',
            lat: 38.73306,
            lon: 0.23011,
            driveMin: 30,
            img: 'images/spots/cap-la-nau.jpg',
            tip: 'Östlichster Punkt der Provinz Alicante mit Leuchtturm über schneeweißen Steilklippen – an klaren Tagen sieht man von hier bis nach Ibiza!',
            routeLabel: 'Route zum Kap',
            mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Faro+del+Cabo+de+la+Nao+Javea'
        },
        {
            id: 'cala-moraig',
            name: 'Startpunkt Cala del Moraig (Parkplatz)',
            cat: 'ausflug',
            cats: ['ausflug'],
            catLabel: '🧭 Start Klippenwanderung',
            icon: '🅿️',
            lat: 38.70775,
            lon: 0.16519,
            driveMin: 35,
            tip: 'Startpunkt für die Wanderung zur Cala Llebeig – Parkplatz in der Saison unbedingt vorab online reservieren!',
            extraLabel: '🅿️ Buchen',
            extraUrl: 'https://calamoraig.es/tienda/',
            routeLabel: 'Parkplatz Start',
            isParking: true,
            mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Cala+del+Moraig+Benitachell'
        },
        {
            id: 'cala-llebeig',
            name: 'Cala Llebeig (Klippenwanderung)',
            cat: 'ausflug',
            cats: ['ausflug'],
            catLabel: '🧭 Versteckte Bucht',
            icon: '🥾',
            lat: 38.69865,
            lon: 0.15578,
            driveMin: 35,
            img: 'images/ausflug-cala-llebeig.jpg',
            tip: 'Autofreie ehemalige Schmugglerbucht mit Fischerhütten über die Ruta de los Acantilados ab Cala del Moraig (ca. 4 km Hin & Rück).',
            extraLabel: '🅿️ Buchen',
            extraUrl: 'https://calamoraig.es/tienda/',
            routeLabel: 'Parkplatz Start',
            isParking: true,
            mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Cala+del+Moraig+Benitachell'
        },
        {
            id: 'coll-de-rates',
            name: 'Coll de Rates (Panoramastraße)',
            cat: 'ausflug',
            cats: ['ausflug'],
            catLabel: '🧭 Panoramastraße & Radprofis',
            icon: '🚴',
            lat: 38.72360,
            lon: -0.05940,
            driveMin: 38,
            img: 'images/spots/coll-de-rates.jpg',
            tip: 'Tolle Panoramastraße (628 m) durchs Hinterland & legendäres Trainingsrevier der WorldTour-Radprofis. Oben warten Weitblick bis zum Meer und ein Panoramarestaurant.',
            routeLabel: 'Route zum Pass',
            mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Coll+de+Rates+Parcent+Alicante'
        },
        {
            id: 'penon-ifach',
            name: 'Wanderung Peñón de Ifach (Calpe)',
            cat: 'ausflug',
            cats: ['ausflug'],
            catLabel: '🧭 Gipfelwanderung',
            icon: '⛰️',
            lat: 38.63420,
            lon: 0.07640,
            driveMin: 38,
            img: 'images/spots/penon-ifach.jpg',
            tip: 'Wahrzeichen der Costa Blanca (332 m): Durch den Felstunnel mit festem Schuhwerk & Trittsicherheit bis zum Gipfel-Panorama. Gratis Online-Reservierung vorab nötig!',
            extraLabel: '🎫 Gratis-Ticket',
            extraUrl: 'https://parquesnaturales.gva.es/es/web/pn-penyal-d-ifac',
            routeLabel: 'Route zum Felsen',
            mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Penon+de+Ifach+Calpe'
        },
        {
            id: 'altea',
            name: 'Altea (Weiße Altstadt)',
            cat: 'ausflug',
            cats: ['ausflug'],
            catLabel: '🧭 Altstadt-Perle',
            icon: '⛪',
            lat: 38.59890,
            lon: -0.05140,
            driveMin: 45,
            img: 'images/spots/altea.jpg',
            tip: 'Malerische weiße Altstadt mit Kopfsteinpflaster, kleinen Künstler-Boutiquen und der berühmten blauen Kirchenkuppel hoch über der Bucht – abends besonders schön!',
            routeLabel: 'Route zur Altstadt',
            mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Casco+Antiguo+Altea+Alicante'
        },
        {
            id: 'benidorm',
            name: 'Benidorm (abschreckender Kontrast 😄)',
            cat: 'ausflug',
            cats: ['ausflug'],
            catLabel: '🧭 Kontrast-Ausflug',
            icon: '🏙️',
            lat: 38.53320,
            lon: -0.13150,
            driveMin: 50,
            img: 'images/spots/benidorm.jpg',
            tip: 'Das „Manhattan der Costa Blanca“ – bewusst als abschreckender Kontrast! Einmal vom Balcón del Mediterráneo auf die Skyline schauen und danach unser entspanntes Dénia noch mehr lieben.',
            routeLabel: 'Route zur Skyline',
            mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Balcon+del+Mediterraneo+Benidorm'
        },
        {
            id: 'fonts-algar',
            name: 'Fonts de l’Algar (Wasserfälle)',
            cat: 'ausflug',
            cats: ['ausflug'],
            catLabel: '🧭 Wasserfälle & Baden',
            icon: '💦',
            lat: 38.65935,
            lon: -0.09600,
            driveMin: 52,
            img: 'images/spots/fonts-algar.jpg',
            tip: 'Kristallklare Wasserfälle und natürliche Felsenpools zum Baden – am besten früh morgens hin, Badeschuhe einpacken und ideal mit Guadalest kombinieren!',
            routeLabel: 'Route zum Wasserfall',
            mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Fonts+de+l+Algar+Callosa+den+Sarria'
        },
        {
            id: 'guadalest',
            name: 'El Castell de Guadalest',
            cat: 'ausflug',
            cats: ['ausflug'],
            catLabel: '🧭 Bergdorf & Burg',
            icon: '🏰',
            lat: 38.67564,
            lon: -0.19877,
            driveMin: 60,
            img: 'images/spots/guadalest.jpg',
            tip: 'Spektakuläres Bergdorf wie ein Adlerhorst auf einem Felsen mit Burg, kleinen Museen und Blick auf den türkisblauen Stausee. Perfekte Kombi mit den Fonts de l’Algar!',
            routeLabel: 'Route zur Burg',
            mapsUrl: 'https://www.google.com/maps/search/?api=1&query=El+Castell+de+Guadalest+Alicante'
        },
        {
            id: 'alicante',
            name: 'Alicante (Rambla & Castillo de Santa Bárbara)',
            cat: 'ausflug',
            cats: ['ausflug'],
            catLabel: '🧭 Städtetrip · Costa Blanca',
            icon: '🏛️',
            lat: 38.34890,
            lon: -0.47800,
            driveMin: 65,
            img: 'images/spots/alicante.jpg',
            tip: 'Lebendiger Tagesausflug nach Alicante: über die palmengesäumte Rambla & Explanada de España bummeln und hoch aufs imposante Castillo de Santa Bárbara (auch per Fels-Aufzug!).',
            routeLabel: 'Route zur Burg',
            mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Castillo+de+Santa+Barbara+Alicante'
        },
        {
            id: 'pasarela-relleu',
            name: 'Pasarela de Relleu',
            cat: 'ausflug',
            cats: ['ausflug'],
            catLabel: '🧭 Schlucht & Holzsteg',
            icon: '🌉',
            lat: 38.56296,
            lon: -0.28846,
            driveMin: 75,
            tip: 'Der „Caminito del Rey“ der Costa Blanca: Spektakulärer Holzsteg an der Felswand mit Glasboden-Aussichtsplattform (ca. 10 km Wanderung hin & zurück). Zeitfenster-Ticket vorab buchen!',
            extraLabel: '🎫 Tickets',
            extraUrl: 'https://pasareladerelleu.es/',
            routeLabel: 'Route zum Steg',
            mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Pasarela+de+Relleu+Alicante'
        },
        {
            id: 'oceanografic',
            name: 'L’Oceanogràfic (Valencia)',
            cat: 'ausflug',
            cats: ['ausflug'],
            catLabel: '🧭 Tagesausflug · Valencia',
            icon: '🐬',
            lat: 39.45279,
            lon: -0.34812,
            driveMin: 75,
            img: 'images/spots/oceanografic.jpg',
            tip: 'Europas größtes Aquarium mit Unterwassertunnel, Haien, Belugas & futuristischer Architektur in der Ciudad de las Artes y las Ciencias – toller Tagesausflug!',
            extraLabel: '🎫 Tickets',
            extraUrl: 'https://www.oceanografic.org/',
            routeLabel: 'Route nach Valencia',
            mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Oceanografic+Valencia'
        },
        {
            id: 'ibiza-formentera',
            name: 'Ibiza & Formentera (Schnellfähre ab Dénia)',
            cat: 'ausflug',
            cats: ['ausflug'],
            catLabel: '⛴️ Insel-Trip · Balearen',
            icon: '⛴️',
            lat: 38.84550,
            lon: 0.11380,
            driveMin: 120,
            sortOrderKm: 115,
            badgeLabel: '⛴️ ca. 2 Std. Fähre',
            popupDistLabel: '10 Min. zum Hafen + ~2 Std. Schnellfähre',
            img: 'images/spots/ibiza-formentera.jpg',
            tip: 'Direkt ab dem Fährhafen Baleària Port in Dénia geht es per Schnellfähre in rund 2 Stunden nach Ibiza oder Formentera – als Tagesausflug oder noch besser mit 1–2 Übernachtungen!',
            extraLabel: '⛴️ Baleària',
            extraUrl: 'https://www.balearia.com/de',
            routeLabel: 'Zum Fährhafen',
            mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Balearia+Port+Estacion+Maritima+Denia'
        }
    ];

    function calcDistanceKm(lat, lon) {
        const R = 6371;
        const dLat = (lat - CASA_LAT) * Math.PI / 180;
        const dLon = (lon - CASA_LON) * Math.PI / 180;
        const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(CASA_LAT * Math.PI / 180) * Math.cos(lat * Math.PI / 180) *
            Math.sin(dLon / 2) ** 2;
        return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }

    function getSortDistanceKm(spot) {
        if (typeof spot.sortOrderKm === 'number') return spot.sortOrderKm;
        return calcDistanceKm(spot.lat, spot.lon);
    }

    function formatDriveCompact(mins) {
        if (mins >= 60) {
            const h = Math.floor(mins / 60);
            const m = mins % 60;
            return m === 0 ? `ca. ${h} Std.` : `ca. ${h} Std. ${m} Min.`;
        }
        return `ca. ${mins} Min.`;
    }

    function formatSpotBadgeText(spot) {
        if (!spot) return '';
        if (spot.badgeLabel) return spot.badgeLabel;
        if (spot.id === 'casa') return '🏠 60 m zum Meer';
        const km = calcDistanceKm(spot.lat, spot.lon);
        if (km < 1.35) {
            const m = Math.round(km * 100) * 10;
            const mins = Math.max(2, Math.round(km * 14));
            const distTxt = m >= 1000 ? `${(m / 1000).toFixed(1).replace('.', ',')} km` : `${m} m`;
            return `🚶 ~${mins} Min. · ${distTxt}`;
        }
        const kmLabel = km >= 20 ? `${Math.round(km)} km` : `${km.toFixed(1).replace('.', ',')} km`;
        return `🚗 ${formatDriveCompact(spot.driveMin)} · ${kmLabel}`;
    }

    function formatPopupDistText(spot) {
        if (spot.popupDistLabel) return spot.popupDistLabel;
        if (spot.id === 'casa') return 'Startpunkt · 60 m zum Meer';
        const km = calcDistanceKm(spot.lat, spot.lon);
        if (km < 1.35) {
            const m = Math.round(km * 100) * 10;
            const mins = Math.max(2, Math.round(km * 14));
            return `ca. ${m} m · ~${mins} Min. zu Fuß`;
        }
        const kmLabel = km >= 20 ? `${Math.round(km)} km` : `${km.toFixed(1).replace('.', ',')} km`;
        return `${formatDriveCompact(spot.driveMin)} Auto · ${kmLabel} ab Casa`;
    }

    function compassSvg(size, needleColor) {
        return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9.5"/><polygon points="16.2 7.8 14.1 14.1 7.8 16.2 9.9 9.9 16.2 7.8" fill="${needleColor}" stroke="${needleColor}" stroke-width="1.2"/></svg>`;
    }

    function gmapsPinSvg(size) {
        return `<svg class="btn-svg-icon" width="${size}" height="${size}" viewBox="0 0 24 24" aria-hidden="true"><path fill="#EA4335" d="M12 2C8.13 2 5 5.13 5 9c0 1.74.5 3.37 1.41 4.84L12 22l5.59-8.16C18.5 12.37 19 10.74 19 9c0-3.87-3.13-7-7-7z"/><path fill="#4285F4" d="M12 2a7 7 0 0 0-7 7c0 1.47.45 2.84 1.22 3.97L12 9V2z"/><path fill="#FBBC04" d="M6.22 12.97 12 22V9l-5.78 3.97z"/><path fill="#34A853" d="M12 22l5.78-9.03A6.96 6.96 0 0 0 19 9h-7v13z"/><circle fill="#FFFFFF" cx="12" cy="9" r="2.7"/></svg>`;
    }

    function parkingSvg(size) {
        return `<svg class="btn-svg-icon" width="${size}" height="${size}" viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="4" fill="#2563EB"/><path fill="#FFFFFF" d="M9 18V6h4.8c2.3 0 3.9 1.4 3.9 3.7 0 2.3-1.6 3.7-3.9 3.7H11.5V18H9zm2.5-6.7h2c1.1 0 1.7-.6 1.7-1.6s-.6-1.6-1.7-1.6h-2v3.2z"/></svg>`;
    }

    /* =====================================================================
       STYLES FÜR DISTANZ-BADGES, FILTER-LEISTE & KARTEN-OVERLAY INJIZIEREN
       ===================================================================== */
    function injectStyles() {
        if (document.getElementById('casa-spots-map-styles')) return;
        const style = document.createElement('style');
        style.id = 'casa-spots-map-styles';
        style.textContent = `
            /* Filter-Block (Kategorie + Anfahrt inkl. Entdecker-Karte) */
            .filter-stack {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 10px;
            }
            .distance-filter-bar {
                display: inline-flex;
                flex-wrap: wrap;
                align-items: center;
                justify-content: center;
                gap: 6px;
                background: rgba(15, 23, 42, 0.48);
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
                padding: 6px 10px;
                border-radius: 26px;
                border: 1px solid rgba(56, 189, 248, 0.28);
                max-width: 100%;
                box-sizing: border-box;
            }
            .dist-filter-label {
                font-family: 'Lato', sans-serif;
                font-size: 11px;
                font-weight: 700;
                letter-spacing: 1px;
                text-transform: uppercase;
                color: rgba(255, 255, 255, 0.62);
                padding: 0 4px;
            }
            .dist-btn {
                background: transparent;
                border: none;
                color: rgba(255, 255, 255, 0.86);
                padding: 7px 13px;
                border-radius: 20px;
                font-family: 'Lato', sans-serif;
                font-size: 13px;
                font-weight: 700;
                cursor: pointer;
                transition: all 0.22s ease;
                white-space: nowrap;
            }
            .dist-btn:hover {
                background: rgba(56, 189, 248, 0.16);
                color: #ffffff;
            }
            .dist-btn.active {
                background: #38bdf8;
                color: #0f172a;
                box-shadow: 0 4px 14px rgba(56, 189, 248, 0.35);
            }
            .dist-divider {
                width: 1px;
                height: 18px;
                background: rgba(255, 255, 255, 0.22);
                margin: 0 2px;
            }
            .dist-map-btn {
                display: inline-flex;
                align-items: center;
                gap: 6px;
                background: rgba(245, 158, 11, 0.16);
                border: 1px solid rgba(245, 158, 11, 0.55);
                color: #fde68a;
                padding: 6px 13px;
                border-radius: 20px;
                font-family: 'Lato', sans-serif;
                font-size: 13px;
                font-weight: 700;
                cursor: pointer;
                transition: all 0.22s ease;
                white-space: nowrap;
            }
            .dist-map-btn:hover {
                background: #f59e0b;
                color: #0f172a;
                border-color: #f59e0b;
            }

            /* Klickbares Entfernung/Anfahrtsdauer-Badge rechts oben im Kartenbild */
            .spot-dist-pill {
                position: absolute;
                top: 12px;
                right: 12px;
                z-index: 3;
                display: inline-flex;
                align-items: center;
                gap: 6px;
                background: rgba(15, 23, 42, 0.8);
                backdrop-filter: blur(8px);
                -webkit-backdrop-filter: blur(8px);
                color: #ffffff;
                padding: 6px 12px;
                border-radius: 20px;
                font-family: 'Lato', sans-serif;
                font-size: 11.5px;
                font-weight: 700;
                border: 1px solid rgba(255, 255, 255, 0.25);
                box-shadow: 0 4px 12px rgba(15, 23, 42, 0.3);
                letter-spacing: 0.2px;
                white-space: nowrap;
                cursor: pointer;
                transition: all 0.2s ease;
            }
            .spot-dist-pill:hover {
                background: rgba(15, 23, 42, 0.96);
                border-color: #38bdf8;
                color: #7dd3fc;
                transform: translateY(-1px) scale(1.03);
                box-shadow: 0 6px 16px rgba(56, 189, 248, 0.3);
            }
            .spot-dist-pill svg {
                flex-shrink: 0;
                color: #7dd3fc;
            }

            /* Einheitliche einzeilige Action-Buttons mit SVG-Icons */
            .spot-actions .action-btn {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                gap: 6px;
                white-space: nowrap;
            }
            .btn-svg-icon {
                flex-shrink: 0;
                display: inline-block;
                vertical-align: middle;
            }

            /* Empty State wenn Kombi-Filter 0 Treffer liefert */
            .spots-empty-state {
                grid-column: 1 / -1;
                text-align: center;
                background: #ffffff;
                border-radius: 20px;
                padding: 36px 20px;
                border: 1px dashed rgba(15, 23, 42, 0.18);
                color: #475569;
                font-family: 'Lato', sans-serif;
            }
            .spots-empty-state p { margin: 0 0 14px 0; font-size: 0.98rem; }
            .spots-empty-state button {
                background: #0f172a;
                color: #ffffff;
                border: none;
                padding: 10px 18px;
                border-radius: 12px;
                font-family: 'Lato', sans-serif;
                font-size: 13.5px;
                font-weight: 700;
                cursor: pointer;
            }

            /* =========================================================
               AIRBNB-STYLE KARTEN-OVERLAY (MODAL)
               ========================================================= */
            .spot-map-overlay {
                position: fixed;
                inset: 0;
                z-index: 9500;
                background: rgba(15, 23, 42, 0.78);
                backdrop-filter: blur(6px);
                -webkit-backdrop-filter: blur(6px);
                display: none;
                align-items: center;
                justify-content: center;
                padding: 16px;
                box-sizing: border-box;
            }
            .spot-map-overlay.open {
                display: flex;
            }
            .spot-map-modal {
                position: relative;
                width: 100%;
                max-width: 1200px;
                height: 88vh;
                max-height: 860px;
                background: #ffffff;
                border-radius: 24px;
                overflow: hidden;
                box-shadow: 0 28px 70px rgba(0, 0, 0, 0.45);
                display: flex;
                flex-direction: column;
            }
            .smo-header {
                background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
                color: #ffffff;
                padding: 12px 16px;
                display: flex;
                flex-direction: column;
                gap: 8px;
                flex-shrink: 0;
            }
            .smo-top-row {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 12px;
            }
            .smo-title-wrap {
                display: flex;
                align-items: center;
                gap: 10px;
                min-width: 0;
            }
            .smo-title {
                font-family: 'Playfair Display', serif;
                font-size: 1.25rem;
                margin: 0;
                color: #ffffff;
                white-space: nowrap;
                display: inline-flex;
                align-items: center;
                gap: 8px;
            }
            .smo-count {
                font-family: 'Lato', sans-serif;
                font-size: 12px;
                font-weight: 700;
                color: #7dd3fc;
                background: rgba(56, 189, 248, 0.14);
                border: 1px solid rgba(56, 189, 248, 0.3);
                padding: 3px 9px;
                border-radius: 14px;
                white-space: nowrap;
            }
            .smo-close-btn {
                background: rgba(255, 255, 255, 0.12);
                color: #ffffff;
                border: 1px solid rgba(255, 255, 255, 0.2);
                width: 36px;
                height: 36px;
                border-radius: 50%;
                font-size: 18px;
                line-height: 1;
                cursor: pointer;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
                transition: background 0.2s ease;
            }
            .smo-close-btn:hover { background: rgba(255, 255, 255, 0.25); }

            .smo-filters {
                display: flex;
                flex-wrap: wrap;
                align-items: center;
                gap: 6px;
            }
            .smo-pill {
                background: rgba(255, 255, 255, 0.08);
                border: 1px solid rgba(255, 255, 255, 0.14);
                color: rgba(255, 255, 255, 0.86);
                padding: 5px 11px;
                border-radius: 18px;
                font-family: 'Lato', sans-serif;
                font-size: 12.5px;
                font-weight: 700;
                cursor: pointer;
                transition: all 0.2s ease;
                white-space: nowrap;
            }
            .smo-pill:hover { background: rgba(255, 255, 255, 0.16); color: #ffffff; }
            .smo-pill.active-cat {
                background: #f59e0b;
                color: #0f172a;
                border-color: #f59e0b;
            }
            .smo-pill.active-dist {
                background: #38bdf8;
                color: #0f172a;
                border-color: #38bdf8;
            }
            .smo-divider {
                width: 1px;
                height: 18px;
                background: rgba(255, 255, 255, 0.2);
                margin: 0 2px;
            }

            .smo-stage {
                position: relative;
                flex: 1;
                min-height: 260px;
                background: #0f172a;
            }
            #smo-leaflet-map {
                width: 100%;
                height: 100%;
                z-index: 1;
            }

            /* 2-Klick Datenschutz-Gate im Overlay */
            .smo-consent-gate {
                position: absolute;
                inset: 0;
                z-index: 500;
                background: radial-gradient(circle at 30% 20%, rgba(56, 189, 248, 0.22), transparent 55%),
                            linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
                color: #ffffff;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                text-align: center;
                padding: 24px 20px;
            }
            .smo-consent-gate.hidden { display: none; }
            .smo-consent-gate h3 {
                font-family: 'Playfair Display', serif;
                font-size: clamp(1.35rem, 2.8vw, 1.85rem);
                margin: 10px 0 10px 0;
                color: #ffffff;
            }
            .smo-consent-gate p {
                font-family: 'Lato', sans-serif;
                font-size: 0.94rem;
                color: rgba(255, 255, 255, 0.82);
                max-width: 480px;
                line-height: 1.55;
                margin: 0 0 16px 0;
            }
            .smo-consent-gate a { color: #7dd3fc; }
            .smo-remember {
                display: inline-flex;
                align-items: center;
                gap: 8px;
                font-family: 'Lato', sans-serif;
                font-size: 0.88rem;
                color: rgba(255, 255, 255, 0.88);
                margin-bottom: 18px;
                cursor: pointer;
            }
            .smo-remember input { width: 16px; height: 16px; accent-color: #f59e0b; }
            .smo-load-btn {
                background: #f59e0b;
                color: #0f172a;
                border: none;
                padding: 13px 24px;
                border-radius: 14px;
                font-family: 'Lato', sans-serif;
                font-size: 0.96rem;
                font-weight: 700;
                cursor: pointer;
                display: inline-flex;
                align-items: center;
                gap: 8px;
                box-shadow: 0 10px 25px rgba(245, 158, 11, 0.35);
            }
            .smo-load-btn:hover { background: #fbbf24; }

            .smo-footer {
                position: relative;
                display: flex;
                flex-wrap: wrap;
                align-items: center;
                justify-content: space-between;
                gap: 8px 14px;
                padding: 10px 16px;
                background: #f8fafc;
                border-top: 1px solid #e2e8f0;
                flex-shrink: 0;
                font-family: 'Lato', sans-serif;
            }
            .smo-legend {
                display: flex;
                flex-wrap: wrap;
                align-items: center;
                gap: 12px;
                font-size: 12px;
                font-weight: 700;
                color: #334155;
            }
            .smo-legend-dot { display: inline-flex; align-items: center; gap: 5px; }
            .smo-swatch { width: 10px; height: 10px; border-radius: 50%; display: inline-block; }
            .smo-actions {
                display: flex;
                flex-wrap: wrap;
                align-items: center;
                gap: 6px;
            }
            .smo-mini-btn {
                background: #ffffff;
                border: 1px solid #cbd5e1;
                color: #334155;
                padding: 5px 11px;
                border-radius: 9px;
                font-family: 'Lato', sans-serif;
                font-size: 12px;
                font-weight: 700;
                cursor: pointer;
                text-decoration: none;
                display: inline-flex;
                align-items: center;
                gap: 5px;
                white-space: nowrap;
            }
            .smo-mini-btn:hover { background: #e2e8f0; color: #0f172a; }
            .smo-mini-btn.kml { background: #0f172a; color: #ffffff; border-color: #0f172a; }
            .smo-mini-btn.kml:hover { background: #f59e0b; color: #0f172a; border-color: #f59e0b; }
            .smo-mini-btn.kml-help {
                background: #e0f2fe;
                border-color: #7dd3fc;
                color: #0369a1;
            }
            .smo-mini-btn.kml-help:hover { background: #bae6fd; color: #0c4a6e; }

            /* Quicktip-Popover für KML-Einbindung */
            .smo-kml-popover {
                position: absolute;
                right: 16px;
                bottom: calc(100% + 10px);
                z-index: 650;
                width: min(350px, calc(100vw - 24px));
                background: #0f172a;
                color: #ffffff;
                border: 1px solid rgba(56, 189, 248, 0.35);
                border-radius: 16px;
                padding: 15px 16px;
                box-shadow: 0 18px 40px rgba(0, 0, 0, 0.42);
                text-align: left;
                display: none;
            }
            .smo-kml-popover.open { display: block; }
            .smo-kml-popover-head {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 8px;
            }
            .smo-kml-popover h4 {
                margin: 0;
                font-family: 'Lato', sans-serif;
                font-size: 13.5px;
                font-weight: 700;
                color: #f59e0b;
            }
            .smo-kml-popover-close {
                background: transparent;
                border: none;
                color: rgba(255, 255, 255, 0.7);
                font-size: 16px;
                cursor: pointer;
                padding: 0 4px;
            }
            .smo-kml-popover ol {
                margin: 0 0 10px 0;
                padding-left: 18px;
                font-size: 12.5px;
                line-height: 1.5;
                color: rgba(255, 255, 255, 0.88);
            }
            .smo-kml-popover li { margin-bottom: 5px; }
            .smo-kml-popover a {
                color: #7dd3fc;
                font-weight: 700;
                text-decoration: underline;
            }
            .smo-kml-popover .kml-tip-note {
                font-size: 11.5px;
                color: rgba(255, 255, 255, 0.68);
                margin: 0;
            }

            /* Custom Map Pins & Popups – Casa = Rot, Restaurants = Orange */
            .casa-pin {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 34px;
                height: 34px;
                border-radius: 50%;
                border: 2.5px solid #ffffff;
                box-shadow: 0 4px 12px rgba(15, 23, 42, 0.42);
                font-size: 16px;
                transition: transform 0.2s ease;
            }
            .casa-pin:hover { transform: scale(1.14); }
            .casa-pin.cat-casa {
                width: 42px;
                height: 42px;
                font-size: 20px;
                background: linear-gradient(135deg, #ef4444, #dc2626);
                box-shadow: 0 0 0 5px rgba(239, 68, 68, 0.38), 0 6px 16px rgba(15, 23, 42, 0.45);
            }
            .casa-pin.cat-kulinarik { background: #f97316; }
            .casa-pin.cat-chiringuito { background: #06b6d4; }
            .casa-pin.cat-ausflug { background: #10b981; }

            .leaflet-popup-content-wrapper {
                border-radius: 16px !important;
                padding: 0 !important;
                overflow: hidden;
                box-shadow: 0 14px 34px rgba(15, 23, 42, 0.24) !important;
            }
            .leaflet-popup-content { margin: 0 !important; width: 274px !important; }
            .smo-popup-img { width: 100%; height: 118px; object-fit: cover; display: block; }
            .smo-popup-body { padding: 13px 15px 14px 15px; font-family: 'Lato', sans-serif; }
            .smo-popup-cat {
                font-size: 10.5px;
                font-weight: 700;
                letter-spacing: 1px;
                text-transform: uppercase;
                color: #0284c7;
                display: block;
                margin-bottom: 3px;
            }
            .smo-popup-title {
                font-family: 'Playfair Display', serif;
                font-size: 1.08rem;
                color: #0f172a;
                margin: 0 0 5px 0;
                line-height: 1.25;
            }
            .smo-popup-dist {
                display: inline-block;
                background: #f1f5f9;
                color: #334155;
                font-size: 11px;
                font-weight: 700;
                padding: 3px 8px;
                border-radius: 10px;
                margin-bottom: 7px;
            }
            .smo-popup-desc {
                font-size: 0.85rem;
                color: #475569;
                line-height: 1.45;
                margin: 0 0 11px 0;
            }
            .smo-popup-btns { display: flex; gap: 7px; flex-wrap: wrap; }
            .smo-popup-btn {
                flex: 1;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                gap: 5px;
                text-align: center;
                text-decoration: none !important;
                padding: 7px 9px;
                border-radius: 9px;
                font-size: 12px;
                font-weight: 700;
                white-space: nowrap;
            }
            .smo-popup-btn.primary { background: #0f172a; color: #ffffff !important; }
            .smo-popup-btn.primary:hover { background: #f59e0b; color: #0f172a !important; }
            .smo-popup-btn.secondary { background: #f1f5f9; color: #0f172a !important; }
            .smo-popup-btn.secondary:hover { background: #e2e8f0; }

            @media (max-width: 768px) {
                .distance-filter-bar { width: 100%; border-radius: 20px; padding: 8px; gap: 5px; }
                .dist-filter-label { width: 100%; text-align: center; padding-bottom: 2px; }
                .dist-divider { display: none; }
                .dist-btn { padding: 6px 10px; font-size: 12px; }
                .dist-map-btn { padding: 6px 11px; font-size: 12px; }
                .spot-map-overlay { padding: 0; }
                .spot-map-modal {
                    height: 100dvh;
                    max-height: none;
                    border-radius: 0;
                }
                .smo-header { padding: 10px 12px; gap: 6px; }
                .smo-title { font-size: 1.08rem; }
                .smo-pill { padding: 4px 9px; font-size: 11.5px; }
                .smo-divider { display: none; }
                .smo-legend { display: none; }
                .smo-footer { padding: 8px 10px; justify-content: center; }
                .smo-kml-popover { right: 12px; left: 12px; width: auto; }
            }
        `;
        document.head.appendChild(style);
    }

    /* =====================================================================
       OVERLAY-DOM & LEAFLET-STEUERUNG (SATELLIT ALS DEFAULT)
       ===================================================================== */
    let overlayEl = null;
    let leafletMap = null;
    let markerLayer = null;
    let osmTileLayer = null;
    let satelliteTileLayer = null;
    let isSatelliteMode = true;
    let markersById = {};
    let leafletLoaded = false;
    let modalCat = 'all';
    let modalDist = 'all';
    let pendingFocusId = null;

    function hasMapConsent() {
        try { return localStorage.getItem(MAP_CONSENT_KEY) === '1'; } catch (e) { return false; }
    }

    function ensureOverlayDOM() {
        if (overlayEl) return overlayEl;
        injectStyles();

        overlayEl = document.createElement('div');
        overlayEl.id = 'spotMapOverlay';
        overlayEl.className = 'spot-map-overlay';
        overlayEl.setAttribute('role', 'dialog');
        overlayEl.setAttribute('aria-modal', 'true');
        overlayEl.setAttribute('aria-label', 'Interaktive Entdecker-Karte');

        const gmBtnHtml = GOOGLE_MY_MAPS_URL
            ? `<a href="${GOOGLE_MY_MAPS_URL}" target="_blank" rel="noopener noreferrer" class="smo-mini-btn kml">${compassSvg(14, '#f59e0b')} Google My Maps</a>`
            : '';

        overlayEl.innerHTML = `
            <div class="spot-map-modal">
                <div class="smo-header">
                    <div class="smo-top-row">
                        <div class="smo-title-wrap">
                            <h2 class="smo-title">${compassSvg(20, '#f59e0b')} Entdecker-Karte</h2>
                            <span class="smo-count" id="smoCountBadge">39 Spots</span>
                        </div>
                        <button type="button" class="smo-close-btn" id="smoCloseBtn" title="Karte schließen" aria-label="Karte schließen">✕</button>
                    </div>
                    <div class="smo-filters" id="smoFiltersBar">
                        <button type="button" class="smo-pill" data-smo-cat="all">✨ Alle</button>
                        <button type="button" class="smo-pill" data-smo-cat="ausflug">🧭 Ausflüge</button>
                        <button type="button" class="smo-pill" data-smo-cat="kulinarik">🍽️ Kulinarik</button>
                        <button type="button" class="smo-pill" data-smo-cat="chiringuito">🏖️ Chiringuitos</button>
                        <span class="smo-divider"></span>
                        <button type="button" class="smo-pill" data-smo-dist="all">🌍 Alle Entf.</button>
                        <button type="button" class="smo-pill" data-smo-dist="walk">🚶 Zu Fuß</button>
                        <button type="button" class="smo-pill" data-smo-dist="20">🚗 ≤ 20 Min.</button>
                        <button type="button" class="smo-pill" data-smo-dist="45">🚗 ≤ 45 Min.</button>
                        <button type="button" class="smo-pill" data-smo-dist="daytrip">🛣️ 45+ Min.</button>
                    </div>
                </div>

                <div class="smo-stage">
                    <div class="smo-consent-gate" id="smoConsentGate">
                        <div style="color:#7dd3fc;">${compassSvg(46, '#f59e0b')}</div>
                        <h3>Interaktive Entdecker-Karte laden</h3>
                        <p>Aus Datenschutzgründen wird die Karte (Esri Satellit / OpenStreetMap) erst nach deinem Klick geladen. Dabei wird deine IP-Adresse an den Kartenanbieter übertragen (<a href="impressum.html">Datenschutz</a>).</p>
                        <label class="smo-remember">
                            <input type="checkbox" id="smoRememberCheck" checked>
                            <span>Entscheidung in diesem Browser merken (lokal)</span>
                        </label>
                        <button type="button" class="smo-load-btn" id="smoLoadBtn">${compassSvg(18, '#0f172a')} Karte jetzt laden</button>
                    </div>
                    <div id="smo-leaflet-map"></div>
                </div>

                <div class="smo-footer">
                    <div class="smo-kml-popover" id="smoKmlPopover" role="dialog" aria-label="Anleitung KML in Google Maps einbinden">
                        <div class="smo-kml-popover-head">
                            <h4>📱 Alle Spots in deine Google Maps App laden</h4>
                            <button type="button" class="smo-kml-popover-close" id="smoKmlPopoverClose" aria-label="Schließen">✕</button>
                        </div>
                        <ol>
                            <li>Klicke auf <strong>📥 Spots (.kml)</strong>, um unsere Spot-Datei herunterzuladen.</li>
                            <li>Öffne <a href="https://www.google.com/maps/d/" target="_blank" rel="noopener noreferrer">Google My Maps ↗</a> → <strong>Neue Karte erstellen</strong> → <strong>Importieren</strong> und wähle die Datei aus.</li>
                            <li>Öffne danach deine <strong>Google Maps App</strong> → Tab <em>Gespeichert</em> → <em>Karten</em> – schon hast du alle Spots &amp; Tipps unterwegs dabei!</li>
                        </ol>
                        <p class="kml-tip-note">Tipp: Funktioniert am bequemsten einmalig am PC/Browser und synchronisiert sich automatisch aufs Handy.</p>
                    </div>

                    <div class="smo-legend">
                        <span class="smo-legend-dot"><span class="smo-swatch" style="background:#ef4444;"></span> Casa</span>
                        <span class="smo-legend-dot"><span class="smo-swatch" style="background:#f97316;"></span> Restaurants</span>
                        <span class="smo-legend-dot"><span class="smo-swatch" style="background:#06b6d4;"></span> Chiringuitos</span>
                        <span class="smo-legend-dot"><span class="smo-swatch" style="background:#10b981;"></span> Ausflüge</span>
                    </div>
                    <div class="smo-actions">
                        <button type="button" class="smo-mini-btn" id="smoToggleStyleBtn" style="display:none;">${compassSvg(14, '#0369a1')} Straßenkarte</button>
                        <button type="button" class="smo-mini-btn" id="smoFitBtn" style="display:none;">🎯 Alle im Blick</button>
                        ${gmBtnHtml}
                        <a href="casa-englers-spots.kml" download="casa-englers-spots.kml" class="smo-mini-btn kml">📥 Spots (.kml)</a>
                        <button type="button" class="smo-mini-btn kml-help" id="smoKmlHelpBtn" title="Wie binde ich die .kml-Datei in Google Maps ein?">❓ Wie einbinden?</button>
                        <button type="button" class="smo-mini-btn" id="smoRevokeBtn" style="display:none;">🔒 Ausblenden</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(overlayEl);

        // Events
        overlayEl.addEventListener('click', (e) => {
            if (e.target === overlayEl) closeSpotMapOverlay();
        });
        document.getElementById('smoCloseBtn').addEventListener('click', closeSpotMapOverlay);
        document.getElementById('smoLoadBtn').addEventListener('click', () => {
            if (document.getElementById('smoRememberCheck').checked) {
                try { localStorage.setItem(MAP_CONSENT_KEY, '1'); } catch (e) {}
            }
            initOverlayMap();
        });
        document.getElementById('smoToggleStyleBtn').addEventListener('click', toggleOverlayMapStyle);
        document.getElementById('smoFitBtn').addEventListener('click', fitOverlayMarkers);
        document.getElementById('smoRevokeBtn').addEventListener('click', revokeOverlayConsent);

        const kmlPopover = document.getElementById('smoKmlPopover');
        document.getElementById('smoKmlHelpBtn').addEventListener('click', (e) => {
            e.stopPropagation();
            kmlPopover.classList.toggle('open');
        });
        document.getElementById('smoKmlPopoverClose').addEventListener('click', () => {
            kmlPopover.classList.remove('open');
        });

        overlayEl.querySelectorAll('[data-smo-cat]').forEach(btn => {
            btn.addEventListener('click', () => {
                modalCat = btn.dataset.smoCat;
                pendingFocusId = null;
                syncOverlayFilterButtons();
                if (leafletMap) {
                    renderOverlayMarkers();
                    fitOverlayMarkers();
                }
            });
        });

        overlayEl.querySelectorAll('[data-smo-dist]').forEach(btn => {
            btn.addEventListener('click', () => {
                modalDist = btn.dataset.smoDist;
                pendingFocusId = null;
                syncOverlayFilterButtons();
                if (leafletMap) {
                    renderOverlayMarkers();
                    fitOverlayMarkers();
                }
            });
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && overlayEl && overlayEl.classList.contains('open')) {
                if (kmlPopover.classList.contains('open')) {
                    kmlPopover.classList.remove('open');
                } else {
                    closeSpotMapOverlay();
                }
            }
        });

        return overlayEl;
    }

    function matchesModalFilters(spot) {
        if (spot.id === 'casa') return true;
        const catOk = modalCat === 'all' || spot.cats.includes(modalCat);
        if (!catOk) return false;
        if (modalDist === 'all') return true;
        if (modalDist === 'walk') return calcDistanceKm(spot.lat, spot.lon) <= 2.0 && !spot.badgeLabel;
        if (modalDist === '20') return spot.driveMin <= 20;
        if (modalDist === '45') return spot.driveMin <= 45;
        if (modalDist === 'daytrip') return spot.driveMin > 45;
        return true;
    }

    function syncOverlayFilterButtons() {
        if (!overlayEl) return;
        overlayEl.querySelectorAll('[data-smo-cat]').forEach(b => {
            b.classList.toggle('active-cat', b.dataset.smoCat === modalCat);
        });
        overlayEl.querySelectorAll('[data-smo-dist]').forEach(b => {
            b.classList.toggle('active-dist', b.dataset.smoDist === modalDist);
        });
        const count = SPOTS.filter(s => s.id !== 'casa' && matchesModalFilters(s)).length;
        const badge = document.getElementById('smoCountBadge');
        if (badge) badge.textContent = `${count} ${count === 1 ? 'Spot' : 'Spots'}`;
    }

    function loadLeaflet(callback) {
        if (leafletLoaded && window.L) {
            callback();
            return;
        }
        const css = document.createElement('link');
        css.rel = 'stylesheet';
        css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(css);

        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.onload = () => {
            leafletLoaded = true;
            callback();
        };
        document.head.appendChild(script);
    }

    function initOverlayMap() {
        document.getElementById('smoConsentGate').classList.add('hidden');
        document.getElementById('smoToggleStyleBtn').style.display = 'inline-flex';
        document.getElementById('smoFitBtn').style.display = 'inline-flex';
        document.getElementById('smoRevokeBtn').style.display = 'inline-flex';

        loadLeaflet(() => {
            if (!leafletMap) {
                leafletMap = L.map('smo-leaflet-map', { scrollWheelZoom: true }).setView([38.82, 0.12], 12);
                osmTileLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>',
                    maxZoom: 19
                });
                satelliteTileLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                    attribution: 'Satellit &copy; Esri, Maxar, Earthstar Geographics',
                    maxZoom: 19
                });
                // Satellit als Default!
                isSatelliteMode = true;
                satelliteTileLayer.addTo(leafletMap);
                document.getElementById('smoToggleStyleBtn').innerHTML = `${compassSvg(14, '#0369a1')} Straßenkarte`;
                markerLayer = L.layerGroup().addTo(leafletMap);
            }
            setTimeout(() => {
                if (!leafletMap) return;
                leafletMap.invalidateSize();
                renderOverlayMarkers();
                if (pendingFocusId && markersById[pendingFocusId]) {
                    const spot = SPOTS.find(s => s.id === pendingFocusId);
                    if (spot) {
                        leafletMap.setView([spot.lat, spot.lon], 14);
                        setTimeout(() => markersById[pendingFocusId] && markersById[pendingFocusId].openPopup(), 220);
                    }
                    pendingFocusId = null;
                } else {
                    fitOverlayMarkers();
                }
            }, 80);
        });
    }

    function toggleOverlayMapStyle() {
        if (!leafletMap || !osmTileLayer || !satelliteTileLayer) return;
        const btn = document.getElementById('smoToggleStyleBtn');
        if (isSatelliteMode) {
            leafletMap.removeLayer(satelliteTileLayer);
            osmTileLayer.addTo(leafletMap);
            isSatelliteMode = false;
            btn.innerHTML = '🛰️ Satellit';
        } else {
            leafletMap.removeLayer(osmTileLayer);
            satelliteTileLayer.addTo(leafletMap);
            isSatelliteMode = true;
            btn.innerHTML = `${compassSvg(14, '#0369a1')} Straßenkarte`;
        }
    }

    function revokeOverlayConsent() {
        try { localStorage.removeItem(MAP_CONSENT_KEY); } catch (e) {}
        if (leafletMap) {
            leafletMap.remove();
            leafletMap = null;
            markerLayer = null;
            osmTileLayer = null;
            satelliteTileLayer = null;
            isSatelliteMode = true;
            markersById = {};
        }
        document.getElementById('smoConsentGate').classList.remove('hidden');
        document.getElementById('smoToggleStyleBtn').style.display = 'none';
        document.getElementById('smoToggleStyleBtn').innerHTML = `${compassSvg(14, '#0369a1')} Straßenkarte`;
        document.getElementById('smoFitBtn').style.display = 'none';
        document.getElementById('smoRevokeBtn').style.display = 'none';
    }

    function buildPopupHtml(s) {
        const imgHtml = s.img ? `<img src="${s.img}" alt="${s.name}" class="smo-popup-img">` : '';
        const extraBtn = s.extraUrl
            ? `<a href="${s.extraUrl}" target="_blank" rel="noopener noreferrer" class="smo-popup-btn secondary">${s.extraLabel}</a>`
            : '';
        const routeIcon = s.isParking ? parkingSvg(14) : gmapsPinSvg(14);
        const routeTxt = s.routeLabel || 'Route starten';
        return `
            ${imgHtml}
            <div class="smo-popup-body">
                <span class="smo-popup-cat">${s.catLabel}</span>
                <h3 class="smo-popup-title">${s.name}</h3>
                <span class="smo-popup-dist">${formatPopupDistText(s)}</span>
                <p class="smo-popup-desc">${s.tip}</p>
                <div class="smo-popup-btns">
                    ${extraBtn}
                    <a href="${s.mapsUrl}" target="_blank" rel="noopener noreferrer" class="smo-popup-btn primary">${routeIcon} ${routeTxt}</a>
                </div>
            </div>
        `;
    }

    function renderOverlayMarkers() {
        if (!markerLayer || !window.L) return;
        markerLayer.clearLayers();
        markersById = {};

        SPOTS.forEach(s => {
            if (!matchesModalFilters(s)) return;
            const isCasa = s.id === 'casa';
            const divIcon = L.divIcon({
                className: '',
                html: `<div class="casa-pin cat-${s.cat}" title="${s.name}">${s.icon}</div>`,
                iconSize: isCasa ? [42, 42] : [34, 34],
                iconAnchor: isCasa ? [21, 21] : [17, 17],
                popupAnchor: [0, isCasa ? -20 : -16]
            });

            const marker = L.marker([s.lat, s.lon], {
                icon: divIcon,
                zIndexOffset: isCasa ? 1000 : 0
            }).bindPopup(buildPopupHtml(s), { maxWidth: 280 });

            marker.addTo(markerLayer);
            markersById[s.id] = marker;
        });
    }

    function fitOverlayMarkers() {
        if (!leafletMap || !window.L) return;
        const visible = SPOTS.filter(matchesModalFilters);
        if (!visible.length) return;
        const bounds = L.latLngBounds(visible.map(s => [s.lat, s.lon]));
        leafletMap.fitBounds(bounds, { padding: [42, 42], maxZoom: 15 });
    }

    function openSpotMapOverlay(opts) {
        opts = opts || {};
        ensureOverlayDOM();

        modalCat = opts.cat || 'all';
        modalDist = opts.dist || 'all';
        pendingFocusId = opts.focusId || null;

        if (pendingFocusId) {
            const target = SPOTS.find(s => s.id === pendingFocusId);
            if (target && !matchesModalFilters(target)) {
                modalCat = 'all';
                modalDist = 'all';
            }
        }

        const kmlPop = document.getElementById('smoKmlPopover');
        if (kmlPop) kmlPop.classList.remove('open');

        syncOverlayFilterButtons();
        overlayEl.classList.add('open');
        document.body.style.overflow = 'hidden';

        if (hasMapConsent()) {
            initOverlayMap();
        }
    }

    function closeSpotMapOverlay() {
        if (!overlayEl) return;
        overlayEl.classList.remove('open');
        document.body.style.overflow = '';
    }

    /* =====================================================================
       AUTO-ENHANCEMENT FÜR NORMALE KARTEN AUF AUSFLUEGE.HTML & KULINARISCHES.HTML
       1) Klickbares Entfernung/Dauer-Badge rechts oben im Bild -> öffnet Spot auf Entdecker-Karte
       2) Google-Maps-Pin-SVG bzw. Parkplatz-SVG auf Route-/Park-Buttons einsetzen
       3) Alle Karten aufsteigend nach Entfernung sortieren
       ===================================================================== */
    function enhancePageCards() {
        injectStyles();
        const defaultPageCat = window.location.pathname.includes('kulinarisches') ? 'kulinarik' : 'ausflug';
        const grid = document.querySelector('.spots-grid');

        document.querySelectorAll('.spot-card[data-spot-id]').forEach(card => {
            const spotId = card.dataset.spotId;
            const spot = SPOTS.find(s => s.id === spotId);
            if (!spot) return;

            const km = getSortDistanceKm(spot);
            card.dataset.driveMin = String(spot.driveMin);
            card.dataset.km = km.toFixed(2);

            const visual = card.querySelector('.spot-visual');
            if (visual && !visual.querySelector('.spot-dist-pill')) {
                const pill = document.createElement('button');
                pill.type = 'button';
                pill.className = 'spot-dist-pill';
                pill.title = 'Auf der Entdecker-Karte anzeigen';
                pill.textContent = formatSpotBadgeText(spot);
                pill.addEventListener('click', (e) => {
                    e.stopPropagation();
                    openSpotMapOverlay({ cat: defaultPageCat, dist: 'all', focusId: spotId });
                });
                visual.appendChild(pill);
            }
        });

        // Standard Google Maps Pin SVG & Parkplatz SVG auf Route-/Park-Buttons setzen
        document.querySelectorAll('.spot-actions a[data-icon="gmaps"]').forEach(a => {
            if (!a.querySelector('svg')) {
                a.insertAdjacentHTML('afterbegin', gmapsPinSvg(15));
            }
        });
        document.querySelectorAll('.spot-actions a[data-icon="parking"]').forEach(a => {
            if (!a.querySelector('svg')) {
                a.insertAdjacentHTML('afterbegin', parkingSvg(15));
            }
        });

        // Karten aufsteigend nach Entfernung ab Casa sortieren
        if (grid) {
            const cards = Array.from(grid.querySelectorAll(':scope > .spot-card'));
            cards.sort((a, b) => {
                const kmA = a.dataset.km ? parseFloat(a.dataset.km) : 99999;
                const kmB = b.dataset.km ? parseFloat(b.dataset.km) : 99999;
                if (kmA !== kmB) return kmA - kmB;
                const minA = a.dataset.driveMin ? parseFloat(a.dataset.driveMin) : 99999;
                const minB = b.dataset.driveMin ? parseFloat(b.dataset.driveMin) : 99999;
                return minA - minB;
            });
            cards.forEach(card => grid.appendChild(card));
        }
    }

    /* =====================================================================
       KOMBINIERTER KATEGORIE- & ENTFERNUNGS-FILTER FÜR DIE KARTEN-SEITEN
       ===================================================================== */
    let pageCatFilter = 'all';
    let pageDistFilter = 'all';

    function applyPageFilters() {
        const grid = document.querySelector('.spots-grid');
        if (!grid) return;

        let visibleCount = 0;
        grid.querySelectorAll('.spot-card').forEach(card => {
            const cats = (card.dataset.category || '').split(/\s+/);
            const catOk = pageCatFilter === 'all' || cats.includes(pageCatFilter);

            let distOk = true;
            if (pageDistFilter !== 'all') {
                const driveMin = parseFloat(card.dataset.driveMin);
                const km = parseFloat(card.dataset.km);
                if (isNaN(driveMin)) {
                    distOk = false;
                } else if (pageDistFilter === 'walk') {
                    distOk = km <= 2.0 && driveMin <= 15;
                } else if (pageDistFilter === '20') {
                    distOk = driveMin <= 20;
                } else if (pageDistFilter === '45') {
                    distOk = driveMin <= 45;
                } else if (pageDistFilter === 'daytrip') {
                    distOk = driveMin > 45;
                }
            }

            const show = catOk && distOk;
            card.classList.toggle('hidden', !show);
            if (show) visibleCount++;
        });

        let emptyEl = grid.querySelector('.spots-empty-state');
        if (visibleCount === 0) {
            if (!emptyEl) {
                emptyEl = document.createElement('div');
                emptyEl.className = 'spots-empty-state';
                emptyEl.innerHTML = `
                    <p>Für diese Kombination aus Kategorie und Anfahrtsdauer gibt es aktuell keinen Eintrag.</p>
                    <button type="button" onclick="window.resetPageSpotFilters()">🔄 Alle Filter zurücksetzen</button>
                `;
                grid.appendChild(emptyEl);
            }
        } else if (emptyEl) {
            emptyEl.remove();
        }
    }

    window.filterSpots = function (category, btn) {
        pageCatFilter = category;
        document.querySelectorAll('.vibe-filter-bar .vibe-btn').forEach(b => b.classList.remove('active'));
        if (btn) btn.classList.add('active');
        applyPageFilters();
    };

    window.filterByDistance = function (dist, btn) {
        pageDistFilter = dist;
        document.querySelectorAll('.distance-filter-bar .dist-btn').forEach(b => b.classList.remove('active'));
        if (btn) btn.classList.add('active');
        applyPageFilters();
    };

    window.resetPageSpotFilters = function () {
        pageCatFilter = 'all';
        pageDistFilter = 'all';
        document.querySelectorAll('.vibe-filter-bar .vibe-btn').forEach((b, i) => {
            b.classList.toggle('active', i === 0);
        });
        document.querySelectorAll('.distance-filter-bar .dist-btn').forEach(b => {
            b.classList.toggle('active', b.dataset.dist === 'all');
        });
        applyPageFilters();
    };

    window.getActivePageDistFilter = function () {
        return pageDistFilter;
    };

    window.openSpotMapOverlay = openSpotMapOverlay;
    window.closeSpotMapOverlay = closeSpotMapOverlay;
    window.DENIA_SPOTS = SPOTS;

    document.addEventListener('DOMContentLoaded', enhancePageCards);
})();
