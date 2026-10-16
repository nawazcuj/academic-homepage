/* TT FOOTER GRADIENT V3 */
(()=>{
'use strict';
const palettes={
 original:null,
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
const gradient=k=>{const c=palettes[k];return c?`linear-gradient(180deg,${c[0]} 0%,${c[1]} 46%,${c[2]} 100%)`:null};
function init(){
 const picker=document.getElementById('footer_gradient_theme');
 const panel=document.querySelector('.tt-footer-gradient-panel');
 const appearance=document.getElementById('tts-panel-appearance');
 const preview=document.getElementById('tt-footer-gradient-preview');
 if(panel&&appearance&&panel.parentElement!==appearance){
   // Do not clone the section: move the SAME select, keeping its name, value and submit behaviour.
   appearance.appendChild(panel);
 }
 if(picker&&preview){
   if(!preview.querySelector('.tt-fg-preview-caption')){
     const caption=document.createElement('span');caption.className='tt-fg-preview-caption';
     caption.textContent='MATHEMATICS · RESEARCH · TEACHING';preview.appendChild(caption);
   }
   function update(){
     const value=picker.value;
     const g=gradient(value)||'linear-gradient(180deg,#263b46,#0b1922)';
     preview.style.setProperty('background',g,'important');
     preview.style.setProperty('background-image',g,'important');
     preview.style.setProperty('color',['champagne','sage'].includes(value)?'#203536':'#fff1db','important');
     preview.style.setProperty('text-shadow',['champagne','sage'].includes(value)?'none':'0 2px 10px #0007','important');
     preview.dataset.gradient=value;
   }
   picker.addEventListener('input',update);
   picker.addEventListener('change',update);
   update();
 }
 // Use Flask-rendered saved value, NOT the admin preview selection on public pages.
 const saved=document.documentElement.dataset.ttFooterTheme||'original';
 const g=gradient(saved);
 if(!g)return;
 // Include actual footer wrappers even when custom templates use a div instead of <footer>.
 const candidates=[...document.querySelectorAll('footer, .tt-editorial-footer, .site-footer, .footer, #footer')];
 const targets=candidates.filter(el=>!candidates.some(other=>other!==el&&other.contains(el)));
 for(const el of targets){
   el.style.setProperty('background',g,'important');
   el.style.setProperty('background-image',g,'important');
   el.style.setProperty('background-color',palettes[saved][2],'important');
   el.setAttribute('data-tt-footer-applied',saved);
 }
 // Light gradients need contrasting text; constrain changes strictly to the selected footer.
 if(['champagne','sage'].includes(saved)){
   for(const el of targets){
     el.classList.add('tt-footer-light-gradient');
   }
 }
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
