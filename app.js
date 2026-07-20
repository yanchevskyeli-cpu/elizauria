/* ============================================================
   ELIZAURIA — Shared national scripts
   ============================================================ */

/* ---- National config (edit me!) ---- */
window.ELZ = {
  dogName: "Auri",          // <-- change to your dog's real name
  basePopulation: 14200000, // ceremonial starting population
  founded: 2026
};

/* ---- Citizen registry (saved in this browser) ---- */
const Registry = {
  key: "elz_citizens",
  all(){ try{ return JSON.parse(localStorage.getItem(this.key)) || []; }catch(e){ return []; } },
  add(c){ const a=this.all(); a.unshift(c); localStorage.setItem(this.key, JSON.stringify(a.slice(0,500))); return a.length; },
  count(){ return this.all().length; }
};

/* ---- Small helpers ---- */
function toast(msg){
  let t=document.querySelector('.toast');
  if(!t){ t=document.createElement('div'); t.className='toast'; document.body.appendChild(t); }
  t.textContent=msg; t.classList.add('show');
  clearTimeout(t._h); t._h=setTimeout(()=>t.classList.remove('show'),2600);
}

/* ---- Web-Audio blips (no files needed) ---- */
let _ac;
function audioCtx(){ _ac = _ac || new (window.AudioContext||window.webkitAudioContext)(); return _ac; }
function beep(freq,dur,type,when,vol){
  const ac=audioCtx(), o=ac.createOscillator(), g=ac.createGain();
  o.type=type||'triangle'; o.frequency.value=freq;
  o.connect(g); g.connect(ac.destination);
  const t=ac.currentTime+(when||0);
  g.gain.setValueAtTime(0,t);
  g.gain.linearRampToValueAtTime(vol||0.2,t+0.02);
  g.gain.exponentialRampToValueAtTime(0.0001,t+(dur||0.25));
  o.start(t); o.stop(t+(dur||0.25)+0.02);
}
function playAnthem(btn){
  try{
    const notes=[392,440,494,523,587,523,494,440,392,330,392,494,587];
    notes.forEach((f,i)=>beep(f,0.3,'triangle',i*0.30,0.18));
    if(btn){ btn.classList.add('playing'); setTimeout(()=>btn.classList.remove('playing'),notes.length*300); }
  }catch(e){ toast('Hum it yourself: Rise, Elizauria!'); }
}
function bark(){ try{ beep(300,0.12,'sawtooth',0,0.25); beep(230,0.16,'sawtooth',0.12,0.22); }catch(e){} }
function thud(){ try{ beep(90,0.14,'square',0,0.32); beep(60,0.2,'sine',0.02,0.25);}catch(e){} }

/* ---- Confetti ---- */
function confetti(){
  let c=document.getElementById('confetti');
  if(!c){ c=document.createElement('canvas'); c.id='confetti'; document.body.appendChild(c); }
  const ctx=c.getContext('2d'); c.width=innerWidth; c.height=innerHeight;
  const colors=['#e0b94d','#f3d078','#1c3a8f','#ffffff','#12235c'];
  const P=Array.from({length:140},()=>({x:Math.random()*c.width,y:-20-Math.random()*c.height,r:4+Math.random()*6,
    c:colors[Math.floor(Math.random()*colors.length)],vy:2+Math.random()*4,vx:-2+Math.random()*4,a:Math.random()*6}));
  let frames=0;
  (function loop(){
    ctx.clearRect(0,0,c.width,c.height);
    P.forEach(p=>{ p.y+=p.vy; p.x+=p.vx; p.a+=0.1;
      ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.a);
      ctx.fillStyle=p.c; ctx.fillRect(-p.r/2,-p.r/2,p.r,p.r*0.6); ctx.restore(); });
    if(frames++<220) requestAnimationFrame(loop); else ctx.clearRect(0,0,c.width,c.height);
  })();
}

/* ---- Boot: nav, reveal, counters, clock, totop ---- */
document.addEventListener('DOMContentLoaded',()=>{
  // mobile nav
  const tog=document.querySelector('.nav-toggle'), nav=document.querySelector('nav.main');
  if(tog&&nav) tog.addEventListener('click',()=>nav.classList.toggle('open'));

  // reveal on scroll
  const io=new IntersectionObserver((es)=>es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target);} }),{threshold:.12});
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

  // animated counters
  document.querySelectorAll('[data-count]').forEach(el=>{
    const target=+el.getAttribute('data-count');
    const co=new IntersectionObserver((es)=>es.forEach(e=>{
      if(!e.isIntersecting) return; co.disconnect();
      let cur=0, step=Math.max(1,Math.floor(target/60));
      const t=setInterval(()=>{ cur+=step; if(cur>=target){cur=target;clearInterval(t);} el.textContent=cur.toLocaleString(); },20);
    }),{threshold:.4});
    co.observe(el);
  });

  // live population (base + real citizens, tiny drift)
  const pop=document.getElementById('livePop');
  if(pop){
    let n=window.ELZ.basePopulation+Registry.count()*137+318;
    const render=()=>pop.textContent=n.toLocaleString();
    render(); setInterval(()=>{ n+=Math.floor(Math.random()*6); render(); },1600);
  }

  // Elizapolis clock
  const clk=document.getElementById('clock');
  if(clk){ const tick=()=>clk.textContent=new Date().toLocaleTimeString(); tick(); setInterval(tick,1000); }

  // back to top
  const top=document.createElement('button'); top.className='totop'; top.innerHTML='&#8679;'; top.title='Back to top';
  document.body.appendChild(top); top.addEventListener('click',()=>scrollTo({top:0,behavior:'smooth'}));
  addEventListener('scroll',()=>top.classList.toggle('show',scrollY>500));

  // anthem buttons
  document.querySelectorAll('[data-anthem]').forEach(b=>b.addEventListener('click',()=>playAnthem(b)));
});
