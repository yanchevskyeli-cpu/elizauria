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

/* ---- Shop catalog (stores + items, prices in Golden Stars ★) ---- */
var STORES=[
  {name:'Grocery Store', icon:'🛒', items:[
    {id:'apple',n:'Apple',e:'🍎',p:3},{id:'bread',n:'Bread',e:'🍞',p:5},{id:'milk',n:'Milk',e:'🥛',p:6},
    {id:'eggs',n:'Eggs',e:'🥚',p:10},{id:'cheese',n:'Cheese',e:'🧀',p:12},{id:'choc',n:'Chocolate',e:'🍫',p:8},
    {id:'coffee',n:'Coffee',e:'☕',p:15},{id:'melon',n:'Watermelon',e:'🍉',p:20}
  ]},
  {name:'Snack Bar', icon:'🍔', items:[
    {id:'fries',n:'Fries',e:'🍟',p:10},{id:'icecream',n:'Ice Cream',e:'🍦',p:15},{id:'taco',n:'Taco',e:'🌮',p:20},
    {id:'burger',n:'Burger',e:'🍔',p:25},{id:'pizza',n:'Pizza',e:'🍕',p:40},{id:'cake',n:'Cake',e:'🎂',p:55},
    {id:'sushi',n:'Sushi',e:'🍣',p:90},{id:'donut',n:'Donut',e:'🍩',p:12}
  ]},
  {name:'Toy Store', icon:'🧸', items:[
    {id:'ball',n:'Ball',e:'⚽',p:15},{id:'kite',n:'Kite',e:'🪁',p:25},{id:'puzzle',n:'Puzzle',e:'🧩',p:30},
    {id:'teddy',n:'Teddy Bear',e:'🧸',p:40},{id:'boardgame',n:'Board Game',e:'🎲',p:60},{id:'lego',n:'Building Blocks',e:'🧱',p:120},
    {id:'rccar',n:'RC Car',e:'🏎️',p:200}
  ]},
  {name:'Fashion Boutique', icon:'👕', items:[
    {id:'hat',n:'Hat',e:'🧢',p:60},{id:'tshirt',n:'T-Shirt',e:'👕',p:80},{id:'shades',n:'Sunglasses',e:'🕶️',p:120},
    {id:'backpack',n:'Backpack',e:'🎒',p:200},{id:'sneakers',n:'Sneakers',e:'👟',p:250},{id:'dress',n:'Dress',e:'👗',p:350},
    {id:'watch',n:'Watch',e:'⌚',p:900}
  ]},
  {name:'Pet Shop', icon:'🐾', items:[
    {id:'goldfish',n:'Goldfish',e:'🐠',p:30},{id:'hamster',n:'Hamster',e:'🐹',p:80},{id:'parrot',n:'Parrot',e:'🦜',p:500},
    {id:'cat',n:'Cat',e:'🐱',p:400},{id:'dog',n:'Dog',e:'🐕',p:600},{id:'pony',n:'Pony',e:'🐴',p:5000},
    {id:'horse',n:'Horse',e:'🐎',p:15000}
  ]},
  {name:'Electronics', icon:'📱', items:[
    {id:'earbuds',n:'Earbuds',e:'🎧',p:150},{id:'console',n:'Game Console',e:'🎮',p:800},{id:'smartwatch',n:'Smartwatch',e:'⌚',p:600},
    {id:'phone',n:'Smartphone',e:'📱',p:1200},{id:'camera',n:'Camera',e:'📷',p:1500},{id:'drone',n:'Drone',e:'🛸',p:1800},
    {id:'tv',n:'Big TV',e:'📺',p:2500},{id:'laptop',n:'Laptop',e:'💻',p:3000}
  ]},
  {name:'Car Dealership', icon:'🚗', items:[
    {id:'bike',n:'Bicycle',e:'🚲',p:500},{id:'scooter',n:'Scooter',e:'🛵',p:1200},{id:'jetski',n:'Jet Ski',e:'🌊',p:30000},
    {id:'moto',n:'Motorcycle',e:'🏍️',p:9000},{id:'car',n:'Car',e:'🚗',p:45000},{id:'truck',n:'Truck',e:'🚚',p:60000},
    {id:'boat',n:'Boat',e:'⛵',p:120000},{id:'sportscar',n:'Sports Car',e:'🏎️',p:250000}
  ]},
  {name:'Real Estate', icon:'🏠', items:[
    {id:'tent',n:'Tent',e:'⛺',p:300},{id:'apartment',n:'Apartment',e:'🏢',p:150000},{id:'house',n:'House',e:'🏠',p:500000},
    {id:'villa',n:'Beach Villa',e:'🏖️',p:3000000},{id:'mansion',n:'Mansion',e:'🏛️',p:2000000},{id:'castle',n:'Castle',e:'🏰',p:10000000},
    {id:'island',n:'Private Island',e:'🏝️',p:50000000}
  ]},
  {name:'Luxury & Jewels', icon:'💎', items:[
    {id:'ring',n:'Gold Ring',e:'💍',p:5000},{id:'rolex',n:'Luxury Watch',e:'⌚',p:90000},{id:'statue',n:'Golden Statue',e:'🗿',p:800000},
    {id:'crown',n:'Royal Crown',e:'👑',p:1000000},{id:'diamond',n:'Diamond',e:'💎',p:500000},{id:'yacht',n:'Mega Yacht',e:'🛥️',p:5000000},
    {id:'jet',n:'Private Jet',e:'✈️',p:20000000}
  ]},
  {name:'Elizauria Space Agency', icon:'🚀', items:[
    {id:'telescope',n:'Telescope',e:'🔭',p:2000},{id:'spacesuit',n:'Space Suit',e:'🧑‍🚀',p:80000},{id:'satellite',n:'Satellite',e:'🛰️',p:5000000},
    {id:'rocket',n:'Rocket',e:'🚀',p:100000000},{id:'moon',n:'Plot on the Moon',e:'🌙',p:250000000},{id:'star',n:'Your Own Star',e:'⭐',p:999999999}
  ]}
];

