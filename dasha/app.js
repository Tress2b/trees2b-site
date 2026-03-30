/* ═══════════════════════════════════════════════════
   CONFIG
═══════════════════════════════════════════════════ */
const NAME = "Dasha";

// Birthday window: Apr 3 00:00 → Apr 4 00:00 (1 full day)
const BIRTHDAY      = new Date("2026-04-03T00:00:00");
const BIRTHDAY_END  = new Date("2026-04-04T00:00:00");
const BIRTHDAY_NEXT = new Date("2027-04-03T00:00:00");

// Drake – Ratchet Happy Birthday
const BDAY_SONG_FILE = "music/mike.mp3";

/* ═══════════════════════════════════════════════════
   APPLY NAME EVERYWHERE
═══════════════════════════════════════════════════ */
document.querySelectorAll(
  "#hero-name-text, #hero-name-grad, #celeb-name"
).forEach(el => (el.textContent = NAME));
document.getElementById("lock-name").textContent = `for ${NAME} ✦`;

/* ═══════════════════════════════════════════════════
   CURSOR
═══════════════════════════════════════════════════ */
const curEl  = document.getElementById("cur");
const ringEl = document.getElementById("cur-ring");
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener("mousemove", e => {
  mx = e.clientX; my = e.clientY;
  curEl.style.left = mx + "px";
  curEl.style.top  = my + "px";
});
document.addEventListener("mousedown", () => curEl.style.transform = "translate(-50%,-50%) scale(1.8)");
document.addEventListener("mouseup",   () => curEl.style.transform = "translate(-50%,-50%) scale(1)");

(function lerpRing() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ringEl.style.left = rx + "px";
  ringEl.style.top  = ry + "px";
  requestAnimationFrame(lerpRing);
})();

/* ═══════════════════════════════════════════════════
   AURORA CANVAS
═══════════════════════════════════════════════════ */
const aCanvas = document.getElementById("aurora");
const aCtx    = aCanvas.getContext("2d");
let AW, AH, aOrbs = [];
let amx = innerWidth / 2, amy = innerHeight / 2;

function initAurora() {
  AW = aCanvas.width  = innerWidth;
  AH = aCanvas.height = innerHeight;
  aOrbs = [
    { x: AW*.2, y: AH*.5, tx: AW*.2, ty: AH*.5, r: AW*.4,  h: 22,  a: 0.07 },
    { x: AW*.8, y: AH*.4, tx: AW*.8, ty: AH*.4, r: AW*.35, h: 340, a: 0.05 },
    { x: AW*.5, y: AH*.8, tx: AW*.5, ty: AH*.8, r: AW*.3,  h: 150, a: 0.04 },
  ];
}
document.addEventListener("mousemove", e => { amx = e.clientX; amy = e.clientY; });
window.addEventListener("resize", initAurora);
initAurora();

(function drawAurora() {
  aCtx.clearRect(0, 0, AW, AH);
  aOrbs[0].tx = amx * 0.55 + AW * 0.05; aOrbs[0].ty = amy * 0.5 + AH * 0.1;
  aOrbs[1].tx = AW - amx * 0.4;          aOrbs[1].ty = AH * 0.3 + amy * 0.2;
  aOrbs.forEach(o => {
    o.x += (o.tx - o.x) * 0.02;
    o.y += (o.ty - o.y) * 0.02;
    const g = aCtx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r);
    g.addColorStop(0, `hsla(${o.h},55%,45%,${o.a})`);
    g.addColorStop(1, `hsla(${o.h},55%,45%,0)`);
    aCtx.fillStyle = g;
    aCtx.fillRect(0, 0, AW, AH);
  });
  requestAnimationFrame(drawAurora);
})();

/* ═══════════════════════════════════════════════════
   LOCK CLOCK
═══════════════════════════════════════════════════ */
function updateClock() {
  const n = new Date();
  document.getElementById("lock-time").textContent =
    `${n.getHours() % 12 || 12}:${String(n.getMinutes()).padStart(2,"0")}`;
  document.getElementById("lock-date").textContent =
    n.toLocaleDateString("en-US", { weekday:"long", month:"long", day:"numeric" });
}
updateClock();
setInterval(updateClock, 10000);

/* ═══════════════════════════════════════════════════
   LOCK SLIDESHOW
═══════════════════════════════════════════════════ */
const lockSlides   = document.querySelectorAll(".ls");
const lockDotsWrap = document.getElementById("lock-dots");
let lockIdx = 0;

