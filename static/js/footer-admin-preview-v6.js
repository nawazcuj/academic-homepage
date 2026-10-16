/* Footer gradient editor. Public footer rendering is handled in base.html. */
(function () {
  'use strict';
  const colors = {
    original:['#253943','#0b1b25'],
    midnight:['#102D39','#174B50','#06131D'],
    bronze:['#39433E','#4A382B','#111820'],
    sapphire:['#142C4B','#263E66','#080F24'],
    emerald:['#16463E','#23564A','#091B20'],
    champagne:['#F4EBDE','#E6D5BE','#BCA78B'],
    slate:['#354C58','#526674','#142531'],
    aubergine:['#34283E','#563B58','#161425'],
    ocean:['#1A5364','#28747B','#0A2534'],
    forest:['#29483C','#405A42','#111F1C'],
    rose:['#583E3C','#674C46','#23191E'],
    graphite:['#3B4246','#252F34','#080F15'],
    sage:['#E2E9E1','#B8CFC3','#647D78']
  };
  function init() {
    const picker = document.getElementById('footer_gradient_theme');
    const preview = document.getElementById('tt-footer-gradient-preview');
    if (!picker || !preview) return;
    preview.textContent='';
    const title=document.createElement('span');
    title.className='tt-preview-title';title.textContent='TheTrefoil';
    const subtitle=document.createElement('span');
    subtitle.className='tt-preview-subtitle';subtitle.textContent='MATHEMATICS · RESEARCH · TEACHING';
    preview.append(title,subtitle);
    function refresh() {
      const c=colors[picker.value] || colors.original;
      const bg=c.length===3
        ? `linear-gradient(180deg,${c[0]} 0%,${c[1]} 46%,${c[2]} 100%)`
        : `linear-gradient(180deg,${c[0]} 0%,${c[1]} 100%)`;
      preview.style.backgroundImage=bg;
      preview.style.backgroundColor=c[0];
      const light=['sage','champagne'].includes(picker.value);
      preview.style.color=light?'#20393a':'#fff0d6';
      preview.style.textShadow=light?'none':'0 2px 12px rgba(0,0,0,.4)';
    }
    picker.addEventListener('change',refresh);
    picker.addEventListener('input',refresh);
    refresh();
  }
  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
