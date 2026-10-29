
function escapeHtml(text) {
    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

/* ═══ Sprache ═══
   Jede Seite gibt es zweimal: deutsch unter /…, englisch unter /en/….
   Eleventy setzt die Texte schon beim Bauen ein (.eleventy.js →
   languageVersions). Das Skript liest die Sprache nur noch aus <html lang>
   und braucht sie für Texte, die es selbst erzeugt (Formular, Filter). */
const currentLang = document.documentElement.lang === 'de' ? 'de' : 'en';

function t(key) {
    const dict = window.TRANSLATIONS;
    if (!dict) return key;
    return (dict[currentLang] && dict[currentLang][key])
        || (dict.en && dict.en[key])
        || key;
}

/* ═══ Animationen an/aus ═══
   Der Schalter im Header gilt seitenübergreifend (gespeichert im Browser).
   Ohne eigene Wahl richtet sich die Seite nach der Systemeinstellung
   „Bewegung reduzieren“. Ist Bewegung aus, trägt <html> die Klasse
   jw-motion-off: das CSS schaltet dann Übergänge und Animationen ab, die
   Skripte unten fragen motionOff() bei jedem Schritt ab. */
const MOTION_KEY = 'jw-motion';
const systemReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

let motionChoice = null; // Wahl dieser Sitzung, falls der Browser-Speicher gesperrt ist

function storedMotion() {
    if (motionChoice) return motionChoice;
    try { return localStorage.getItem(MOTION_KEY); } catch (error) { return null; }
}

function motionOff() {
    const stored = storedMotion();
    if (stored === 'off') return true;
    if (stored === 'on') return false;
    return systemReducedMotion.matches;
}

function applyMotionState() {
    const off = motionOff();
    document.documentElement.classList.toggle('jw-motion-off', off);
    document.querySelectorAll('#motion-toggle').forEach(function (button) {
        button.setAttribute('aria-pressed', off ? 'false' : 'true');
    });
    document.dispatchEvent(new CustomEvent('jw-motion-change', { detail: { off: off } }));
}

(function initMotionToggle() {
    const button = document.getElementById('motion-toggle');
    if (button) {
        button.addEventListener('click', function () {
            motionChoice = motionOff() ? 'on' : 'off';
            try { localStorage.setItem(MOTION_KEY, motionChoice); } catch (error) { /* gilt dann nur bis zum Neuladen */ }
            applyMotionState();
        });
    }
    if (systemReducedMotion.addEventListener) {
        systemReducedMotion.addEventListener('change', applyMotionState);
    }
    applyMotionState();
})();

/* ═══ Project Filtering ═══ */
function initProjectFilters() {
    const workList = document.querySelector(".work-list");
    const filterContainer = document.querySelector(".project-filters");

    if (!workList || !filterContainer) {
        return;
    }

    // Get all unique project types from work items
    const types = new Set();
    workList.querySelectorAll(".work-item-link").forEach((item) => {
        const metaSpan = item.querySelector(".work-meta span");
        if (metaSpan) {
            const text = metaSpan.textContent.trim();
            // Extract the type part (everything inside brackets)
            const match = text.match(/\[([^\]]+)]/);
            if (match) {
                const typePart = match[1];
                // Split by comma and add each type
                typePart.split(",").forEach((type) => {
                    types.add(type.trim());
                });
            }
        }
    });

    // Sort types alphabetically
    const sortedTypes = Array.from(types).sort();

    // Clear existing buttons (keep "All" button)
    const existingButtons = filterContainer.querySelectorAll(".filter-btn:not([data-filter='all'])");
    existingButtons.forEach((btn) => btn.remove());

    // Add filter buttons for each type
    sortedTypes.forEach((type) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "filter-btn";
        btn.dataset.filter = type;
        btn.setAttribute("aria-pressed", "false");
        // Beschriftung in der Seitensprache (Übersetzung aus _data/global.json → categories)
        btn.textContent = t("cat." + type) === "cat." + type ? type : t("cat." + type);
        filterContainer.appendChild(btn);
    });

    // Filter function
    function filterProjects(selectedType) {
        workList.querySelectorAll(".work-item-link").forEach((item) => {
            const metaSpan = item.querySelector(".work-meta span");
            if (!metaSpan) {
                item.classList.remove("hidden");
                return;
            }

            const text = metaSpan.textContent.trim();
            const match = text.match(/\[([^\]]+)]/);

            if (selectedType === "all") {
                item.classList.remove("hidden");
            } else if (match) {
                const typePart = match[1];
                const itemTypes = typePart.split(",").map((t) => t.trim());
                if (itemTypes.includes(selectedType)) {
                    item.classList.remove("hidden");
                } else {
                    item.classList.add("hidden");
                }
            } else {
                item.classList.add("hidden");
            }
        });
    }

    // Statuszeile „4 Projekte“: role="status" lässt Screenreader die neue
    // Anzahl vorlesen, sehende Nutzer erkennen sofort, dass der Filter griff.
    const status = document.querySelector(".jw-filter-status");
    function updateStatus() {
        if (!status) return;
        const shown = Array.from(workList.children).filter(function (li) {
            return Array.from(li.querySelectorAll(".work-item-link")).some(function (link) {
                return !link.classList.contains("hidden");
            });
        }).length;
        status.textContent = shown === 1 ? t("filter.count_one") : t("filter.count").replace("{n}", shown);
    }

    // Attach click listeners to filter buttons
    filterContainer.querySelectorAll(".filter-btn").forEach((btn) => {
        btn.addEventListener("click", function () {
            // Aktiver Filter: sichtbar per Klasse, für Screenreader per aria-pressed
            filterContainer.querySelectorAll(".filter-btn").forEach((b) => {
                b.classList.remove("active");
                b.setAttribute("aria-pressed", "false");
            });
            btn.classList.add("active");
            btn.setAttribute("aria-pressed", "true");

            // Filter projects
            const selectedType = btn.dataset.filter;
            filterProjects(selectedType);
            updateStatus();
        });
    });

    updateStatus();
}

initProjectFilters();

const form = document.getElementById("form") || document.querySelector(".contact-form");