lockSlides.forEach((_, i) => {
  const d = document.createElement("div");
  d.className = "ldot" + (i === 0 ? " on" : "");
  lockDotsWrap.appendChild(d);
});

function goLockSlide(n) {
  lockSlides[lockIdx].classList.remove("on");
  lockDotsWrap.children[lockIdx].classList.remove("on");
  lockIdx = (n + lockSlides.length) % lockSlides.length;
  lockSlides[lockIdx].classList.add("on");
  lockDotsWrap.children[lockIdx].classList.add("on");
}
setInterval(() => goLockSlide(lockIdx + 1), 3000);

/* ═══════════════════════════════════════════════════
   TOP SLIDER
═══════════════════════════════════════════════════ */
const tsSlides   = document.querySelectorAll(".ts");
const tsDotsWrap = document.getElementById("ts-dots");
let tsIdx  = 0;
let tsAuto = null;

tsSlides.forEach((_, i) => {
  const d = document.createElement("div");
  d.className = "tsdot" + (i === 0 ? " on" : "");
  d.addEventListener("click", () => { clearInterval(tsAuto); goTs(i); startTsAuto(); });
  tsDotsWrap.appendChild(d);
});

function goTs(n) {
  tsSlides[tsIdx].classList.remove("on"); tsDotsWrap.children[tsIdx].classList.remove("on");
  tsIdx = (n + tsSlides.length) % tsSlides.length;
  tsSlides[tsIdx].classList.add("on"); tsDotsWrap.children[tsIdx].classList.add("on");
}
function startTsAuto() { tsAuto = setInterval(() => goTs(tsIdx + 1), 3500); }
document.getElementById("ts-prev").addEventListener("click", () => { clearInterval(tsAuto); goTs(tsIdx-1); startTsAuto(); });
document.getElementById("ts-next").addEventListener("click", () => { clearInterval(tsAuto); goTs(tsIdx+1); startTsAuto(); });
startTsAuto();

/* ═══════════════════════════════════════════════════
   LOCK / UNLOCK
═══════════════════════════════════════════════════ */
const lockEl  = document.getElementById("lock");
const backBtn = document.getElementById("back-btn");
let locked = true;
let touchStartY = 0;

lockEl.addEventListener("touchstart", e => { touchStartY = e.touches[0].clientY; }, { passive: true });
lockEl.addEventListener("touchend",   e => { if (touchStartY - e.changedTouches[0].clientY > 50) unlock(); }, { passive: true });
document.getElementById("swipe-hint").addEventListener("click", unlock);
document.getElementById("back-btn").addEventListener("click", goLock);

function unlock() {
  if (!locked) return;
  locked = false;
  lockEl.classList.add("away");
  backBtn.classList.add("show");
}
function goLock() {
  if (locked) return;
  locked = true;
  lockEl.classList.remove("away");
  backBtn.classList.remove("show");
  document.getElementById("main").scrollTop = 0;
}

/* ═══════════════════════════════════════════════════
   PETALS
═══════════════════════════════════════════════════ */
const petalEl   = document.getElementById("petals");
const petalCols = ["#d9928a","#c8784a","#f0c8a0","#7a9e8e","#f2e8d9"];

function spawnPetal() {
  if (petalEl.children.length >= 50) petalEl.removeChild(petalEl.firstChild);
  const el  = document.createElement("div");
  const sz  = 5 + Math.random() * 11;
  const dur = 11 + Math.random() * 18;
  const del = Math.random() * -30;
  el.className = "petal";
  el.style.cssText = `left:${Math.random()*100}%;width:${sz}px;height:${sz*.55}px;`
    + `background:${petalCols[Math.floor(Math.random()*petalCols.length)]};`
    + `opacity:${.25+Math.random()*.5};animation-duration:${dur}s;animation-delay:${del}s;`;
  petalEl.appendChild(el);
}
for (let i = 0; i < 28; i++) spawnPetal();
setInterval(spawnPetal, 2800);

/* ═══════════════════════════════════════════════════
   UTILITY — format seconds as M:SS
═══════════════════════════════════════════════════ */
function fmtTime(s) {
  if (!s || isNaN(s) || s < 0) return "0:00";
  return `${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,"0")}`;
}

