/* THETREFOIL GOLD SHIMMER STUDIO V1 */
(()=>{'use strict';
 const allowed=new Set(['classic','champagne','diamond','liquid','royal','cinematic','starlight','rose','antique']);
 function start(){
  const root=document.documentElement;
  if(!allowed.has(root.dataset.goldEffect))root.dataset.goldEffect='classic';
  /* Match the site's actual editorial label classes and the newer admin labels. */
  const selectors=[
   '.section-kicker','.ttv-eyebrow','.ttv-kicker','.ttv-feature-eyebrow',
   '.tb-eyebrow','.ttc-kicker','.tt-philosophy-kicker',
   '.tad-kicker','.tce-kicker','.tts-kicker','.tts-eyebrow',
   '[class*="section-kicker"]','[class*="eyebrow"]',
   '[class*="overline"]','[class*="-kicker"]'
  ];
  document.querySelectorAll(selectors.join(',')).forEach(el=>{
   if(el.closest('button, input, select, textarea, .tt-gold-settings') || el.classList.contains('tt-shimmer-label'))return;
   if(el.children.length>3)return; // Never change complex containers.
   el.classList.add('tt-shimmer-label');
  });
  const select=document.getElementById('gold_shimmer_effect');
  if(select){select.addEventListener('change',()=>{
    if(allowed.has(select.value))root.dataset.goldEffect=select.value;
  });}
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
