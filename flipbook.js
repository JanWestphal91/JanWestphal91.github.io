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
            // Tried mobileScrollSupport:false here to force preventDefault()
            // synchronously on touchstart, ruling out a touch-gesture race
            // as the cause of the "jumps to header" bug — it made no
            // difference, which is exactly what you'd expect if scroll is
            // physically blocked from the first touch and the page still
            // jumps: the cause isn't touch-gesture handling at all, it's a
            // real height collapse (see #book's aspect-ratio in style.css).
            // Left true so touching the book can still scroll the page.
            mobileScrollSupport: true,
            usePortrait: true,
        });

        flipbook.on("init", function () {
            buildControls(flipbook, bookElement);
            installDebugHud(flipbook, bookElement);
        });

        flipbook.loadFromHTML(bookElement.querySelectorAll(".flipbook-page"));
    }

    // TEMPORARY diagnostics for the "jumps to header" bug — remove once
    // found. Renders a live on-screen log (so it's readable on a phone
    // without needing devtools) of scrollY, document height, #book's own
    // rendered height, and the URL hash, on every relevant event. The goal
    // is to see, at the moment of the jump, whether scrollHeight actually
    // shrank (layout collapse), whether the hash changed (anchor
    // navigation), or neither (something calling scrollTo directly).
    function installDebugHud(flipbook, bookElement) {
        const hud = document.createElement("pre");
        hud.id = "flipbook-debug-hud";
        hud.style.cssText =
            "position:fixed;left:0;right:0;bottom:0;max-height:45vh;" +
            "margin:0;padding:6px;overflow:auto;z-index:99999;" +
            "background:rgba(0,0,0,0.88);color:#5f5;" +
            "font:11px/1.45 monospace;white-space:pre-wrap;pointer-events:none;";
        document.body.appendChild(hud);

        const lines = [];
        function record(label) {
            const entry =
                performance.now().toFixed(0) + "ms " + label +
                " scrollY=" + window.scrollY +
                " docH=" + document.documentElement.scrollHeight +
                " bookH=" + Math.round(bookElement.getBoundingClientRect().height) +
                " hash=" + JSON.stringify(location.hash);
            lines.push(entry);
            if (lines.length > 50) lines.shift();
            hud.textContent = lines.join("\n");
        }

        record("hud-installed");
        flipbook.on("changeState", function (e) { record("changeState:" + e.data); });
        flipbook.on("flip", function (e) { record("flip:" + e.data); });
        window.addEventListener("scroll", function () { record("scroll-event"); }, { passive: true });
        window.addEventListener("hashchange", function () { record("hashchange"); });
        new MutationObserver(function () { record("book-dom-mutated"); })
            .observe(bookElement, { childList: true, subtree: true });
    }

    document.addEventListener("DOMContentLoaded", function () {
        const bookElement = document.getElementById("book");
        if (bookElement) {
            initFlipbook(bookElement);
        }
    });
})();
