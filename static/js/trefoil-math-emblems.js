(()=>{
 const shapes={
 Research:`<svg viewBox="0 0 100 100" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="2.3" stroke-linejoin="round"><path d="M50 13L20 67L79 67Z M20 67L77 36L50 13L51 84L79 67 M77 36L51 84"/></g><g class="tt-nodes" fill="#ffdf9f"><circle cx="50" cy="13" r="4.5"/><circle cx="20" cy="67" r="4.5"/><circle cx="79" cy="67" r="4.5"/><circle cx="77" cy="36" r="4"/><circle cx="51" cy="84" r="4"/></g><path class="tt-glint" fill="#fff5d7" d="M82 12l2.5 7.5L92 22l-7.5 2.5L82 32l-2.5-7.5L72 22l7.5-2.5z"/></svg>`,
 Teaching:`<svg viewBox="0 0 100 100" aria-hidden="true"><g class="tt-book" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M50 78Q32 67 12 74V27Q32 20 50 31Q68 20 88 27V74Q68 67 50 78ZM50 31V78"/><path d="M19 40Q30 37 43 43M19 52Q30 49 43 55M57 43Q69 37 81 40M57 55Q69 49 81 52"/></g><path class="tt-glint" fill="#fff5d7" d="M50 4l3.5 11L65 18.5 53.5 22 50 33l-3.5-11L35 18.5 46.5 15z"/></svg>`,
 Discovery:`<svg viewBox="0 0 100 100" aria-hidden="true"><g class="tt-orbits" fill="none" stroke="currentColor" stroke-width="2.1"><circle cx="47" cy="56" r="27"/><ellipse cx="47" cy="56" rx="40" ry="14" transform="rotate(-30 47 56)"/><ellipse cx="47" cy="56" rx="15" ry="38" transform="rotate(45 47 56)"/></g><circle cx="47" cy="56" r="6" fill="#f4c176"/><circle cx="47" cy="56" r="2.5" fill="#fff4d5"/><path class="tt-glint" fill="#fff5d7" d="M78 6l4 12 12 4-12 4-4 12-4-12-12-4 12-4z"/></svg>`
 };
 function install(){
   const root=document.getElementById('trefoil-philosophy');if(!root)return;
   let n=0;
   root.querySelectorAll('h3,h4,h2,strong').forEach(heading=>{
     const key=heading.textContent.trim().replace(/\s+/g,' ');
     if(!Object.prototype.hasOwnProperty.call(shapes,key))return;
     const card=heading.closest('article, .tt-philosophy-card, .tt-philosophy-item, li')||heading.parentElement;
     if(!card)return;
     const old=card.querySelectorAll('.tt-math-emblem,.tt-symbol-emblem');old.forEach(el=>el.remove());
     const code={Research:'01',Teaching:'02',Discovery:'03'}[key];
     Array.from(card.querySelectorAll('span,div,small,b')).filter(el=>!el.querySelector('*') && el.textContent.trim()===code).forEach(el=>{el.hidden=true;el.style.display='none'});
     // The emblem is placed immediately above its title, independent of card markup.
     const emblem=document.createElement('span');emblem.className='tt-symbol-emblem tt-symbol-emblem--'+key.toLowerCase();
     emblem.setAttribute('role','img');emblem.setAttribute('aria-label',key+' mathematical emblem');
     emblem.innerHTML=shapes[key];heading.before(emblem);n++;
   });
   console.info('TheTrefoil mathematical emblems installed:',n,'of 3');
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
})();
