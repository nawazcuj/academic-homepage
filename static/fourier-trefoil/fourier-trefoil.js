(() => {
  'use strict';
  const canvas = document.getElementById('fourier-trefoil-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const $ = id => document.getElementById(id);
  const playButton = $('ft-play'), resetButton = $('ft-reset'), speedInput = $('ft-speed'),
        speedOutput = $('ft-speed-value'), termsInput = $('ft-terms'), termsOutput = $('ft-terms-value'),
        guidesInput = $('ft-guides'), pathInput = $('ft-path');
  const TAU = 2 * Math.PI;
  const samples = 1024;
  const maxFreq = 5;
  const data = [];
  // A (2,3) torus knot: the conventional trefoil with three crossings.
  // Project a tilted 3D view into the complex plane for nontrivial epicycles.
  for (let j = 0; j < samples; j++) {
    const t = TAU * j / samples;
    const r = 2 + Math.cos(3*t);
    const x = r * Math.cos(2*t), y = r * Math.sin(2*t), z = Math.sin(3*t);
    const angle = .56; // tilt about x
    data.push({x, y:y*Math.cos(angle) - z*Math.sin(angle)});
  }
  // Discrete Fourier transform: coefficients for frequencies -5,...,5.
  const coefficients = [];
  for (let n = -maxFreq; n <= maxFreq; n++) {
    let re=0, im=0;
    for (let j=0;j<samples;j++) {
      const a = -TAU*n*j/samples, c=Math.cos(a),s=Math.sin(a);
      re += data[j].x*c - data[j].y*s;
      im += data[j].x*s + data[j].y*c;
    }
    re /= samples; im /= samples;
    coefficients.push({n,re,im,r:Math.hypot(re,im)});
  }
  coefficients.sort((a,b)=>b.r-a.r); // largest circles first
  let playing = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let phase=0, lastTime=0, cssWidth=1, cssHeight=1, scale=1, centerX=0,centerY=0;
  let traced=[];
  const full = [];
  function endpoint(t, count) {
    let x=0,y=0;
    for(let k=0;k<count;k++) {
      const c=coefficients[k], ang=c.n*t;
      x+=c.re*Math.cos(ang)-c.im*Math.sin(ang);
      y+=c.re*Math.sin(ang)+c.im*Math.cos(ang);
    }
    return {x,y};
  }
  function rebuildFull() {
    full.length=0;
    for(let i=0;i<=600;i++)full.push(endpoint(TAU*i/600,Number(termsInput.value)));
  }
  function resize() {
    const rect=canvas.getBoundingClientRect();
    cssWidth=Math.max(1,rect.width); cssHeight=Math.max(1,rect.height);
    const dpr=Math.min(window.devicePixelRatio||1,2);
    canvas.width=Math.round(cssWidth*dpr);canvas.height=Math.round(cssHeight*dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);
    scale=Math.min(cssWidth*.57/6.6,cssHeight*.72/6.6);
    centerX=cssWidth*.5;centerY=cssHeight*.51;
  }
  function point(p) {return {x:centerX+p.x*scale,y:centerY-p.y*scale};}
  function strokePoints(points,color,width,glow=0) {
    if(points.length<2)return;
    ctx.save();ctx.beginPath();
    const first=point(points[0]);ctx.moveTo(first.x,first.y);
    for(let i=1;i<points.length;i++){const p=point(points[i]);ctx.lineTo(p.x,p.y);}
    ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineJoin='round';ctx.lineCap='round';
    if(glow){ctx.shadowColor=color;ctx.shadowBlur=glow;}
    ctx.stroke();ctx.restore();
  }
  function draw(t) {
    ctx.clearRect(0,0,cssWidth,cssHeight);
    const count=Number(termsInput.value);
    if(pathInput.checked) strokePoints(full,'rgba(227,181,116,.22)',1.7);
    // Trace completed cycles plus current partial cycle, capped for efficiency.
    strokePoints(traced,'#f3c88b',2.8,11);
    let x=0,y=0;
    for(let k=0;k<count;k++) {
      const c=coefficients[k],a=c.n*t;
      const nx=x+c.re*Math.cos(a)-c.im*Math.sin(a);
      const ny=y+c.re*Math.sin(a)+c.im*Math.cos(a);
      if(guidesInput.checked && c.r>.005) {
        const center=point({x,y}),end=point({x:nx,y:ny});
        ctx.save();ctx.beginPath();ctx.arc(center.x,center.y,c.r*scale,0,TAU);
        ctx.strokeStyle='rgba(121,209,213,.32)';ctx.lineWidth=1.15;ctx.stroke();
        ctx.beginPath();ctx.moveTo(center.x,center.y);ctx.lineTo(end.x,end.y);
        ctx.strokeStyle=k===0?'rgba(255,220,154,.75)':'rgba(130,218,222,.8)';ctx.lineWidth=1.6;ctx.stroke();ctx.restore();
      }
      x=nx;y=ny;
    }
    const tip=point({x,y});
    ctx.save();ctx.beginPath();ctx.arc(tip.x,tip.y,4.2,0,TAU);
    ctx.fillStyle='#fff3d5';ctx.shadowColor='#f8d493';ctx.shadowBlur=16;ctx.fill();ctx.restore();
  }
  function restart(){phase=0;traced=[endpoint(0,Number(termsInput.value))];lastTime=0;draw(phase);}
  function setPlaying(value){playing=value;playButton.textContent=playing?'Pause':'Play';playButton.setAttribute('aria-pressed',String(playing));lastTime=0;}
  playButton.addEventListener('click',()=>setPlaying(!playing));
  resetButton.addEventListener('click',()=>{restart();setPlaying(true);});
  termsInput.addEventListener('input',()=>{termsOutput.value=termsInput.value;rebuildFull();restart();});
  speedInput.addEventListener('input',()=>{speedOutput.value=speedInput.value+'×';});
  pathInput.addEventListener('change',()=>draw(phase));
  guidesInput.addEventListener('change',()=>draw(phase));
  // ResizeObserver avoids reliance on window width changes alone.
  if('ResizeObserver' in window)new ResizeObserver(resize).observe(canvas);
  else window.addEventListener('resize',resize);
  resize();rebuildFull();restart();setPlaying(playing);
  function animate(timestamp) {
    const delta=lastTime?Math.min((timestamp-lastTime)/1000,.07):0;lastTime=timestamp;
    if(playing && !document.hidden) {
      const next=phase+delta*TAU/11*Number(speedInput.value);
      if(next>=TAU){phase=next%TAU;traced=[];}else{phase=next;}
      traced.push(endpoint(phase,Number(termsInput.value)));
      if(traced.length>1400)traced=traced.slice(-1400);
    }
    draw(phase);window.requestAnimationFrame(animate);
  }
  window.requestAnimationFrame(animate);
})();
