gsap.registerPlugin(ScrollTrigger);

let isAltTheme = false;
let sysBreached = false;
let audioCtx, analyser, dataArray;
let mX = window.innerWidth / 2, mY = window.innerHeight / 2;
let gyroX = 0, gyroY = 0;

// 1. Smooth Scroll Setup
const lenis = new Lenis({ duration: 1.5, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
lenis.stop(); // Locked until breach
function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
requestAnimationFrame(raf);

// 2. Biometric Hold-to-Breach Sequence
const breachBtn = document.getElementById('breach-trigger');
const breachFill = document.getElementById('breach-fill');
const bootScreen = document.getElementById('boot-screen');
let breachTimer;

breachBtn.addEventListener('mousedown', initiateBreach);
breachBtn.addEventListener('touchstart', initiateBreach);
window.addEventListener('mouseup', abortBreach);
window.addEventListener('touchend', abortBreach);

function initiateBreach() {
    if(sysBreached) return;
    gsap.to(breachFill, { width: '100%', duration: 2, ease: "power1.inOut" });
    breachTimer = setTimeout(() => {
        sysBreached = true;
        gsap.to(bootScreen, { scale: 2, opacity: 0, duration: 1, ease: "expo.out", onComplete: () => bootScreen.style.display = 'none' });
        initAudioEngine();
        if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
            DeviceOrientationEvent.requestPermission().then(state => { if (state === 'granted') attachGyro(); }).catch(console.error);
        } else { attachGyro(); }
        lenis.start();
    }, 2000);
}

function abortBreach() {
    if(!sysBreached) {
        clearTimeout(breachTimer);
        gsap.to(breachFill, { width: '0%', duration: 0.5, ease: "power2.out" });
    }
}

// 3. Web Audio API
function initAudioEngine() {
    const audioEl = document.getElementById('player');
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if(!audioCtx) {
        audioCtx = new AudioContext();
        analyser = audioCtx.createAnalyser();
        const source = audioCtx.createMediaElementSource(audioEl);
        source.connect(analyser);
        analyser.connect(audioCtx.destination);
        analyser.fftSize = 256;
        dataArray = new Uint8Array(analyser.frequencyBinCount);
    }
    if(audioCtx.state === 'suspended') audioCtx.resume();
}

// 4. Gyroscopic Parallax
function attachGyro() {
    window.addEventListener("deviceorientation", (e) => {
        if(!e.gamma || !e.beta) return;
        gyroX = (e.gamma / 90) * (window.innerWidth / 2); 
        gyroY = (e.beta / 180) * (window.innerHeight / 2); 
        mX = (window.innerWidth / 2) + gyroX;
        mY = (window.innerHeight / 2) + gyroY;
        xTo(mX); yTo(mY); dXTo(mX); dYTo(mY);
    });
}

// 5. Camera Zoom Hero
gsap.to("#zoom-target", {
    scale: 120, opacity: 0, ease: "power2.in",
    scrollTrigger: { trigger: ".hero-section", start: "top top", end: "bottom top", scrub: 1, pin: true }
});

// 6. Mathematically Locked Horizontal Scroll
const filmTrack = document.getElementById("film-track");
const scrollTween = gsap.to(filmTrack, {
    x: () => -(filmTrack.clientWidth - window.innerWidth),
    ease: "none"
});

ScrollTrigger.create({
    trigger: ".film-section", start: "top top",
    end: () => `+=${filmTrack.clientWidth - window.innerWidth}`,
    pin: true, animation: scrollTween, scrub: 1, invalidateOnRefresh: true
});

gsap.utils.toArray(".video-card").forEach((card) => {
    const img = card.querySelector(".parallax-img");
    gsap.to(img, {
        x: () => 80, ease: "none",
        scrollTrigger: { trigger: card, containerAnimation: scrollTween, start: "left right", end: "right left", scrub: true, invalidateOnRefresh: true }
    });
});

// 7. Gravity Well Cursor
const cursor = document.getElementById('target-cursor');
const dot = document.getElementById('target-dot');
const xTo = gsap.quickTo(cursor, "left", { duration: 0.2, ease: "power3" });
const yTo = gsap.quickTo(cursor, "top", { duration: 0.2, ease: "power3" });
const dXTo = gsap.quickTo(dot, "left", { duration: 0.05, ease: "power3" });
const dYTo = gsap.quickTo(dot, "top", { duration: 0.05, ease: "power3" });

document.addEventListener('mousemove', (e) => {
    if(gyroX === 0) { mX = e.clientX; mY = e.clientY; } 
    xTo(mX); yTo(mY); dXTo(mX); dYTo(mY);
});

document.querySelectorAll('.gravity-well').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        cursor.classList.add('active');
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        gsap.to(card, { x: x * 0.1, y: y * 0.1, duration: 0.5, ease: "power2.out" });
    });
    card.addEventListener('mouseleave', () => {
        cursor.classList.remove('active');
        gsap.to(card, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1, 0.3)" });
    });
});

document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('active'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
});