if (form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const status = form.querySelector(".jw-form-status");

    // Rückmeldung direkt unter dem Button statt eines Browser-Popups.
    // Bei einem Fehler gibt es einen Ersatzweg per E-Mail, mit der bereits
    // getippten Nachricht als Vorlage.
    function showStatus(kind, text, withMailLink) {
        if (!status) return;
        status.hidden = false;
        status.className = "jw-form-status is-" + kind;
        status.textContent = text;

        const address = form.dataset.mail;
        if (withMailLink && address) {
            const data = new FormData(form);
            const body = (data.get("message") || "") + "\n\n– " + (data.get("name") || "");
            const link = document.createElement("a");
            link.href = "mailto:" + address +
                "?subject=" + encodeURIComponent("Nachricht über janwestphal.dev") +
                "&body=" + encodeURIComponent(body);
            link.textContent = t("contact.fallback") + "\u00a0";
            link.insertAdjacentHTML("beforeend", jwArrow("r"));
            status.appendChild(document.createTextNode(" "));
            status.appendChild(link);
        }
    }

    // ── Eigene Prüfung der Felder ──
    // Die Browser-Meldungen erscheinen in der Sprache des Browsers, nicht der
    // Seite. Deshalb novalidate im HTML und hier eigene Texte: Fehler stehen
    // unter dem Feld (aria-describedby), das Feld ist als ungültig markiert
    // (aria-invalid), der Fokus springt ins erste fehlerhafte Feld.
    const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    function fieldError(field) {
        const value = field.value.trim();
        if (field.name === "name" && !value) return t("contact.invalid_name");
        if (field.name === "email" && !value) return t("contact.invalid_email_missing");
        if (field.name === "email" && !EMAIL_PATTERN.test(value)) return t("contact.invalid_email");
        if (field.name === "message" && !value) return t("contact.invalid_message");
        return "";
    }

    function showFieldError(field, message) {
        const box = document.getElementById(field.id + "-error");
        if (message) field.setAttribute("aria-invalid", "true");
        else field.removeAttribute("aria-invalid");
        if (!box) return;
        box.textContent = message;
        box.hidden = !message;
    }

    const fields = Array.from(form.querySelectorAll("input[required], textarea[required]"));
    fields.forEach(function (field) {
        // Fehler verschwindet, sobald die Eingabe passt; geprüft wird erst
        // nach dem ersten Absendeversuch, damit niemand beim Tippen gestört wird.
        field.addEventListener("input", function () {
            if (field.getAttribute("aria-invalid") === "true") showFieldError(field, fieldError(field));
        });
        field.addEventListener("blur", function () {
            if (field.getAttribute("aria-invalid") === "true") showFieldError(field, fieldError(field));
        });
    });

    function validate() {
        let first = null;
        fields.forEach(function (field) {
            const message = fieldError(field);
            showFieldError(field, message);
            if (message && !first) first = field;
        });
        if (first) first.focus();
        return !first;
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        if (!validate()) return;

        // Formspark erwartet JSON; das Fangfeld _honeypot wird mitgeschickt,
        // damit Formspark Bot-Nachrichten erkennen kann.
        const payload = Object.fromEntries(new FormData(form).entries());
        const originalText = submitBtn ? submitBtn.innerHTML : ""; // mit Pfeil-Grafik

        if (submitBtn) {
            submitBtn.textContent = t("contact.submit.sending");
            submitBtn.disabled = true;
        }
        if (status) status.hidden = true;

        try {
            const response = await fetch(form.action, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                form.reset();
                showStatus("success", t("contact.success"), false);
            } else {
                showStatus("error", t("contact.error-prefix") + " " + response.status + ").", true);
            }
        } catch (_error) {
            showStatus("error", t("contact.network-error"), true);
        } finally {
            if (submitBtn) {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        }
    });
}


/* ═══ Menü auf dem Handy ═══
   Unter 860 px steht die Navigation hinter dem Knopf „Menü“. Er klappt die
   Liste auf und zu; Escape, ein Klick daneben oder ein Link schließen sie. */
const burgerMenuToggle = document.getElementById("burger-menu-toggle");
const navMain = document.querySelector(".nav-main");
const siteHeader = document.querySelector(".site-header");

function setMenu(open) {
    if (!navMain || !burgerMenuToggle) return;
    navMain.classList.toggle("active", open);
    if (siteHeader) siteHeader.classList.toggle("is-menu-open", open);
    burgerMenuToggle.setAttribute("aria-expanded", open ? "true" : "false");
}

function closeBurgerMenu() {
    setMenu(false);
}

if (burgerMenuToggle) {
    burgerMenuToggle.addEventListener("click", function (event) {
        event.preventDefault();
        setMenu(burgerMenuToggle.getAttribute("aria-expanded") !== "true");
    });
}

document.querySelectorAll(".nav-links a").forEach(function (link) {
    link.addEventListener("click", closeBurgerMenu);
});

document.addEventListener("click", function (event) {
    if (!navMain || !navMain.classList.contains("active")) return;
    if (navMain.contains(event.target) || (burgerMenuToggle && burgerMenuToggle.contains(event.target))) return;
    closeBurgerMenu();
});

document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && navMain && navMain.classList.contains("active")) {
        closeBurgerMenu();
        if (burgerMenuToggle) burgerMenuToggle.focus();
    }
});

window.addEventListener("resize", function () {
    if (window.innerWidth > 860) closeBurgerMenu();
});

/* ═══ Header-Höhe für Sprungziele ═══
   Der Header bleibt oben stehen. Damit Anker (#about, #contact) und per
   Tastatur fokussierte Elemente nicht darunter verschwinden, bekommt
   <html> die gemessene Höhe als scroll-padding-top (CSS-Variable). */
(function initHeaderOffset() {
    const header = document.querySelector(".site-header");
    if (!header) return;
    function measure() {
        document.documentElement.style.setProperty("--jw-header-h", Math.ceil(header.getBoundingClientRect().height) + "px");
        // Höhe des Laufbands (nur Startseite) – der Kopfbereich füllt damit den ersten Bildschirm
        const ticker = document.querySelector(".ticker-band");
        document.documentElement.style.setProperty("--jw-ticker-h", (ticker ? Math.ceil(ticker.getBoundingClientRect().height) : 0) + "px");
    }
    measure();
    window.addEventListener("resize", measure);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
})();

/* Pfeil als Grafik – dieselbe Form wie _build/arrows.js, für Texte, die
   erst im Browser entstehen (Karussell-Unterschrift, Hinweis im Formular) */
