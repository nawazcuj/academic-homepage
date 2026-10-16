/* THE TREFOIL: mutually exclusive admin preview selector */
(() => {
  'use strict';
  const root = document.documentElement;
  const allowed = new Set(['none','emboss','underline','glow','foil','spacing','reveal','tilt','bronze']);
  function start() {
    const field = document.getElementById('gold_typography_effect');
    if (!field) return;
    function update() {
      if (allowed.has(field.value)) root.dataset.goldTypography = field.value;
    }
    field.addEventListener('change',update);
    update();
    const demo = document.querySelector('.tt-typography-preview-label');
    if(demo) demo.classList.add('tt-shimmer-label');
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();
