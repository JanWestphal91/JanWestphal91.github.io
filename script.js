
function escapeHtml(text) {
    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

/* ═══ i18n ═══ */
const LANG_STORAGE_KEY = 'preferred-lang';

function detectLang() {
    const stored = localStorage.getItem(LANG_STORAGE_KEY);
    if (stored === 'de' || stored === 'en') return stored;
    return (navigator.language || '').toLowerCase().startsWith('de') ? 'de' : 'en';
}

let currentLang = detectLang();

function t(key) {
    const dict = window.TRANSLATIONS;
    if (!dict) return key;
    return (dict[currentLang] && dict[currentLang][key])
        || (dict.en && dict.en[key])
        || key;
}

function applyTranslations(lang, skipProjectRender) {
    currentLang = lang;
    document.documentElement.lang = lang;

    document.querySelectorAll('[data-i18n]').forEach(function(el) {
        el.textContent = t(el.dataset.i18n);
    });

    document.querySelectorAll('[data-en]').forEach(function(el) {
        el.textContent = lang === 'de' && el.dataset.de ? el.dataset.de : el.dataset.en;
    });

    document.querySelectorAll('[data-lang-show]').forEach(function(el) {
        el.hidden = el.dataset.langShow !== lang;
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(function(el) {
        el.placeholder = t(el.dataset.i18nPlaceholder);
    });

    document.querySelectorAll('[data-i18n-aria]').forEach(function(el) {
        el.setAttribute('aria-label', t(el.dataset.i18nAria));
    });

    document.querySelectorAll('[data-i18n-alt]').forEach(function(el) {
        el.alt = t(el.dataset.i18nAlt);
    });

    // Attribute aus den CMS-Texten (_data/*.json), geschrieben vom
    // Eleventy-Shortcode {% i18n text, "alt" | "placeholder" | "aria" %}.
    const pickLang = function(el, name) {
        const de = el.dataset[name + 'De'];
        return lang === 'de' && de ? de : el.dataset[name + 'En'];
    };
    document.querySelectorAll('[data-alt-en]').forEach(function(el) {
        el.alt = pickLang(el, 'alt');
    });
    document.querySelectorAll('[data-placeholder-en]').forEach(function(el) {
        el.placeholder = pickLang(el, 'placeholder');
    });
    document.querySelectorAll('[data-aria-en]').forEach(function(el) {
        el.setAttribute('aria-label', pickLang(el, 'aria'));
    });

    const bowlLabel = document.getElementById('bowl-label');
    if (bowlLabel && !bowlLabel._fishMsgActive) {
        bowlLabel.textContent = t('bowl.label');
    }

    const toggle = document.getElementById('lang-toggle');
    if (toggle) toggle.textContent = lang === 'de' ? 'EN' : 'DE';

    // Den Titel nur ändern, wenn jemand die Sprache selbst gewählt hat.
    // So sehen Suchmaschinen (ohne gespeicherte Wahl) immer den Titel aus
    // dem HTML, der zur Beschreibung in index.njk passt.
    // Die Titel stehen als data-title-en / data-title-de am <body>.
    if (document.body.dataset.titleEn && localStorage.getItem(LANG_STORAGE_KEY)) {
        document.title = lang === 'de' && document.body.dataset.titleDe
            ? document.body.dataset.titleDe
            : document.body.dataset.titleEn;
    }
}

function initLangToggle() {
    const toggle = document.getElementById('lang-toggle');
    if (!toggle) return;
    toggle.addEventListener('click', function() {
        const next = currentLang === 'de' ? 'en' : 'de';
        localStorage.setItem(LANG_STORAGE_KEY, next);
        applyTranslations(next);
    });
}

const TEXT_EFFECTS = {
    wavy: {
        dataAttribute: "data-wavy",
        charClass: "wavy-text__char",
        animation: "wavy-bounce 1.2s ease-in-out infinite",
        delayStep: 0.08
    },
    rainbow: {
        dataAttribute: "data-rainbow",
        charClass: "rainbow-text__char",
        animation: "rainbow-cycle 2.1s linear infinite",
        delayStep: 0.08
    }
};

function createEffectTextHTML(text, effectNames = []) {
    const validEffects = effectNames.filter((effectName) => TEXT_EFFECTS[effectName]);
    let characterIndex = 0;
    const tokens = String(text).split(/(\s+)/);

    return tokens.map((token) => {
        if (!token) {
            return "";
        }

        if (/^\s+$/.test(token)) {
            characterIndex += token.length;
            return token;
        }

        const wordHtml = Array.from(token).map((character) => {
            const charClasses = ["text-effect__char"];
            const animationValues = [];
            const delayValues = [];

            validEffects.forEach((effectName) => {
                const effect = TEXT_EFFECTS[effectName];
                charClasses.push(effect.charClass);
                animationValues.push(effect.animation);
                delayValues.push(`${(effect.delayStep * characterIndex).toFixed(3)}s`);
            });

            const style = animationValues.length > 0
                ? ` style="--effect-animations:${animationValues.join(",")};--effect-delays:${delayValues.join(",")}"`
                : "";

            characterIndex += 1;
            return `<span class="${charClasses.join(" ")}"${style}>${escapeHtml(character)}</span>`;
        }).join("");

        return `<span class="text-effect__word">${wordHtml}</span>`;
    }).join("");
}

function applyTextEffects(target, effectNames, text = null) {
    if (!target) {
        return "";
    }

    const element = typeof target === "string" ? document.querySelector(target) : target;

    if (!element) {
        return "";
    }

    const validEffects = Array.from(new Set(effectNames.filter((effectName) => TEXT_EFFECTS[effectName])));

    if (validEffects.length === 0) {
        return "";
    }

    const originalText = text ?? element.dataset.effectsOriginal ?? element.textContent ?? "";

    element.dataset.effectsOriginal = originalText;
    element.dataset.effects = validEffects.join(" ");
    element.classList.add("text-effects");
    element.setAttribute("aria-label", originalText);
    element.innerHTML = createEffectTextHTML(originalText, validEffects);

    return element.innerHTML;
}

function createWavyTextHTML(text) {
    return createEffectTextHTML(text, ["wavy"]);
}

function createRainbowTextHTML(text) {
    return createEffectTextHTML(text, ["rainbow"]);
}

function applyWavyText(target, text = null) {
    return applyTextEffects(target, ["wavy"], text);
}

function applyRainbowText(target, text = null) {
    return applyTextEffects(target, ["rainbow"], text);
}

function getElementEffects(element) {
    return Object.keys(TEXT_EFFECTS).filter((effectName) => {
        return element.hasAttribute(TEXT_EFFECTS[effectName].dataAttribute);
    });
}

applyTranslations(currentLang, true);

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
            const match = text.match(/\[([^\]]+)\]/);
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
        btn.className = "filter-btn";
        btn.dataset.filter = type;
        btn.textContent = type;
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
            const match = text.match(/\[([^\]]+)\]/);

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

    // Attach click listeners to filter buttons
    filterContainer.querySelectorAll(".filter-btn").forEach((btn) => {
        btn.addEventListener("click", function () {
            // Update active state
            filterContainer.querySelectorAll(".filter-btn").forEach((b) => {
                b.classList.remove("active");
            });
            btn.classList.add("active");

            // Filter projects
            const selectedType = btn.dataset.filter;
            filterProjects(selectedType);
        });
    });
}