function jwArrow(dir) {
    const rotate = { r: 0, l: 180, ur: -45, d: 90 }[dir] || 0;
    const svg = function (part) {
        return '<svg class="jw-arrow__' + part + '" viewBox="0 0 16 16" focusable="false">' +
            '<g transform="rotate(' + rotate + ' 8 8)">' +
            '<path d="M1.5 8H13M8.2 3.2 13 8l-4.8 4.8" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="square"/>' +
            '</g></svg>';
    };
    return '<span class="jw-arrow jw-arrow--' + dir + '" aria-hidden="true">' + svg('a') + svg('b') + '</span>';
}

/* ═══ Header Ticker: click to pause/resume, drag to scrub ═══ */
function initTicker() {
    const band = document.querySelector(".ticker-band");
    const content = band ? band.querySelector(".ticker-content") : null;

    if (!band || !content) {
        return;
    }

    // Take over from the CSS keyframe animation so pausing and dragging can
    // share a single offset. Read the current animated position first so the
    // handover is seamless (script.js is deferred — the CSS animation has
    // usually been running for a moment already).
    let x = 0;
    const computedTransform = getComputedStyle(content).transform;
    if (computedTransform && computedTransform !== "none") {
        x = -new DOMMatrixReadOnly(computedTransform).m41;
    }
    content.style.animation = "none";

    // Abstand von einer Kopie des Textes zur nächsten – der Punkt, an dem die
    // Schleife unsichtbar von vorn beginnt. Ist der Text kürzer als das
    // Fenster, entstünde eine Lücke, bis die nächste Kopie hereinläuft.
    // Darum werden so viele Kopien angehängt, dass immer mindestens eine
    // Fensterbreite plus eine Kopie Text dasteht.
    let half = 0;
    function measure() {
        const copies = content.querySelectorAll(".ticker-text");
        if (copies.length < 2) { half = content.scrollWidth; return; }
        half = copies[1].offsetLeft - copies[0].offsetLeft;
        if (half <= 0) return;
        const needed = Math.ceil(band.clientWidth / half) + 1;
        for (let i = copies.length; i < needed; i++) {
            const clone = copies[1].cloneNode(true);
            clone.setAttribute("aria-hidden", "true");
            content.appendChild(clone);
        }
    }
    measure();
    window.addEventListener("resize", measure);

    // Match the old CSS timing: 50% of the content per 30s.
    const LOOP_SECONDS = 30;
    // Animationen aus (Schalter im Header oder Systemeinstellung): Laufband steht
    let paused = false;
    let pointerIsDown = false;
    let lastTime = performance.now();

    function apply() {
        if (half > 0) {
            x = ((x % half) + half) % half;
        }
        content.style.transform = "translateX(" + (-x) + "px)";
    }
    apply();

    function loop(now) {
        const dt = (now - lastTime) / 1000;
        lastTime = now;
        if (!paused && !pointerIsDown && !motionOff() && half > 0) {
            x += (half / LOOP_SECONDS) * dt;
            apply();
        }
        requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);

    // Pointer events cover mouse and touch alike. touch-action: pan-y (CSS)
    // keeps vertical page scrolling native; horizontal moves are ours.
    let downX = 0;
    let startX = 0;
    let dragged = false;

    band.addEventListener("pointerdown", function (e) {
        pointerIsDown = true; // freezes the ticker immediately
        dragged = false;
        downX = e.clientX;
        startX = x;
        band.setPointerCapture(e.pointerId);
    });

    band.addEventListener("pointermove", function (e) {
        if (!pointerIsDown) {
            return;
        }
        const dx = e.clientX - downX;
        if (Math.abs(dx) > 4) {
            dragged = true;
        }
        if (dragged) {
            x = startX - dx;
            apply();
        }
    });

    function release(e) {
        if (!pointerIsDown) {
            return;
        }
        pointerIsDown = false;
        // A plain click (no drag) toggles pause/resume; after a real drag the
        // previous state is kept, so dragging a running ticker lets it resume
        // from wherever it was dropped.
        if (e.type === "pointerup" && !dragged) {
            paused = !paused;
        }
        band.classList.toggle("ticker-band--paused", paused);
    }

    band.addEventListener("pointerup", release);
    band.addEventListener("pointercancel", release);
}

initTicker();

/* ═══ Lightbox: Bilder im Fließtext und in Galerien groß anzeigen ═══
   Übergang beim Öffnen und Schließen (FLIP): Das große Bild startet genau
   an der Stelle und in der Größe des angeklickten Vorschaubilds und gleitet
   von dort in die Bildmitte. Ist das Vorschaubild zugeschnitten
   (object-fit: cover), wird das große Bild anfangs passend beschnitten
   (clip-path), damit es nicht verzerrt. Beim Schließen läuft es zurück. */
