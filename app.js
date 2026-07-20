/* ============================================================
   ELIZAURIA — Shared national scripts
   ============================================================ */

/* ---- National config (edit me!) ---- */
window.ELZ = {
  dogName: "Boni",
  founded: 2026
};

/* ---- Citizen registry (saved in this browser) ---- */
const Registry = {
  key: "elz_citizens",
  all(){ try{ return JSON.parse(localStorage.getItem(this.key)) || []; }catch(e){ return []; } },
  add(c){ const a=this.all(); a.unshift(c); localStorage.setItem(this.key, JSON.stringify(a)); return a.length; },
  remove(pred){ const a=this.all().filter(c=>!pred(c)); localStorage.setItem(this.key, JSON.stringify(a)); },
  count(){ return this.all().length; }
};

/* ---- Public citizen database: citizens.json in the GitHub repo ----
   Everyone who visits the site sees the same wall. New citizens apply
   via a GitHub issue; approved ones are added to citizens.json. */
const FOUNDERS=[
  {name:"Eli Yanchevsky", role:"President", photo:"president.jpg"},
  {name:"Netanel Yanchevsky", role:"Prime Minister", photo:"minister.jpg"},
  {name:"Boni", role:"National Dog · Guardian of the Realm", photo:"dog.jpg"}
];
let PUBLIC_CITIZENS=null;
async function loadPublicCitizens(){
  if(PUBLIC_CITIZENS) return PUBLIC_CITIZENS;
  try{
    const r=await fetch('citizens.json',{cache:'no-store'});
    const data=await r.json();
    PUBLIC_CITIZENS=Array.isArray(data)&&data.length?data:FOUNDERS;
  }catch(e){ PUBLIC_CITIZENS=FOUNDERS; } // file:// fallback
  return PUBLIC_CITIZENS;
}
function escHtml(s){ return String(s).replace(/</g,"&lt;"); }

/* Expandable citizen detail (tap a card) */
function openCitizen(c,founder){
  let m=document.getElementById('czModal');
  if(m) m.remove();
  m=document.createElement('div'); m.id='czModal'; m.className='cz-modal';
  const av=c.photo?'<img src="'+c.photo+'" alt="">':'<span>'+escHtml((c.name||'★')[0].toUpperCase())+'</span>';
  const since=c.since||(c.at?new Date(c.at).toLocaleDateString():'2026');
  m.innerHTML='<div class="cz-sheet">'
    +'<button class="cz-close" aria-label="Close">✕</button>'
    +'<div class="cz-big-av">'+av+'</div>'
    +'<h3>'+(founder?'👑 ':'')+escHtml(c.name)+'</h3>'
    +'<div class="cz-role">'+escHtml(c.role||'Citizen')+(founder?'':' · pending approval')+'</div>'
    +'<div class="cz-facts">'
    +'<div><b>Origin</b>'+escHtml(c.origin||'Earth')+'</div>'
    +'<div><b>Citizen since</b>'+escHtml(since)+'</div>'
    +'<div><b>Status</b>'+(founder?'Founding Citizen':'Early Citizen ★')+'</div>'
    +'</div>'
    +(c.bio?'<p class="cz-bio">'+escHtml(c.bio)+'</p>':'')
    +'</div>';
  m.addEventListener('click',e=>{ if(e.target===m||e.target.classList.contains('cz-close')) m.remove(); });
  document.body.appendChild(m);
}

async function renderCitizenWall(wallId,countId){
  const wall=document.getElementById(wallId); if(!wall) return;
  const pub=await loadPublicCitizens();
  const local=Registry.all();
  if(countId){ const c=document.getElementById(countId); if(c) c.textContent=(pub.length+local.length).toLocaleString(); }
  const pubHtml=pub.map((f,i)=>{
    const founder=i<3;
    const av=f.photo?'<img src="'+f.photo+'" alt="">':escHtml((f.name||'★')[0].toUpperCase());
    return '<div class="cz'+(founder?' founder':'')+'" data-pub="'+i+'"><div class="av">'+av+'</div><div class="nm">'+escHtml(f.name)+'</div><div class="rl">'+(founder?'👑 ':'')+escHtml(f.role||'Citizen')+'</div></div>';
  }).join('');
  const localHtml=local.map((c,i)=>{
    const av=c.photo?'<img src="'+c.photo+'" alt="">':escHtml(c.initial||'★');
    return '<div class="cz" data-loc="'+i+'"><div class="av">'+av+'</div><div class="nm">'+escHtml(c.name)+'</div><div class="rl">'+escHtml(c.role)+' · pending</div></div>';
  }).join('');
  wall.innerHTML=pubHtml+localHtml;
  wall.querySelectorAll('.cz').forEach(el=>{
    el.addEventListener('click',()=>{
      if(el.dataset.pub!==undefined) openCitizen(pub[+el.dataset.pub], +el.dataset.pub<3);
      else openCitizen(local[+el.dataset.loc], false);
    });
  });
}

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

  // real population: public database + citizens registered on this device
  const pop=document.getElementById('livePop');
  if(pop) loadPublicCitizens().then(pub=>{ pop.textContent=(pub.length+Registry.count()).toLocaleString(); });

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