document.querySelectorAll('.magnetic').forEach(el => {
    el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const str = el.dataset.strength || 20;
        const x = (e.clientX - rect.left - rect.width / 2) * (str / 100);
        const y = (e.clientY - rect.top - rect.height / 2) * (str / 100);
        gsap.to(el, { x: x, y: y, duration: 0.3, ease: 'power2.out' });
    });
    el.addEventListener('mouseleave', () => gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.3)' }));
});

document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        gsap.to(card, { rotationY: x * 10, rotationX: -y * 10, duration: 0.5, transformPerspective: 1000, ease: "power2.out" });
    });
    card.addEventListener('mouseleave', () => gsap.to(card, { rotationY: 0, rotationX: 0, duration: 0.7, ease: "power2.out" }));
});

// 8. Audio-Reactive Cosmos Canvas
const cCan = document.getElementById('cosmos-canvas');
const cCtx = cCan.getContext('2d');
let stars = [];

function initCosmos() {
    cCan.width = window.innerWidth; cCan.height = window.innerHeight;
    stars = [];
    for(let i=0; i < (window.innerWidth < 768 ? 60 : 120); i++) {
        stars.push({ x: Math.random() * cCan.width, y: Math.random() * cCan.height, vx: (Math.random() - 0.5) * 0.5, vy: (Math.random() - 0.5) * 0.5, baseRadius: Math.random() * 1.5 + 0.5 });
    }
}
window.addEventListener('resize', initCosmos); initCosmos();

