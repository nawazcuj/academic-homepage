(()=>{'use strict';const stage=document.getElementById('mascot-stage');if(!stage||stage.dataset.ready)return;stage.dataset.ready='yes';
const actions=['bounce','cartwheel','wiggle','peekaboo','bow','sneak','moonwalk','somersault','stretch','shy','hiccup','tiptoe','levitate','squish','nod','nap','juggle','toss','orbit','chase','celebrate','party','magic','shock'];
let deck=[],last='',busy=false,job=null,idleJob=null;const prefersReduced=matchMedia('(prefers-reduced-motion: reduce)');function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function next(){if(!deck.length){deck=shuffle([...actions]);if(deck.length>1&&deck[0]===last){[deck[0],deck[1]]=[deck[1],deck[0]]}}return deck.shift()}
function perform(action){if(prefersReduced.matches)return;if(!action)action=next();clearTimeout(job);busy=true;stage.removeAttribute('data-action');void stage.offsetWidth;stage.dataset.action=action;stage.querySelector('#status').textContent='Trefoil surprise: '+action.replaceAll('-',' ');last=action;job=setTimeout(()=>{stage.removeAttribute('data-action');busy=false},action==='nap'?2750:action==='orbit'?2500:action==='peekaboo'?2150:2200)}
function poke(){clearTimeout(idleJob);perform();planIdle()}
function planIdle(){clearTimeout(idleJob);idleJob=setTimeout(()=>{if(!busy&&!document.hidden)perform();planIdle()},13500+Math.random()*10000)}
stage.addEventListener('click',poke);stage.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();poke()}});document.addEventListener('visibilitychange',()=>{if(document.hidden){clearTimeout(idleJob);clearTimeout(job);stage.removeAttribute('data-action');busy=false}else planIdle()});planIdle();
})();