/* ═══════════════════════════════════════════════════
   MUSIC PLAYER (lo-fi tracks)
═══════════════════════════════════════════════════ */
const TRACKS = [
  { title:"Hometown Glory",   artist:"Adele",    emoji:"🎹", url:"music/Hometown Glory.mp3" },
  { title:"Water Under the Bridge",   artist:"Adele",    emoji:"🎸", url:"music/Water_Under_the_Bridge.mp3" },
  { title:"When We Were Young",    artist:"Adele",  emoji:"🎷", url:"music/When_We_Were_Young.mp3" },
  { title:"Someone Like You", artist:"Adele",  emoji:"✨", url:"music/Someone_Like_You.mp3" },
  { title:"Птичка",           artist:"HammAli",  emoji:"🕊️", url:"music/Птичка.mp3" }
];

// Check browser memory for saved track, default to 0
let trackIdx  = parseInt(localStorage.getItem("dashaSavedTrack")) || 0;
let audioEl   = null;
let isPlaying = false;

function setPlayIcon(on) {
  const icon = on ? "&#9646;&#9646;" : "&#9654;";
  document.getElementById("btn-play").innerHTML = icon;
  const fsPlay = document.getElementById("fs-play");
  if (fsPlay) fsPlay.innerHTML = icon;
}

function loadTrack(idx, autoplay) {
  trackIdx = (idx + TRACKS.length) % TRACKS.length;
  
  localStorage.setItem("dashaSavedTrack", trackIdx);
  
  const t  = TRACKS[trackIdx];
  document.getElementById("pl-title").textContent  = t.title;
  document.getElementById("pl-artist").textContent = t.artist;
  document.getElementById("pl-art").textContent    = t.emoji;
  document.getElementById("pl-art").classList.remove("spin");
  document.getElementById("player").classList.remove("bday-glow");
  document.getElementById("pl-bar").style.width    = "0%";
  document.getElementById("pl-cur").textContent    = "0:00";
  document.getElementById("pl-dur").textContent    = "0:00";

  // If fullscreen player is open, update it immediately
  const fsEl = document.getElementById('player-fs');
  if (fsEl && fsEl.classList.contains('open')) {
    const fsDisc   = document.getElementById('fs-disc');
    const fsTitle  = document.getElementById('fs-title');
    const fsArtist = document.getElementById('fs-artist');
    const fsBar    = document.getElementById('fs-bar');
    const fsCur    = document.getElementById('fs-cur');
    const fsDur    = document.getElementById('fs-dur');
    if (fsDisc)   fsDisc.textContent   = t.emoji;
    if (fsTitle)  fsTitle.textContent  = t.title;
    if (fsArtist) fsArtist.textContent = t.artist;
    if (fsDisc)   fsDisc.classList.remove('spin');
    if (fsBar)    fsBar.style.width    = '0%';
    if (fsCur)    fsCur.textContent    = '0:00';
    if (fsDur)    fsDur.textContent    = '0:00';
  }

  if (audioEl) { audioEl.pause(); audioEl.src = ""; }
  audioEl = new Audio(t.url);
  audioEl.volume = parseFloat(document.getElementById("vol-slider").value);
  audioEl.addEventListener("loadedmetadata", () => {
    const dur = fmtTime(audioEl.duration);
    document.getElementById("pl-dur").textContent = dur;
    const fsDur = document.getElementById('fs-dur');
    if (fsDur) fsDur.textContent = dur;
  });
  audioEl.addEventListener("timeupdate", () => {
    if (!audioEl.duration) return;
    const pct = (audioEl.currentTime / audioEl.duration * 100) + "%";
    const cur  = fmtTime(audioEl.currentTime);
    document.getElementById("pl-bar").style.width = pct;
    document.getElementById("pl-cur").textContent = cur;
    const fsBar = document.getElementById('fs-bar');
    const fsCur = document.getElementById('fs-cur');
    if (fsBar) fsBar.style.width  = pct;
    if (fsCur) fsCur.textContent  = cur;
  });
  audioEl.addEventListener("ended", () => loadTrack(trackIdx + 1, true));

  if (autoplay) {
    audioEl.play().then(() => { isPlaying = true; setPlayIcon(true); }).catch(() => { isPlaying = false; setPlayIcon(false); });
  } else {
    isPlaying = false;
    setPlayIcon(false);
  }
}

