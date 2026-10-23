const markdownIt = require("markdown-it");
const md = markdownIt({ html: true, breaks: false, linkify: true });

// ── Bilder im Fließtext ───────────────────────────────────────────────
// Ein Bild, das allein in einem Absatz steht, wird zu einer <figure>:
//
//   ![Alt-Text](/Images/blog/slug/bild.webp "Bildunterschrift |klein")
//
// Der Titel in Anführungszeichen wird zur Bildunterschrift. Ein optionales
// "|klein" oder "|gross" am Ende bestimmt die Größe und wird aus der
// sichtbaren Unterschrift entfernt; ohne Angabe gilt "mittel". Geschrieben
// wird das im CMS über die Editor-Komponente "Bild mit Bildunterschrift"
// (siehe admin/index.html), von Hand muss man das nicht tippen.
// Das Bild wird anklickbar und öffnet sich groß (Lightbox in script.js,
// ohne JavaScript als direkter Link auf die Bilddatei).
const FIGURE_SIZES = {
    klein: "klein",   small: "klein",
    mittel: "mittel", medium: "mittel",
    gross: "gross",   "groß": "gross", large: "gross"
};

// Trennt "Bildunterschrift |klein" in Unterschrift und Größe.
function splitCaption(title) {
    const raw = String(title || "");
    const match = raw.match(/^(.*?)\s*\|\s*([\wäöüß]+)\s*$/i);

    if (match && FIGURE_SIZES[match[2].toLowerCase()]) {
        return { caption: match[1].trim(), size: FIGURE_SIZES[match[2].toLowerCase()] };
    }
    return { caption: raw.trim(), size: null };
}

function imageFigures(mdInstance) {
    mdInstance.core.ruler.push("image_figures", function (state) {
        const tokens = state.tokens;

        for (let i = 1; i < tokens.length - 1; i++) {
            const inline = tokens[i];

            if (inline.type !== "inline") continue;
            if (tokens[i - 1].type !== "paragraph_open") continue;
            if (tokens[i + 1].type !== "paragraph_close") continue;

            // Nur Absätze, die ausschließlich ein Bild enthalten.
            const meaningful = (inline.children || []).filter(function (child) {
                if (child.type === "softbreak" || child.type === "hardbreak") return false;
                if (child.type === "text" && !child.content.trim()) return false;
                return true;
            });
            if (meaningful.length !== 1 || meaningful[0].type !== "image") continue;

            const image = meaningful[0];
            let src = image.attrGet("src") || "";
            let size = null;

            // Bevorzugt: Größe steht am Ende der Bildunterschrift.
            const parsed = splitCaption(image.attrGet("title"));
            const caption = parsed.caption;
            if (parsed.size) size = parsed.size;

            // Rückfalloption: älteres "bild.webp#klein" am Dateipfad.
            const hash = src.indexOf("#");
            if (hash !== -1) {
                const key = src.slice(hash + 1).toLowerCase();
                if (FIGURE_SIZES[key] && !size) size = FIGURE_SIZES[key];
                src = src.slice(0, hash);
                image.attrSet("src", src);
            }

            if (!size) size = "mittel";

            if (image.attrs) {
                image.attrs = image.attrs.filter(function (attr) { return attr[0] !== "title"; });
            }
            image.attrSet("loading", "lazy");

            const linkOpen = new state.Token("html_inline", "", 0);
            linkOpen.content = '<a class="post-figure__link" data-lightbox href="'
                + mdInstance.utils.escapeHtml(src) + '">';
            const linkClose = new state.Token("html_inline", "", 0);
            linkClose.content = "</a>";

            const children = [linkOpen, image, linkClose];
            if (caption) {
                const figcaption = new state.Token("html_inline", "", 0);
                figcaption.content = "<figcaption>"
                    + mdInstance.utils.escapeHtml(caption) + "</figcaption>";
                children.push(figcaption);
            }
            inline.children = children;

            // <p> wird zu <figure> — sonst wäre das Markup ungültig.
            tokens[i - 1].type = "figure_open";
            tokens[i - 1].tag = "figure";
            tokens[i - 1].attrSet("class", "post-figure post-figure--" + size);
            tokens[i + 1].type = "figure_close";
            tokens[i + 1].tag = "figure";
        }
    });
}

imageFigures(md);

