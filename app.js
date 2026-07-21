/* ============================================================
   ELIZAURIA — Shared national scripts
   ============================================================ */

/* ---- National config (edit me!) ---- */
window.ELZ = {
  dogName: "Boni",
  founded: 2026
};

/* ---- Accounts (login/session) ---- */
var Account={
  get(){ try{ return JSON.parse(localStorage.getItem('elz_account'))||null; }catch(e){ return null; } },
  set(a){ try{ localStorage.setItem('elz_account', JSON.stringify(a)); }catch(e){} },
  clear(){ try{ localStorage.removeItem('elz_account'); }catch(e){} },
  deviceId(){ var d; try{ d=localStorage.getItem('elz_device'); if(!d){ d='dev-'+Date.now()+Math.floor(Math.random()*99999); localStorage.setItem('elz_device',d); } }catch(e){ d='dev-anon'; } return d; },
  ownerId(){ var a=this.get(); return a? a.id : this.deviceId(); },
  name(){ var a=this.get(); return a? a.name : ''; }
};
var PRESIDENT_ACCOUNT={ id:'acct-president-eli', name:'Eli Yanchevsky', president:true };
var PRESIDENT_PASSWORD='Eli24032015!';

/* Saved citizen accounts on this device (so they can log back in) */
var Accounts={
  key:'elz_accounts',
  all(){ try{ return JSON.parse(localStorage.getItem(this.key))||[]; }catch(e){ return []; } },
  add(a){ var l=this.all(); l.push(a); try{ localStorage.setItem(this.key, JSON.stringify(l)); }catch(e){} },
  find(id){ return this.all().filter(function(a){ return a.id===id; })[0]; }
};

/* ---- Professions (Work → minigames) ---- */
var PROFESSIONS=[
  {id:'cashier',   icon:'🛒', name:'Cashier',      desc:'Scan the groceries, dodge the bombs!',      target:'🥫', bad:'💣'},
  {id:'financier', icon:'💼', name:'Financier',    desc:'Grab gold coins, avoid the market crashes!',target:'🪙', bad:'📉'},
  {id:'astronaut', icon:'🚀', name:'Astronaut',    desc:'Collect stars, avoid the asteroids!',       target:'⭐', bad:'☄️'},
  {id:'engineer',  icon:'🔧', name:'Engineer',     desc:'Tighten the gears, avoid the sparks!',      target:'⚙️', bad:'🔥'},
  {id:'teacher',   icon:'📚', name:'Teacher',      desc:'Solve as many problems as you can!',        math:true},
  {id:'pilot',     icon:'✈️', name:'Pilot',        desc:'Hit the runways, avoid the storms!',        target:'🛬', bad:'🌩️'},
  {id:'doctor',    icon:'🩺', name:'Doctor',       desc:'Give the medicine, avoid the germs!',       target:'💊', bad:'🦠'},
  {id:'chef',      icon:'👨‍🍳', name:'Chef',        desc:'Serve the dishes, dodge the flames!',       target:'🍔', bad:'🔥'},
  {id:'farmer',    icon:'🚜', name:'Farmer',       desc:'Harvest the crops, avoid the crows!',       target:'🌽', bad:'🐦'},
  {id:'firefighter',icon:'🧯',name:'Firefighter',  desc:'Put out fires, don\'t soak the cat!',        target:'🔥', bad:'🐱'}
];

/* ---- Bank (points per account) ---- */
var Bank={
  key(){ return 'elz_balance_'+Account.ownerId(); },
  get(){ try{ return Math.max(0, parseInt(localStorage.getItem(this.key()),10)||0); }catch(e){ return 0; } },
  add(n){ var v=this.get()+Math.round(+n||0); if(v<0)v=0; try{ localStorage.setItem(this.key(), v); }catch(e){} return v; }
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

/* Shared worldwide citizen registry (same list on every device) */
const CITIZENS_URL='https://textdb.dev/api/data/elizauria-citizens-9a4f7d21-6c3e-45b8-8f1a-2d7e9b0c4a55';
function loadSharedCitizens(){
  return fetch(CITIZENS_URL,{headers:{'accept':'application/json'},cache:'no-store'})
    .then(r=>r.text())
    .then(t=>{ try{ const d=JSON.parse(t); return Array.isArray(d)?d:[]; }catch(e){ return []; } })
    .catch(()=>[]);
}
function saveSharedCitizens(list){
  return fetch(CITIZENS_URL,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(list)});
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
    +'<div class="cz-role">'+escHtml(c.role||'Citizen')+'</div>'
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
  const [pub,shared]=await Promise.all([loadPublicCitizens(),loadSharedCitizens()]);
  if(countId){ const c=document.getElementById(countId); if(c) c.textContent=(pub.length+shared.length).toLocaleString(); }
  const pubHtml=pub.map((f,i)=>{
    const founder=i<3;
    const av=f.photo?'<img src="'+f.photo+'" alt="">':escHtml((f.name||'★')[0].toUpperCase());
    return '<div class="cz'+(founder?' founder':'')+'" data-pub="'+i+'"><div class="av">'+av+'</div><div class="nm">'+escHtml(f.name)+'</div><div class="rl">'+(founder?'👑 ':'')+escHtml(f.role||'Citizen')+'</div></div>';
  }).join('');
  const sharedHtml=shared.map((c,i)=>{
    const av=c.photo?'<img src="'+c.photo+'" alt="">':escHtml(c.initial||(c.name||'★')[0].toUpperCase());
    return '<div class="cz" data-sh="'+i+'"><div class="av">'+av+'</div><div class="nm">'+escHtml(c.name)+'</div><div class="rl">'+escHtml(c.role||'Citizen')+'</div></div>';
  }).join('');
  wall.innerHTML=pubHtml+sharedHtml;
  wall.querySelectorAll('.cz').forEach(el=>{
    el.addEventListener('click',()=>{
      if(el.dataset.pub!==undefined) openCitizen(pub[+el.dataset.pub], +el.dataset.pub<3);
      else openCitizen(shared[+el.dataset.sh], false);
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

  // real population: same shared registry on every device
  const pop=document.getElementById('livePop');
  if(pop) Promise.all([loadPublicCitizens(),loadSharedCitizens()]).then(([pub,shared])=>{
    pop.textContent=(pub.length+shared.length).toLocaleString();
  });

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