document.getElementById("btn-play").addEventListener("click", () => {
  // If celebration is active, control the birthday track
  if (celebOn && bdayAudioEl) {
    if (!bdayAudioEl.paused) {
      bdayAudioEl.pause();
      setPlayIcon(false);
    } else {
      bdayAudioEl.play();
      setPlayIcon(true);
    }
    return;
  }
  
  // Otherwise, control the normal playlist
  if (!audioEl) { loadTrack(0, true); return; }
  if (isPlaying) {
    audioEl.pause();
    isPlaying = false;
    setPlayIcon(false);
  } else {
    audioEl.play().then(() => { isPlaying = true; setPlayIcon(true); }).catch(() => {});
  }
});

document.getElementById("btn-prev").addEventListener("click", () => loadTrack(trackIdx - 1, isPlaying));
document.getElementById("btn-next").addEventListener("click", () => loadTrack(trackIdx + 1, isPlaying));

document.getElementById("vol-slider").addEventListener("input", e => {
  const vol = parseFloat(e.target.value);
  if (audioEl) audioEl.volume = vol;
  if (bdayAudioEl) bdayAudioEl.volume = vol;
});

document.getElementById("pl-progress").addEventListener("click", e => {
  if (!audioEl || !audioEl.duration) return;
  const r = e.currentTarget.getBoundingClientRect();
  audioEl.currentTime = ((e.clientX - r.left) / r.width) * audioEl.duration;
});

loadTrack(0, false);

/* ═══════════════════════════════════════════════════
   BIRTHDAY SONG
   FIX: Instead of hidden -9999px IFrame API (blocked by
   browsers), we inject a real tiny iframe with autoplay=1
   in the src. The browser allows autoplay because:
   1. The user already tapped the lock screen (gesture ✓)
   2. The iframe is in-viewport at near-zero opacity
═══════════════════════════════════════════════════ */
let bdayAudioEl = null;

function playBdaySong() {
  // Stop background music
  if (audioEl && !audioEl.paused) { audioEl.pause(); isPlaying = false; }

  // Clean up any old iframe if it exists
  const old = document.getElementById("yt-frame");
  if (old) old.remove();

  // Initialize and play local birthday song
  if (!bdayAudioEl) {
    bdayAudioEl = new Audio(BDAY_SONG_FILE);
  }
  bdayAudioEl.volume = parseFloat(document.getElementById("vol-slider").value);
  bdayAudioEl.currentTime = 0;
  bdayAudioEl.play().then(() => setPlayIcon(true)).catch(() => setPlayIcon(false));

  // Update player widget UI to show bday song
  document.getElementById("pl-art").textContent    = "🎂";
  document.getElementById("pl-art").classList.add("spin");
  document.getElementById("pl-title").textContent  = "Happy Birthday";
  document.getElementById("pl-artist").textContent = "Mike Tyson";
  document.getElementById("player").classList.add("bday-glow");
  document.getElementById("pl-bar").style.width    = "100%";
  document.getElementById("pl-cur").textContent    = "0:00";
  document.getElementById("pl-dur").textContent    = "~3:00";
  setPlayIcon(true);
}

function stopBdaySong() {
  if (bdayAudioEl) {
    bdayAudioEl.pause();
    bdayAudioEl.currentTime = 0;
  }
}

/* ═══════════════════════════════════════════════════
   SPARKLE BURST
═══════════════════════════════════════════════════ */
const SPARK_COLS = ['#f5d49a','#d98f8a','#c8784a','#7a9e8e','#f2e8d9','#ffffff'];
function spawnSparkles(blockEl) {
  const r  = blockEl.getBoundingClientRect();
  const cx = r.left + r.width  / 2;
  const cy = r.top  + r.height / 2;
  for (let i = 0; i < 12; i++) {
    const el  = document.createElement('div');
    el.className = 'sparkle';
    const sz  = 3 + Math.random() * 5;
    const ang = (Math.PI * 2 / 12) * i + Math.random() * 0.4;
    const d   = 28 + Math.random() * 36;
    el.style.cssText = [
      `width:${sz}px`, `height:${sz}px`,
      `left:${cx - sz/2}px`, `top:${cy - sz/2}px`,
      `background:${SPARK_COLS[i % SPARK_COLS.length]}`,
      `--dx:${Math.cos(ang)*d}px`,
      `--dy:${Math.sin(ang)*d}px`,
      `animation-duration:${0.45 + Math.random()*0.3}s`,
      `animation-delay:${Math.random()*0.06}s`,
    ].join(';');
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 900);
  }
}