function initLightbox() {
    let overlay = null;
    let source = null;      // angeklicktes Vorschaubild
    let closing = false;
    let returnFocus = null; // Fokus nach dem Schließen zurück auf den Bildlink
    const DURATION = 420;
    const EASING = "cubic-bezier(0.2, 0.8, 0.2, 1)";

    function onKeydown(event) {
        if (event.key === "Escape") close();
    }

    // Transformation, die das große Bild (final) auf das Vorschaubild (thumb) legt
    function flipFrom(thumb, final) {
        const scale = Math.max(thumb.width / final.width, thumb.height / final.height);
        const dx = (thumb.left + thumb.width / 2) - (final.left + final.width / 2);
        const dy = (thumb.top + thumb.height / 2) - (final.top + final.height / 2);
        // Sichtbarer Ausschnitt in Koordinaten des großen Bilds (ungeschnitten)
        const insetX = Math.max(0, (final.width - thumb.width / scale) / 2);
        const insetY = Math.max(0, (final.height - thumb.height / scale) / 2);
        return {
            transform: "translate(" + dx + "px, " + dy + "px) scale(" + scale + ")",
            clipPath: "inset(" + insetY + "px " + insetX + "px)"
        };
    }

    function visibleRect(el) {
        if (!el || !el.isConnected) return null;
        const r = el.getBoundingClientRect();
        if (r.width < 2 || r.height < 2 || r.bottom < 0 || r.top > window.innerHeight) return null;
        return r;
    }

    function finish() {
        if (overlay) overlay.remove();
        if (source) source.style.visibility = "";
        overlay = null;
        source = null;
        closing = false;
        document.body.style.overflow = "";
        document.removeEventListener("keydown", onKeydown);
        if (returnFocus && returnFocus.isConnected) returnFocus.focus({ preventScroll: true });
        returnFocus = null;
    }

    function close() {
        if (!overlay || closing) return;
        closing = true;
        const img = overlay.querySelector(".lightbox__figure img");
        const extras = overlay.querySelectorAll(".lightbox__close, figcaption");
        const thumb = visibleRect(source);
        if (motionOff() || !img) { finish(); return; }

        extras.forEach(function (el) {
            el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 150, fill: "forwards" });
        });
        overlay.animate([{ backgroundColor: "rgba(0, 0, 0, 0.88)" }, { backgroundColor: "rgba(0, 0, 0, 0)" }],
            { duration: DURATION, easing: EASING, fill: "forwards" });
        const frames = thumb
            ? [{ transform: "none", clipPath: "inset(0px 0px)" }, flipFrom(thumb, img.getBoundingClientRect())]
            : [{ opacity: 1, transform: "none" }, { opacity: 0, transform: "scale(0.96)" }];
        img.animate(frames, { duration: thumb ? DURATION : 220, easing: EASING, fill: "forwards" })
            .finished.then(finish, finish);
    }

    function open(src, alt, caption, thumbEl) {
        if (!src) return;
        if (overlay) finish();

        overlay = document.createElement("div");
        overlay.className = "lightbox";
        overlay.setAttribute("role", "dialog");
        overlay.setAttribute("aria-modal", "true");
        if (alt) overlay.setAttribute("aria-label", alt);
        overlay.innerHTML =
            '<button class="lightbox__close" aria-label="' + escapeHtml(t("lightbox.close")) + '">&times;</button>' +
            '<figure class="lightbox__figure">' +
            '<img src="' + escapeHtml(src) + '" alt="' + escapeHtml(alt || "") + '">' +
            (caption ? "<figcaption>" + escapeHtml(caption) + "</figcaption>" : "") +
            "</figure>";

        overlay.addEventListener("click", function (event) {
            if (event.target === overlay || event.target.closest(".lightbox__close")) {
                close();
            }
        });

        source = thumbEl || null;
        returnFocus = document.activeElement;
        const img = overlay.querySelector(".lightbox__figure img");
        const extras = overlay.querySelectorAll(".lightbox__close, figcaption");
        const thumb = visibleRect(source);
        const animated = !motionOff();

        if (animated) {
            // Bis das große Bild geladen und vermessen ist, nichts zeigen
            overlay.style.backgroundColor = "rgba(0, 0, 0, 0)";
            img.style.opacity = "0";
            extras.forEach(function (el) { el.style.opacity = "0"; });
        }

        document.body.appendChild(overlay);
        document.body.style.overflow = "hidden";
        document.addEventListener("keydown", onKeydown);
        overlay.querySelector(".lightbox__close").focus({ preventScroll: true });
        if (!animated) return;

        const ready = img.decode ? img.decode().catch(function () {}) : Promise.resolve();
        ready.then(function () {
            if (!overlay || closing) return;
            overlay.style.backgroundColor = "";
            img.style.opacity = "";
            extras.forEach(function (el) { el.style.opacity = ""; });
            overlay.animate([{ backgroundColor: "rgba(0, 0, 0, 0)" }, { backgroundColor: "rgba(0, 0, 0, 0.88)" }],
                { duration: DURATION, easing: EASING });
            if (thumb) {
                if (source) source.style.visibility = "hidden";
                img.animate([flipFrom(thumb, img.getBoundingClientRect()), { transform: "none", clipPath: "inset(0px 0px)" }],
                    { duration: DURATION, easing: EASING });
            } else {
                img.animate([{ opacity: 0, transform: "scale(0.96)" }, { opacity: 1, transform: "none" }],
                    { duration: 260, easing: EASING });
            }
            extras.forEach(function (el) {
                el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200, delay: DURATION - 120, fill: "backwards" });
            });
        });
    }

    document.addEventListener("click", function (event) {
        if (!(event.target instanceof Element)) return;

        // Bilder im Fließtext, in Galerien und in der Case Study sind in einen Link gewickelt.
        const figureLink = event.target.closest(".post-figure__link");
        if (figureLink) {
            event.preventDefault();
            const image = figureLink.querySelector("img");
            const figure = figureLink.closest("figure");
            const caption = figure ? figure.querySelector("figcaption") : null;
            open(figureLink.getAttribute("href"), image ? image.alt : "", caption ? caption.textContent : "", image);
            return;
        }

        // Ältere Galerien ohne Link um das Bild
        const galleryImage = event.target.closest(".project-gallery__item img");
        if (galleryImage) {
            const figure = galleryImage.closest("figure");
            const caption = figure ? figure.querySelector("figcaption") : null;
            open(galleryImage.getAttribute("src"), galleryImage.alt, caption ? caption.textContent : "", galleryImage);
        }
    });
}

initLightbox();

/* ═══ Galerie im Archiv-Stil (Projektseiten) ═══
   Aus dem normalen Bildraster baut das Skript eine zweite Ansicht:
   links ein Index aller Bilder, in der Mitte die Bilder untereinander,
   rechts ein Detailfeld. Beim Scrollen zählt das Bild, das gerade die
   Bildschirmmitte kreuzt (IntersectionObserver mit schmalem Band in der
   Mitte); Index und Detailfeld folgen ihm. Ein Klick im Index scrollt zum
   Bild, ein Klick aufs Bild öffnet die Lightbox. Die Wahl Archiv/Raster
   merkt sich der Browser. Auf schmalen Bildschirmen bleibt das Raster. */
