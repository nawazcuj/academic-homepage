/* Apply the academic-luxury layout only when the two exact headings are found.
 * Never rebuild links or icons: their original HTML and hrefs remain untouched.
 */
(function(){
  function init(){
    const headings = [...document.querySelectorAll('h1,h2,h3,h4,h5')];
    const match = txt => headings.find(el=>el.textContent.trim().replace(/\s+/g,' ').toLowerCase()===txt);
    const left = match('academic affiliation'), right = match('academic profiles');
    if(!left || !right) return;
    let parent=left.parentElement;
    while(parent && !parent.contains(right)) parent=parent.parentElement;
    if(!parent || ['BODY','MAIN','HTML'].includes(parent.tagName)) return;
    let a=left,b=right;
    while(a.parentElement!==parent) a=a.parentElement;
    while(b.parentElement!==parent) b=b.parentElement;
    if(a===b || parent.children.length>4) return;
    parent.classList.add('tt-ap-grid');
    a.classList.add('tt-ap-affiliation');
    b.classList.add('tt-ap-network');
    b.querySelectorAll('a[href]').forEach(link=>{link.classList.add('tt-ap-profile-link');});
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