// ── Zwei-Klick-Einbettungen ──────────────────────────────────────────
// Externe iframes (YouTube, itch.io) laden beim Seitenaufruf Inhalte und
// teils Cookies von Fremdanbietern. Dieser Transform ersetzt sie in der
// fertigen HTML-Ausgabe durch einen Platzhalter mit Hinweis und Button;
// das originale iframe steckt in einem <template> (wird nicht geladen)
// und wird erst nach Klick von script.js eingesetzt. YouTube läuft
// zusätzlich über youtube-nocookie.com.
// Texte der Hinweise kommen aus _data/global.json (CMS: Seiten-Texte →
// Allgemein → Einbettungen). Sie werden bei jedem Build frisch gelesen.
const fs = require("fs");
const { buildLanguageVersions } = require("./_build/languages.js");
const path = require("path");

function loadEmbedTexts() {
    const file = path.join(__dirname, "_data", "global.json");
    return JSON.parse(fs.readFileSync(file, "utf8")).embeds || {};
}

function consentProviders() {
    const t = loadEmbedTexts();
    const pick = function (v, lang) { return (v && (v[lang] || v.en)) || ""; };
    return [
        {
            test: /(^|\.)(youtube\.com|youtube-nocookie\.com|youtu\.be)$/i,
            kind: "video",
            en: pick(t.youtube_text, "en"), de: pick(t.youtube_text, "de"),
            buttonEn: pick(t.youtube_button, "en"), buttonDe: pick(t.youtube_button, "de"),
            privacyEn: pick(t.privacy_link, "en"), privacyDe: pick(t.privacy_link, "de")
        },
        {
            test: /(^|\.)itch\.io$/i,
            kind: "widget",
            en: pick(t.itch_text, "en"), de: pick(t.itch_text, "de"),
            buttonEn: pick(t.itch_button, "en"), buttonDe: pick(t.itch_button, "de"),
            privacyEn: pick(t.privacy_link, "en"), privacyDe: pick(t.privacy_link, "de")
        }
    ];
}