(function () {
    const VIEW_KEY = 'jw-gallery-view';
    const MIN_ITEMS = 4;
    const wide = window.matchMedia('(min-width: 1024px)');

    function pad(n) { return String(n).padStart(2, '0'); }

    function storedView() {
        try { return localStorage.getItem(VIEW_KEY); } catch (error) { return null; }
    }

    document.querySelectorAll('.page-project .jw-gallery, .page-post .jw-gallery').forEach(function (grid) {
        const figures = Array.from(grid.querySelectorAll('.project-gallery__item'));
        if (figures.length < MIN_ITEMS) return;

        const section = grid.closest('section');
        const toggle = section ? section.querySelector('.jw-view-toggle') : null;
        const prefix = (grid.dataset.archiveCode || 'IM').trim() || 'IM';

        const items = figures.map(function (figure, i) {
            const link = figure.querySelector('a');
            const img = figure.querySelector('img');
            const captionEl = figure.querySelector('figcaption span:not(.jw-fig)');
            const caption = captionEl ? captionEl.textContent.trim() : '';
            return {
                code: prefix + '–' + pad(i + 1),
                href: link ? link.getAttribute('href') : img.getAttribute('src'),
                src: img.getAttribute('src'),
                // <picture> aus dem Build (srcset in mehreren Breiten) mitnehmen
                picture: img.closest('picture'),
                alt: img.getAttribute('alt') || '',
                // Notiz aus dem CMS (Feld „Notiz“), sonst der Alt-Text
                text: (figure.querySelector('.jw-gallery__text') || {}).textContent || '',
                title: caption || ('Fig. ' + pad(i + 1))
            };
        });

        // ── Gerüst ──
        const archive = document.createElement('div');
        archive.className = 'jw-archive';

        const index = document.createElement('ol');
        index.className = 'jw-archive__index';

        const stream = document.createElement('div');
        stream.className = 'jw-archive__stream';

        const detail = document.createElement('aside');
        detail.className = 'jw-archive__detail';
        detail.innerHTML =
            '<div class="jw-archive__detail-head"><span class="jw-archive__detail-code"></span><span class="jw-archive__detail-count"></span></div>' +
            '<p class="jw-archive__detail-title"></p>' +
            '<p class="jw-archive__detail-text"></p>';

        items.forEach(function (item, i) {
            const li = document.createElement('li');
            const button = document.createElement('button');
            button.type = 'button';
            button.innerHTML = '<span class="jw-archive__num">' + pad(i + 1) + '</span><span class="jw-archive__name"></span>';
            button.querySelector('.jw-archive__name').textContent = item.title;
            li.appendChild(button);
            index.appendChild(li);

            const fig = document.createElement('figure');
            fig.className = 'jw-archive__item';
            fig.dataset.index = String(i);
            fig.innerHTML = '<figcaption class="jw-archive__code"></figcaption><a class="post-figure__link" data-lightbox><img loading="lazy" alt=""></a>';
            fig.querySelector('figcaption').textContent = item.code + '  ' + item.title;
            fig.querySelector('figcaption').dataset.code = item.code;
            const a = fig.querySelector('a');
            a.setAttribute('href', item.href);
            const img = fig.querySelector('img');
            if (item.picture) {
                // Gleiches Bild in mehreren Breiten; die Spalte ist rund halb so breit wie das Fenster
                const pic = item.picture.cloneNode(true);
                pic.querySelectorAll('source, img').forEach(function (el) {
                    if (el.hasAttribute('srcset')) el.setAttribute('sizes', '(min-width: 1024px) 45vw, 100vw');
                });
                pic.querySelector('img').setAttribute('loading', 'lazy');
                img.replaceWith(pic);
            } else {
                img.setAttribute('src', item.src);
                img.setAttribute('alt', item.alt);
            }
            stream.appendChild(fig);

            button.addEventListener('click', function () {
                fig.scrollIntoView({ block: 'center', behavior: motionOff() ? 'auto' : 'smooth' });
                setActive(i);
            });
        });

        archive.appendChild(index);
        archive.appendChild(stream);
        archive.appendChild(detail);
        grid.after(archive);

        // Höhe des Detailfelds für die Zentrierung (CSS: --jw-detail-h)
        function measureDetail() {
            detail.style.setProperty('--jw-detail-h', Math.ceil(detail.getBoundingClientRect().height) + 'px');
        }
        if ('ResizeObserver' in window) new ResizeObserver(measureDetail).observe(detail);

        // ── Aktives Bild ──
        const buttons = Array.from(index.querySelectorAll('button'));

        // Der Index scrollt in sich, wenn er höher ist als der sichtbare
        // Bereich (CSS: max-height). Kommt die aktive Zeile in die Nähe des
        // oberen oder unteren Rands, wird die Liste so verschoben, dass die
        // Zeile mittig steht. Nur die Liste scrollt, nicht die Seite.
        function keepInIndexView(button) {
            if (!button || index.scrollHeight <= index.clientHeight) return;
            const row = button.getBoundingClientRect();
            const box = index.getBoundingClientRect();
            const margin = row.height * 2;
            if (row.top >= box.top + margin && row.bottom <= box.bottom - margin) return;
            const top = index.scrollTop + (row.top - box.top) - (box.height - row.height) / 2;
            index.scrollTo({ top: Math.max(0, top), behavior: motionOff() ? 'auto' : 'smooth' });
        }
        const streamItems = Array.from(stream.children);
        let active = -1;

        function setActive(i) {
            if (i === active) return;
            active = i;
            buttons.forEach(function (b, j) {
                if (j === i) b.setAttribute('aria-current', 'true');
                else b.removeAttribute('aria-current');
            });
            keepInIndexView(buttons[i]);
            streamItems.forEach(function (el, j) { el.classList.toggle('is-active', j === i); });
            const item = items[i];
            detail.querySelector('.jw-archive__detail-code').textContent = item.code;
            detail.querySelector('.jw-archive__detail-count').textContent = pad(i + 1) + ' / ' + pad(items.length);
            detail.querySelector('.jw-archive__detail-title').textContent = item.title;
            detail.querySelector('.jw-archive__detail-text').textContent = item.text || item.alt;
            if (!motionOff() && detail.animate) {
                detail.querySelectorAll('.jw-archive__detail-title, .jw-archive__detail-text').forEach(function (el, k) {
                    el.animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }],
                        { duration: 320, delay: k * 50, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)', fill: 'backwards' });
                });
            }
        }

        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) setActive(Number(entry.target.dataset.index));
                });
            }, { rootMargin: '-45% 0px -45% 0px' });
            streamItems.forEach(function (el) { observer.observe(el); });
        }
        setActive(0);

        // ── Ansicht umschalten ──
        function apply(view) {
            const useArchive = view === 'archive' && wide.matches;
            archive.hidden = !useArchive;
            grid.hidden = useArchive;
            if (toggle) {
                toggle.hidden = !wide.matches;
                toggle.querySelectorAll('button').forEach(function (b) {
                    b.setAttribute('aria-pressed', b.dataset.view === view ? 'true' : 'false');
                });
            }
        }

        let view = storedView() === 'grid' ? 'grid' : 'archive';
        if (toggle) {
            toggle.addEventListener('click', function (event) {
                const button = event.target.closest('button[data-view]');
                if (!button) return;
                view = button.dataset.view;
                try { localStorage.setItem(VIEW_KEY, view); } catch (error) { /* nur für diese Seite */ }
                apply(view);
            });
        }
        if (wide.addEventListener) wide.addEventListener('change', function () { apply(view); });
        apply(view);
    });
})();