/* ═══════════════════════════════════════════════════
   COUNTDOWN  — interactive with tooltips + number roll
═══════════════════════════════════════════════════ */
const UNITS = ['d','h','m','s'];

// Fun label conversions
const FUN_LABEL = {
  d: v => `😴 ${v} sleep${v!==1?'s':''}`,
  h: v => `☕ ${v} coffee${v!==1?'s':''}`,
  m: v => `💓 ${Math.round(v*72).toLocaleString()} heartbeats`,
  s: v => `👁 ${Math.round(v*0.4)} blinks`,
};

// Cache elements
const cdEls = {};
UNITS.forEach(k => {
  cdEls[k] = {
    num:   document.getElementById(`cd-${k}`),
    block: document.getElementById(`cdb-${k}`),
    tip:   document.getElementById(`tip-${k}`),
    raw:   0,
  };
});

// Hover: sparkles + heartbeat boost
let hbHover = false;
UNITS.forEach(k => {
  const b = cdEls[k].block;
  if (!b) return;
  b.addEventListener('mouseenter', () => { hbHover = true;  spawnSparkles(b); });
  b.addEventListener('mouseleave', () => { hbHover = false; });
  b.addEventListener('touchstart', () => spawnSparkles(b), { passive: true });
});

// Roll number + update tooltip
const prevVals = {};
function setUnit(k, raw) {
  const str = String(raw).padStart(2, '0');
  if (prevVals[k] === str) return;
  prevVals[k] = str;

  const el = cdEls[k].num;
  cdEls[k].raw = raw;

  // Update tooltip text
  if (cdEls[k].tip) cdEls[k].tip.textContent = FUN_LABEL[k](raw);

  // Roll animation
  el.classList.remove('roll-out','roll-in');
  void el.offsetWidth;
  el.classList.add('roll-out');
  setTimeout(() => {
    el.textContent = str;
    el.classList.remove('roll-out');
    void el.offsetWidth;
    el.classList.add('roll-in');
    setTimeout(() => el.classList.remove('roll-in'), 250);
  }, 180);
}

/* ═══════════════════════════════════════════════════
   HEARTBEAT CANVAS
═══════════════════════════════════════════════════ */
const hbCanvas = document.getElementById('heartbeat');
const hbCtx    = hbCanvas.getContext('2d');
const EKG = [0,0,0,0.04,-0.04,0.08,-0.12,0,0,0,0.18,-0.28,1.0,-0.55,0.1,0,0,0.22,0.28,0.08,0,0,0,0,0,0,0,0,0];
const EKG_LEN = EKG.length;
let hbOff = 0, hbBaseSpd = 1.0, hbCol = '#7a9e8e';

