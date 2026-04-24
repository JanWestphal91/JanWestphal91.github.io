const themeToggle = document.getElementById("theme-toggle");
const body = document.body;
const THEME_STORAGE_KEY = "janwestphal-theme";
const DEFAULT_THEME = "light";

function isValidTheme(theme) {
    return theme === "light" || theme === "dark";
}

function readStoredTheme() {
    try {
        const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
        return isValidTheme(storedTheme) ? storedTheme : null;
    } catch (_error) {
        return null;
    }
}

function storeTheme(theme) {
    try {
        localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (_error) {
        // Ignore storage errors (e.g. private mode restrictions).
    }
}

function applyTheme(theme) {
    const resolvedTheme = isValidTheme(theme) ? theme : DEFAULT_THEME;
    const isLightMode = resolvedTheme === "light";

    body.classList.toggle("light", isLightMode);

    if (themeToggle) {
        themeToggle.textContent = isLightMode ? "Cool Mode" : "Serious Mode";
    }
}

function initTheme() {
    const storedTheme = readStoredTheme();
    applyTheme(storedTheme || DEFAULT_THEME);
}

initTheme();

if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        const nextTheme = body.classList.contains("light") ? "dark" : "light";
        applyTheme(nextTheme);
        storeTheme(nextTheme);
    });
}

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

const PROJECT_DATA = {
    "go-pony-go-c": {
        title: "Go Pony, Go C!",
        category: "[Webgame] 2026",
        summary: "Arcade-Racing mit Pixel-Art, Highspeed-Flow und einer klaren Retro-Flash-DNA.",
        meta: [
            "Rolle: Game Design, Programming, Art Direction",
            "Tools: Godot, Aseprite",
            "Status: Released on itch.io"
        ],
        images: [
            {
                src: "Images/iconpatterndark.png",
                alt: "Dunkles Icon-Pattern fuer das visuelle Interface",
                caption: "UI-Pattern Dark"
            },
            {
                src: "Images/iconpatternlight.png",
                alt: "Helles Icon-Pattern fuer das visuelle Interface",
                caption: "UI-Pattern Light"
            }
        ],
        content: [
            "Das Projekt ist als kompakter Arcaderacer angelegt: schnell starten, Rhythmus finden und ueber direkte Bewegung belohnt werden.",
            "Im Fokus standen Lesbarkeit im Tempo, charakterstarke Pixel-Art und eine klare Spielschleife, die sofort funktioniert."
        ]
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

    if (!categoryElement || !titleElement || !summaryElement || !metaElement || !galleryElement || !contentElement) {
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

    contentElement.innerHTML = project.content
        .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
        .join("");
}

renderProjectPage();

function buildProjectsDropdown() {
    const dropdown = document.getElementById("projects-dropdown");

    if (!dropdown) {
        return;
    }

    const projectLinks = Array.from(document.querySelectorAll(".work-item h3 a"));
    const uniqueProjects = [];
    const seen = new Set();

    projectLinks.forEach((link) => {
        const label = (link.textContent || "").trim();
        const href = (link.getAttribute("href") || "").trim();
        const key = `${label}|${href}`;

        if (!label || !href || seen.has(key)) {
            return;
        }

        seen.add(key);
        uniqueProjects.push({ label, href });
    });

    if (uniqueProjects.length === 0) {
        dropdown.innerHTML = '<li class="nav-dropdown__empty">Noch keine Projekte</li>';
        return;
    }

    dropdown.innerHTML = uniqueProjects
        .map((project) => `<li><a href="${escapeHtml(project.href)}">${escapeHtml(project.label)}</a></li>`)
        .join("");
}

buildProjectsDropdown();

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