/* ═══ Fächer (Kopfbereich der Startseite) ═══
   Die Karten liegen wie Spielkarten in der Hand, Lage und Drehung kommen
   aus dem CSS (.jw-fan). Das Skript entscheidet nur, welche Karte gehoben
   ist: beim Überfahren, beim Fokus per Tastatur oder beim ersten Antippen
   auf Touch-Geräten (das zweite Antippen öffnet das Projekt). Die Nachbarn
   bekommen --s = -1 / 1 und rücken zur Seite. Dazu neigt sich die gehobene
   Karte zum Zeiger, mit einem Glanzpunkt, der ihm folgt.
   Durchschalten: Pfeil-Buttons unter dem Fächer, Pfeiltasten und – auf
   Touch-Geräten – Wischen nach links/rechts. Nach der letzten Karte kommt
   wieder die erste.
   Ohne JavaScript ist die erste Karte gehoben, alle Links funktionieren. */
(function () {
    const root = document.querySelector('[data-fan]');
    if (!root) return;

    const slots = Array.from(root.querySelectorAll('.jw-fan__slot'));
    const cards = slots.map(function (slot) { return slot.querySelector('.jw-fan__card'); });
    const caption = root.querySelector('.jw-fan__caption');
    const captionTitle = root.querySelector('.jw-fan__caption-title');
    const meta = root.querySelector('.jw-fan__meta');
    const count = root.querySelector('.jw-fan__count');
    const n = slots.length;
    let active = 0;
    const TILT = 10; // Grad

    function pad(v) { return String(v).padStart(2, '0'); }

    function setActive(index) {
        if (index === active) return;
        active = index;
        slots.forEach(function (slot, i) {
            slot.classList.toggle('is-active', i === index);
            slot.style.setProperty('--s', i === index ? 0 : (i < index ? -1 : 1));
            slot.style.zIndex = String(20 - Math.abs(i - index));
            if (i !== index) resetTilt(cards[i]);
        });
        const info = slots[index].querySelector('.jw-fan__info');
        if (captionTitle && info) captionTitle.textContent = info.querySelector('.jw-fan__title').textContent;
        if (caption) caption.setAttribute('href', cards[index].getAttribute('href'));
        if (meta && info) meta.innerHTML = info.querySelector('.jw-fan__cats').outerHTML;
        if (count) count.textContent = pad(index + 1) + ' / ' + pad(n);
    }

    function resetTilt(card) {
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
        card.style.setProperty('--jw-shine', '0');
    }

    // Startzustand: Nachbarn der ersten Karte rücken zur Seite
    slots.forEach(function (slot, i) { slot.style.setProperty('--s', i === 0 ? 0 : 1); });

    cards.forEach(function (card, i) {
        // Maus und Stift: Überfahren hebt die Karte
        card.addEventListener('pointerenter', function (event) {
            if (event.pointerType !== 'touch') setActive(i);
        });
        card.addEventListener('focus', function () { setActive(i); });

        // Touch: erstes Antippen hebt die Karte, erst das zweite öffnet sie
        card.addEventListener('click', function (event) {
            if (i !== active) {
                event.preventDefault();
                setActive(i);
            }
        });

        // Neigung zum Zeiger, nur auf der gehobenen Karte
        card.addEventListener('pointermove', function (event) {
            if (event.pointerType === 'touch' || i !== active || motionOff()) return;
            const r = card.getBoundingClientRect();
            const px = ((event.clientX - r.left) / r.width) * 2 - 1;   // -1 … 1
            const py = ((event.clientY - r.top) / r.height) * 2 - 1;
            card.style.setProperty('--ry', (px * TILT).toFixed(2) + 'deg');
            card.style.setProperty('--rx', (-py * TILT).toFixed(2) + 'deg');
            card.style.setProperty('--jw-gx', ((px + 1) * 50).toFixed(1) + '%');
            card.style.setProperty('--jw-gy', ((py + 1) * 50).toFixed(1) + '%');
            card.style.setProperty('--jw-shine', Math.min(1, Math.hypot(px, py)).toFixed(3));
        });
        card.addEventListener('pointerleave', function () { resetTilt(card); });
    });

    function step(delta) {
        setActive((active + delta + n) % n);
    }

    // Pfeil-Buttons unter dem Fächer (ohne JS ausgeblendet)
    const nav = root.querySelector('.jw-fan__nav');
    const prev = root.querySelector('[data-fan-prev]');
    const next = root.querySelector('[data-fan-next]');
    if (nav && prev && next) {
        prev.innerHTML = jwArrow('l');
        next.innerHTML = jwArrow('r');
        prev.addEventListener('click', function () { step(-1); });
        next.addEventListener('click', function () { step(1); });
        nav.hidden = false;
    }

    // Wischen auf Touch-Geräten. touch-action: pan-y (CSS) lässt das
    // senkrechte Scrollen beim Browser; waagerechte Bewegungen kommen hier an.
    // Ab 40 px, und deutlich mehr waagerecht als senkrecht, zählt es als
    // Wischen. Der Klick, den manche Browser danach noch auslösen, wird
    // verworfen, damit nicht gleich das Projekt öffnet.
    const hand = root.querySelector('.jw-fan__hand');
    const SWIPE = 40; // px
    let startX = null;
    let startY = 0;
    let swiped = false;
    hand.addEventListener('pointerdown', function (event) {
        if (event.pointerType !== 'touch') return;
        startX = event.clientX;
        startY = event.clientY;
    });
    hand.addEventListener('pointerup', function (event) {
        if (startX === null) return;
        const dx = event.clientX - startX;
        const dy = event.clientY - startY;
        startX = null;
        if (Math.abs(dx) < SWIPE || Math.abs(dx) < Math.abs(dy) * 1.2) return;
        step(dx < 0 ? 1 : -1);
        swiped = true;
        setTimeout(function () { swiped = false; }, 400);
    });
    hand.addEventListener('pointercancel', function () { startX = null; });
    hand.addEventListener('click', function (event) {
        if (!swiped) return;
        event.preventDefault();
        event.stopPropagation();
        swiped = false;
    }, true);

    // Pfeiltasten wandern durch die Karten
    root.addEventListener('keydown', function (event) {
        if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
        const next = (active + (event.key === 'ArrowRight' ? 1 : -1) + n) % n;
        event.preventDefault();
        cards[next].focus();
    });

    // Ziehen eines Links als Bild verhindern
    root.addEventListener('dragstart', function (event) { event.preventDefault(); });
})();