initProjectFilters();

/* ═══ Mobile: tap to flip cards (first tap flips, second tap follows link) ═══ */
function initMobileCardFlip() {
    // Attach click handlers to work-item links for small viewports
    document.querySelectorAll('.work-item-link').forEach((link) => {
        const card = link.querySelector('.flip-card');
        if (!card) return;

        link.addEventListener('click', function (e) {
            // Only intercept on touch / small screens
            if (window.matchMedia('(max-width: 768px)').matches) {
                if (!card.classList.contains('is-flipped')) {
                    // Prevent navigation and flip the card
                    e.preventDefault();
                    // close other flipped cards
                    document.querySelectorAll('.flip-card.is-flipped').forEach((c) => c.classList.remove('is-flipped'));
                    card.classList.add('is-flipped');
                } else {
                    // allow navigation on second tap
                }
            }
        });
    });
}

initMobileCardFlip();

// Returning via the browser/phone back button restores the page from the
// back-forward cache exactly as it was left — including a card still stuck
// in its tapped "is-flipped" state. pageshow fires on bfcache restores too
// (unlike DOMContentLoaded), so reset all cards there.
window.addEventListener("pageshow", function () {
    document.querySelectorAll(".flip-card.is-flipped").forEach(function (card) {
        card.classList.remove("is-flipped");
    });
});

const form = document.getElementById("form") || document.querySelector(".contact-form");