function escapeAttr(text) {
    return String(text).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

function consentEmbeds(html) {
    const providers = consentProviders();
    return html.replace(/<iframe\b[^>]*>[\s\S]*?<\/iframe>/gi, function (tag) {
        const srcMatch = tag.match(/\ssrc="([^"]+)"/i);
        if (!srcMatch) return tag;

        let host;
        try {
            host = new URL(srcMatch[1].replace(/&amp;/g, "&")).hostname;
        } catch (error) {
            return tag;
        }

        const provider = providers.find(function (p) { return p.test.test(host); });
        if (!provider) return tag;

        let iframe = tag;
        if (provider.kind === "video") {
            iframe = iframe.replace(/https:\/\/(www\.)?youtube\.com\/embed\//i, "https://www.youtube-nocookie.com/embed/");
        }

        // Kleine Widgets behalten ihre Breite, damit das Layout nicht springt.
        const width = (tag.match(/\swidth="(\d+)"/i) || [])[1];
        const height = (tag.match(/\sheight="(\d+)"/i) || [])[1];
        const style = provider.kind === "video" || !width
            ? ""
            : ' style="width:' + width + 'px;min-height:' + (height || 0) + 'px"';

        return '<div class="jw-consent jw-consent--' + provider.kind + '"' + style + '>' +
            '<p class="jw-consent__text"><span data-en="' + escapeAttr(provider.en) + '" data-de="' + escapeAttr(provider.de) + '">' + escapeAttr(provider.en) + '</span> ' +
            '<a href="/datenschutz/" data-en="' + escapeAttr(provider.privacyEn) + '" data-de="' + escapeAttr(provider.privacyDe) + '">' + provider.privacyEn + '</a></p>' +
            '<button type="button" class="jw-consent__button" data-en="' + escapeAttr(provider.buttonEn) + '" data-de="' + escapeAttr(provider.buttonDe) + '">' + escapeAttr(provider.buttonEn) + '</button>' +
            '<template>' + iframe + '</template>' +
            '</div>';
    });
}

module.exports = function(eleventyConfig) {
    // Zwei Sprachversionen: Deutsch unter /, Englisch unter /en/ (siehe
    // _build/languages.js). Läuft nach jedem Build und schreibt auch die
    // sitemap.xml mit beiden Versionen.
    eleventyConfig.on("eleventy.after", function ({ dir, results }) {
        buildLanguageVersions(dir.output, results);
    });

    // Eleventy soll dieselbe Markdown-Instanz benutzen wie der "md"-Filter,
    // damit englische und deutsche Texte identisch gerendert werden.
    eleventyConfig.setLibrary("md", md);

    // Externe Einbettungen erst nach Klick laden (siehe consentEmbeds oben).
    eleventyConfig.addTransform("consentEmbeds", function (content) {
        const outputPath = this.page && this.page.outputPath;
        if (outputPath && outputPath.endsWith(".html") && content.includes("<iframe")) {
            return consentEmbeds(content);
        }
        return content;
    });

    // Rechtstexte (content/legal): Markdown macht aus „itch.io“ automatisch
    // einen Link. Dort unerwünscht – solche Auto-Links wieder zu Text machen.
    // Ausdrücklich gesetzte Links [Text](https://…) bleiben erhalten.
    eleventyConfig.addTransform("legalNoAutolinks", function (content) {
        const input = (this.page && this.page.inputPath) || "";
        if (!input.includes("content/legal/")) return content;
        return content.replace(/<a href="http:\/\/([^"]+)">\1<\/a>/g, "$1");
    });

    // ── Entwürfe ──────────────────────────────────────────────────────
    // Beiträge mit "published: false" werden beim Build komplett
    // übersprungen: keine Seite, kein Eintrag in den Übersichten.
    // Beim lokalen Vorschau-Server (npx @11ty/eleventy --serve) sind sie
    // dagegen sichtbar, damit du Entwürfe ansehen kannst.
    eleventyConfig.addPreprocessor("drafts", "md", (data) => {
        if (data.published === false && process.env.ELEVENTY_RUN_MODE === "build") {
            return false;
        }
    });

    eleventyConfig.addFilter("md", content => content ? md.render(content) : '');

    // ── Zweisprachige Texte ───────────────────────────────────────────
    // Alle Seitentexte liegen in _data/ als { "en": "…", "de": "…" }.
    // {% i18n text %} schreibt daraus data-en="…" data-de="…"; script.js
    // tauscht beim Sprachwechsel den Inhalt aus. Mit zweitem Argument für
    // Attribute: {% i18n text, "placeholder" %} → data-placeholder-en/-de
    // (ebenso "aria" und "alt"). Fehlt der deutsche Text, gilt der englische.
    eleventyConfig.addShortcode("i18n", function (value, attr) {
        if (!value || typeof value !== "object") return "";
        const en = value.en || "";
        const de = value.de || en;
        const prefix = attr ? "data-" + attr + "-" : "data-";
        return prefix + 'en="' + escapeAttr(en) + '" ' + prefix + 'de="' + escapeAttr(de) + '"';
    });
    // Static assets — must be explicit in Eleventy 3
    eleventyConfig.addPassthroughCopy("Images");
    eleventyConfig.addPassthroughCopy("style.css");
    eleventyConfig.addPassthroughCopy("theme.css");
    eleventyConfig.addPassthroughCopy("fonts");
    eleventyConfig.addPassthroughCopy("favicon.ico");
    eleventyConfig.addPassthroughCopy("site.webmanifest");
    eleventyConfig.addPassthroughCopy("script.js");
    eleventyConfig.addPassthroughCopy("CNAME");
    eleventyConfig.addPassthroughCopy("admin");
    eleventyConfig.addPassthroughCopy("google1fb37088e637c525.html");
    eleventyConfig.addPassthroughCopy("robots.txt");
    eleventyConfig.addPassthroughCopy("BingSiteAuth.xml");
    eleventyConfig.addPassthroughCopy("page-flip.browser.js");
    eleventyConfig.addPassthroughCopy("flipbook.js");
    eleventyConfig.addPassthroughCopy("js");

    // Inhalte mit "published: false" (CMS: Schalter „Veröffentlicht“) werden
    // gar nicht gebaut: keine eigene Seite, in keiner Liste, nicht in der Sitemap.
    eleventyConfig.addPreprocessor("unpublished", "md", function(data) {
        if (data.published === false) return false;
    });

    eleventyConfig.addCollection("projects", function(collectionApi) {
        return collectionApi.getFilteredByGlob("content/projects/*/index.md")
            .sort((a, b) => (a.data.order ?? 999) - (b.data.order ?? 999));
    });

    eleventyConfig.addCollection("blog", function(collectionApi) {
        return collectionApi.getFilteredByGlob("content/blog/*/index.md")
            .sort((a, b) => b.date - a.date);
    });

    eleventyConfig.addFilter("postDate", function(date, locale) {
        return new Date(date).toLocaleDateString(locale || "en-US", {
            year: "numeric", month: "long", day: "numeric"
        });
    });

    // ── Startseite: Kategorie-Feld "[Electronic, Game] 2026" zerlegen ──
    // catTypes → "Electronic · Game", catYear → "2026" (leer, wenn keins).
    eleventyConfig.addFilter("catTypes", function(category) {
        const match = String(category || "").match(/\[([^\]]+)\]/);
        if (!match) return "";
        return match[1].split(",").map(function(t) { return t.trim(); }).join(" · ");
    });

    eleventyConfig.addFilter("catYear", function(category) {
        return String(category || "").replace(/\[[^\]]*\]/, "").trim();
    });

    // Vorheriger/nächster Eintrag einer Collection (für Detailseiten).
    // Liefert { index (1-basiert), prev, next } anhand der Seiten-URL.
    eleventyConfig.addFilter("neighbors", function(list, url) {
        const items = list || [];
        const i = items.findIndex(function(item) { return item.url === url; });
        if (i === -1) return { index: 0, prev: null, next: null };
        return {
            index: i + 1,
            prev: i > 0 ? items[i - 1] : null,
            next: i < items.length - 1 ? items[i + 1] : null
        };
    });

    // Kategorien „[Electronic, Game] 2026“ zweisprachig ausgeben:
    // {% cats project.data.category %} → <span data-en="Electronic" data-de="Elektronik">…</span> · …
    // Die Übersetzungen stehen in _data/global.json → categories (CMS: Allgemein).
    eleventyConfig.addShortcode("cats", function (category) {
        const match = String(category || "").match(/\[([^\]]+)\]/);
        if (!match) return "";
        const file = path.join(__dirname, "_data", "global.json");
        const list = (JSON.parse(fs.readFileSync(file, "utf8")).categories) || [];
        return match[1].split(",").map(function (raw) {
            const key = raw.trim();
            const entry = list.find(function (c) { return c.key === key; }) || {};
            const en = entry.en || key;
            const de = entry.de || en;
            return '<span data-en="' + escapeAttr(en) + '" data-de="' + escapeAttr(de) + '">' + escapeAttr(en) + '</span>';
        }).join(" · ");
    });

    // Liste von Objekten → Liste eines Feldes, z. B. socials.items | pluck("url")
    eleventyConfig.addFilter("pluck", function(list, key) {
        return (list || []).map(function(item) { return item && item[key]; }).filter(Boolean);
    });

    // Startseite: Karten-Karussell. Jede Karte im CMS verweist per Slug auf
    // ein Projekt; Bild und Alt-Text der Karte sind optional (sonst Coverbild).
    // Liefert [{ project, item }] in der Reihenfolge des CMS.
    eleventyConfig.addFilter("carouselCards", function(projects, items) {
        return (items || []).map(function(item) {
            const project = (projects || []).find(function(p) { return p.data.slug === item.project; });
            return project ? { project: project, item: item } : null;
        }).filter(Boolean);
    });

    // Projekte ohne die angegebenen Slugs (z. B. ohne die aus dem Karussell)
    eleventyConfig.addFilter("withoutSlugs", function(projects, slugs) {
        const skip = slugs || [];
        return (projects || []).filter(function(p) { return skip.indexOf(p.data.slug) === -1; });
    });

    // YouTube-ID aus einem Einbettungscode: <iframe src="…/embed/ID?…"> → "ID"
    eleventyConfig.addFilter("youtubeId", function(embed) {
        const m = String(embed || "").match(/youtube(?:-nocookie)?\.com\/embed\/([A-Za-z0-9_-]{6,})/);
        return m ? m[1] : "";
    });

    // Projekte in der Reihenfolge der angegebenen Slugs (unbekannte fallen weg)
    eleventyConfig.addFilter("bySlugs", function(projects, slugs) {
        return (slugs || []).map(function(slug) {
            return (projects || []).find(function(p) { return p.data.slug === slug; });
        }).filter(Boolean);
    });

    // 1 → "01"
    eleventyConfig.addFilter("pad2", function(n) {
        return String(n).padStart(2, "0");
    });

    eleventyConfig.addFilter("limit", function(arr, n) {
        return arr.slice(0, n);
    });

    eleventyConfig.addFilter("imgPath", function(path) {
        if (!path) return path;
        return path.startsWith('/') ? path : '/' + path;
    });

    return {
        dir: {
            input: ".",
            output: "_site",
            includes: "_includes"
        }
    };
};