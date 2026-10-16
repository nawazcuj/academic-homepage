(()=>{'use strict';
  function boot(){
    const strip=document.getElementById('tt-live-footer-strip');if(!strip)return;
    const clock=strip.querySelector('[data-tt-live-time]');
    const math=strip.querySelector('[data-tt-live-math]');
    const next=strip.querySelector('[data-tt-next-math]');
    const top=strip.querySelector('[data-tt-to-top]');
    const expressions=['eⁱπ + 1 = 0','V − E + F = 2','sin²θ + cos²θ = 1','∫₀¹ x² dx = ⅓','a² + b² = c²','χ(G) ≤ Δ(G) + 1'];
    let index=0;
    const fmt=new Intl.DateTimeFormat('en-IN',{timeZone:'Asia/Kolkata',hour:'2-digit',minute:'2-digit',hour12:true});
    function tick(){if(clock)clock.textContent=fmt.format(new Date())+' IST';}
    tick();window.setInterval(tick,30000);
    if(next&&math)next.addEventListener('click',()=>{index=(index+1)%expressions.length;math.textContent=expressions[index];});
    if(top)top.addEventListener('click',()=>window.scrollTo({top:0,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'}));
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
