(() => {
  'use strict';
  const root = document.documentElement;
  const stored = localStorage.getItem('academic-theme');
  const theme = stored === 'dark' || stored === 'light' ? stored : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  root.dataset.theme = theme;
  const toggle = document.querySelector('#theme-toggle');
  if (toggle) {
    toggle.setAttribute('aria-pressed', String(theme === 'dark'));
    toggle.addEventListener('click', () => {
      const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
      root.dataset.theme = next;
      localStorage.setItem('academic-theme', next);
      toggle.setAttribute('aria-pressed', String(next === 'dark'));
    });
  }
  const menuButton = document.querySelector('#menu-toggle');
  const nav = document.querySelector('#site-nav');
  if (menuButton && nav) {
    menuButton.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      menuButton.setAttribute('aria-expanded', String(open));
      menuButton.textContent = open ? '✕' : '☰';
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      nav.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
    }));
  }
  window.addEventListener('load', () => {
    if (typeof window.renderMathInElement === 'function') {
      window.renderMathInElement(document.body, {delimiters: [{left:'$$',right:'$$',display:true},{left:'\\(',right:'\\)',display:false}]});
    }
  });
  const y = document.querySelector('#year');
  if (y) y.textContent = String(new Date().getFullYear());
})();
