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
            mobileScrollSupport: true,
            usePortrait: true,
        });

        flipbook.on("init", function () {
            buildControls(flipbook, bookElement);
            guardScrollPositionDuringFlips(flipbook);
        });

        flipbook.loadFromHTML(bookElement.querySelectorAll(".flipbook-page"));
    }

    // On every page turn, PageFlip rewrites the DOM inside #book (it appends
    // the newly rendered page, then later removes the old one). On mobile
    // Chrome this DOM churn is followed — a frame or two later — by the
    // browser silently resetting window.scrollY, which reads as "the page
    // jumps to the header". It's most visible on short pages (nothing below
    // the book to scroll into), but happens on every page regardless.
    // CSS `overflow-anchor: none` does not prevent it.
    //
    // A previous version of this guard tried to detect "is the user actually
    // scrolling" from raw touch deltas on #book, and backed off past a 10px
    // vertical threshold. That heuristic was wrong on two counts: (1) real
    // page-flip swipes wobble vertically by more than 10px too, so it backed
    // off mid-flip, right when the jump happens; (2) it only listened on
    // #book, but the page slider in buildControls() is inserted *after*
    // #book as a sibling, so dragging it to flip pages was never guarded at
    // all. PageFlip's own "changeState" event is ground truth for whether a
    // flip is in progress (it fires "read" | "user_fold" | "flipping" |
    // "fold_corner") — while it's anything but "read", PageFlip's own touch
    // handler is already calling preventDefault() on every touchmove, so
    // real scrolling is physically impossible and it's always safe to pin
    // scrollY. We keep pinning for a short grace period after returning to
    // "read" too, since the browser's scroll reset lands a frame or two
    // after the DOM settles, not synchronously with the state change.
    function guardScrollPositionDuringFlips(flipbook) {
        const graceMs = 250;
        let anchorScrollY = window.scrollY;
        let flipping = false;
        let guardUntil = 0;

        window.addEventListener("scroll", function () {
            if (!flipping && performance.now() >= guardUntil) {
                anchorScrollY = window.scrollY;
            }
        }, { passive: true });

        function tick() {
            if (window.scrollY !== anchorScrollY) {
                window.scrollTo(window.scrollX, anchorScrollY);
            }
            if (flipping || performance.now() < guardUntil) {
                requestAnimationFrame(tick);
            }
        }

        flipbook.on("changeState", function (e) {
            if (e.data !== "read") {
                if (!flipping) {
                    anchorScrollY = window.scrollY;
                    requestAnimationFrame(tick);
                }
                flipping = true;
            } else {
                flipping = false;
                guardUntil = performance.now() + graceMs;
            }
        });
    }

    document.addEventListener("DOMContentLoaded", function () {
        const bookElement = document.getElementById("book");
        if (bookElement) {
            initFlipbook(bookElement);
        }
    });
})();