if (form) {
    const submitBtn = form.querySelector('button[type="submit"]');

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Formspark erwartet JSON; das Fangfeld _honeypot wird mitgeschickt,
        // damit Formspark Bot-Nachrichten erkennen kann.
        const payload = Object.fromEntries(new FormData(form).entries());

        const originalText = submitBtn ? submitBtn.textContent : "";

        if (submitBtn) {
            submitBtn.textContent = t("contact.submit.sending");
            submitBtn.disabled = true;
        }

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
                alert(t("contact.success"));
                form.reset();
            } else {
                alert(t("contact.error-prefix") + response.status);
            }

        } catch (_error) {
            alert(t("contact.network-error"));
        } finally {
            if (submitBtn) {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        }
    });
}



const autoEffectSelector = Object.values(TEXT_EFFECTS)
    .map((effect) => `[${effect.dataAttribute}]`)
    .join(",");

document.querySelectorAll(autoEffectSelector).forEach((element) => {
    const elementEffects = getElementEffects(element);
    const effectText = elementEffects
        .map((effectName) => element.getAttribute(TEXT_EFFECTS[effectName].dataAttribute))
        .find((value) => value !== null && value !== "");

    applyTextEffects(element, elementEffects, effectText ?? null);
});

window.TEXT_EFFECTS = TEXT_EFFECTS;
window.createEffectTextHTML = createEffectTextHTML;
window.applyTextEffects = applyTextEffects;
window.createWavyTextHTML = createWavyTextHTML;
window.applyWavyText = applyWavyText;
window.createRainbowTextHTML = createRainbowTextHTML;
window.applyRainbowText = applyRainbowText;

/* ═══ Burger Menu Mobile Navigation ═══ */
const burgerMenuToggle = document.getElementById("burger-menu-toggle");
const navMain = document.querySelector(".nav-main");

function closeBurgerMenu() {
    if (navMain) {
        navMain.classList.remove("active");
    }
    if (burgerMenuToggle) {
        burgerMenuToggle.classList.remove("active");
        burgerMenuToggle.setAttribute("aria-expanded", "false");
    }
}

function toggleBurgerMenu(event) {
    event.preventDefault();
    
    if (navMain) {
        const isActive = navMain.classList.toggle("active");
        if (burgerMenuToggle) {
            burgerMenuToggle.classList.toggle("active", isActive);
            burgerMenuToggle.setAttribute("aria-expanded", isActive ? "true" : "false");
        }
    }
}

if (burgerMenuToggle) {
    burgerMenuToggle.addEventListener("click", toggleBurgerMenu);
}


// Nav-Links schließen das Menü beim Klick
document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", closeBurgerMenu);
});

// Menü schließen wenn auf der Seite geklickt wird
document.addEventListener("click", (event) => {
    const isClickInsideNav = navMain && navMain.contains(event.target);
    const isClickOnBurger = burgerMenuToggle && burgerMenuToggle.contains(event.target);
    
    if (!isClickInsideNav && !isClickOnBurger && navMain && navMain.classList.contains("active")) {
        closeBurgerMenu();
    }
});

// Menü schließen bei Fenster-Skalierung über 768px
window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
        closeBurgerMenu();
    }
});

function initAutoHideHeader() {
    const header = document.querySelector(".site-header");

    if (!header) {
        return;
    }

    let lastScrollY = window.scrollY;
    let ticking = false;
    const directionThreshold = 6;

    function setHeaderVisible(isVisible) {
        header.classList.toggle("site-header--hidden", !isVisible);
    }

    setHeaderVisible(true);

    function handleScrollDirection() {
        const currentScrollY = window.scrollY;
        const delta = currentScrollY - lastScrollY;
        const menuIsOpen = navMain && navMain.classList.contains("active");

        if (menuIsOpen || currentScrollY < 24) {
            setHeaderVisible(true);
            lastScrollY = currentScrollY;
        } else if (Math.abs(delta) >= directionThreshold) {
            if (delta > 0) {
                setHeaderVisible(false);
            } else {
                setHeaderVisible(true);
            }
            lastScrollY = currentScrollY;
        }

        ticking = false;
    }

    window.addEventListener("scroll", () => {
        if (!ticking) {
            window.requestAnimationFrame(handleScrollDirection);
            ticking = true;
        }
    }, { passive: true });
}

initAutoHideHeader();

