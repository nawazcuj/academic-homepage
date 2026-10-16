(() => {
  'use strict';
  const root=document.querySelector('.tt-settings-studio');
  if(!root) return;
  const field=root.querySelector('select[name="color_palette"]');
  if(field && !root.querySelector('.tts-swatches')) {
    const colors={
      'original':['#fbfaf7','#ffffff'],
      'deep-sage':['#A8B8AA','#DCE5DA'], 'slate-blue':['#A5B6C2','#DEE7EC'],
      'smoky-teal':['#95B2B1','#D9E9E6'], 'warm-taupe':['#B9ADA0','#E7DFD5'],
      'graphite-mist':['#A4A9AE','#E0E3E5'], 'dusty-olive':['#B0B49C','#E2E5D6'],
      'midnight-navy':['#172436','#24354A'], 'oxford-blue':['#142D3B','#254151'],
      'forest-ink':['#192D27','#2A4138'], 'deep-petrol':['#18383E','#294A50'],
      'charcoal-plum':['#302B38','#443B4B'], 'espresso-brown':['#352C29','#4A3C35'],
      'graphite-blue':['#252F3B','#374453'], 'black-olive':['#2B3027','#3E4637']
    };
    const holder=document.createElement('div');holder.className='tts-swatches';
    const a=document.createElement('div');a.className='tts-swatch';
    const b=document.createElement('div');b.className='tts-swatch';
    const text=document.createElement('span');text.className='tts-swatch-label';
    holder.append(a,b,text);field.insertAdjacentElement('afterend',holder);
    function sync(){const [bg,card]=colors[field.value]||colors.original;
      a.style.background=bg;b.style.background=card;
      text.textContent=field.options[field.selectedIndex]?.textContent.trim()||'';
    }
    field.addEventListener('change',sync);sync();
  }
  const form=field?.closest('form');
  if(!form) return;
  // Move the existing Save button to the end, after the palette field.
  // This preserves its original submit behaviour and CSRF protection.
  const buttons=Array.from(form.querySelectorAll('button'));
  const save=buttons.find(x=>x.type==='submit'||!x.hasAttribute('type'));
  if(save && !save.closest('.tts-form-footer')){
    const footer=document.createElement('div');footer.className='tts-form-footer';
    save.classList.add('tts-save-btn');footer.append(save);form.append(footer);
  }
})();

/* THETREFOIL SETTINGS TABS V2 */
(() => {
 'use strict';
 const root=document.querySelector('.tts-studio');
 if(!root) return;
 const tabs=[...root.querySelectorAll('.tts-tab')];
 const panels=[...root.querySelectorAll('.tt-settings-tab-panel')];
 function activate(name){
   tabs.forEach(tab=>{const active=tab.dataset.tab===name;tab.classList.toggle('is-active',active);tab.setAttribute('aria-selected',String(active));});
   panels.forEach(panel=>{panel.hidden=panel.dataset.panel!==name;});
 }
 tabs.forEach(tab=>tab.addEventListener('click',()=>activate(tab.dataset.tab)));
 activate('profile');
 // Keep any existing animation-preview and palette-preview implementation.
})();
