// ═══ Pfeile als Grafik ══════════════════════════════════════════════
//
// Die Pfeilzeichen im Text (→ ← ↗ ↓) sind in Bricolage lang und dünn.
// Nach dem Build ersetzt dieses Modul sie durch einen kurzen, kräftigen
// SVG-Pfeil. Jeder Pfeil steht zweimal in einem kleinen Rahmen mit
// overflow: hidden: Beim Überfahren des Links gleitet der erste in
// Pfeilrichtung hinaus und der zweite von der Gegenseite herein
// (CSS: .jw-arrow in theme.css). Für Screenreader bleibt der Pfeil
// unsichtbar (aria-hidden), der Linktext reicht.
//
// Dieselbe Grafik baut script.js (jwArrow) für Texte, die erst im Browser
// entstehen, z. B. die Bildunterschrift im Karussell.

const ARROWS = { "→": "r", "←": "l", "↗": "ur", "↓": "d" };
const ROTATE = { r: 0, l: 180, ur: -45, d: 90 };

// Ein Pfeil nach rechts in einem 16er-Raster; Richtung per Drehung
function svg(dir, part) {
    return '<svg class="jw-arrow__' + part + '" viewBox="0 0 16 16" focusable="false">'
        + '<g transform="rotate(' + ROTATE[dir] + ' 8 8)">'
        + '<path d="M1.5 8H13M8.2 3.2 13 8l-4.8 4.8" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="square"/>'
        + '</g></svg>';
}

function arrowHTML(dir) {
    return '<span class="jw-arrow jw-arrow--' + dir + '" aria-hidden="true">' + svg(dir, "a") + svg(dir, "b") + '</span>';
}

const SKIP = new Set(["SCRIPT", "STYLE", "TEMPLATE", "TEXTAREA", "TITLE", "PRE", "CODE", "NOSCRIPT", "OPTION", "SVG"]);
const PATTERN = /[→←↗↓]/;

function replaceArrows(document) {
    if (!document.body) return;
    const nodes = [];
    (function walk(node) {
        for (let child = node.firstChild; child; child = child.nextSibling) {
            if (child.nodeType === 3) {
                if (PATTERN.test(child.nodeValue)) nodes.push(child);
            } else if (child.nodeType === 1 && !SKIP.has(child.tagName.toUpperCase())) {
                walk(child);
            }
        }
    })(document.body);

    nodes.forEach(function (node) {
        const parts = node.nodeValue.split(/([→←↗↓])/);
        const frag = document.createDocumentFragment();
        parts.forEach(function (part) {
            if (!part) return;
            if (ARROWS[part]) {
                const holder = document.createElement("span");
                holder.innerHTML = arrowHTML(ARROWS[part]);
                frag.appendChild(holder.firstChild);
            } else {
                frag.appendChild(document.createTextNode(part));
            }
        });
        node.replaceWith(frag);
    });
}

module.exports = { replaceArrows, arrowHTML };
