/* TT FOOTER SAVE V4 */
(()=>{'use strict';
const palette={
original:null,midnight:['#102D39','#174B50','#06131D'],bronze:['#39433E','#4A382B','#111820'],
sapphire:['#142C4B','#263E66','#080F24'],emerald:['#16463E','#23564A','#091B20'],
champagne:['#F4EBDE','#E6D5BE','#BCA78B'],slate:['#354C58','#526674','#142531'],
aubergine:['#34283E','#563B58','#161425'],ocean:['#1A5364','#28747B','#0A2534'],
forest:['#29483C','#405A42','#111F1C'],rose:['#583E3C','#674C46','#23191E'],
graphite:['#3B4246','#252F34','#080F15'],sage:['#E2E9E1','#B8CFC3','#647D78']
};
const gradient=key=>palette[key]?`linear-gradient(180deg, ${palette[key][0]} 0%, ${palette[key][1]} 46%, ${palette[key][2]} 100%)`:null;
function apply(){
 const root=document.documentElement;
 const saved=root.dataset.ttFooterSaved||'original';
 const g=gradient(saved);
 // Only the actual site footer (the base template includes a footer element); no admin panels.
 const ft=document.querySelector('footer.tt-editorial-footer')||document.querySelector('footer.site-footer')||document.querySelector('footer');
 if(!ft||!g)return;
 ft.classList.add('tt-footer-gradient-v4');
 ft.style.setProperty('--tt-footer-gradient-v4',g);
 ft.style.setProperty('--tt-footer-fallback-v4',palette[saved][2]);
 ft.style.setProperty('background',g,'important');
 ft.style.setProperty('background-image',g,'important');
 ft.dataset.ttFooterApplied=saved;
}
function start(){
 const input=document.getElementById('footer_gradient_theme');
 if(input){
   const formId=input.getAttribute('form');
   const form=(formId&&document.getElementById(formId))||input.closest('form');
   // Force it to be submitted with the Save Website Settings button even if the panel is moved.
   if(form && input.form!==form){
     input.setAttribute('form',form.id);
   }
   if(form && !form.id){
     form.id='tt-footer-form-v4';input.setAttribute('form',form.id);
   }
   // Do not duplicate the field or redirect form submission.
 }
 apply();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
