
(() => {
  "use strict";

  const root = document.documentElement;

  const modes = new Set([
    "emboss", "underline", "glow", "foil",
    "spacing", "reveal", "tilt", "bronze"
  ]);

  const selectors = [
    ".tt-shimmer-label",
    ".section-kicker",
    ".ttv-kicker",
    ".tb-eyebrow",
    ".ttc-kicker",
    ".tt-philosophy-kicker",
    ".tad-kicker",
    ".tce-kicker",
    ".tt-gold-glitter",
    ".tb-heading-top > span:first-child"
  ].join(",");

  const properties = [
    "animation", "transition", "color",
    "-webkit-text-fill-color", "text-shadow",
    "background-image", "background-size",
    "background-position", "background-repeat",
    "background-clip", "-webkit-background-clip",
    "filter", "transform", "clip-path",
    "letter-spacing", "opacity", "will-change"
  ];

  let nodes = [];
  let original = new Map();
  let timer = null;
  let observer = null;
  let mode = "none";

  const clamp = x => Math.max(0, Math.min(1, x));

  function set(el, prop, value) {
    el.style.setProperty(prop, value, "important");
  }

  function saveOriginal(el) {
    if (original.has(el)) return;

    const saved = {};
    for (const p of properties) {
      saved[p] = [
        el.style.getPropertyValue(p),
        el.style.getPropertyPriority(p)
      ];
    }
    original.set(el, saved);
  }

  function restore() {
    for (const [el, saved] of original) {
      for (const p of properties) {
        const [value, priority] = saved[p];
        if (value) {
          el.style.setProperty(p, value, priority);
        } else {
          el.style.removeProperty(p);
        }
      }
    }
    original.clear();
    nodes = [];
  }

  function rgbaGold(t) {
    const a = [137, 88, 43];
    const b = [255, 230, 169];
    const c = a.map((v, i) =>
      Math.round(v + (b[i] - v) * t)
    );
    return `rgb(${c.join(",")})`;
  }

  function choose(next) {
    if (timer !== null) {
      cancelAnimationFrame(timer);
      timer = null;
    }

    restore();
    mode = modes.has(next) ? next : "none";

    root.dataset.goldTypography = mode;
    root.dataset.goldEffect =
      mode === "none"
        ? (document.getElementById("gold_shimmer_effect")
            ?.value || root.dataset.goldEffect || "classic")
        : "none";

    root.classList.toggle("tt-type-active", mode !== "none");
    root.classList.toggle(
      "tt-typography-no-stars", mode !== "none"
    );

    if (mode === "none") return;

    nodes = [...document.querySelectorAll(selectors)]
      .filter(el =>
        !el.closest(
          ".tt-gold-settings button, " +
          ".tt-gold-settings select, " +
          ".tt-gold-settings option"
        )
      );

    nodes.forEach(el => {
      saveOriginal(el);
      set(el, "animation", "none");
      set(el, "transition", "none");
      set(el, "background-image", "none");
      set(el, "background-clip", "border-box");
      set(el, "-webkit-background-clip", "border-box");
      set(el, "clip-path", "none");
      set(el, "transform", "none");
      set(el, "filter", "none");
      set(el, "text-shadow", "none");
      set(el, "letter-spacing", ".12em");
      set(el, "color", "#dcb477");
      set(el, "-webkit-text-fill-color", "#dcb477");
    });

    if (window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches) {
      render(0.25);
      return;
    }

    const started = performance.now();
    let last = 0;

    function tick(now) {
      if (now - last >= 33) {
        last = now;
        render((now - started) / 1000);
      }

      if (mode !== "none") {
        timer = requestAnimationFrame(tick);
      }
    }

    timer = requestAnimationFrame(tick);
  }

  function render(time) {
    const wave = (Math.sin(time * Math.PI / 2) + 1) / 2;
    const slow = (Math.sin(time * Math.PI / 3) + 1) / 2;

    for (const el of nodes) {
      if (!el.isConnected) continue;

      const gold = rgbaGold(wave);

      switch (mode) {
        case "emboss":
          set(el, "color", "#dbb577");
          set(el, "-webkit-text-fill-color", "#dbb577");
          set(el, "text-shadow",
            "0 -1px 0 #fff0c1, " +
            "0 1px 0 #69411e, " +
            "0 3px 3px rgba(0,0,0,.45)");
          break;

        case "underline":
          set(el, "background-image",
            "linear-gradient(90deg," +
            "#a57337,#ffe7a5,#b77c36)");
          set(el, "background-repeat", "no-repeat");
          set(el, "background-position", "left bottom");
          set(el, "background-size",
            `${Math.round(wave * 100)}% 2px`);
          break;

        case "glow":
          set(el, "color", gold);
          set(el, "-webkit-text-fill-color", gold);
          set(el, "text-shadow",
            `0 0 ${Math.round(wave * 13)}px ` +
            `rgba(255,208,113,${(.1 + wave * .8).toFixed(2)}),` +
            `0 0 ${Math.round(wave * 20)}px ` +
            `rgba(236,157,53,${(wave * .6).toFixed(2)})`);
          break;

        case "foil":
          set(el, "color",
            rgbaGold(.3 + .7 * slow));
          set(el, "-webkit-text-fill-color",
            rgbaGold(.3 + .7 * slow));
          set(el, "text-shadow",
            "-1px -1px 0 #fff1c5," +
            "1px 2px 0 #6e451f," +
            "2px 3px 4px rgba(0,0,0,.35)");
          break;

        case "spacing":
          set(el, "letter-spacing",
            `${(.09 + wave * .22).toFixed(3)}em`);
          break;

        case "reveal":
          set(el, "clip-path",
            `inset(0 ${(100 * (1 - wave)).toFixed(1)}% 0 0)`);
          break;

        case "tilt":
          set(el, "transform",
            `perspective(600px) rotateY(` +
            `${((wave - .5) * 24).toFixed(1)}deg)`);
          break;

        case "bronze":
          set(el, "color", gold);
          set(el, "-webkit-text-fill-color", gold);
          break;
      }
    }
  }

  const style = document.createElement("style");
  style.id = "tt-v5-star-suppression";

  style.textContent = `
    html.tt-type-active body :is(${selectors})
    ::before {
      animation: none !important;
    }

    html.tt-type-active body :is(${selectors})::before,
    html.tt-type-active body :is(${selectors})::after {
      content: none !important;
      display: none !important;
      visibility: hidden !important;
      animation: none !important;
    }

    html.tt-type-active body .tt-shimmer-label::after {
      content: none !important;
      display: none !important;
    }
  `;

  document.head.appendChild(style);

  function start() {
    const typography = document.getElementById(
      "gold_typography_effect"
    );
    const shimmer = document.getElementById(
      "gold_shimmer_effect"
    );

    /*
       Apply the saved mode on every page, including pages
       without the admin settings dropdown.
    */
    const saved = root.dataset.goldTypography || "none";

    if (modes.has(saved)) {
      root.dataset.goldEffect = "none";
      root.classList.add("tt-type-active");
      root.classList.add("tt-typography-no-stars");
    }

    choose(saved);

    if (typography) {
      typography.addEventListener("change", () => {
        if (modes.has(typography.value) && shimmer) {
          shimmer.value = "none";
        }
        choose(typography.value);
      });
    }

    if (shimmer) {
      shimmer.addEventListener("change", () => {
        if (shimmer.value !== "none" && typography) {
          typography.value = "none";
          choose("none");
        } else if (typography) {
          choose(typography.value);
        }
      });
    }

    const form = typography?.closest("form");

    if (form) {
      form.addEventListener("submit", () => {
        if (modes.has(typography.value) && shimmer) {
          shimmer.value = "none";
        }
      });
    }

    // Include headings dynamically inserted after page load.
    observer = new MutationObserver(() => {
      if (mode === "none") return;

      const found = document.querySelectorAll(selectors);
      if ([...found].some(el => !nodes.includes(el))) {
        choose(mode);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    console.info(
      "TheTrefoil typography controller active:",
      mode
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded", start, {once:true}
    );
  } else {
    start();
  }

})();
