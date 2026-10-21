// ═══ Zwei statische Sprachversionen ═══════════════════════════════════
//
// Die Vorlagen schreiben jede Seite einmal: englischer Text im HTML, beide
// Sprachen zusätzlich als Attribute (data-en / data-de, siehe Shortcode
// {% i18n %} in .eleventy.js). Nach dem Build macht dieses Modul daraus
// zwei fertige Seiten:
//
//   Deutsch   /pfad/       (Hauptadresse)
//   Englisch  /en/pfad/
//
// Jede Version enthält nur noch ihre eigene Sprache: richtiges lang-
// Attribut, eigener Titel und eigene Beschreibung, canonical und hreflang
// auf die jeweils andere Version. Suchmaschinen und Screenreader sehen
// damit von Anfang an die richtige Sprache – ohne JavaScript.
//
// Regeln, die die Vorlagen nutzen:
//   data-en / data-de                 → Textinhalt
//   data-alt-en / -de                 → alt
//   data-placeholder-en / -de         → placeholder
//   data-aria-en / -de                → aria-label
//   data-content-en / -de             → content (Meta-Angaben im <head>)
//   data-lang-show="de" | "en"        → Element nur in dieser Sprache
//   a[data-lang-switch]               → Link zur anderen Sprachversion
//   lang-Attribut im Inhalt           → bleibt (z. B. deutsche Rechtstexte)

const fs = require("fs");
const path = require("path");
const { parseHTML } = require("linkedom");

const SITE = "https://janwestphal.dev";
const LANGS = ["de", "en"];
const DEFAULT_LANG = "de";
const LOCALES = { de: "de_DE", en: "en_US" };
const SWITCH_TEXT = {
    de: { long: "Deutsch", short: "DE" },
    en: { long: "English", short: "EN" }
};

// Adresse einer Seite in einer Sprache: "/blog/" → "/en/blog/"
function localUrl(url, lang) {
    if (lang === DEFAULT_LANG) return url;
    return "/" + lang + (url === "/" ? "/" : url);
}