/* ═══ Animationen: Sektions-Aufbau, Filter-Übergänge, Überschriften ═══
   Alle bleiben still, wenn Animationen aus sind (motionOff(): Schalter im
   Header oder Systemeinstellung „Bewegung reduzieren“).
   Ohne JavaScript ist die Seite vollständig sichtbar – die Ausgangszustände
   (z. B. unsichtbare Linien) setzt erst das Skript über Klassen. */
(function () {
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    /* ── 2. Sektionen bauen sich auf: Linie zieht sich auf, Label „entschlüsselt“ sich ── */
    const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/#_<>*';

    function scramble(el) {
        // Alle Textknoten im Label einsammeln und ihren Endtext merken
        const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
        const nodes = [];
        while (walker.nextNode()) {
            const node = walker.currentNode;
            if (node.nodeValue.trim()) nodes.push({ node: node, text: node.nodeValue });
        }
        const total = nodes.reduce(function (sum, n) { return sum + n.text.length; }, 0);
        const duration = 700;
        const start = performance.now();

        function step(time) {
            const t = Math.min((time - start) / duration, 1);
            let revealed = Math.floor(total * t);
            nodes.forEach(function (n) {
                // Wurde der Text inzwischen ersetzt (Sprachwechsel), nicht mehr anfassen
                if (!n.node.isConnected) return;
                let out = '';
                for (let i = 0; i < n.text.length; i++) {
                    const ch = n.text[i];
                    if (revealed > 0 || ch === ' ' || ch === '—') out += ch;
                    else out += CHARS[Math.floor(Math.random() * CHARS.length)];
                    revealed--;
                }
                n.node.nodeValue = out;
            });
            if (t < 1) requestAnimationFrame(step);
            else nodes.forEach(function (n) { if (n.node.isConnected) n.node.nodeValue = n.text; });
        }
        requestAnimationFrame(step);
    }

    // Elemente mit Linie oben (Startseite und Unterseiten) und freistehende Labels
    const revealTargets = document.querySelectorAll([
        '.jw-head', '#contact > .jw-label', '.jw-cv__group',
        '.jw-filterbar', '.jw-plist', '.jw-blist', '.jw-rule', '.jw-pager__link',
        '.jw-legal h2', '.jw-links__list',
        '.jw-page-head > .jw-label', '.jw-links__group > .jw-label', '#jw-archive-title'
    ].join(', '));
    if (revealTargets.length && 'IntersectionObserver' in window) {
        document.documentElement.classList.add('jw-reveal-ready');
        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                const el = entry.target;
                if (entry.isIntersecting) {
                    if (el.classList.contains('is-revealed')) return;
                    el.classList.add('is-revealed');
                    const label = el.matches('.jw-label') ? el : el.querySelector('.jw-label');
                    if (label && !motionOff()) scramble(label);
                    return;
                }
                // Verlässt die Sektion den Bildschirm nach unten (man scrollt hoch),
                // fährt die Linie wieder ein und baut sich beim nächsten Mal neu auf.
                const bottom = window.innerHeight; // echte Fensterkante, nicht die um 12 % verkleinerte
                if (entry.boundingClientRect.top >= bottom) el.classList.remove('is-revealed');
            });
        }, { rootMargin: '0px 0px -12% 0px' });
        revealTargets.forEach(function (el) { observer.observe(el); });
        // Was beim Laden schon im Fenster steht (z. B. die Linie über „01 — Projekte“
        // knapp über der Unterkante), baut sich sofort auf statt erst beim Scrollen
        revealTargets.forEach(function (el) {
            const r = el.getBoundingClientRect();
            if (r.top < window.innerHeight && r.bottom > 0 && !el.classList.contains('is-revealed')) {
                el.classList.add('is-revealed');
                const label = el.matches('.jw-label') ? el : el.querySelector('.jw-label');
                if (label && !motionOff()) scramble(label);
            }
        });
    }

    /* ── 4. Weiche Übergänge beim Filtern (FLIP-Technik) ──
       Vor dem Filtern merkt sich das Skript die Position jedes Eintrags
       (First), nach dem Filtern liest es die neue (Last), versetzt den
       Eintrag optisch zurück an die alte Stelle (Invert) und lässt ihn an
       die neue gleiten (Play). Neu sichtbare Einträge blenden weich ein. */
    document.querySelectorAll('.project-filters').forEach(function (bar) {
        const list = document.querySelector('.work-list');
        if (!list) return;
        function isShown(li) {
            const r = li.getBoundingClientRect();
            return r.height > 0 && r.width > 0;
        }
        // Capture-Phase: läuft vor den eigentlichen Filter-Handlern
        bar.addEventListener('click', function (event) {
            if (!event.target.closest('.filter-btn') || motionOff()) return;
            const before = new Map();
            Array.from(list.children).forEach(function (li) {
                before.set(li, isShown(li) ? li.getBoundingClientRect() : null);
            });
            // Nach den Filter-Handlern, aber vor dem nächsten Bild
            requestAnimationFrame(function () {
                let delay = 0;
                Array.from(list.children).forEach(function (li) {
                    if (!isShown(li)) return;
                    const old = before.get(li);
                    const now = li.getBoundingClientRect();
                    if (old) {
                        const dx = old.left - now.left;
                        const dy = old.top - now.top;
                        if (Math.abs(dx) < 1 && Math.abs(dy) < 1) return;
                        li.animate([
                            { transform: 'translate(' + dx + 'px, ' + dy + 'px)' },
                            { transform: 'none' }
                        ], { duration: 500, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)' });
                    } else {
                        li.animate([
                            { opacity: 0, transform: 'translateY(14px)' },
                            { opacity: 1, transform: 'none' }
                        ], { duration: 380, delay: 60 + delay, easing: 'ease-out', fill: 'backwards' });
                        delay += 40;
                    }
                });
            });
        }, true);
    });

    /* ── 3. Seitenüberschriften: Buchstaben schwellen unter dem Zeiger an ──
       Bricolage Grotesque ist eine variable Schrift. Jeder Buchstabe bekommt
       je nach Abstand zum Zeiger mehr Strichstärke (wght) und Breite (wdth).
       Gilt für die große Überschrift jeder Seite (Start, Projekte, Blog,
       Detailseiten, Links, Rechtliches, 404). */
    if (finePointer) {
        document.querySelectorAll('#jw-title, #jw-page-title, .jw-post-head h1, .jw-links__head h1').forEach(initWave);
    }

    function initWave(title) {
        // Ausgangswerte aus dem CSS der jeweiligen Überschrift lesen
        const style = getComputedStyle(title);
        const baseWght = parseFloat(style.fontWeight) || 600;
        const baseWdth = parseFloat(style.fontStretch) || 100;
        const BASE = { wght: baseWght, wdth: baseWdth };
        // Nur die Strichstärke steigt (Grundwert 600 aus dem CSS bis 800).
        // Breite und Lage der Buchstaben bleiben, die Zeile verschiebt sich kaum.
        const PEAK = { wght: Math.min(800, baseWght + 200), wdth: baseWdth };
        let radius = 220;
        let letters = [];
        let rects = [];
        let pointer = null;
        let frame = null;

        function settings(v) {
            return '"wght" ' + v.wght.toFixed(0) + ', "wdth" ' + v.wdth.toFixed(1);
        }

        // Jeden Textabschnitt der Überschrift in einzelne Buchstaben zerlegen.
        // Zeilenumbrüche (<br>) und Auszeichnungen wie das farbige „&“ bleiben
        // erhalten. Screenreader lesen den Text am Stück (jw-sr-only).
        function split() {
            const walker = document.createTreeWalker(title, NodeFilter.SHOW_TEXT);
            const nodes = [];
            while (walker.nextNode()) {
                if (walker.currentNode.nodeValue.trim()) nodes.push(walker.currentNode);
            }
            nodes.forEach(function (node) {
                const text = node.nodeValue;
                const frag = document.createDocumentFragment();
                const sr = document.createElement('span');
                sr.className = 'jw-sr-only';
                sr.textContent = text;
                const visual = document.createElement('span');
                visual.className = 'jw-letters';
                visual.setAttribute('aria-hidden', 'true');
                text.split(/(\s+)/).forEach(function (chunk) {
                    if (!chunk) return;
                    // Leerzeichen als normaler Text: dort darf die Zeile umbrechen
                    if (chunk.trim() === '') { visual.appendChild(document.createTextNode(chunk)); return; }
                    // Ein Wort bleibt zusammen, damit es nie zwischen zwei Buchstaben
                    // umbricht. Nach einem Bindestrich darf die Zeile weiterhin
                    // umbrechen (<wbr>), z. B. bei „Medienkompetenz-Game-Jam“.
                    chunk.split(/(?<=-)/).forEach(function (part, i) {
                        if (i > 0) visual.appendChild(document.createElement('wbr'));
                        const word = document.createElement('span');
                        word.className = 'jw-word';
                        Array.from(part).forEach(function (ch) {
                            const letter = document.createElement('span');
                            letter.className = 'jw-letter';
                            letter.textContent = ch;
                            letter.current = { wght: BASE.wght, wdth: BASE.wdth, k: 0 };
                            letter.style.fontVariationSettings = settings(BASE);
                            word.appendChild(letter);
                        });
                        visual.appendChild(word);
                    });
                });
                frag.appendChild(sr);
                frag.appendChild(visual);
                node.replaceWith(frag);
            });
            letters = Array.from(title.querySelectorAll('.jw-letter'));
            rects = [];
        }

        function measure() {
            // Wirkungsradius wächst mit der Schriftgröße
            radius = Math.max(90, parseFloat(getComputedStyle(title).fontSize) * 1.5);
            rects = letters.map(function (l) {
                const r = l.getBoundingClientRect();
                return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
            });
        }

        function tick() {
            if (!rects.length) measure();
            let moving = false;
            letters.forEach(function (letter, i) {
                let k = 0;
                if (pointer && rects[i] && !motionOff()) {
                    const dx = pointer.x - rects[i].x;
                    const dy = pointer.y - rects[i].y;
                    const d = Math.sqrt(dx * dx + dy * dy);
                    k = Math.max(0, 1 - d / radius);
                    k = k * k * (3 - 2 * k); // weiche Kurve
                }
                const goal = { wght: BASE.wght + (PEAK.wght - BASE.wght) * k, wdth: BASE.wdth + (PEAK.wdth - BASE.wdth) * k };
                const c = letter.current;
                c.wght += (goal.wght - c.wght) * 0.25;
                c.wdth += (goal.wdth - c.wdth) * 0.25;
                c.k += (k - c.k) * 0.25;
                if (Math.abs(goal.wght - c.wght) > 0.5 || Math.abs(k - c.k) > 0.005) moving = true;
                letter.style.fontVariationSettings = settings(c);

            });
            frame = (pointer || moving) ? requestAnimationFrame(tick) : null;
        }

        const area = title.closest('.jw-hero, .jw-page-head, .jw-detail-head, .jw-post-head, .jw-links__head') || title;
        area.addEventListener('pointermove', function (event) {
            pointer = { x: event.clientX, y: event.clientY };
            if (!frame) frame = requestAnimationFrame(tick);
        });
        area.addEventListener('pointerleave', function () {
            pointer = null;
            if (!frame) frame = requestAnimationFrame(tick);
        });
        window.addEventListener('scroll', function () { rects = []; }, { passive: true });
        window.addEventListener('resize', function () { rects = []; });

        split();
    }
})();

