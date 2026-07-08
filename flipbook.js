// flipbook.js
// Vanilla script (no ES import) — this site runs without a bundler.
// Uses the global St.PageFlip exposed by page-flip.browser.js.
// Activates on any page containing a #book element with data-flipbook-images.

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
        slider.setAttribute("aria-label", "Page");

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
            img.loading = "lazy";
            img.decoding = "async";

            page.appendChild(img);
            bookElement.appendChild(page);
        });

        const flipbook = new St.PageFlip(bookElement, {
            width: 550,
            height: 733,
            size: "stretch",
            minWidth: 280,
            maxWidth: 1200,
            minHeight: 375,
            maxHeight: 1600,
            showCover: true,
            drawShadow: true,
            maxShadowOpacity: 0.5,
            flippingTime: 700,
            // false, not true: with mobileScrollSupport enabled, PageFlip's
            // own touch handler only decides whether to call
            // preventDefault() *after* it sees which way the drag goes,
            // which races the browser's native scroll gesture and is the
            // cause of a well-known upstream bug where the page jumps to
            // the top mid-flip on mobile Chrome
            // (https://github.com/Nodlik/StPageFlip/issues/38, unresolved).
            // With it false, preventDefault() fires synchronously on
            // touchstart, so native scroll never arms in the first place.
            // This matches the StPageFlip demo's own primary example
            // (https://nodlik.github.io/StPageFlip/), which uses the same
            // width/height/size here and has no scroll-jump issue.
            mobileScrollSupport: false,
            usePortrait: true,
        });

        flipbook.on("init", function () {
            buildControls(flipbook, bookElement);
        });

        flipbook.loadFromHTML(bookElement.querySelectorAll(".flipbook-page"));
    }

    document.addEventListener("DOMContentLoaded", function () {
        const bookElement = document.getElementById("book");
        if (bookElement) {
            initFlipbook(bookElement);
        }
    });
})();