/* ═══ Hero Name Modal ═══ */
function initHeroModal() {
    const heroNameLink = document.querySelector(".hero-name-link");
    const modal = document.getElementById("hero-modal");
    const modalOverlay = document.querySelector(".modal-overlay");
    const modalClose = document.querySelector(".modal-close");

    if (!heroNameLink || !modal) {
        return;
    }

    function openModal(e) {
        e.preventDefault();
        modal.style.display = "flex";
        document.body.style.overflow = "hidden";
    }

    function closeModal() {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
    }

    heroNameLink.addEventListener("click", openModal);
    modalClose.addEventListener("click", closeModal);
    modalOverlay.addEventListener("click", closeModal);

    // Close modal on Escape key
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.style.display === "flex") {
            closeModal();
        }
    });
}

initHeroModal();

function initWavyHover(element) {
    if (!element) {
        return;
    }

    const originalText = element.textContent || "";

    function applyEffect() {
        // Don't re-apply if the effect is already active. Without this guard,
        // clicking the link swallowed the first click: hovering applies the
        // wavy spans, then mousedown moves focus to the link and the focus
        // handler rebuilt the innerHTML *between mousedown and mouseup* — the
        // span under the pointer got replaced mid-click, so the browser never
        // dispatched the click and the link only reacted on the second try.
        if (element.dataset.effects) {
            return;
        }
        applyWavyText(element, originalText);
    }

    function restoreText() {
        element.textContent = originalText;
        element.classList.remove("text-effects");
        element.removeAttribute("aria-label");
        delete element.dataset.effectsOriginal;
        delete element.dataset.effects;
    }

    element.addEventListener("mouseenter", applyEffect);
    element.addEventListener("focus", applyEffect);
    element.addEventListener("mouseleave", restoreText);
    element.addEventListener("blur", restoreText);
}

initWavyHover(document.querySelector(".logo"));
initWavyHover(document.querySelector(".hero-name-link"));

// Make the optional demo DIV draggable only when it exists.
const demoDraggable = document.getElementById("mydiv");
if (demoDraggable) {
    dragElement(demoDraggable);
}

function dragElement(elmnt) {
    if (!elmnt) {
        return;
    }

    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    const header = document.getElementById(elmnt.id + "header");

    if (header) {
        header.onmousedown = dragMouseDown;
    } else {
        elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();

        if (header) {
            header.classList.add("dragging");
        }

        pos3 = e.clientX;
        pos4 = e.clientY;

        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();

        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;

        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        if (header) {
            header.classList.remove("dragging");
        }

        document.onmouseup = null;
        document.onmousemove = null;
    }
}




