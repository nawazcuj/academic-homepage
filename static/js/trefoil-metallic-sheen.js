
(() => {
    "use strict";

    function install() {
        const original = document.querySelector(
            "img.tt-corner-enhanced-gif:not(.tt-corner-metal-layer)"
        );

        if (!original || document.querySelector(
            ".tt-corner-metal-layer"
        )) return;

        const modes = [
            "sheen-silver",
            "sheen-sapphire",
            "sheen-champagne"
        ];

        const layers = modes.map(mode => {
            const img = document.createElement("img");
            img.src = original.currentSrc || original.src;
            img.alt = "";
            img.setAttribute("aria-hidden", "true");
            img.className = "tt-corner-metal-layer " + mode;
            img.decoding = "async";
            document.body.appendChild(img);
            return img;
        });

        let pending = false;

        function positionLayers() {
            pending = false;
            if (!original.isConnected) {
                layers.forEach(el => el.remove());
                return;
            }

            const r = original.getBoundingClientRect();
            const cs = getComputedStyle(original);
            const visible = r.width > 0 && r.height > 0 &&
                cs.display !== "none" &&
                cs.visibility !== "hidden";

            layers.forEach(layer => {
                layer.style.setProperty(
                    "display", visible ? "block" : "none", "important"
                );
                layer.style.setProperty(
                    "left", r.left + "px", "important"
                );
                layer.style.setProperty(
                    "top", r.top + "px", "important"
                );
                layer.style.setProperty(
                    "width", r.width + "px", "important"
                );
                layer.style.setProperty(
                    "height", r.height + "px", "important"
                );

                const z = parseInt(cs.zIndex, 10);
                layer.style.setProperty(
                    "z-index",
                    String(Number.isFinite(z) ? z + 1 : 100),
                    "important"
                );
            });
        }

        function requestPosition() {
            if (!pending) {
                pending = true;
                requestAnimationFrame(positionLayers);
            }
        }

        window.addEventListener("resize", requestPosition);
        window.addEventListener("scroll", requestPosition, {
            passive: true
        });

        if ("ResizeObserver" in window) {
            new ResizeObserver(requestPosition).observe(original);
        }

        positionLayers();
        console.info("TheTrefoil: metallic sheen layers installed");
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", install);
    } else {
        install();
    }
})();