// Interne Seitenlinks bekommen in der englischen Version /en/ davor.
// Dateien (Bilder, PDFs, Schriften …), das CMS und Anker bleiben, wie sie sind.
function isPageLink(href) {
    if (!href || !href.startsWith("/") || href.startsWith("//")) return false;
    const pathOnly = href.split(/[?#]/)[0];
    if (/^\/(Images|fonts|admin|en)(\/|$)/.test(pathOnly)) return false;
    const last = pathOnly.split("/").pop();
    if (last.includes(".") && !last.endsWith(".html")) return false;
    return true;
}

function rewriteHref(href, lang) {
    if (lang === DEFAULT_LANG) return href;
    // Absolute Links auf die eigene Seite (z. B. im Projekttext) wie interne behandeln
    if (href.startsWith(SITE + "/")) href = href.slice(SITE.length);
    if (!isPageLink(href)) return href;
    return "/" + lang + href;
}

const ATTRS = [
    ["alt", "alt"],
    ["placeholder", "placeholder"],
    ["aria", "aria-label"],
    ["content", "content"]
];

function localize(html, url, lang) {
    const { document } = parseHTML(html);
    const root = document.documentElement;
    root.setAttribute("lang", lang);

    // Elemente der anderen Sprache entfernen
    document.querySelectorAll("[data-lang-show]").forEach(function (el) {
        if (el.getAttribute("data-lang-show") !== lang) {
            el.remove();
        } else {
            el.removeAttribute("data-lang-show");
            el.removeAttribute("hidden");
        }
    });

    // Texte
    document.querySelectorAll("[data-en]").forEach(function (el) {
        const en = el.getAttribute("data-en");
        const de = el.getAttribute("data-de");
        el.textContent = lang === "de" && de ? de : en;
        el.removeAttribute("data-en");
        el.removeAttribute("data-de");
    });

    // Attribute
    ATTRS.forEach(function ([key, attr]) {
        document.querySelectorAll("[data-" + key + "-en]").forEach(function (el) {
            const en = el.getAttribute("data-" + key + "-en");
            const de = el.getAttribute("data-" + key + "-de");
            el.setAttribute(attr, lang === "de" && de ? de : en);
            el.removeAttribute("data-" + key + "-en");
            el.removeAttribute("data-" + key + "-de");
        });
    });

    // Links innerhalb der Seite
    document.querySelectorAll("a[href]").forEach(function (a) {
        if (a.hasAttribute("data-lang-switch")) return;
        a.setAttribute("href", rewriteHref(a.getAttribute("href"), lang));
    });

    // Sprachumschalter: normaler Link zur anderen Version, in deren Sprache beschriftet
    const other = lang === "de" ? "en" : "de";
    document.querySelectorAll("a[data-lang-switch]").forEach(function (a) {
        a.setAttribute("href", localUrl(url, other));
        a.setAttribute("lang", other);
        a.setAttribute("hreflang", other);
        a.removeAttribute("data-lang-switch");
        const long = a.querySelector("[data-lang-switch-long]");
        const short = a.querySelector("[data-lang-switch-short]");
        if (long) { long.textContent = SWITCH_TEXT[other].long; long.removeAttribute("data-lang-switch-long"); }
        if (short) { short.textContent = SWITCH_TEXT[other].short; short.removeAttribute("data-lang-switch-short"); }
        if (!long && !short) a.textContent = SWITCH_TEXT[other].long;
    });

    // <head>: Adressen dieser Version und der anderen
    const head = document.head;
    head.querySelectorAll('link[rel="canonical"], link[rel="alternate"][hreflang], meta[property="og:url"], meta[property="og:locale"], meta[property="og:locale:alternate"]')
        .forEach(function (el) { el.remove(); });

    const anchor = head.querySelector('meta[name="robots"]') || head.querySelector("title");
    const tags = [];
    function add(tag, attrs) {
        const el = document.createElement(tag);
        Object.keys(attrs).forEach(function (k) { el.setAttribute(k, attrs[k]); });
        tags.push(el);
    }
    add("link", { rel: "canonical", href: SITE + localUrl(url, lang) });
    LANGS.forEach(function (l) {
        add("link", { rel: "alternate", hreflang: l, href: SITE + localUrl(url, l) });
    });
    add("link", { rel: "alternate", hreflang: "x-default", href: SITE + localUrl(url, DEFAULT_LANG) });
    add("meta", { property: "og:url", content: SITE + localUrl(url, lang) });
    add("meta", { property: "og:locale", content: LOCALES[lang] });
    add("meta", { property: "og:locale:alternate", content: LOCALES[other] });
    // Hinter dem Anker einfügen, jede Zeile eingerückt wie der Rest des <head>
    let after = anchor;
    tags.forEach(function (el) {
        const indent = document.createTextNode("\n    ");
        if (after && after.parentNode === head) {
            after.after(indent);
            indent.after(el);
            after = el;
        } else {
            head.appendChild(indent);
            head.appendChild(el);
        }
    });

    return "<!DOCTYPE html>\n" + root.outerHTML + "\n";
}

// Wird nach jedem Build aufgerufen (eleventy.after). results: alle von
// Eleventy geschriebenen Seiten mit url, outputPath und content.
function buildLanguageVersions(outputDir, results) {
    const pages = [];

    results.forEach(function (result) {
        if (!result.outputPath || !result.outputPath.endsWith(".html")) return;
        if (!result.url || !/<html[\s>]/i.test(result.content)) return;

        const rel = path.relative(outputDir, result.outputPath);
        LANGS.forEach(function (lang) {
            const target = lang === DEFAULT_LANG
                ? result.outputPath
                : path.join(outputDir, lang, rel);
            fs.mkdirSync(path.dirname(target), { recursive: true });
            fs.writeFileSync(target, localize(result.content, result.url, lang));
        });

        // Sitemap: nur Seiten, die in Suchmaschinen erscheinen sollen
        const robots = (result.content.match(/<meta name="robots" content="([^"]*)"/i) || [])[1] || "";
        if (!/noindex/i.test(robots)) pages.push(result.url);
    });

    writeSitemap(outputDir, pages);
}

// sitemap.xml mit beiden Sprachversionen und gegenseitigen hreflang-Verweisen
function writeSitemap(outputDir, urls) {
    const sorted = urls.slice().sort(function (a, b) {
        return a === "/" ? -1 : b === "/" ? 1 : a.localeCompare(b);
    });
    const entries = [];
    sorted.forEach(function (url) {
        LANGS.forEach(function (lang) {
            const links = LANGS.map(function (l) {
                return '        <xhtml:link rel="alternate" hreflang="' + l + '" href="' + SITE + localUrl(url, l) + '"/>';
            }).concat('        <xhtml:link rel="alternate" hreflang="x-default" href="' + SITE + localUrl(url, DEFAULT_LANG) + '"/>');
            entries.push("    <url>\n        <loc>" + SITE + localUrl(url, lang) + "</loc>\n" + links.join("\n") + "\n    </url>");
        });
    });
    const xml = '<?xml version="1.0" encoding="UTF-8"?>\n' +
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n' +
        entries.join("\n") + "\n</urlset>\n";
    fs.writeFileSync(path.join(outputDir, "sitemap.xml"), xml);
}

module.exports = { buildLanguageVersions, localUrl };
