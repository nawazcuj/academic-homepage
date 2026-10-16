// Edit this file to add verified academic details. Do not include private information.
window.TREFOIL_CONTENT = {
  name: "TheTrefoil",
  affiliation: "",
  biography: "",
  links: [
    {label:"GitHub ↗",url:"https://github.com/nawazcuj"}
  ],
  publications: [
    // {title:"Verified paper title",authors:"Author names",venue:"Journal or preprint · Year",url:"https://doi.org/..."}
  ]
};
(() => {
  const c=window.TREFOIL_CONTENT;
  const list=document.getElementById("publication-list");
  if(list && c.publications.length){
    list.replaceChildren();
    for(const p of c.publications){
      const item=document.createElement("article");item.className="pub";
      const title=document.createElement("h3");title.textContent=p.title||"Untitled";item.append(title);
      const desc=document.createElement("p");desc.textContent=[p.authors,p.venue].filter(Boolean).join(" · ");item.append(desc);
      if(p.url && /^https?:\/\//i.test(p.url)){const a=document.createElement("a");a.className="text-link";a.target="_blank";a.rel="noopener noreferrer";a.href=p.url;a.textContent="Read publication ↗";item.append(a)}
      list.append(item);
    }
  }
  const links=document.getElementById("profile-links");
  if(links){links.replaceChildren();for(const l of c.links){if(!/^https?:\/\//i.test(l.url))continue;const a=document.createElement("a");a.href=l.url;a.target="_blank";a.rel="noopener noreferrer";a.className="text-link";a.textContent=l.label;links.append(a)}}
})();
