/* THE TREFOIL UNIFIED GOLD V1 — one settings value, one global controller. */
(()=>{'use strict';
const root=document.documentElement;
const types=new Set(['emboss','underline','glow','foil','spacing','reveal','tilt','bronze']);
const shimmer=new Set(['classic','champagne','diamond','liquid','royal','cinematic','starlight','rose','antique','molten','platinum','imperial','prismatic']);
const allowed=new Set(['none',...types,...shimmer]);
const selectors='.tt-shimmer-label,.section-kicker,.ttv-kicker,.tb-eyebrow,.ttc-kicker,.tt-philosophy-kicker,.tad-kicker,.tce-kicker,.tt-gold-glitter,.tb-heading-top > span:first-child,[class*="-kicker"],[class*="eyebrow"],[class*="overline"]';
const owned=['animation','background-image','background-clip','-webkit-background-clip','-webkit-text-fill-color','color','text-shadow','transform','clip-path','letter-spacing','filter','background-position','background-size','background-repeat','opacity'];
const saved=new WeakMap();let elements=[],selected='none',raf=0,started=0;
function set(el,k,v){el.style.setProperty(k,v,'important')}
function restore(el){el.classList.remove('tt-unified-underline');el.style.removeProperty('--tt-ul-left');el.style.removeProperty('--tt-ul-right');const state=saved.get(el);if(!state)return;for(const[k,v,pr]of state){if(v)el.style.setProperty(k,v,pr);else el.style.removeProperty(k)}saved.delete(el)}
function initElement(el){if(!saved.has(el))saved.set(el,owned.map(k=>[k,el.style.getPropertyValue(k),el.style.getPropertyPriority(k)]));
  set(el,'animation','none');set(el,'background-image','none');set(el,'background-clip','border-box');set(el,'-webkit-background-clip','border-box');set(el,'clip-path','none');set(el,'transform','none');set(el,'filter','none');set(el,'text-shadow','none');set(el,'-webkit-text-fill-color','#d7af75');set(el,'color','#d7af75');set(el,'opacity','1');
}
const color=(r,g,b)=>`rgb(${Math.round(r)},${Math.round(g)},${Math.round(b)})`;
function gold(p,base=[143,89,38],light=[255,227,158]){return color(...base.map((v,i)=>v+(light[i]-v)*p))}
function render(seconds){
 let w=(1-Math.cos(seconds*2*Math.PI/4))/2;
 const output=elements;
 for(const el of output){if(!el.isConnected)continue;
 let hue=gold(w), bright=gold(.1+.9*w), shadow=w.toFixed(3);
 if(selected==='none')continue;
 if(types.has(selected)){
 switch(selected){
 case 'emboss':set(el,'text-shadow','0 -1px 0 #fff0be,0 1px 0 #724720,0 3px 4px rgba(0,0,0,.45)'); break;
 case 'underline': {
    const cycle = 2.0;
    const p = ((seconds / cycle) % 1 + 1) % 1;

    let left = 0;
    let width = 0;

    if (p < 0.5) {
        width = 200 * p;
    } else {
        left = 200 * (p - 0.5);
        width = 100 - left;
    }

    set(el, "background-image",
        `linear-gradient(90deg,transparent ${left.toFixed(2)}%,#e4b369 ${left.toFixed(2)}%,#ffe7a5 ${(left+width).toFixed(2)}%,transparent ${(left+width).toFixed(2)}%)`);
    set(el, "background-repeat", "no-repeat");
    set(el, "background-position", "left bottom");
    set(el, "background-size", "100% 2px");

    set(el, "clip-path", "none");
    set(el, "opacity", "1");

    set(el, "--tt-line-start", `${left.toFixed(2)}%`);
    set(el, "--tt-line-end", `${(left+width).toFixed(2)}%`);
    break;
}
 case 'glow':set(el,'color',bright);set(el,'-webkit-text-fill-color',bright);set(el,'text-shadow',`0 0 ${Math.round(w*13)}px rgba(255,209,126,${(w*.9).toFixed(2)}),0 0 ${Math.round(w*24)}px rgba(226,150,58,${(w*.65).toFixed(2)})`);break;
 case 'foil':set(el,'color',gold(.2+.75*w));set(el,'-webkit-text-fill-color',gold(.2+.75*w));set(el,'text-shadow','-.8px -.8px 0 #ffe5a9,1px 2px 0 #6e441e,2px 3px 4px rgba(0,0,0,.4)');break;
 case 'spacing':set(el,'letter-spacing',`${(.08+w*.24).toFixed(3)}em`);break;
 case 'reveal':set(el,'clip-path',`inset(0 ${(100*(1-w)).toFixed(1)}% 0 0)`);break;
 case 'tilt':set(el,'transform',`perspective(550px) rotateY(${((w-.5)*26).toFixed(1)}deg)`);break;
 case 'bronze':set(el,'color',hue);set(el,'-webkit-text-fill-color',hue);break;
 } } else {
 const palettes={champagne:[[156,103,54],[255,239,191]],diamond:[[122,80,41],[255,255,248]],liquid:[[133,76,23],[255,219,132]],royal:[[146,85,36],[255,232,166]],cinematic:[[144,97,54],[255,251,225]],starlight:[[138,89,39],[255,241,203]],rose:[[141,78,67],[255,218,202]],antique:[[115,83,43],[229,205,143]],molten:[[120,62,14],[255,219,105]],platinum:[[148,119,77],[242,249,255]],imperial:[[118,63,28],[254,229,149]],prismatic:[[166,117,87],[252,238,220]]};
 const pair=palettes[selected]||[[150,89,37],[255,236,174]];
 const v=gold(w,pair[0],pair[1]);set(el,'color',v);set(el,'-webkit-text-fill-color',v);
 if(['diamond','platinum','cinematic','molten'].includes(selected))set(el,'text-shadow',`0 0 ${Math.round(2+7*w)}px rgba(255,224,171,${(.08+.5*w).toFixed(2)})`);
 }
 }
}
function activate(name){if(!allowed.has(name))name='none';if(raf)cancelAnimationFrame(raf);elements.forEach(restore);
 selected=name;root.dataset.ttUnifiedGold=name;root.dataset.goldEffect=shimmer.has(name)?name:'none';root.dataset.goldTypography=types.has(name)?name:'none';root.classList.toggle('tt-type-active',types.has(name));root.classList.toggle('tt-typography-no-stars',!shimmer.has(name));
 elements=[...new Set(document.querySelectorAll(selectors))].filter(el=>!el.closest('button,select,option,textarea, .tt-corner-choice-setting')&&el.childElementCount<4);
 elements.forEach(initElement);started=performance.now();
 if(matchMedia('(prefers-reduced-motion: reduce)').matches){render(1100);return}
 function tick(now){render((now-started)/1000);raf=requestAnimationFrame(tick)}
 raf=requestAnimationFrame(tick);
}
function boot(){const select=document.getElementById('gold_unified_effect');
 const source=document.getElementById('tt-unified-gold-state');
 let savedMode='none';
 try{savedMode=JSON.parse(source?.textContent||'"none"')}catch(e){console.warn('Gold setting could not be read',e)}
 activate(String(savedMode));
 if(select){select.addEventListener('change',()=>activate(select.value));
 const form=select.closest('form');if(form)form.addEventListener('submit',()=>{const v=select.value;root.dataset.ttUnifiedGold=v});}
 // Lightweight observer for dynamic content, without repeatedly resetting the clock.
 const obs=new MutationObserver(list=>{if(list.some(x=>[...x.addedNodes].some(n=>n.nodeType===1&&!n.matches?.('script,style')))){
 const newEls=[...document.querySelectorAll(selectors)].filter(el=>!elements.includes(el)&&el.childElementCount<4);
 if(newEls.length){newEls.forEach(initElement);elements.push(...newEls)}}});
 obs.observe(document.body,{subtree:true,childList:true});
 console.info('TheTrefoil unified golden headings:',selected);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
