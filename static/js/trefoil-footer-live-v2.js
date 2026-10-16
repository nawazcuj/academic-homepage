(()=>{'use strict';
function boot(){
 const strip=document.getElementById('tt-live-footer-strip');if(!strip)return;
 const time=strip.querySelector('[data-tt-live-time]');
 const math=strip.querySelector('[data-tt-live-math]');
 const another=strip.querySelector('[data-tt-next-math]');
 const expressions=["eⁱπ + 1 = 0", "a² + b² = c²", "sin²θ + cos²θ = 1", "cos(α + β) = cosα cosβ − sinα sinβ", "eⁱθ = cosθ + i sinθ", "eˣ = Σₙ₌₀∞ xⁿ/n!", "π = 4 Σₙ₌₀∞ (−1)ⁿ/(2n+1)", "∫₀¹ x² dx = ⅓", "∫₀∞ e⁻ˣ dx = 1", "d/dx(sin x) = cos x", "d/dx(eˣ) = eˣ", "∫₋∞∞ e⁻ˣ² dx = √π", "Γ(n+1) = n!", "Γ(½) = √π", "ln(ab) = ln a + ln b", "ln x = ∫₁ˣ dt/t", "limₓ→₀ sin x/x = 1", "(a+b)ⁿ = Σₖ₌₀ⁿ C(n,k)aⁿ⁻ᵏbᵏ", "cosh²x − sinh²x = 1", "arctan 1 = π/4", "ζ(2) = π²/6", "ζ(4) = π⁴/90", "φ = (1+√5)/2", "φ² = φ+1", "Fₙ₊₂ = Fₙ₊₁ + Fₙ", "Fₙ = (φⁿ − ψⁿ)/√5", "gcd(a,b) · lcm(a,b) = |ab|", "a ≡ b (mod n) ⇔ n ∣ (a−b)", "x = (−b ± √(b²−4ac))/(2a)", "det(AB) = det(A)det(B)", "(AB)ᵀ = BᵀAᵀ", "tr(AB) = tr(BA)", "A v = λv", "det(λI−A) = 0", "‖x‖² = ⟨x,x⟩", "(u·v)² ≤ (u·u)(v·v)", "dim(U+V) = dim U+dim V−dim(U∩V)", "rank(A)+nullity(A) = n", "V − E + F = 2", "χ(Kₙ) = n", "χ(G) ≤ Δ(G)+1", "χ′(G) ∈ {Δ(G),Δ(G)+1}", "Σᵥ deg(v) = 2|E|", "|E(Kₙ)| = n(n−1)/2", "|E(T)| = |V(T)|−1", "n! = n(n−1)!", "P(A∣B) = P(B∣A)P(A)/P(B)", "E[X] = Σₓ x P(X=x)", "Var(X) = E[X²] − E[X]²", "P(A∪B) = P(A)+P(B)−P(A∩B)", "P(X=k) = e⁻λ λᵏ/k!", "f(x) = (1/(σ√2π)) e⁻⁽ˣ⁻μ⁾²/(2σ²)", "σ² = E[(X−μ)²]", "H(X) = −Σₓ p(x) log₂ p(x)", "I(X;Y) = H(X)−H(X∣Y)", "S = kᴮ ln Ω", "∇·(∇×F) = 0", "∇×(∇f) = 0", "∇²f = ∂²f/∂x² + ∂²f/∂y² + ∂²f/∂z²", "∮∂S F·dr = ∬S (∇×F)·n dS", "∭V ∇·F dV = ∬∂V F·n dS", "∂u/∂t = κ∇²u", "∂²u/∂t² = c²∇²u", "∇²φ = 0", "∇²φ = −ρ/ε₀", "∇·E = ρ/ε₀", "∇·B = 0", "∇×E = −∂B/∂t", "∇×B = μ₀J + μ₀ε₀ ∂E/∂t", "F = ma", "p = mv", "W = F·d (constant F)", "K = ½mv²", "U = mgh (uniform g)", "F = −kx", "T = 2π√(m/k)", "F = Gm₁m₂/r²", "g = GM/r²", "vₑ = √(2GM/r)", "T² = (4π²/GM)a³", "L = r×p", "τ = r×F", "τ = dL/dt", "I = Σᵢ mᵢrᵢ²", "Kᵣₒₜ = ½Iω²", "v = rω", "a꜀ = v²/r", "E = mc²", "E² = (pc)²+(mc²)²", "γ = 1/√(1−v²/c²)", "Δt = γΔτ", "p = γmv", "E = hf", "λ = h/p", "Eₙ = −13.6 eV/n² (hydrogen)", "iℏ ∂ψ/∂t = Ĥψ", "ΔxΔp ≥ ℏ/2", "[x̂,p̂] = iℏ", "E = ℏω", "λ = c/f", "c = 1/√(μ₀ε₀)", "n = c/v", "1/f = 1/dₒ + 1/dᵢ (thin lens)", "V = IR", "P = IV", "Q = CV", "U꜀ = ½CV²", "Uₗ = ½LI²", "F = q(E + v×B)", "F = kₑq₁q₂/r²", "PV = nRT", "ΔU = Q − W (work by system)", "η = 1 − T꜀/Tₕ (Carnot)", "pVᵞ = constant (adiabatic ideal gas)", "⟨K⟩ = ³⁄₂ kᴮT (monatomic gas)", "dS = δQᵣₑᵥ/T", "v = fλ", "I = P/A (uniform intensity)", "β = 10 log₁₀(I/I₀)", "θ = λ/D (single-slit first minimum)", "d sinθ = mλ (grating)", "ρ = m/V", "P = F/A", "P + ½ρv² + ρgh = constant", "Fᵦ = ρfluid g Vdisplaced", "Q = Av (steady flow)", "N = N₀e⁻λᵗ", "t½ = ln 2/λ", "R = λN", "1 + 2 + ⋯ + n = n(n+1)/2", "Σₖ₌₁ⁿ k² = n(n+1)(2n+1)/6", "∂²f/∂x∂y = ∂²f/∂y∂x (smooth f)", "∮C dz/z = 2πi (C encloses 0)", "f(z) = (1/2πi) ∮ f(w)/(w−z) dw", "χ(S²) = 2", "dim H₁(S¹) = 1"];
 let remaining=[];
 let previous=-1;
 const clockFormat=new Intl.DateTimeFormat('en-IN',{timeZone:'Asia/Kolkata',hour:'2-digit',minute:'2-digit',hour12:true});
 function tick(){
   if(!time)return;
   const parts=clockFormat.formatToParts(new Date());
   const get=t=>parts.find(p=>p.type===t)?.value||'';
   const hour=get('hour'), minute=get('minute'), day=get('dayPeriod');
   time.textContent='';
   const h=document.createElement('span');h.textContent=hour;
   const colon=document.createElement('span');colon.className='tt-live-colon';colon.textContent=':';colon.setAttribute('aria-hidden','true');
   const m=document.createElement('span');m.textContent=minute;
   const suffix=document.createElement('span');suffix.className='tt-live-clock-suffix';suffix.textContent=' '+day.toUpperCase()+' IST';
   time.append(h,colon,m,suffix);
   time.setAttribute('datetime',new Date().toISOString());
   time.setAttribute('aria-label',hour+':'+minute+' '+day+' India Standard Time');
 }
 function refill(){remaining=expressions.map((_,i)=>i).filter(i=>i!==previous);for(let i=remaining.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[remaining[i],remaining[j]]=[remaining[j],remaining[i]];}}
 function showAnother(){if(!math)return;if(!remaining.length)refill();const next=remaining.pop();previous=next;math.textContent=expressions[next];math.title=expressions[next];}
 tick();window.setInterval(tick,1000);
 showAnother();window.setInterval(()=>{if(!document.hidden)showAnother();},12000);
 if(another)another.addEventListener('click',showAnother);
 const top=strip.querySelector('[data-tt-to-top]');
 if(top)top.addEventListener('click',()=>window.scrollTo({top:0,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'}));
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();