function resizeHb() {
  const dpr = devicePixelRatio || 1;
  hbCanvas.width  = hbCanvas.offsetWidth  * dpr;
  hbCanvas.height = hbCanvas.offsetHeight * dpr;
  hbCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
resizeHb();
window.addEventListener('resize', resizeHb);

(function drawHb() {
  const W = hbCanvas.offsetWidth, H = hbCanvas.offsetHeight;
  const mid = H/2, amp = H*0.4, step = W/26;
  const total = EKG_LEN * step;
  const spd = hbBaseSpd * (hbHover ? 2.8 : 1);
  const col = hbHover ? 'rgba(200,120,74,0.95)' : hbCol;

  hbCtx.clearRect(0, 0, W, H);

  // base line
  hbCtx.beginPath();
  hbCtx.strokeStyle = 'rgba(242,232,217,0.05)';
  hbCtx.lineWidth = 1;
  hbCtx.moveTo(0, mid); hbCtx.lineTo(W, mid);
  hbCtx.stroke();

  // EKG
  hbCtx.beginPath();
  hbCtx.strokeStyle = col;
  hbCtx.lineWidth = hbHover ? 2.2 : 1.6;
  hbCtx.lineJoin = 'round'; hbCtx.lineCap = 'round';
  let first = true;
  const off = hbOff % total;
  for (let rep = -1; rep <= 2; rep++) {
    for (let i = 0; i < EKG_LEN; i++) {
      const x = rep*total - off + i*step;
      const y = mid - EKG[i]*amp;
      first ? hbCtx.moveTo(x,y) : hbCtx.lineTo(x,y);
      first = false;
    }
  }
  hbCtx.stroke();

  // lead dot
  const lx = W*0.75, phase = Math.floor((hbOff/step)%EKG_LEN);
  const ly = mid - EKG[phase]*amp;
  const dotR = hbHover ? 8 : 5;
  const grd = hbCtx.createRadialGradient(lx,ly,0,lx,ly,dotR+2);
  grd.addColorStop(0, col); grd.addColorStop(1,'transparent');
  hbCtx.beginPath(); hbCtx.fillStyle = grd;
  hbCtx.arc(lx, ly, dotR, 0, Math.PI*2); hbCtx.fill();

  hbOff += spd;
  requestAnimationFrame(drawHb);
})();

/* ═══════════════════════════════════════════════════
   TENSION + TICK
═══════════════════════════════════════════════════ */
let cdTimer = null;

function applyTension(diff) {
  const hrs = diff / 3600000, secs = diff / 1000;
  UNITS.forEach(k => {
    const b = cdEls[k].block;
    if (!b) return;
    if (hrs < 24) { b.classList.add('warm');   b.classList.remove('urgent','pulse'); hbCol = 'rgba(245,212,154,.85)'; hbBaseSpd = 1.7; }
    if (hrs < 1)  { b.classList.add('urgent'); b.classList.remove('warm','pulse');   hbCol = 'rgba(217,143,138,.9)';  hbBaseSpd = 2.8;
      aOrbs.forEach(o => o.a = Math.min(o.a+0.003, 0.17)); }
    if (secs <= 10 && secs > 0) { b.classList.add('pulse'); hbCol = 'rgba(200,120,74,1)';
      hbBaseSpd = 3.0 + (10-secs)*0.4; aOrbs.forEach(o => o.a = 0.2); }
  });
}

function tick() {
  const now  = Date.now();

  // ── STATE 3: past the birthday window → count to next year ──
  if (now >= BIRTHDAY_END.getTime()) {
    const diff = BIRTHDAY_NEXT - now;
    if (diff <= 0) { clearInterval(cdTimer); return; }
    const vals = {
      d: Math.floor(diff/86400000),
      h: Math.floor((diff%86400000)/3600000),
      m: Math.floor((diff%3600000)/60000),
      s: Math.floor((diff%60000)/1000),
    };
    Object.entries(vals).forEach(([k,v]) => {
      if (prevVals[k] !== String(v).padStart(2,'0')) setUnit(k,v);
    });
    return;
  }

  // ── STATE 2: inside birthday window → show celeb, keep it up ──
  if (now >= BIRTHDAY.getTime()) {
    clearInterval(cdTimer);
    UNITS.forEach(k => setUnit(k, 0));
    // Hide close button — she can't dismiss it during the window
    const closeBtn = document.getElementById('btn-close-celeb');
    if (closeBtn) closeBtn.style.display = 'none';
    setTimeout(triggerCeleb, 400);
    return;
  }

  // ── STATE 1: counting down to birthday ──
  const diff = BIRTHDAY - now;
  const vals = {
    d: Math.floor(diff/86400000),
    h: Math.floor((diff%86400000)/3600000),
    m: Math.floor((diff%3600000)/60000),
    s: Math.floor((diff%60000)/1000),
  };
  let changed = false;
  Object.entries(vals).forEach(([k,v]) => {
    if (prevVals[k] !== String(v).padStart(2,'0')) { setUnit(k,v); changed = true; }
  });
  applyTension(diff);
}
cdTimer = setInterval(tick, 1000);
tick();

/* ═══════════════════════════════════════════════════
   TOAST
═══════════════════════════════════════════════════ */
let toastTimer = null;
function showToast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 3000);
}

/* ═══════════════════════════════════════════════════
   CELEBRATION + CONFETTI
   FIX 1: Canvas sized AFTER overlay becomes display:flex
   FIX 2: renderConfetti loop starts only after first burst
   FIX 3: Canvas resize handler updates celebCanvas ref
═══════════════════════════════════════════════════ */
let celebOn       = false;
let celebCanvas   = null;
let celebCtx      = null;
let particles     = [];
let burstInterval = null;
let confettiRAF   = null;

const CONFETTI_COLORS = ["#f5d49a","#d9928a","#c8784a","#7a9e8e","#f2e8d9","#ffffff","#ffb347","#ff69b4"];

