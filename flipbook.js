// flipbook.js
// Vanilla script (no ES import) — this site runs without a bundler.
// Uses the global St.PageFlip exposed by page-flip.browser.js.
// Activates every #book or .jw-flipbook element with data-flipbook-images.

(function () {
    function buildControls(flipbook, bookElement) {
        // Count in spreads (double pages), not individual page indices —
        // PageFlip's own page index jumps unevenly across a spread
        // (0, 1, 3, 5, ...), which reads as broken when shown as "X / N".
        const controls = document.createElement("div");
        controls.className = "flipbook-controls";

        const slider = document.createElement("input");
        slider.type = "range";
        slider.className = "flipbook-controls__slider";
        slider.min = "0";
        // Beschriftung in der Seitensprache; mit Titel, wenn mehrere Hefte auf der Seite sind
        const pageWord = document.documentElement.lang === "de" ? "Seite" : "Page";
        const bookTitle = bookElement.dataset.flipbookTitle;
        slider.setAttribute("aria-label", bookTitle ? bookTitle + " – " + pageWord : pageWord);

        const label = document.createElement("span");
        label.className = "flipbook-controls__label";

        function spreadCount() {
            return flipbook.getPageCollection().getSpread().length;
        }

        function setLabel(spreadIndex) {
            label.textContent = (spreadIndex + 1) + " / " + spreadCount();
        }

        function syncRange() {
            slider.max = String(spreadCount() - 1);
        }

        syncRange();
        const initialSpreadIndex = flipbook.getPageCollection().getCurrentSpreadIndex();
        slider.value = String(initialSpreadIndex);
        setLabel(initialSpreadIndex);

        slider.addEventListener("input", function () {
            const spread = flipbook.getPageCollection().getSpread()[Number(slider.value)];
            flipbook.turnToPage(spread[0]);
        });

        flipbook.on("flip", function () {
            const spreadIndex = flipbook.getPageCollection().getCurrentSpreadIndex();
            slider.value = String(spreadIndex);
            setLabel(spreadIndex);
        });

        // Portrait/landscape can change on resize (single page vs. spread),
        // which changes how many spreads there are.
        flipbook.on("changeOrientation", function () {
            syncRange();
            setLabel(flipbook.getPageCollection().getCurrentSpreadIndex());
        });

        controls.appendChild(slider);
        controls.appendChild(label);
        bookElement.insertAdjacentElement("afterend", controls);
    }

    function initFlipbook(bookElement) {
        const imagePaths = (bookElement.dataset.flipbookImages || "")
            .split(",")
            .map(function (path) { return path.trim(); })
            .filter(Boolean);

        if (!imagePaths.length) {
            return;
        }

        // Render pages as real <img> elements (loadFromHTML) rather than
        // drawing onto <canvas> (loadFromImages). The canvas path in this
        // library sizes its buffer in CSS pixels only — it never accounts
        // for devicePixelRatio — so on high-DPR phones the page image is
        // rasterized undersized and then upscaled, which looks blurry.
        // <img> elements are scaled by the browser itself, which is DPR-correct.
        imagePaths.forEach(function (path, index) {
            const page = document.createElement("div");
            page.className = "flipbook-page";
            if (index === 0 || index === imagePaths.length - 1) {
                page.dataset.density = "hard";
            }

            const img = document.createElement("img");
            img.src = path;
            img.alt = "";
            // Not loading="lazy": PageFlip reparents/repositions pages as
            // you flip (it mutates #book's DOM on every turn). A page whose
            // image hasn't been fetched yet can briefly render at its
            // undetermined natural size while it's being moved into place,
            // inflating document height for a frame — which is what was
            // forcing the scroll-jump-to-header bug on every flip.
            img.decoding = "async";

            page.appendChild(img);
            bookElement.appendChild(page);
        });

        // Optional page format per book: data-flipbook-width / -height
        // (e.g. 1 / 1 for a square zine). Defaults to the original
        // portrait format 550 × 733. Only the ratio matters; the min/max
        // heights are derived from it so PageFlip never distorts pages.
        const pageW = Number(bookElement.dataset.flipbookWidth) || 550;
        const pageH = Number(bookElement.dataset.flipbookHeight) || 733;
        const ratio = pageH / pageW;
        bookElement.style.setProperty("--book-ratio", pageW + " / " + pageH);

        // Größte Seitenbreite: Hefte (.jw-flipbook) höchstens 550 px pro Seite,
        // damit eine Doppelseite auf den Bildschirm passt; per
        // data-flipbook-max-width änderbar. Das alte Einzelbuch bleibt bei 1200.
        const maxPage = Number(bookElement.dataset.flipbookMaxWidth) ||
            (bookElement.classList.contains("jw-flipbook") ? 550 : 1200);

        const flipbook = new St.PageFlip(bookElement, {
            width: 550,
            height: Math.round(550 * ratio),
            size: "stretch",
            minWidth: 280,
            maxWidth: maxPage,
            minHeight: Math.round(280 * ratio),
            maxHeight: Math.round(maxPage * ratio),
            showCover: true,
            drawShadow: true,
            maxShadowOpacity: 0.5,
            flippingTime: 700,
            mobileScrollSupport: true,
            usePortrait: true,
        });

        flipbook.on("init", function () {
            buildControls(flipbook, bookElement);
        });

        flipbook.loadFromHTML(bookElement.querySelectorAll(".flipbook-page"));
    }

    // Alle Bücher der Seite starten: das alte Einzelbuch (#book im Feld
    // „Einbettung“) und beliebig viele Hefte aus dem Feld „Flipbooks“
    // (.jw-flipbook). Jedes Buch ist eine eigene PageFlip-Instanz.
    document.addEventListener("DOMContentLoaded", function () {
        document.querySelectorAll("#book[data-flipbook-images], .jw-flipbook[data-flipbook-images]").forEach(initFlipbook);
    });
})();