function drawCosmos() {
    cCtx.clearRect(0,0,cCan.width,cCan.height);
    let bassScale = 1;
    if(analyser && !document.getElementById('player').paused) {
        analyser.getByteFrequencyData(dataArray);
        bassScale = 1 + (dataArray[2] / 255) * 2; 
    }
    
    stars.forEach(star => {
        let dx = mX - star.x, dy = mY - star.y, dist = Math.sqrt(dx*dx + dy*dy);
        if(dist < 200) { star.x -= dx * 0.005; star.y -= dy * 0.005; }
        star.x += star.vx * bassScale; star.y += star.vy * bassScale;
        
        if(star.x < 0) star.x = cCan.width; if(star.x > cCan.width) star.x = 0;
        if(star.y < 0) star.y = cCan.height; if(star.y > cCan.height) star.y = 0;
        
        cCtx.fillStyle = `rgba(255, 255, 255, ${star.baseRadius * 0.3})`;
        cCtx.beginPath(); cCtx.arc(star.x, star.y, star.baseRadius * bassScale, 0, Math.PI*2); cCtx.fill();
    });

    cCtx.lineWidth = 0.5;
    for(let i=0; i<stars.length; i++) {
        for(let j=i+1; j<stars.length; j++) {
            const dx = stars[i].x - stars[j].x; const dy = stars[i].y - stars[j].y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            if(dist < 100 + (bassScale * 20)) {
                const r = isAltTheme ? 255 : 0; const g = isAltTheme ? 51 : 210; const b = isAltTheme ? 0 : 255;
                cCtx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${0.2 * (1 - dist/120)})`;
                cCtx.beginPath(); cCtx.moveTo(stars[i].x, stars[i].y); cCtx.lineTo(stars[j].x, stars[j].y); cCtx.stroke();
            }
        }
    }
    requestAnimationFrame(drawCosmos);
}
drawCosmos();

// 9. Dashboard Audio Visualizer & Toggle
const audioBtn = document.getElementById('audio-toggle');
const audioEl = document.getElementById('player');

audioBtn.addEventListener('click', () => {
    if(!audioCtx) initAudioEngine(); 
    if (audioEl.paused) { audioEl.play(); audioBtn.innerText = "MUT"; } else { audioEl.pause(); audioBtn.innerText = "SYNC"; }
});

const vCan = document.getElementById('visualizer-canvas'); const vCtx = vCan.getContext('2d'); let time = 0;
function resizeVis() { if(vCan) { vCan.width = vCan.offsetWidth; vCan.height = vCan.offsetHeight; } }
window.addEventListener('resize', resizeVis); setTimeout(resizeVis, 100);

function drawVis() {
    if(!vCan.width) return requestAnimationFrame(drawVis);
    vCtx.clearRect(0,0,vCan.width,vCan.height);
    const cx = vCan.width/2, cy = vCan.height/2; const isPlaying = !audioEl.paused;
    
    vCtx.beginPath();
    for(let i = 0; i <= 60; i++) {
        const angle = (i / 60) * Math.PI * 2; let offset = 0;
        if(isPlaying && analyser) { offset = (dataArray[Math.floor((i / 60) * 30)] / 255) * 30; } 
        else { offset = Math.sin(angle * 3 + time) * 3; }
        const r = 50 + offset; const x = cx + Math.cos(angle) * r, y = cy + Math.sin(angle) * r;
        if(i === 0) vCtx.moveTo(x, y); else vCtx.lineTo(x, y);
    }
    vCtx.closePath(); vCtx.strokeStyle = isAltTheme ? "rgba(255, 51, 0, 0.8)" : "rgba(0, 210, 255, 0.8)";
    vCtx.lineWidth = 1.5; vCtx.stroke();
    time += isPlaying ? 0.1 : 0.02; requestAnimationFrame(drawVis);
}
drawVis();

// 10. Radar
const rCan = document.getElementById('radar-canvas'); const rCtx = rCan.getContext('2d'); let rAng = 0;
function resizeRadar() { if(rCan) { rCan.width = rCan.offsetWidth; rCan.height = rCan.offsetHeight; } }
window.addEventListener('resize', resizeRadar); setTimeout(resizeRadar, 100);

function drawRadar() {
    if(!rCan.width) return requestAnimationFrame(drawRadar);
    const cx = rCan.width/2, cy = rCan.height/2; rCtx.clearRect(0,0,rCan.width,rCan.height);
    rCtx.strokeStyle = "rgba(255, 255, 255, 0.05)"; rCtx.lineWidth = 1;
    for(let i=1; i<=3; i++) { rCtx.beginPath(); rCtx.arc(cx, cy, cx * (i*0.25), 0, Math.PI*2); rCtx.stroke(); }
    
    rAng += 0.02; const satX = cx + Math.cos(rAng) * (cx*0.75), satY = cy + Math.sin(rAng) * (cx*0.75);
    rCtx.fillStyle = isAltTheme ? "rgba(255, 51, 0, 1)" : "rgba(0, 210, 255, 1)";
    rCtx.beginPath(); rCtx.arc(satX, satY, 3, 0, Math.PI*2); rCtx.fill();
    
    rCtx.save(); rCtx.translate(cx, cy); rCtx.rotate(rAng);
    const g = rCtx.createConicGradient(0, 0, 0);
    g.addColorStop(0, isAltTheme ? "rgba(255, 51, 0, 0.2)" : "rgba(0, 210, 255, 0.2)"); g.addColorStop(0.2, "transparent");
    rCtx.fillStyle = g; rCtx.beginPath(); rCtx.arc(0,0,cx*0.8, 0, Math.PI*2); rCtx.fill(); rCtx.restore();
    
    requestAnimationFrame(drawRadar);
}
drawRadar();

// 11. Terminal Keylogger & Phase Shift
const terminal = document.getElementById('hacker-terminal');
let keyBuffer = "";

document.addEventListener('keydown', (e) => {
    if(!sysBreached || e.ctrlKey || e.metaKey || e.altKey || e.key.length > 1) return; 
    keyBuffer += e.key.toUpperCase();
    if(keyBuffer.length > 15) keyBuffer = keyBuffer.slice(-15); 
    
    terminal.innerHTML += `<span style="color:var(--text); opacity: 0.5;">${e.key.toUpperCase()}</span>`;
    
    if(keyBuffer.includes("RESUME")) triggerEasterEgg("RESUME_DOWNLOAD_INITIATED", "assets/trees2b_resume.pdf");
    if(keyBuffer.includes("ACCESS")) triggerEasterEgg("LEVEL_4_ACCESS_GRANTED", "mailto:Benjamin@trees2b.shop");
    if(keyBuffer.includes("CONTACT")) triggerEasterEgg("SECURE_CHANNEL_OPENED", "mailto:Benjamin@trees2b.shop");
    
    terminal.scrollTop = terminal.scrollHeight;
});

function triggerEasterEgg(msg, actionUrl) {
    keyBuffer = ""; 
    terminal.innerHTML += `<br><span style="color:var(--accent); font-weight:800;">> [OVERRIDE ACCEPTED] ${msg}</span><br>> `;
    setTimeout(() => { window.location.href = actionUrl; }, 1000); 
}

document.getElementById('theme-toggle-btn').addEventListener('click', () => {
    isAltTheme = !isAltTheme;
    document.body.classList.toggle('alt-theme');
    gsap.fromTo("#flash-overlay", { opacity: 1 }, { opacity: 0, duration: 0.6, ease: "expo.out" });
    terminal.innerHTML += `<br><span style="color:var(--accent); font-weight:800;">> WARNING: ${isAltTheme ? "SOLAR PROTOCOL OVERRIDE." : "SYSTEM REVERTED."}</span><br>> `;
    terminal.scrollTop = terminal.scrollHeight;
});

// 12. Clock & Passive Logs
const logs = [ "SYNCING ORBITAL PATHWAYS FOR TREES2B...", "CALIBRATING NEURAL MESH...", "TELEMETRY LINK ESTABLISHED.", "SCANNING SECTOR 01..." ];
let logIndex = 0;
setInterval(() => {
    if(!sysBreached) return;
    terminal.innerHTML += `<br><span style="color:var(--accent)">></span> ${logs[logIndex]}`;
    logIndex = (logIndex + 1) % logs.length;
    terminal.scrollTop = terminal.scrollHeight;
}, 3000);

document.querySelectorAll('.dock-item').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        lenis.scrollTo(link.getAttribute('href'), { offset: 0 });
    });
});

setInterval(() => { document.getElementById('live-clock').innerText = new Date().toLocaleTimeString('en-GB', { hour12: false }); }, 1000);