function burst() {
  if (!celebCanvas) return;
  const x = 40 + Math.random() * (celebCanvas.width  - 80);
  const y = 30 + Math.random() * (celebCanvas.height * 0.6);
  for (let i = 0; i < 90; i++) {
    const ang = Math.random() * Math.PI * 2;
    const spd = 2 + Math.random() * 8;
    particles.push({
      x, y,
      vx: Math.cos(ang) * spd,
      vy: Math.sin(ang) * spd - 2.5,
      alpha:   1,
      decay:   0.010 + Math.random() * 0.012,
      size:    2 + Math.random() * 6,
      col:     CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      shape:   Math.random() < 0.5 ? "circle" : "rect",
      rot:     Math.random() * Math.PI * 2,
      rspd:    (Math.random() - 0.5) * 0.2,
      gravity: 0.09,
    });
  }
}

function renderConfetti() {
  if (!celebOn || !celebCanvas) return;
  celebCtx.fillStyle = "rgba(12,10,9,0.14)";
  celebCtx.fillRect(0, 0, celebCanvas.width, celebCanvas.height);

  particles = particles.filter(p => p.alpha > 0.02);
  particles.forEach(p => {
    p.vy += p.gravity; p.vx *= 0.991;
    p.x  += p.vx;     p.y  += p.vy;
    p.alpha -= p.decay; p.rot += p.rspd;
    celebCtx.save();
    celebCtx.globalAlpha = Math.max(0, p.alpha);
    celebCtx.translate(p.x, p.y);
    celebCtx.rotate(p.rot);
    celebCtx.fillStyle = p.col;
    if (p.shape === "circle") {
      celebCtx.beginPath();
      celebCtx.arc(0, 0, p.size, 0, Math.PI * 2);
      celebCtx.fill();
    } else {
      celebCtx.fillRect(-p.size * 0.5, -p.size * 0.9, p.size, p.size * 1.8);
    }
    celebCtx.restore();
  });
  confettiRAF = requestAnimationFrame(renderConfetti);
}

function triggerCeleb() {
  if (celebOn) return;
  celebOn = true;

  // Auto-unlock so they see the party
  if (locked) unlock();
  document.getElementById("main").scrollTop = 0;

  // Show overlay — MUST happen before sizing the canvas
  document.getElementById("celeb").classList.add("on");

  // NOW size the canvas (overlay is visible, so dimensions are real)
  celebCanvas = document.getElementById("celeb-cv");
  celebCtx    = celebCanvas.getContext("2d");
  celebCanvas.width  = window.innerWidth;
  celebCanvas.height = window.innerHeight;

  // Clear any stale particles from a previous run
  particles = [];

  // Fire first burst immediately, then schedule more
  burst();
  let volley = 1;
  const volleyTimer = setInterval(() => {
    burst();
    if (++volley >= 10) clearInterval(volleyTimer);
  }, 130);

  // Continuous burst after initial volley
  burstInterval = setInterval(burst, 580);

  // Start draw loop
  if (confettiRAF) cancelAnimationFrame(confettiRAF);
  renderConfetti();

  // 🎵 Play the birthday song
  playBdaySong();
}

function closeCeleb() {
  // Don't allow closing during the birthday window
  const now = Date.now();
  if (now >= BIRTHDAY.getTime() && now < BIRTHDAY_END.getTime()) return;

  celebOn = false;
  clearInterval(burstInterval);
  burstInterval = null;
  if (confettiRAF) { cancelAnimationFrame(confettiRAF); confettiRAF = null; }
  particles = [];
  if (celebCtx) celebCtx.clearRect(0, 0, celebCanvas.width, celebCanvas.height);
  document.getElementById("celeb").classList.remove("on");
  stopBdaySong();
  loadTrack(0, false); // reset music player
}

document.getElementById("btn-close-celeb").addEventListener("click", closeCeleb);

