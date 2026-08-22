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

module.exports = function(eleventyConfig) {
    // Eleventy soll dieselbe Markdown-Instanz benutzen wie der "md"-Filter,
    // damit englische und deutsche Texte identisch gerendert werden.
    eleventyConfig.setLibrary("md", md);

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
    // Static assets — must be explicit in Eleventy 3
    eleventyConfig.addPassthroughCopy("Images");
    eleventyConfig.addPassthroughCopy("style.css");
    eleventyConfig.addPassthroughCopy("script.js");
    eleventyConfig.addPassthroughCopy("translations.js");
    eleventyConfig.addPassthroughCopy("CNAME");
    eleventyConfig.addPassthroughCopy("admin");
    // Copy as-is so the URL stays /project.html (not /project/)
    eleventyConfig.addPassthroughCopy("project.html");
    eleventyConfig.addPassthroughCopy("google1fb37088e637c525.html");
    eleventyConfig.addPassthroughCopy("sitemap.xml");
    eleventyConfig.addPassthroughCopy("robots.txt");
    eleventyConfig.addPassthroughCopy("BingSiteAuth.xml");
    eleventyConfig.addPassthroughCopy("page-flip.browser.js");
    eleventyConfig.addPassthroughCopy("flipbook.js");

    eleventyConfig.addCollection("projects", function(collectionApi) {
        return collectionApi.getFilteredByGlob("content/projects/*/index.md")
            .sort((a, b) => (a.data.order || 999) - (b.data.order || 999));
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

    eleventyConfig.addFilter("limit", function(arr, n) {
        return arr.slice(0, n);
    });

    eleventyConfig.addFilter("imgPath", function(path) {
        if (!path) return path;
        return path.startsWith('/') ? path : '/' + path;
    });

    eleventyConfig.addFilter("projectsToJson", function(projects) {
        const data = {};
        projects.forEach(function(p) {
            const d = p.data;
            data[d.slug] = {
                title: d.title,
                category: d.category,
                summary: d.summary || "",
                meta: d.meta || [],
                images: (d.images || []).map(function(img) {
                    return { src: img.src, alt: img.alt, caption: img.caption };
                }),
                content: d.content || [],
                embed: d.embed ? d.embed.trim() : null,
                de: {
                    summary: d.summary_de || null,
                    meta: d.meta_de || null,
                    images: (d.images || []).map(function(img) {
                        return { caption: img.caption_de || img.caption };
                    }),
                    content: d.content_de || null
                }
            };
        });
        return JSON.stringify(data);
    });

    return {
        dir: {
            input: ".",
            output: "_site",
            includes: "_includes"
        }
    };
};