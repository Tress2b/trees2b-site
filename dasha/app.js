/* ═══════════════════════════════════════════════════
   CONFIG  — edit these two lines
═══════════════════════════════════════════════════ */
const NAME     = "Dasha";
const BIRTHDAY = new Date(Date.now() + 10000); // 10-second demo
// Real birthday → const BIRTHDAY = new Date("2026-04-05T00:00:00");

// Drake – Ratchet Happy Birthday
const BDAY_SONG_FILE = "music/Ratchet Happy Birthday.mp3";

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
  { title:"Я то, что надо",   artist:"Браво",    emoji:"🎸", url:"music/Браво Я то, что надо.mp3" },
  { title:"Валерий Сютки",    artist:"Валерий",  emoji:"🎷", url:"music/Валерий Сютки.mp3" },
  { title:"Something Stupid", artist:"Sinatra",  emoji:"✨", url:"music/Something Stupid.mp3" },
  { title:"Птичка",           artist:"HammAli",  emoji:"🕊️", url:"music/Птичка.mp3" }
];
let trackIdx  = 0;
let audioEl   = null;
let isPlaying = false;

function setPlayIcon(on) {
  document.getElementById("btn-play").innerHTML = on ? "&#9646;&#9646;" : "&#9654;";
}

function loadTrack(idx, autoplay) {
  trackIdx = (idx + TRACKS.length) % TRACKS.length;
  const t  = TRACKS[trackIdx];
  document.getElementById("pl-title").textContent  = t.title;
  document.getElementById("pl-artist").textContent = t.artist;
  document.getElementById("pl-art").textContent    = t.emoji;
  document.getElementById("pl-art").classList.remove("spin");
  document.getElementById("player").classList.remove("bday-glow");
  document.getElementById("pl-bar").style.width    = "0%";
  document.getElementById("pl-cur").textContent    = "0:00";
  document.getElementById("pl-dur").textContent    = "0:00";

  if (audioEl) { audioEl.pause(); audioEl.src = ""; }
  audioEl = new Audio(t.url);
  audioEl.volume = parseFloat(document.getElementById("vol-slider").value);
  audioEl.addEventListener("loadedmetadata", () => {
    document.getElementById("pl-dur").textContent = fmtTime(audioEl.duration);
  });
  audioEl.addEventListener("timeupdate", () => {
    if (!audioEl.duration) return;
    document.getElementById("pl-bar").style.width = (audioEl.currentTime / audioEl.duration * 100) + "%";
    document.getElementById("pl-cur").textContent = fmtTime(audioEl.currentTime);
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
  if (isPlaying) { audioEl.pause(); isPlaying = false; }
  else { audioEl.play().then(() => { isPlaying = true; }).catch(() => {}); }
  setPlayIcon(isPlaying);
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
  document.getElementById("pl-title").textContent  = "Ratchet Happy Birthday";
  document.getElementById("pl-artist").textContent = "Drake";
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
   COUNTDOWN
═══════════════════════════════════════════════════ */
const prevVals = {};
let cdTimer    = null;

function tick() {
  const diff = BIRTHDAY - Date.now();

  if (diff <= 0) {
    clearInterval(cdTimer);
    ["cd-d","cd-h","cd-m","cd-s"].forEach(id => {
      document.getElementById(id).textContent = "00";
    });
    // Small delay so user sees the zeros before celebration pops
    setTimeout(triggerCeleb, 400);
    return;
  }

  const vals = {
    "cd-d": Math.floor(diff / 86400000),
    "cd-h": Math.floor((diff % 86400000) / 3600000),
    "cd-m": Math.floor((diff % 3600000)  / 60000),
    "cd-s": Math.floor((diff % 60000)    / 1000),
  };

  Object.entries(vals).forEach(([id, val]) => {
    const str = String(val).padStart(2, "0");
    if (prevVals[id] === str) return;
    prevVals[id] = str;
    const el = document.getElementById(id);
    el.classList.remove("tick");
    void el.offsetWidth; // force reflow — restarts animation
    el.classList.add("tick");
    el.textContent = str;
  });
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
   WISH BUTTONS
═══════════════════════════════════════════════════ */
let wishCount = 0;
let msgIdx    = 0;
const MESSAGES = [
  "born on a day the world decided to try its absolute hardest",
  "the kind of person who makes strangers feel like old friends",
  "equal parts chaos and grace — somehow, always perfectly you",
  "a little terrifying, entirely wonderful, completely irreplaceable",
  "the reason this whole year was worth it",
  "you have a gift for making everywhere feel like somewhere",
];

function sendWish(msg) {
  wishCount++;
  document.getElementById("wish-count").textContent = wishCount;
  showToast(msg);
  msgIdx = (msgIdx + 1) % MESSAGES.length;
  const el = document.getElementById("msg");
  el.style.opacity = "0";
  setTimeout(() => { el.textContent = MESSAGES[msgIdx]; el.style.opacity = "1"; }, 320);
  for (let i = 0; i < 6; i++) setTimeout(spawnPetal, i * 90);
}

document.getElementById("btn-wish").addEventListener( "click", () => sendWish("🌸 a wish just went your way"));
document.getElementById("btn-love").addEventListener( "click", () => sendWish("💛 all the love in the world"));
document.getElementById("btn-magic").addEventListener("click", () => sendWish("✨ magic, just for you"));

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
// ═══════════════════════════════════════════════════
//   GIFT FORM SUBMISSION
// ═══════════════════════════════════════════════════
const giftForm = document.getElementById("gift-form");
if (giftForm) {
  giftForm.addEventListener("submit", function(e) {
    e.preventDefault(); // Stop the redirect
    
    const btn = document.getElementById("gift-btn");
    const data = new FormData(giftForm);

    btn.textContent = "Sending...";
    btn.disabled = true;

    fetch("https://formspree.io/f/myknerve", {
      method: "POST",
      body: data,
      headers: { 'Accept': 'application/json' }
    }).then(response => {
      if (response.ok) {
        btn.textContent = "Sent!";
        giftForm.reset();
      } else {
        btn.textContent = "Error. Try again.";
        btn.disabled = false;
      }
    }).catch(error => {
      btn.textContent = "Error. Try again.";
      btn.disabled = false;
    });
  });
}