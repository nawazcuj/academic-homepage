(() => {
  const images = [...document.querySelectorAll('img.tt-journal-subject-art[data-art-original][data-art-illustrated]')];
  if (!images.length) return;
  const key = 'thetrefoil-journal-artwork-v1';
  const allowed = ['classic', 'illustrated'];
  let choice = 'classic';
  try { const remembered = localStorage.getItem(key); if (allowed.includes(remembered)) choice = remembered; } catch (_) {}
  const wrap = document.createElement('div');
  wrap.className = 'tt-art-choice';
  wrap.setAttribute('role','group');
  wrap.setAttribute('aria-label','Mathematical illustration style');
  const intro = document.createElement('span');
  intro.textContent = 'Illustrations';
  wrap.appendChild(intro);
  const buttons = {};
  [['classic','Original diagrams'],['illustrated','Illustrated boards']].forEach(([value,label]) => {
    const b = document.createElement('button'); b.type='button'; b.className='tt-art-choice-button';
    b.textContent=label;
    b.addEventListener('click',()=>apply(value));
    wrap.appendChild(b);buttons[value]=b;
  });
  function apply(value) {
    choice = value;
    for (const img of images) {
      const next = img.dataset[value === 'classic' ? 'artOriginal' : 'artIllustrated'];
      if(next && img.getAttribute('src') !== next) img.setAttribute('src', next);
    }
    for (const [name,b] of Object.entries(buttons)) {
      const active=name===choice;
      b.classList.toggle('is-active',active);
      b.setAttribute('aria-pressed',String(active));
    }
    try { localStorage.setItem(key, choice); } catch (_) {}
  }
  const filter = document.querySelector('.filter-bar');
  if(filter) filter.insertAdjacentElement('afterend',wrap);
  else document.querySelector('.tt-journal-grid')?.parentElement.prepend(wrap);
  apply(choice);
})();
