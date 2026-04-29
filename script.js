
function escapeHtml(text) {
    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
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
function initLogoWavyHover() {
    const logo = document.querySelector(".logo");

    if (!logo) {
        return;
    }

    const originalText = logo.textContent || "";

    function applyLogoWavy() {
        applyWavyText(logo, originalText);
    }

    function restoreLogoText() {
        logo.textContent = originalText;
        logo.classList.remove("text-effects");
        logo.removeAttribute("aria-label");
        delete logo.dataset.effectsOriginal;
        delete logo.dataset.effects;
    }

    logo.addEventListener("mouseenter", applyLogoWavy);
    logo.addEventListener("focus", applyLogoWavy);
    logo.addEventListener("mouseleave", restoreLogoText);
    logo.addEventListener("blur", restoreLogoText);
}

    const validEffects = effectNames.filter((effectName) => TEXT_EFFECTS[effectName]);
initLogoWavyHover();
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

const PROJECT_DATA = {
    "go-pony-go-c": {
        title: "Go Pony, Go C!",
        category: "[Webgame] 2026",
        summary: "Made with Godot and Aseprite, free 2 play and nothing to pay." +
            "This game is a small homage to the old Flash games of the early 2000s and to cope with physics calculations. " +
            "It features a small pony getting faster, trying to reach lightspeed. " +
            "The game is available on itch.io to play in a browser. ",
        meta: [
            "Webgame",
            "Solo project",
            "Tools used: Godot, Aseprite, Adobe CC",
            "Status: Released on itch.io"
        ],
        images: [
            {
                src: "https://img.itch.zone/aW1hZ2UvNDI4NzgyOS8yNTY3MTUzNi5wbmc=/original/1A9wjP.png",
                alt: "Go Pony, Go C! screenshot 1 from itch.io",
                caption: "Screenshot 1"
            },
            {
                src: "https://img.itch.zone/aW1hZ2UvNDI4NzgyOS8yNTg0NDY4OS5wbmc=/original/OY%2BX9f.png",
                alt: "Go Pony, Go C! screenshot 2 from itch.io",
                caption: "Screenshot 2"
            },
            {
                src: "https://img.itch.zone/aW1hZ2UvNDI4NzgyOS8yNTY3MTUzMy5wbmc=/original/lcI4Mo.png",
                alt: "Go Pony, Go C! screenshot 3 from itch.io",
                caption: "Screenshot 3"
            },
            {
                src: "https://img.itch.zone/aW1hZ2UvNDI4NzgyOS8yNTY3MTUzNS5wbmc=/original/zmOtvE.png",
                alt: "Go Pony, Go C! screenshot 4 from itch.io",
                caption: "Screenshot 4"
            }
        ],
        content: [
            "Can you help a small pony reach its dream? Stay focused and show how fast you are.",
            "Climb the leaderboard and become the fastest pony of them all!"
        ],
        embed: '<iframe frameborder="0" src="https://itch.io/embed/4287829" width="552" height="167"><a href="https://jan-west.itch.io/go-pony-go-c">Go Pony, Go C! by Netro</a></iframe>'
    },
    "creative-coding-experiments": {
        title: "Interaktive visuelle Experimente",
        category: "Creative Coding 2026",
        summary: "Prototypische Arbeiten zwischen Motion, Typografie und Echtzeit-Interaktion.",
        meta: [
            "Rolle: Creative Coding, Visual Design",
            "Fokus: Echtzeit-Input, Formexploration",
            "Status: Laufende Sammlung"
        ],
        images: [
            {
                src: "Images/iconpatterndark.png",
                alt: "Abstraktes dunkles Pattern als visuelle Studie",
                caption: "Pattern Study Dark"
            },
            {
                src: "Images/iconpatternlight.png",
                alt: "Abstraktes helles Pattern als visuelle Studie",
                caption: "Pattern Study Light"
            }
        ],
        content: [
            "Die Experimente dienen als Sandbox fuer Bewegungsprinzipien, Farbkonzepte und systematische Typo-Animation.",
            "Einzelne Studien lassen sich spaeter als Module in groessere Projekte uebernehmen."
        ]
    },
    "design-system-structure": {
        title: "Visuelle Struktur fuer skalierbare Produkte",
        category: "Design Systems 2025",
        summary: "Ein modulares Set aus Regeln und Komponenten fuer konsistente UI-Entwicklung.",
        meta: [
            "Rolle: UX/UI, System Design",
            "Fokus: Skalierbarkeit und Konsistenz",
            "Status: Konzept + Dokumentation"
        ],
        images: [
            {
                src: "Images/iconpatternlight.png",
                alt: "Helles Pattern als Basis fuer ein Design-System",
                caption: "System Pattern"
            }
        ],
        content: [
            "Das Design-System definiert Typografie, Spacing, Komponenten-Hierarchien und klare Einsatzregeln fuer Teams.",
            "Dadurch entstehen schnellere Iterationen und ein durchgaengig stimmiges Nutzererlebnis ueber mehrere Features hinweg."
        ]
    }
};

function renderProjectPage() {
    if (document.body.dataset.page !== "project") {
        return;
    }

    const params = new URLSearchParams(window.location.search);
    const hashId = window.location.hash.replace(/^#/, "");
    const id = params.get("id") || hashId || "go-pony-go-c";
    const project = PROJECT_DATA[id] || PROJECT_DATA["go-pony-go-c"];

    const categoryElement = document.getElementById("project-category");
    const titleElement = document.getElementById("project-title");
    const summaryElement = document.getElementById("project-summary");
    const metaElement = document.getElementById("project-meta");
    const galleryElement = document.getElementById("project-gallery");
    const contentElement = document.getElementById("project-content");

    if (!categoryElement || !titleElement || !summaryElement || !metaElement || !galleryElement) {
        return;
    }

    categoryElement.textContent = project.category;
    titleElement.textContent = project.title;
    summaryElement.textContent = project.summary;
    document.title = `${project.title} - Jan Westphal`;

    metaElement.innerHTML = project.meta
        .map((item) => `<li>${escapeHtml(item)}</li>`)
        .join("");

    galleryElement.innerHTML = project.images
        .map((image) => {
            return `
                <figure class="project-gallery__item">
                    <img src="${escapeHtml(image.src)}" alt="${escapeHtml(image.alt)}" loading="lazy">
                    <figcaption>${escapeHtml(image.caption)}</figcaption>
                </figure>
            `;
        })
        .join("");

    if (contentElement && project.content) {
        contentElement.innerHTML = project.content
            .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
            .join("");
    }

    const embedElement = document.getElementById("project-embed");
    if (embedElement && project.embed) {
        embedElement.innerHTML = project.embed;
    }
}

renderProjectPage();


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

const form = document.getElementById("form") || document.querySelector(".contact-form");

if (form) {
    const submitBtn = form.querySelector('button[type="submit"]');

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData(form);

        const originalText = submitBtn ? submitBtn.textContent : "";

        if (submitBtn) {
            submitBtn.textContent = "Sending...";
            submitBtn.disabled = true;
        }

        try {
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                alert("Success! Your message has been sent.");
                form.reset();
            } else {
                alert("Error: " + data.message);
            }

        } catch (_error) {
            alert("Something went wrong. Please try again.");
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

    const messages = [
        '🐟 *blub blub*',
        '😊 Glub says thanks!',
        '❤️ Glub loves you!',
        '😋 Yummy!',
        '🐟 More please!',
        '🫧 So tasty!',
        '🐠 Glub is full!',
        '🎉 Best day ever!',
    ];

    function showMessage(msg) {
        bowlLabel.textContent = msg;
        clearTimeout(bowlLabel._t);
        bowlLabel._t = setTimeout(() => {
            bowlLabel.textContent = '❗ Feed Glub now ❗';
        }, 2500);
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
                    showMessage(messages[fedCount % messages.length]);
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

initFishScene();
