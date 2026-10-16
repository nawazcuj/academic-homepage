/* GitHub Pages adaptation: preserve original site UI without requiring Flask APIs. */
(()=>{'use strict';
const clean=s=>(s||'').toLocaleLowerCase().trim();
function card(e){const a=document.createElement('a');a.href=e.href;a.className='tt-static-result';const cap=document.createElement('small');cap.textContent=e.category||e.type;const title=document.createElement('strong');title.textContent=e.title;const summary=document.createElement('span');summary.textContent=e.summary||'';a.append(cap,title,summary);return a}
let dataPromise;
function records(){return dataPromise??=(fetch('static/data/public-index.json').then(r=>{if(!r.ok)throw Error('Public search index unavailable');return r.json()}).catch(()=>[]))}
const form=document.querySelector('form.filter-bar[data-tt-static-filter]');
if(form){const inp=form.querySelector('input[name=q]'),sel=form.querySelector('select[name=category]'),container=form.parentNode;
const list=[...container.querySelectorAll('.tt-journal-grid>*, .tt-resource-listing-grid>*, .cards>*, .tt-paper-list>*, .pub-list>*, .ttv-paper-list>*')];
form.addEventListener('submit',e=>{e.preventDefault();apply()});[inp,sel].forEach(i=>i&&i.addEventListener(i===inp?'input':'change',apply));
function apply(){const q=clean(inp?.value),c=clean(sel?.value);for(const el of list){const text=clean(el.textContent),match=(!q||text.includes(q))&&(!c||text.includes(c));el.hidden=!match;el.style.display=match?'':'none'} }
}
const search=document.getElementById('tt-live-search');
if(search){const parent=document.getElementById('tt-static-search-results');const sform=search.closest('form');sform?.addEventListener('submit',e=>{e.preventDefault();run()});search.addEventListener('input',run);
async function run(){const q=clean(search.value);if(!parent)return;parent.replaceChildren();if(q.length<2)return;const data=await records();const hits=data.filter(e=>clean(e.title+' '+e.summary+' '+e.category).includes(q)).slice(0,60);for(const entry of hits)parent.append(card(entry));if(!hits.length){const p=document.createElement('p');p.textContent='No matching results found.';parent.append(p)} }
const init=new URLSearchParams(location.search).get('q');if(init){search.value=init;run()}
}
// Keep static routes local. A backup PDF may not be present in the archive; show only valid CV links.
})();