/* ---- Bank (points per account) ---- */
var Bank={
  key(){ return 'elz_balance_'+Account.ownerId(); },
  get(){ try{ return Math.max(0, parseInt(localStorage.getItem(this.key()),10)||0); }catch(e){ return 0; } },
  add(n){ var v=this.get()+Math.round(+n||0); if(v<0)v=0; try{ localStorage.setItem(this.key(), v); }catch(e){} return v; },
  spend(n){ n=Math.round(+n||0); if(this.get()<n) return false; try{ localStorage.setItem(this.key(), this.get()-n); }catch(e){} return true; }
};

/* ---- Inventory (things you bought, per account) ---- */
var Inventory={
  key(){ return 'elz_inv_'+Account.ownerId(); },
  all(){ try{ return JSON.parse(localStorage.getItem(this.key()))||{}; }catch(e){ return {}; } },
  count(id){ return this.all()[id]||0; },
  addItem(id){ var inv=this.all(); inv[id]=(inv[id]||0)+1; try{ localStorage.setItem(this.key(), JSON.stringify(inv)); }catch(e){} return inv[id]; },
  total(){ var inv=this.all(),t=0; for(var k in inv) t+=inv[k]; return t; }
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

  // reveal on scroll (threshold 0 so very tall sections still reveal on phones)
  var revEls=document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target);} }); },{threshold:0, rootMargin:'0px 0px -40px 0px'});
    revEls.forEach(function(el){ io.observe(el); });
    // safety net: never let content stay hidden
    setTimeout(function(){ revEls.forEach(function(el){ el.classList.add('in'); }); }, 4000);
  } else {
    revEls.forEach(function(el){ el.classList.add('in'); });
  }

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
