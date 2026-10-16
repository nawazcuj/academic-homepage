/* TheTrefoil mascot: standalone, transparent SVG. No dependencies or inline scripts. */
(() => {
  'use strict';
  const ACTIONS = [
    ['Big happy hop','hop'],['Tiny excited hops','doublehop'],['A graceful pirouette','spin'],
    ['Silly side-to-side dance','wiggle'],['Peekaboo!','peek'],['Whoops, a backward tumble!','tumble'],
    ['Chasing the golden orb','chase'],['A spectacular ball toss','toss'],
    ['The ball does a loop','orbit'],['A sleepy little yawn','yawn'],
    ['Caught daydreaming','dream'],['A shy bow','bow'],['Hello there!','wave'],
    ['Wheee! A joyful bounce','bounce'],['The knot tiptoes','tiptoe'],
    ['Ball spins round and round','circle'],['A little victory dance','victory'],
    ['A magic golden sparkle','magic'],['Playing hide and seek','hide'],
    ['A dramatic surprise','surprise'],['A gentle stretch','stretch'],
    ['Practising ballet','ballet'],['The orbiting golden planet','planet'],
    ['A delighted little shimmy','shimmy']
  ];
  const animate = (el, frames, duration, extra={}) => {
    if (!el || !el.animate) return Promise.resolve();
    const anim=el.animate(frames,{duration,easing:'ease-in-out',fill:'none',...extra});
    return anim.finished.catch(()=>{});
  };
  async function init(host){
    if(host.dataset.ttcReady) return;
    host.dataset.ttcReady='yes';
    const svgUrl=host.dataset.svg;
    if (!svgUrl) return;
    let svgText;
    try { const response=await fetch(svgUrl,{credentials:'same-origin'});if(!response.ok)throw Error('SVG '+response.status);svgText=await response.text(); }
    catch(error){host.textContent='Mascot SVG unavailable';console.error('[Trefoil mascot]',error);return}
    const parsed=new DOMParser().parseFromString(svgText,'image/svg+xml');
    if(parsed.querySelector('parsererror'))return;
    const svg=parsed.documentElement;
    if(svg.nodeName.toLowerCase()!=='svg')return;
    svg.removeAttribute('id');
    host.querySelector('.ttc-hit')?.appendChild(document.importNode(svg,true));
    const $=id=>host.querySelector('#'+id);
    const body=$('tc-body'), ball=$('tc-ball'), face=$('tc-face'),left=$('tc-arm-left'),right=$('tc-arm-right'),eyes=$('tc-eyes'),magic=$('tc-magic');
    const caption=host.querySelector('.ttc-caption'), hit=host.querySelector('.ttc-hit');
    let previous=-1,deck=[],playing=false,queue=null,lastTouch=Date.now(),captionTimeout;
    const rand=n=>Math.floor(Math.random()*n);
    function draw(){ if(!deck.length){deck=ACTIONS.map((_,i)=>i);for(let i=deck.length-1;i>0;i--){const j=rand(i+1);[deck[i],deck[j]]=[deck[j],deck[i]]}if(deck[deck.length-1]===previous && deck.length>1)[deck[deck.length-1],deck[0]]=[deck[0],deck[deck.length-1]]}previous=deck.pop();return ACTIONS[previous] }
    const pose=(el, frames, ms=1500,opts={})=>animate(el,frames,ms,opts);
    const B=(...moves)=>moves.map(t=>({transform:t}));
    const orbFrames={
      chase:B('translate(381px,113px)','translate(310px,120px)','translate(270px,176px)','translate(381px,113px)'),
      toss:B('translate(381px,113px)','translate(347px,49px)','translate(260px,15px)','translate(381px,113px)'),
      orbit:B('translate(381px,113px)','translate(237px,30px)','translate(98px,179px)','translate(247px,360px)','translate(381px,113px)'),
      circle:B('translate(381px,113px) scale(1)','translate(330px,64px) scale(.78)','translate(284px,120px) scale(1.1)','translate(381px,113px) scale(1)'),
      planet:B('translate(381px,113px)','translate(311px,39px)','translate(125px,56px)','translate(83px,248px)','translate(381px,113px)')
    };
    async function trigger(userInitiated=false){
      if(document.hidden || playing){if(userInitiated)queue=true;return}
      if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){caption.textContent='Hello from TheTrefoil!';caption.classList.add('is-on');setTimeout(()=>caption.classList.remove('is-on'),1600);return}
      playing=true;lastTouch=Date.now();const [name,kind]=draw();
      caption.textContent=name;caption.classList.add('is-on');clearTimeout(captionTimeout);
      let animations=[];const duration=1500;
      const doBody=(f,d=duration)=>animations.push(pose(body,B(...f),d));
      switch(kind){
        case 'hop':doBody(['translateY(0)','translateY(-66px) rotate(-7deg)','translateY(0)'],1050);break;
        case 'doublehop':doBody(['translateY(0)','translateY(-35px)','translateY(0)','translateY(-47px)','translateY(0)'],1300);break;
        case 'spin':doBody(['rotate(0)','rotate(180deg)','rotate(360deg)'],1450);break;
        case 'tumble':doBody(['rotate(0)','translateX(-15px) rotate(-100deg)','rotate(-360deg)','rotate(-360deg)'],1650);break;
        case 'wiggle': case 'shimmy':doBody(['rotate(0)','rotate(-11deg)','rotate(12deg)','rotate(-12deg)','rotate(11deg)','rotate(0)'],1300);break;
        case 'peek': case 'hide':doBody(['scale(1)','scale(.52) translateY(70px)','scale(.52) translateY(70px)','scale(1.12)','scale(1)'],1700);break;
        case 'bow':doBody(['rotate(0)','rotate(16deg) translateY(18px)','rotate(16deg) translateY(18px)','rotate(0)']);break;
        case 'bounce':case 'victory':doBody(['translateY(0)','translateY(-38px) rotate(-6deg)','translateY(0)','translateY(-50px) rotate(6deg)','translateY(0)'],1450);break;
        case 'tiptoe':doBody(['translateX(0)','translateX(-29px) rotate(-7deg)','translateX(13px) rotate(4deg)','translateX(0)'],1500);break;
        case 'yawn':case 'dream':doBody(['rotate(0)','rotate(12deg) translateY(12px)','rotate(12deg) translateY(12px)','rotate(0)'],1700);animations.push(pose(eyes,[{transform:'scaleY(1)'},{transform:'scaleY(.1)'},{transform:'scaleY(.1)'},{transform:'scaleY(1)'}],1650));break;
        case 'wave':animations.push(pose(right,B('rotate(0)','rotate(-30deg)','rotate(15deg)','rotate(-30deg)','rotate(15deg)','rotate(0)'),1300));break;
        case 'stretch':doBody(['scale(1)','scale(1.08,.9)','scale(.94,1.07)','scale(1)']);break;
        case 'ballet':doBody(['rotate(0)','rotate(110deg)','rotate(270deg)','rotate(360deg)'],1600);break;
        case 'surprise':doBody(['scale(1)','scale(1.1) rotate(-8deg)','scale(.9)','scale(1.07)','scale(1)']);break;
        case 'chase':doBody(['translateX(0)','translateX(24px) rotate(7deg)','translateX(-13px) rotate(-7deg)','translateX(0)']);break;
        default:doBody(['translateY(0)','translateY(-24px) rotate(-5deg)','translateY(0)']);
      }
      if(orbFrames[kind])animations.push(pose(ball,orbFrames[kind],1650));
      if(['magic','planet','victory','surprise','toss','orbit'].includes(kind)) {magic.style.opacity='1';animations.push(pose(magic,[{transform:'scale(.7)',opacity:0},{transform:'scale(1.13)',opacity:1},{transform:'scale(1)',opacity:0}],1600));}
      if(['bow','yawn','surprise','magic'].includes(kind))animations.push(pose(face,B('translateY(0)','translateY(-9px)','translateY(0)'),1200));
      await Promise.all(animations);
      magic.style.opacity='0';captionTimeout=setTimeout(()=>caption.classList.remove('is-on'),600);
      playing=false;if(queue){queue=false;trigger(true)}
    }
    hit.addEventListener('click',()=>trigger(true));
    hit.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();trigger(true)}});
    // No constant surprises when offscreen; respects reduced motion and visibility.
    const observer=new IntersectionObserver(entries=>{host.dataset.visible=entries[0]?.isIntersecting?'yes':'no'});observer.observe(host);
    const idle=setInterval(()=>{if(host.dataset.visible==='yes' && !document.hidden && Date.now()-lastTouch>18000 && Math.random()<.48)trigger(false)},11500);
    window.addEventListener('pagehide',()=>{clearInterval(idle);observer.disconnect()},{once:true});
  }
  function start(){document.querySelectorAll('.ttc-mascot[data-svg]').forEach(init)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
