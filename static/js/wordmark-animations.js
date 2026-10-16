
(() => {
  "use strict";

  const allowed = new Set([
    "none", "shimmer", "typewriter", "rise", "wave",
    "blue-bronze", "flip", "glow", "focus",
    "float", "zoom", "fly", "split", "wipe", "swivel", "bounce", "stretch", "pulse", "color-wave", "rise-rotate", "elegant"
  ]);

  function prepare(container) {
    const wordmark = container.querySelector("[data-tt-wordmark]");
    if (!wordmark) return;

    const label = wordmark.textContent;
    wordmark.setAttribute("aria-label", label);

    let letterIndex = 0;
    let fragment = document.createDocumentFragment();

    for (const character of label) {
      const span = document.createElement("span");
      span.className = "tt-letter";
      span.textContent = character;
      span.setAttribute("aria-hidden", "true");

      if (character.trim()) {
        span.style.setProperty("--tt-index", String(letterIndex));
        if ((letterIndex + 1) % 4 === 0) {
          span.classList.add("tt-bronze");
        }
        letterIndex++;
      } else {
        span.classList.add("tt-space");
      }
      fragment.appendChild(span);
    }

    wordmark.replaceChildren(fragment);
  }

  function restart(container, style, repeat) {
    container.dataset.ttAnimation = allowed.has(style) ? style : "none";
    container.dataset.ttRepeat = repeat === "loop" ? "loop" : "once";

    // Restart animations when the preview selection changes.
    const wordmark = container.querySelector("[data-tt-wordmark]");
    if (!wordmark) return;
    wordmark.style.animation = "none";
    for (const letter of wordmark.querySelectorAll(".tt-letter")) {
      letter.style.animation = "none";
    }

    void wordmark.offsetWidth;

    wordmark.style.animation = "";
    for (const letter of wordmark.querySelectorAll(".tt-letter")) {
      letter.style.animation = "";
    }
  }

  document.querySelectorAll(".tt-brand-title, .tt-animation-preview")
    .forEach(prepare);

  const styleSelect = document.getElementById("tt-wordmark-style");
  const repeatSelect = document.getElementById("tt-wordmark-repeat");
  const preview = document.querySelector(".tt-animation-preview");

  if (styleSelect && repeatSelect && preview) {
    function updatePreview() {
      restart(preview, styleSelect.value, repeatSelect.value);
    }

    const replayButton = document.getElementById("tt-wordmark-replay");
    if (replayButton) replayButton.addEventListener("click", updatePreview);
    styleSelect.addEventListener("change", updatePreview);
    repeatSelect.addEventListener("change", updatePreview);
  }
})();

/* THETREFOIL_SHUFFLE_V1 - header scheduling, no changes to existing preview logic */
(() => {
  "use strict";
  const header = document.querySelector(".tt-brand-title[data-tt-wordmark], .tt-brand-title[data-tt-animation]");
  if (!header) return;

  const styles = [
    "shimmer", "typewriter", "rise", "wave", "blue-bronze", "flip", "glow", "focus",
    "float", "zoom", "fly", "split", "wipe", "swivel", "bounce", "stretch",
    "pulse", "color-wave", "rise-rotate", "elegant"
  ];
  const mode = ["single", "shuffle", "sequence"].includes(header.dataset.ttMode)
    ? header.dataset.ttMode : "shuffle";
  if (mode === "single") return;

  const allowedIntervals = [10, 15, 30, 60];
  const parsed = Number(header.dataset.ttInterval);
  const interval = (allowedIntervals.includes(parsed) ? parsed : 15) * 1000;
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  const wordmark = header.querySelector("[data-tt-wordmark]");
  if (!wordmark) return;
  let timer = null;
  let last = header.dataset.ttAnimation || "";
  let position = -1;

  function stop() {
    if (timer !== null) window.clearTimeout(timer);
    timer = null;
  }
  function resetAnimation() {
    const nodes = [wordmark, ...wordmark.querySelectorAll(".tt-letter")];
    nodes.forEach(node => { node.style.animation = "none"; });
    void wordmark.offsetWidth;
    nodes.forEach(node => { node.style.animation = ""; });
  }
  function nextStyle() {
    if (mode === "sequence") {
      position = (position + 1) % styles.length;
      return styles[position];
    }
    // Uniformly choose one of the 19 alternatives to avoid consecutive repeats.
    const candidates = styles.filter(name => name !== last);
    return candidates[Math.floor(Math.random() * candidates.length)];
  }
  function tick() {
    stop();
    if (document.hidden || media.matches) return;
    const style = nextStyle();
    last = style;
    header.dataset.ttRepeat = "once";
    header.dataset.ttAnimation = style;
    resetAnimation();
    timer = window.setTimeout(tick, interval);
  }
  function visibilityChanged() {
    if (document.hidden || media.matches) {
      stop();
      if (media.matches) {
        header.dataset.ttAnimation = "none";
        resetAnimation();
      }
    } else {
      tick();
    }
  }
  document.addEventListener("visibilitychange", visibilityChanged);
  if (typeof media.addEventListener === "function") media.addEventListener("change", visibilityChanged);
  else if (typeof media.addListener === "function") media.addListener(visibilityChanged);
  visibilityChanged();
})();