/* ═══ Fish Scene — Feed Glub ═══ */
function initFishScene() {
    const can       = document.getElementById('food-can');
    const bowl      = document.getElementById('fish-bowl');
    const fishEl    = document.getElementById('fish');
    const bowlLabel = document.getElementById('bowl-label');
    const canvas    = document.getElementById('pellet-layer');
    const sceneRoot = document.getElementById('top');

    if (!can || !bowl || !fishEl || !canvas || !sceneRoot) return;

    const ctx = canvas.getContext('2d');

    // ── Canvas resize ──
    function resizeCanvas() {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // ── Init can position from CSS (converts bottom → top) ──
    function getRootPageOffset() {
        const r = sceneRoot.getBoundingClientRect();
        return {
            x: r.left + window.scrollX,
            y: r.top + window.scrollY
        };
    }

    const canRect = can.getBoundingClientRect();
    const rootOffset = getRootPageOffset();
    // Keep absolute positioning relative to #top so elements stay above the footer.
    can.style.top    = (canRect.top + window.scrollY - rootOffset.y) + 'px';
    can.style.left   = (canRect.left + window.scrollX - rootOffset.x) + 'px';
    can.style.bottom = 'auto';

    let canX = canRect.left;
    let canY = canRect.top;
    let isDragging = false;
    let offsetX = 0, offsetY = 0;
    let prevX = 0, prevY = 0;
    let velX = 0, velY = 0;
    let angle = 0;

    function getPointerPagePos(e) {
        return {
            x: e.pageX ?? (e.clientX + window.scrollX),
            y: e.pageY ?? (e.clientY + window.scrollY)
        };
    }

    // ── Pellets ──
    const pellets = [];

    function spawnPellets(n) {
        const holesEl = can.querySelector('.can-holes');
        const hr = (holesEl || can).getBoundingClientRect();
        const sx = hr.left + hr.width / 2;
        const sy = hr.top  + hr.height / 2;

        for (let i = 0; i < n; i++) {
            pellets.push({
                x:      sx + (Math.random() - 0.5) * 14,
                y:      sy + (Math.random() - 0.5) * 8,
                vx:     (Math.random() - 0.5) * 2.5 + velX * 0.12,
                vy:     Math.random() * 1.5 + 0.5,
                r:      Math.random() * 2.5 + 2.5,
                color:  Math.random() > 0.5 ? '#b8732a' : '#d4954a',
                inBowl: false,
                eaten:  false,
                alpha:  1,
            });
        }
    }

    // ── Drag ──
    can.addEventListener('pointerdown', e => {
        isDragging = true;
        can.setPointerCapture(e.pointerId);
        can.classList.add('is-dragging');
        document.body.classList.add('is-dragging');

        const pointer = getPointerPagePos(e);
        const r = can.getBoundingClientRect();
        const canLeft = r.left + window.scrollX;
        const canTop = r.top + window.scrollY;
        offsetX = pointer.x - canLeft;
        offsetY = pointer.y - canTop;
        prevX = pointer.x;
        prevY = pointer.y;
        e.preventDefault();
    });

    can.addEventListener('pointermove', e => {
        if (!isDragging) return;

        const pointer = getPointerPagePos(e);

        velX = pointer.x - prevX;
        velY = pointer.y - prevY;
        prevX = pointer.x;
        prevY = pointer.y;

        const rootPos = getRootPageOffset();
        canX = pointer.x - offsetX;
        canY = pointer.y - offsetY;
        can.style.left = (canX - rootPos.x) + 'px';
        can.style.top  = (canY - rootPos.y) + 'px';

        // Smooth tilt
        const targetAngle = Math.max(-72, Math.min(72, velX * 5));
        angle += (targetAngle - angle) * 0.35;
        can.style.transform = `rotate(${angle}deg)`;

        // Spawn when shaking fast + tilted
        const speed = Math.sqrt(velX * velX + velY * velY);
        if (speed > 7 && Math.abs(angle) > 20) {
            spawnPellets(Math.max(1, Math.ceil(speed / 9)));
        }
        e.preventDefault();
    });

    function stopDrag() {
        if (!isDragging) return;
        isDragging = false;
        can.classList.remove('is-dragging');
        document.body.classList.remove('is-dragging');
        angle = 0;
        can.style.transform = 'rotate(0deg)';
        velX = 0;
        velY = 0;
    }

    can.addEventListener('pointerup',     stopDrag);
    can.addEventListener('pointercancel', stopDrag);

    // ── Bowl ellipse collision ──
    function isInBowl(px, py) {
        const b  = bowl.getBoundingClientRect();
        const cx = b.left + b.width  / 2;
        const cy = b.top  + b.height / 2;
        const rx = b.width  / 2 * 0.82;
        const ry = b.height / 2 * 0.82;
        return ((px - cx) / rx) ** 2 + ((py - cy) / ry) ** 2 < 1;
    }

    // ── Fish state ──
    let fishX = 50, fishY = 45;
    let fishTX = 50, fishTY = 45;
    let fishFacingLeft = false;
    let wanderTimer = 0;
    let fedCount = 0;

    function showMessage(msg) {
        bowlLabel.textContent = msg;
        bowlLabel._fishMsgActive = true;
        clearTimeout(bowlLabel._t);
        bowlLabel._t = setTimeout(() => {
            bowlLabel._fishMsgActive = false;
            bowlLabel.textContent = t('bowl.label');
        }, 2500);
    }

    // ── Spawn heart animation ──
    function spawnHeart() {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.textContent = '❤️';
        
        const fp = fishScreenPos();
        heart.style.left = fp.x + 'px';
        heart.style.top = fp.y + 'px';
        
        document.body.appendChild(heart);
        
        setTimeout(() => heart.remove(), 2000);
    }

    // ── Fish pixel position in screen space ──
    function fishScreenPos() {
        const water = bowl.querySelector('.bowl-water');
        const wr    = water.getBoundingClientRect();
        return {
            x: wr.left + (fishX / 100) * wr.width,
            y: wr.top  + (fishY / 100) * wr.height,
        };
    }

    // ── Main loop ──
    function loop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Update + draw pellets
        for (let i = pellets.length - 1; i >= 0; i--) {
            const p = pellets[i];
            if (p.eaten) { pellets.splice(i, 1); continue; }

            if (p.inBowl) {
                const fp   = fishScreenPos();
                const dx   = fp.x - p.x;
                const dy   = fp.y - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 26) {
                    p.eaten = true;
                    fedCount++;
                    fishTX = 15 + Math.random() * 70;
                    fishTY = 10 + Math.random() * 72;
                    showMessage(t('bowl.msg' + (fedCount % 8)));
                    spawnHeart();
                    continue;
                }

                // Pellet drifts toward fish
                p.vx += (dx / dist) * 0.4;
                p.vy += (dy / dist) * 0.4;
                p.vx *= 0.88;
                p.vy *= 0.88;

            } else {
                // Gravity
                p.vy += 0.3;
                p.vx *= 0.99;

                if (isInBowl(p.x, p.y)) {
                    p.inBowl = true;
                    p.vy *= -0.15;
                    p.vx *=  0.4;
                }

                if (p.y > canvas.height + 30) {
                    pellets.splice(i, 1);
                    continue;
                }
            }

            p.x += p.vx;
            p.y += p.vy;

            ctx.save();
            ctx.globalAlpha = p.alpha;
            ctx.beginPath();
            ctx.ellipse(p.x, p.y, p.r, p.r * 0.65, 0, 0, Math.PI * 2);
            ctx.fillStyle   = p.color;
            ctx.fill();
            ctx.strokeStyle = 'rgba(0,0,0,0.18)';
            ctx.lineWidth   = 0.5;
            ctx.stroke();
            ctx.restore();
        }

        // Fish movement (smooth lerp)
        const prevFX = fishX;
        fishX += (fishTX - fishX) * 0.055;
        fishY += (fishTY - fishY) * 0.055;

        if (Math.abs(fishTX - fishX) > 0.3) {
            fishFacingLeft = fishTX < prevFX;
        }

        fishEl.style.left      = fishX + '%';
        fishEl.style.top       = fishY + '%';
        fishEl.style.transform = `translate(-50%, -50%) scaleX(${fishFacingLeft ? -1 : 1})`;

        // Idle wander
        wanderTimer++;
        if (wanderTimer > 130) {
            wanderTimer = 0;
            const hasPelletInBowl = pellets.some(p => p.inBowl);
            if (!hasPelletInBowl) {
                fishTX = 12 + Math.random() * 76;
                fishTY =  8 + Math.random() * 76;
            }
        }

        requestAnimationFrame(loop);
    }

    requestAnimationFrame(loop);
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

    // Width of ONE of the two duplicated .ticker-text spans — the loop point.
    let half = 0;
    function measure() {
        half = content.scrollWidth / 2;
    }
    measure();
    window.addEventListener("resize", measure);
    // The language toggle rewrites the .ticker-text contents.
    new MutationObserver(measure).observe(content, { childList: true, subtree: true, characterData: true });

    // Match the old CSS timing: 50% of the content per 30s.
    const LOOP_SECONDS = 30;
    let paused = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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
        if (!paused && !pointerIsDown && half > 0) {
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

/* ═══ Lightbox: Bilder im Fließtext und in Galerien groß anzeigen ═══ */
function initLightbox() {
    let overlay = null;

    function onKeydown(event) {
        if (event.key === "Escape") close();
    }

    function close() {
        if (!overlay) return;
        overlay.remove();
        overlay = null;
        document.body.style.overflow = "";
        document.removeEventListener("keydown", onKeydown);
    }

    function open(src, alt, caption) {
        if (!src) return;
        close();

        overlay = document.createElement("div");
        overlay.className = "lightbox";
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

        document.body.appendChild(overlay);
        document.body.style.overflow = "hidden";
        document.addEventListener("keydown", onKeydown);
    }

    document.addEventListener("click", function (event) {
        if (!(event.target instanceof Element)) return;

        // Bilder im Fließtext sind in einen Link gewickelt.
        const figureLink = event.target.closest(".post-figure__link");
        if (figureLink) {
            event.preventDefault();
            const image = figureLink.querySelector("img");
            const figure = figureLink.closest("figure");
            const caption = figure ? figure.querySelector("figcaption") : null;
            open(figureLink.getAttribute("href"), image ? image.alt : "", caption ? caption.textContent : "");
            return;
        }

        // Galeriebilder auf Projekt- und Blogseiten.
        const galleryImage = event.target.closest(".project-gallery__item img");
        if (galleryImage) {
            const figure = galleryImage.closest("figure");
            const caption = figure ? figure.querySelector("figcaption") : null;
            open(galleryImage.getAttribute("src"), galleryImage.alt, caption ? caption.textContent : "");
        }
    });
}

initLightbox();

initFishScene();
initLangToggle();

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
