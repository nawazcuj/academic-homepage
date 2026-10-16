
/* TheTrefoil footer reveal */
(function () {
  const footer = document.querySelector(".tt-editorial-footer");
  if (!footer || !("IntersectionObserver" in window)) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  footer.classList.add("tt-footer-motion-ready");

  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        footer.classList.add("tt-footer-visible");
        observer.disconnect();
      }
    },
    { threshold: 0.12 }
  );

  observer.observe(footer);
})();