// Keep confetti canvas sized correctly if window is resized mid-party
window.addEventListener("resize", () => {
  if (!celebCanvas || !celebOn) return;
  celebCanvas.width  = window.innerWidth;
  celebCanvas.height = window.innerHeight;
});
/* ═══════════════════════════════════════════════════
   IMAGE BELT — celeb page scroller
═══════════════════════════════════════════════════ */
(function () {
  const track = document.getElementById('celeb-ad-track');
  if (!track) return;
  const IMG_VW = 0.45, COUNT = 4;
  let halfW = window.innerWidth * IMG_VW * COUNT;
  let x = 0;
  window.addEventListener('resize', () => {
    halfW = window.innerWidth * IMG_VW * COUNT;
    if (x > halfW) x = x % halfW;
  });
  function step() {
    x += 0.7;
    if (x >= halfW) x -= halfW;
    track.style.transform = `translateX(${-x}px)`;
    requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
})();

/* ═══════════════════════════════════════════════════
   FULLSCREEN MUSIC PLAYER
═══════════════════════════════════════════════════ */
(function () {
  const fsEl      = document.getElementById('player-fs');
  const btnExpand = document.getElementById('btn-expand');
  const btnShrink = document.getElementById('btn-shrink');
  const fsDisc    = document.getElementById('fs-disc');
  const fsTitle   = document.getElementById('fs-title');
  const fsArtist  = document.getElementById('fs-artist');
  const fsBar     = document.getElementById('fs-bar');
  const fsCur     = document.getElementById('fs-cur');
  const fsDur     = document.getElementById('fs-dur');
  const fsProg    = document.getElementById('fs-progress');
  const fsPlayBtn = document.getElementById('fs-play');
  const fsPrevBtn = document.getElementById('fs-prev');
  const fsNextBtn = document.getElementById('fs-next');
  const fsVol     = document.getElementById('fs-vol-slider');

  // Mirror the mini player's art emoji into the fullscreen disc
  function syncMeta() {
    const art    = document.getElementById('pl-art');
    const title  = document.getElementById('pl-title');
    const artist = document.getElementById('pl-artist');
    if (art)    fsDisc.textContent  = art.textContent;
    if (title)  fsTitle.textContent  = title.textContent;
    if (artist) fsArtist.textContent = artist.textContent;
  }

  // Sync progress bar and time
  function syncProgress() {
    const bar = document.getElementById('pl-bar');
    const cur = document.getElementById('pl-cur');
    const dur = document.getElementById('pl-dur');
    if (bar) fsBar.style.width  = bar.style.width;
    if (cur) fsCur.textContent  = cur.textContent;
    if (dur) fsDur.textContent  = dur.textContent;
  }

  // Keep disc spinning in sync with mini player art
  function syncSpin() {
    const art = document.getElementById('pl-art');
    if (!art) return;
    if (art.classList.contains('spin')) fsDisc.classList.add('spin');
    else                                fsDisc.classList.remove('spin');
  }

  // Sync play button icon
  function syncPlayIcon() {
    const mini = document.getElementById('btn-play');
    if (!mini) return;
    fsPlayBtn.innerHTML = mini.innerHTML;
  }

  let syncInterval = null;

  function openFs() {
    syncMeta();
    syncProgress();
    syncSpin();
    syncPlayIcon();
    fsEl.classList.add('open');
    // Sync every 500ms while open
    syncInterval = setInterval(() => {
      syncProgress();
      syncSpin();
      syncPlayIcon();
    }, 500);
  }

  function closeFs() {
    fsEl.classList.remove('open');
    clearInterval(syncInterval);
  }

  btnExpand.addEventListener('click', openFs);
  btnShrink.addEventListener('click', closeFs);

  // fs play/prev/next mirror the mini player buttons
  fsPlayBtn.addEventListener('click', () => document.getElementById('btn-play')?.click());
  fsPrevBtn.addEventListener('click', () => document.getElementById('btn-prev')?.click());
  fsNextBtn.addEventListener('click', () => document.getElementById('btn-next')?.click());

  // fs progress seek mirrors mini player progress click
  fsProg.addEventListener('click', e => {
    const miniProg = document.getElementById('pl-progress');
    if (!miniProg) return;
    const ratio = e.offsetX / fsProg.offsetWidth;
    const fake  = new MouseEvent('click', { bubbles: true, clientX: miniProg.getBoundingClientRect().left + ratio * miniProg.offsetWidth });
    miniProg.dispatchEvent(fake);
  });

  // fs volume mirrors mini volume slider
  fsVol.addEventListener('input', () => {
    const miniVol = document.getElementById('vol-slider');
    if (miniVol) { miniVol.value = fsVol.value; miniVol.dispatchEvent(new Event('input')); }
  });
  // Keep fs vol in sync with mini on open
  const miniVolSlider = document.getElementById('vol-slider');
  if (miniVolSlider) {
    miniVolSlider.addEventListener('input', () => { fsVol.value = miniVolSlider.value; });
  }
})();