/* ═══ Zwei-Klick-Einbettungen ═══
   Externe iframes (YouTube, itch.io) werden beim Build durch einen
   Platzhalter ersetzt (.eleventy.js → consentEmbeds). Erst nach Klick
   wird das iframe aus dem <template> eingesetzt und lädt Inhalte vom
   Fremdanbieter. */
document.addEventListener("click", function (event) {
    const button = event.target.closest(".jw-consent__button");
    if (!button) return;
    const box = button.closest(".jw-consent");
    const template = box ? box.querySelector("template") : null;
    if (!template) return;
    box.replaceWith(template.content.cloneNode(true));
});

/* ═══ YouTube erst nach Klick ═══
   Projektseiten zeigen ein lokales Vorschaubild. Erst der Klick lädt den
   Player von youtube-nocookie.com und startet das Video. */
document.querySelectorAll('.jw-video[data-yt]').forEach(function (box) {
    const button = box.querySelector('.jw-video__play');
    if (!button) return;
    button.addEventListener('click', function () {
        const iframe = document.createElement('iframe');
        iframe.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(box.dataset.yt) + '?autoplay=1&rel=0';
        iframe.title = button.textContent.trim();
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
        iframe.referrerPolicy = 'strict-origin-when-cross-origin';
        iframe.allowFullscreen = true;
        iframe.className = 'jw-video__frame';
        button.replaceWith(iframe);
        const note = box.querySelector('.jw-video__note');
        if (note) note.remove();
        iframe.focus();
    });
});
