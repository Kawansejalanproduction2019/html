/**
 * DETECTIVE HARURU BIRTHDAY QUEST (28 OKTOBER)
 * Interactive Escape Room, Torchlight Labyrinth RPG, Patisserie Studio,
 * Canvas Scratch Cards, Detective License Generator & Cloud Wishes Wall
 */

// --- GLOBAL QUEST STATE ---
const QUEST_STATE = {
  stage: 1,
  clock: { hour: 12, minute: 0, solved: false },
  scraps: { scrap1: false, scrap2: false, scrap3: false, assembled: false },
  safe: { combination: [0, 0, 0, 0], solved: false },
  maze: {
    player: { x: 1, y: 1 },
    stars: 0,
    hasSilverKey: false,
    gateUnlocked: false,
    steps: 0,
    solved: false,
    guards: [
      { x: 7, y: 5, dir: 1, minX: 4, maxX: 12, axis: 'x' },
      { x: 13, y: 9, dir: 1, minY: 7, maxY: 13, axis: 'y' }
    ]
  },
  cake: {
    glaze: 'strawberry',
    toppings: [],
    candlePlaced: false,
    candleLit: false,
    candleBlown: false
  },
  coupons: { 1: false, 2: false, 3: false, 4: false }
};

// Streamlined & Adventurous Labirin 21x21 Grid:
// 0: Path, 1: Wall, 2: Golden Key, 3: Star, 4: Silver Key, 5: Iron Gate
const MAZE_MAP = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], // [1,7] = Bintang 1
  [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 4, 1, 0, 1], // [3,17] = Kunci Perak
  [1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1], // Lorong Utama Luas
  [1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 1, 0, 0, 0, 0, 0, 1, 3, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1], // [9,9] = Bintang 2 (Taman Tengah)
  [1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1],
  [1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 5, 1, 0, 1], // [15,17] = Gerbang Jeruji Besi
  [1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1],
  [1, 3, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 2, 1], // [19,1] = Bintang 3, [19,19] = Kunci Emas
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

// Database API URL for Community Wishes (Integrated from RTM Cloud Database)
const WISHES_API_URL = 'https://api.rtmbot.biz.id/api/wishes';
const ADMIN_API_BASE = 'https://api.rtmbot.biz.id';

// Default Fallback Wishes
const DEFAULT_WISHES = [
  {
    name: 'Mas Ilham Endriadi',
    role: 'Kawan Seberang Pulau (Padang)',
    avatar: '🌸',
    roleClass: 'role-minang',
    message: 'Barakallahu fii umrik Haruru! Selamat ulang tahun di tanggal 28 Oktober yang penuh berkah ini. Terima kasih udah selalu jadi teman ngobrol yang seru dan bawa aura ceria di Discord. Sehat selalu, panjang umur dalam keberkahan, dan semoga semua impianmu dimudahkan!',
    time: 'Hari ini'
  },
  {
    name: 'Segenap Squad Discord RTM',
    role: 'Keluarga Server & Squad Mabar',
    avatar: '🤖',
    roleClass: 'role-discord',
    message: 'Happy Birthday Haruru! 🎉 Jangan pernah capek jadi orang baik dan menghibur. Kapan-kapan kita gass mabar bareng lagi yaa!',
    time: 'Hari ini'
  },
  {
    name: 'Sahabat Bandung',
    role: 'Kota Kembang',
    avatar: '✨',
    roleClass: 'role-bandung',
    message: 'Wilujeng tepang taun Haruru! Semoga hari-harimu di Bandung selalu menyenangkan, cerah, dan penuh dengan hal-hal baik ✨',
    time: 'Hari ini'
  }
];

// ==========================================================================
// 1. INITIALIZATION & EVENT LISTENERS
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  initAmbientParticles();
  initMazeCanvas();
  initScratchCards();
  loadWishesFromDatabase();

  // Close modals on backdrop click
  document.querySelectorAll('.cozy-modal').forEach(modal => {
    modal.addEventListener('click', e => {
      if (e.target === modal) modal.style.display = 'none';
    });
  });

  // Keyboard navigation for Maze
  window.addEventListener('keydown', handleGlobalKeydown);

  // Initial cake candle state
  toggleCandle(true);
});

function handleGlobalKeydown(e) {
  if (QUEST_STATE.stage !== 2 || QUEST_STATE.maze.solved) return;

  const key = e.key.toLowerCase();
  if (key === 'arrowup' || key === 'w') { e.preventDefault(); movePlayer(0, -1); }
  else if (key === 'arrowdown' || key === 's') { e.preventDefault(); movePlayer(0, 1); }
  else if (key === 'arrowleft' || key === 'a') { e.preventDefault(); movePlayer(-1, 0); }
  else if (key === 'arrowright' || key === 'd') { e.preventDefault(); movePlayer(1, 0); }
}

// ==========================================================================
// 2. YOUTUBE ON-DEMAND AUDIO ENGINE & SOUND EFFECT SYNTHESIZER
// ==========================================================================
let currentTrackId = 'YdpiHMVL4C0'; // Default: Ghea Indrawari - Jiwa Yang Bersedih
let currentTrackTitle = 'Ghea Indrawari - Jiwa Yang Bersedih 🌸';
let ytPlayer = null;
let isAudioPlaying = false;
let isYtLoading = false;
let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playTone(freq, type = 'sine', duration = 0.2, gainVol = 0.15) {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(gainVol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (_) {}
}

function playClickSound() { playTone(800, 'triangle', 0.04, 0.1); }
function playChimeSound() {
  setTimeout(() => playTone(523.25, 'sine', 0.3, 0.15), 0);
  setTimeout(() => playTone(659.25, 'sine', 0.3, 0.15), 100);
  setTimeout(() => playTone(783.99, 'sine', 0.4, 0.18), 200);
}
function playUnlockSound() {
  playTone(300, 'sawtooth', 0.1, 0.1);
  setTimeout(() => playTone(587.33, 'sine', 0.25, 0.2), 120);
  setTimeout(() => playTone(880.00, 'sine', 0.4, 0.22), 240);
}
function playStepSound() { playTone(120, 'triangle', 0.05, 0.08); }
function playStarSound() {
  playTone(880, 'sine', 0.15, 0.15);
  setTimeout(() => playTone(1320, 'sine', 0.25, 0.18), 100);
}
function playBlowSound() {
  playTone(180, 'sine', 0.35, 0.25);
  setTimeout(() => playTone(220, 'triangle', 0.2, 0.15), 150);
}
function playCelebrationFanfare() {
  const notes = [523.25, 659.25, 783.99, 1046.50];
  notes.forEach((freq, idx) => {
    setTimeout(() => playTone(freq, 'sine', 0.4, 0.2), idx * 140);
  });
}

function loadYouTubePlayer(autoStart = true) {
  if (ytPlayer && typeof ytPlayer.playVideo === 'function') {
    if (autoStart) {
      ytPlayer.playVideo();
      isAudioPlaying = true;
      updateSoundUI(true);
    }
    return;
  }
  if (isYtLoading) return;
  isYtLoading = true;

  const text = document.getElementById('soundText');
  if (text) text.textContent = 'Memuat Musik... ⏳';

  window.onYouTubeIframeAPIReady = function() {
    ytPlayer = new YT.Player('ytPlayerContainer', {
      height: '1',
      width: '1',
      videoId: currentTrackId,
      playerVars: {
        autoplay: 1,
        loop: 1,
        playlist: currentTrackId,
        controls: 0,
        modestbranding: 1,
        playsinline: 1,
        enablejsapi: 1
      },
      events: {
        onReady: function(event) {
          isYtLoading = false;
          try {
            if (autoStart) {
              event.target.playVideo();
              isAudioPlaying = true;
              updateSoundUI(true);
            }
          } catch (_) {}
        },
        onStateChange: onPlayerStateChange
      }
    });
  };

  const ytScriptTag = document.createElement('script');
  ytScriptTag.src = 'https://www.youtube.com/iframe_api';
  const firstScriptTag = document.getElementsByTagName('script')[0];
  if (firstScriptTag && firstScriptTag.parentNode) {
    firstScriptTag.parentNode.insertBefore(ytScriptTag, firstScriptTag);
  } else {
    document.head.appendChild(ytScriptTag);
  }
}

function onPlayerStateChange(event) {
  if (typeof YT !== 'undefined' && event.data === YT.PlayerState.PLAYING) {
    isAudioPlaying = true;
    updateSoundUI(true);
  } else if (typeof YT !== 'undefined' && (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.ENDED)) {
    isAudioPlaying = false;
    updateSoundUI(false);
  }
}

function toggleAudio() {
  if (!ytPlayer) {
    loadYouTubePlayer(true);
    return;
  }
  if (isAudioPlaying) {
    try { ytPlayer.pauseVideo(); } catch (_) {}
    isAudioPlaying = false;
    updateSoundUI(false);
  } else {
    try { ytPlayer.playVideo(); } catch (_) {}
    isAudioPlaying = true;
    updateSoundUI(true);
  }
}

function updateSoundUI(playing) {
  const btn = document.getElementById('btnSoundToggle');
  const text = document.getElementById('soundText');
  if (btn) {
    if (playing) btn.classList.add('playing');
    else btn.classList.remove('playing');
  }
  if (text) {
    if (playing) text.textContent = `🎵 Memutar: ${currentTrackTitle}`;
    else text.textContent = 'Soundtrack: Jeda Musik ⏸️';
  }
}

function openMusicModal() {
  openModal('modalMusic');
}

function selectMusicPreset(videoId, title) {
  playClickSound();
  currentTrackId = videoId;
  currentTrackTitle = title;

  document.querySelectorAll('.music-preset-btn').forEach(btn => btn.classList.remove('active'));
  for (let i = 1; i <= 3; i++) {
    const badge = document.getElementById(`badgeTrack${i}`);
    if (badge) badge.textContent = 'Pilih';
  }

  if (videoId === 'YdpiHMVL4C0') {
    const b = document.getElementById('presetTrack1');
    if (b) b.classList.add('active');
    const bg = document.getElementById('badgeTrack1');
    if (bg) bg.textContent = 'Aktif ✓';
  } else if (videoId === '170p8WkQWz4') {
    const b = document.getElementById('presetTrack2');
    if (b) b.classList.add('active');
    const bg = document.getElementById('badgeTrack2');
    if (bg) bg.textContent = 'Aktif ✓';
  } else if (videoId === 'w_a5F_wM_Zk') {
    const b = document.getElementById('presetTrack3');
    if (b) b.classList.add('active');
    const bg = document.getElementById('badgeTrack3');
    if (bg) bg.textContent = 'Aktif ✓';
  }

  if (ytPlayer && typeof ytPlayer.loadVideoById === 'function') {
    ytPlayer.loadVideoById({ videoId: currentTrackId });
    isAudioPlaying = true;
    updateSoundUI(true);
  } else {
    loadYouTubePlayer(true);
  }

  closeModal('modalMusic');
}

function playCustomYtUrl() {
  const input = document.getElementById('customYtInput');
  const fb = document.getElementById('ytStatusFeedback');
  if (!input) return;

  const val = input.value.trim();
  if (!val) return;

  let videoId = val;
  const match = val.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  if (match && match[1]) {
    videoId = match[1];
  }

  if (videoId.length !== 11) {
    if (fb) {
      fb.className = 'form-feedback error';
      fb.textContent = 'Link atau ID YouTube tidak valid. Harap masukkan link video YouTube yang benar.';
      fb.style.display = 'block';
    }
    return;
  }

  currentTrackId = videoId;
  currentTrackTitle = 'Lagu YouTube Pilihanmu 🎵';

  if (fb) {
    fb.className = 'form-feedback success';
    fb.textContent = 'Lagu berhasil disetel! Memutar sekarang... ✨';
    fb.style.display = 'block';
  }

  if (ytPlayer && typeof ytPlayer.loadVideoById === 'function') {
    ytPlayer.loadVideoById({ videoId: currentTrackId });
    isAudioPlaying = true;
    updateSoundUI(true);
  } else {
    loadYouTubePlayer(true);
  }

  setTimeout(() => {
    closeModal('modalMusic');
  }, 1200);
}

// ==========================================================================
// 3. AMBIENT PARTICLES (SAKURA BLOSSOMS & GOLDEN DUST)
// ==========================================================================
function initAmbientParticles() {
  const canvas = document.getElementById('ambientCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  for (let i = 0; i < 28; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 4 + 2,
      dx: Math.random() * 0.8 - 0.4,
      dy: Math.random() * 0.6 + 0.3,
      color: Math.random() > 0.4 ? 'rgba(232, 106, 130, 0.35)' : 'rgba(229, 193, 117, 0.4)',
      spin: Math.random() * Math.PI,
      spinSpeed: Math.random() * 0.02 - 0.01
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.spin);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.ellipse(0, 0, p.r * 1.5, p.r, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      p.x += p.dx;
      p.y += p.dy;
      p.spin += p.spinSpeed;

      if (p.y > height + 10) { p.y = -10; p.x = Math.random() * width; }
      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;
    });
    requestAnimationFrame(render);
  }
  render();
}

// ==========================================================================
// 4. STAGE SWITCHER & STEPPER CONTROLLER
// ==========================================================================
function switchStage(stageNum) {
  QUEST_STATE.stage = stageNum;

  // Update Stepper Visuals
  for (let i = 1; i <= 4; i++) {
    const stepEl = document.getElementById(`step${i}`);
    const lineEl = document.getElementById(`line${i}`);
    if (stepEl) {
      if (i === stageNum) stepEl.classList.add('active');
      else if (i < stageNum) stepEl.classList.add('active');
      else stepEl.classList.remove('active');
    }
    if (lineEl) {
      if (i < stageNum) lineEl.classList.add('passed');
      else lineEl.classList.remove('passed');
    }
  }

  // Display Active Stage
  document.getElementById('stageRoom').style.display = (stageNum === 1) ? 'block' : 'none';
  document.getElementById('stageMaze').style.display = (stageNum === 2) ? 'block' : 'none';
  document.getElementById('stageCake').style.display = (stageNum === 3) ? 'block' : 'none';
  document.getElementById('stageCelebration').style.display = (stageNum === 4) ? 'block' : 'none';

  if (stageNum === 2) {
    setTimeout(() => drawMaze(), 50);
  } else if (stageNum === 3) {
    setTimeout(() => initCake3D(), 50);
  } else if (stageNum === 4) {
    fireConfettiShower();
  }

  window.scrollTo({ top: document.querySelector('.quest-hero').offsetTop, behavior: 'smooth' });
}

// ==========================================================================
// 5. STAGE 1: DETECTIVE ROOM ESCAPE PUZZLES
// ==========================================================================


// 5A. Teka-Teki Jam Antik Analog
function openClockModal() {
  playClickSound();
  updateAnalogClockView();
  openModal('modalClock');
}

function updateAnalogClockView() {
  const { hour, minute } = QUEST_STATE.clock;
  const hourAngle = (hour % 12 + minute / 60) * 30;
  const minAngle = minute * 6;

  const hourHand = document.getElementById('analogHourHand');
  const minHand = document.getElementById('analogMinHand');
  const display = document.getElementById('clockDisplay');

  if (hourHand) hourHand.setAttribute('transform', `rotate(${hourAngle} 100 100)`);
  if (minHand) minHand.setAttribute('transform', `rotate(${minAngle} 100 100)`);

  const sceneHour = document.getElementById('sceneHourHand');
  const sceneMin = document.getElementById('sceneMinHand');
  if (sceneHour) sceneHour.setAttribute('transform', `rotate(${hourAngle} 45 38)`);
  if (sceneMin) sceneMin.setAttribute('transform', `rotate(${minAngle} 45 38)`);

  const hh = String(hour).padStart(2, '0');
  const mm = String(minute).padStart(2, '0');
  if (display) display.textContent = `${hh}:${mm}`;
}

function adjustClockHour(delta) {
  playClickSound();
  let h = QUEST_STATE.clock.hour + delta;
  if (h > 12) h = 1;
  if (h < 1) h = 12;
  QUEST_STATE.clock.hour = h;
  updateAnalogClockView();
}

function adjustClockMinute(delta) {
  playClickSound();
  let m = QUEST_STATE.clock.minute + delta;
  if (m >= 60) {
    m = m % 60;
    adjustClockHour(1);
  } else if (m < 0) {
    m = 60 + m;
    adjustClockHour(-1);
  }
  QUEST_STATE.clock.minute = m;
  updateAnalogClockView();
}

function checkClockPuzzle() {
  const { hour, minute } = QUEST_STATE.clock;
  const fb = document.getElementById('clockFeedback');

  if (hour === 10 && minute === 28) {
    QUEST_STATE.clock.solved = true;
    QUEST_STATE.scraps.scrap1 = true;
    playUnlockSound();

    if (fb) {
      fb.className = 'form-feedback success';
      fb.textContent = '🎉 KLIK! Jarum tepat di 10:28! Kompartemen rahasia terbuka & Sobekan Surat #1 ditemukan!';
      fb.style.display = 'block';
    }

    document.getElementById('hudClock').textContent = 'Terbuka (Pukul 10:28) ✨';
    document.getElementById('hudClock').classList.add('done');
    updateScrapsTracker();
    updateDialogue("Luar biasa! Jam antik membuka kompartemen dan menjatuhkan Sobekan Surat #1!");

    setTimeout(() => {
      closeModal('modalClock');
    }, 1800);
  } else {
    playTone(200, 'sawtooth', 0.15, 0.1);
    if (fb) {
      fb.className = 'form-feedback error';
      fb.textContent = `Waktu masih ${String(hour).padStart(2,'0')}:${String(minute).padStart(2,'0')}. Petunjuk: Bulan 10, tanggal 28 (10:28)!`;
      fb.style.display = 'block';
    }
  }
}

// 5B. Sofa Beludru (Sobekan #2)
function clickSofa() {
  playClickSound();
  const pillow = document.getElementById('svgPillowGroup');
  if (pillow) pillow.classList.toggle('shifted');

  if (!QUEST_STATE.scraps.scrap2) {
    QUEST_STATE.scraps.scrap2 = true;
    playChimeSound();
    const badge = document.getElementById('pillowScrapFoundBadge');
    if (badge) badge.style.display = 'block';

    updateScrapsTracker();
    updateDialogue("Bantal sofa terangkat! Sobekan Surat #2 terselip di lipatan kain beludru!");
  } else {
    updateDialogue("Bantal sofa sudah diperiksa. Sobekan surat dari sini sudah kamu ambil!");
  }
}

// 5C. Rak Buku Klasik (Sobekan #3)
function openBookshelfModal() {
  playClickSound();
  openModal('modalBookshelf');
}

function inspectBook(bookKey) {
  playClickSound();
  const fb = document.getElementById('bookFeedback');

  if (bookKey === 'haruru28') {
    QUEST_STATE.scraps.scrap3 = true;
    playUnlockSound();
    if (fb) {
      fb.className = 'form-feedback success';
      fb.textContent = '📖 KLIK! Buku "Detektif Haruru Edisi 28" memiliki rongga rahasia! Sobekan Surat #3 berhasil diambil!';
      fb.style.display = 'block';
    }
    updateScrapsTracker();
    updateDialogue("Mantap! Buku Haruru Edisi 28 menyimpan Sobekan Surat #3 di balik halamannya!");

    setTimeout(() => {
      closeModal('modalBookshelf');
    }, 1800);
  } else {
    playTone(240, 'triangle', 0.15, 0.1);
    if (fb) {
      fb.className = 'form-feedback error';
      fb.textContent = 'Buku ini berisi cerita hangat sahabat, namun tidak ada sobekan tersembunyi di dalamnya.';
      fb.style.display = 'block';
    }
  }
}

function updateScrapsTracker() {
  const { scrap1, scrap2, scrap3 } = QUEST_STATE.scraps;
  const count = (scrap1 ? 1 : 0) + (scrap2 ? 1 : 0) + (scrap3 ? 1 : 0);

  const hud = document.getElementById('hudScraps');
  if (hud) {
    hud.textContent = `${count} / 3 Terkumpul`;
    if (count === 3) hud.classList.add('done');
  }

  // Update Scrap Tray in Modal
  const s1 = document.getElementById('scrapSlot1');
  const s2 = document.getElementById('scrapSlot2');
  const s3 = document.getElementById('scrapSlot3');
  if (s1 && scrap1) { s1.textContent = 'Potongan #1 (Jam Antik) ✓'; s1.classList.add('found'); }
  if (s2 && scrap2) { s2.textContent = 'Potongan #2 (Sofa) ✓'; s2.classList.add('found'); }
  if (s3 && scrap3) { s3.textContent = 'Potongan #3 (Buku #28) ✓'; s3.classList.add('found'); }
}

// 5D. Meja Investigasi (Jigsaw Puzzle Assembly)
function openDeskModal() {
  playClickSound();
  updateScrapsTracker();
  openModal('modalDesk');
}

function assembleScrapsTogether() {
  const { scrap1, scrap2, scrap3 } = QUEST_STATE.scraps;

  if (!scrap1 || !scrap2 || !scrap3) {
    alert("Kamu belum mengumpulkan ketiga sobekan surat! Cari sobekan di Jam Antik, Bantal Sofa, dan Rak Buku terlebih dahulu.");
    return;
  }

  playChimeSound();
  QUEST_STATE.scraps.assembled = true;

  const doc = document.getElementById('assembledDocument');
  if (doc) doc.style.display = 'block';

  updateDialogue("Ketiga sobekan surat berhasil disatukan! Sandi brankas adalah: 1 - 0 - 2 - 8!");
}

// 5E. Brankas Rahasia Bertombol Putar (Rotary Safe Cryptex)
function openSafeModal() {
  playClickSound();
  openModal('modalSafe');
}

function spinSafeDial(index, delta) {
  playClickSound();
  let val = QUEST_STATE.safe.combination[index] + delta;
  if (val > 9) val = 0;
  if (val < 0) val = 9;
  QUEST_STATE.safe.combination[index] = val;

  const digitEl = document.getElementById(`dialDigit${index}`);
  if (digitEl) digitEl.textContent = val;
}

function checkSafeCombination() {
  const combo = QUEST_STATE.safe.combination.join('');
  const fb = document.getElementById('safeFeedback');

  if (combo === '1028') {
    QUEST_STATE.safe.solved = true;
    playCelebrationFanfare();

    if (fb) {
      fb.className = 'form-feedback success';
      fb.textContent = '🔓 KLIK! Gerendel brankas terbuka! Dinding kamar bergeser mengungkap gerbang Labirin Lentera!';
      fb.style.display = 'block';
    }

    document.getElementById('hudSafe').textContent = 'Terbuka (Sandi 1028) ✨';
    document.getElementById('hudSafe').classList.add('done');

    setTimeout(() => {
      closeModal('modalSafe');
      switchStage(2);
    }, 1800);
  } else {
    playTone(180, 'sawtooth', 0.2, 0.12);
    if (fb) {
      fb.className = 'form-feedback error';
      fb.textContent = `Sandi "${combo}" salah. Susun sobekan surat di Meja Investigasi untuk mengetahui sandinya!`;
      fb.style.display = 'block';
    }
  }
}

// ==========================================================================
// 6. STAGE 2: EXPEDITION LABYRINTH RPG WITH DYNAMIC TORCHLIGHT (21x21)
// ==========================================================================
let mazeCanvas = null;
let mazeCtx = null;
const TILE_SIZE = 24; // 21 x 24 = 504px
let compassHintTimer = null;
let compassTarget = null;

function initMazeCanvas() {
  mazeCanvas = document.getElementById('mazeCanvas');
  if (!mazeCanvas) return;
  mazeCtx = mazeCanvas.getContext('2d');
}

function drawMaze() {
  if (!mazeCtx) initMazeCanvas();
  if (!mazeCtx) return;

  const ctx = mazeCtx;
  const { player, hasSilverKey, gateUnlocked, stars } = QUEST_STATE.maze;
  const pPixelX = player.x * TILE_SIZE + TILE_SIZE / 2;
  const pPixelY = player.y * TILE_SIZE + TILE_SIZE / 2;

  // 1. Clear with Deep Labyrinth Darkness
  ctx.fillStyle = '#080504';
  ctx.fillRect(0, 0, mazeCanvas.width, mazeCanvas.height);

  // 2. Render Walls & Paths
  for (let r = 0; r < MAZE_MAP.length; r++) {
    for (let c = 0; c < MAZE_MAP[r].length; c++) {
      const type = MAZE_MAP[r][c];
      const x = c * TILE_SIZE;
      const y = r * TILE_SIZE;

      if (type === 1) {
        // Brick Stone Wall
        ctx.fillStyle = '#2D1B13';
        ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
        ctx.strokeStyle = '#43281C';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, TILE_SIZE, TILE_SIZE);
      } else {
        // Stone Pathway
        ctx.fillStyle = '#170E0B';
        ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);

        if (type === 3) {
          // Golden Star Relic
          ctx.font = '14px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('⭐', x + TILE_SIZE / 2, y + TILE_SIZE / 2);
        } else if (type === 4 && !hasSilverKey) {
          // Silver Key
          ctx.font = '14px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('🗝️', x + TILE_SIZE / 2, y + TILE_SIZE / 2);
        } else if (type === 5 && !gateUnlocked) {
          // Iron Gate
          ctx.fillStyle = '#546E7A';
          ctx.fillRect(x + 2, y + 2, TILE_SIZE - 4, TILE_SIZE - 4);
          ctx.font = '12px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('🚪', x + TILE_SIZE / 2, y + TILE_SIZE / 2);
        } else if (type === 2) {
          // Goal: Golden Vault Key
          ctx.font = '16px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('🔑', x + TILE_SIZE / 2, y + TILE_SIZE / 2);
        }
      }
    }
  }

  // 3. Render Patrolling Shadow Guardians 👻
  QUEST_STATE.maze.guards.forEach(g => {
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('👻', g.x * TILE_SIZE + TILE_SIZE / 2, g.y * TILE_SIZE + TILE_SIZE / 2);
  });

  // 4. Compass Guidance Beam (if active)
  if (compassTarget) {
    const tPixelX = compassTarget.x * TILE_SIZE + TILE_SIZE / 2;
    const tPixelY = compassTarget.y * TILE_SIZE + TILE_SIZE / 2;

    ctx.save();
    ctx.strokeStyle = '#FFD54F';
    ctx.lineWidth = 2.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(pPixelX, pPixelY);
    ctx.lineTo(tPixelX, tPixelY);
    ctx.stroke();

    // Pulse target ring
    ctx.beginPath();
    ctx.arc(tPixelX, tPixelY, 14, 0, Math.PI * 2);
    ctx.strokeStyle = '#FFA000';
    ctx.lineWidth = 2;
    ctx.setLineDash([]);
    ctx.stroke();
    ctx.restore();
  }

  // 5. Render Detective Haruru (Chibi Sprite with Lantern)
  ctx.save();
  ctx.beginPath();
  ctx.arc(pPixelX, pPixelY, 9, 0, Math.PI * 2);
  ctx.fillStyle = '#E86A82';
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#FFFFFF';
  ctx.stroke();

  // Detective Hat / Badge
  ctx.font = '11px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('🕵️‍♀️', pPixelX, pPixelY);
  ctx.restore();

  // 6. Dynamic Torchlight / Fog of War Raycasting (Expanded & Softer Ambient Fog)
  const torchRadius = 165;
  const grad = ctx.createRadialGradient(pPixelX, pPixelY, 20, pPixelX, pPixelY, torchRadius);
  grad.addColorStop(0, 'rgba(0, 0, 0, 0)');
  grad.addColorStop(0.55, 'rgba(8, 5, 4, 0.22)');
  grad.addColorStop(0.85, 'rgba(8, 5, 4, 0.52)');
  grad.addColorStop(1, 'rgba(8, 5, 4, 0.72)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, mazeCanvas.width, mazeCanvas.height);
}

function showMazeToast(msg, duration = 3200) {
  const banner = document.getElementById('mazeToastBanner');
  if (!banner) return;
  banner.textContent = msg;
  banner.style.display = 'block';

  clearTimeout(banner._toastTimer);
  banner._toastTimer = setTimeout(() => {
    banner.style.display = 'none';
  }, duration);
}

function triggerCompassHint() {
  playChimeSound();
  const { player, hasSilverKey, gateUnlocked, stars } = QUEST_STATE.maze;
  const hintText = document.getElementById('compassHintText');

  let target = null;
  let label = '';

  if (stars < 3) {
    // Find nearest star
    let minD = 9999;
    for (let r = 0; r < MAZE_MAP.length; r++) {
      for (let c = 0; c < MAZE_MAP[r].length; c++) {
        if (MAZE_MAP[r][c] === 3) {
          const d = Math.hypot(player.x - c, player.y - r);
          if (d < minD) { minD = d; target = { x: c, y: r }; }
        }
      }
    }
    label = '🧭 Kompas menunjuk ke Bintang Memori ⭐ terdekat!';
  } else if (!hasSilverKey) {
    target = { x: 17, y: 3 };
    label = '🧭 Kompas bergetar: Kunci Perak 🗝️ ada di lorong kanan atas!';
  } else if (!gateUnlocked) {
    target = { x: 17, y: 15 };
    label = '🧭 Kompas menunjuk ke Gerbang Jeruji Besi 🚪!';
  } else {
    target = { x: 19, y: 19 };
    label = '🧭 Kompas menunjuk ke Altar Kunci Emas 🔑 di ruang utama!';
  }

  if (target) {
    compassTarget = target;
    if (hintText) hintText.textContent = label;
    showMazeToast(label, 3000);
    drawMaze();

    clearTimeout(compassHintTimer);
    compassHintTimer = setTimeout(() => {
      compassTarget = null;
      if (hintText) hintText.textContent = '💡 Klik kompas jika butuh bantuan arah!';
      drawMaze();
    }, 4500);
  }
}

function movePlayer(dx, dy) {
  const { player } = QUEST_STATE.maze;
  const newX = player.x + dx;
  const newY = player.y + dy;

  // Check boundaries
  if (newY < 0 || newY >= MAZE_MAP.length || newX < 0 || newX >= MAZE_MAP[0].length) return;

  const tile = MAZE_MAP[newY][newX];

  // 1. Wall collision
  if (tile === 1) {
    playTone(150, 'square', 0.05, 0.06);
    return;
  }

  // 2. Gate collision
  if (tile === 5 && !QUEST_STATE.maze.gateUnlocked) {
    if (QUEST_STATE.maze.hasSilverKey) {
      QUEST_STATE.maze.gateUnlocked = true;
      MAZE_MAP[newY][newX] = 0; // Open gate
      playUnlockSound();
      const gateStatus = document.getElementById('mazeGateStatus');
      if (gateStatus) gateStatus.textContent = 'Terbuka (Kunci Perak) ✓';
      showMazeToast("🔓 KLIK! Gerbang jeruji besi berhasil dibuka! Jalan ke brankas emas terbuka lebar!");
    } else {
      playTone(200, 'sawtooth', 0.1, 0.1);
      showMazeToast("🚪 Gerbang jeruji besi terkunci! Temukan Kunci Perak 🗝️ di sayap labirin.");
      return;
    }
  }

  // Move player
  player.x = newX;
  player.y = newY;
  QUEST_STATE.maze.steps++;
  playStepSound();

  const stepEl = document.getElementById('mazeStepCount');
  if (stepEl) stepEl.textContent = QUEST_STATE.maze.steps;

  // 3. Star Pickup
  if (tile === 3) {
    MAZE_MAP[newY][newX] = 0;
    QUEST_STATE.maze.stars++;
    playStarSound();
    const starEl = document.getElementById('mazeStarCount');
    if (starEl) starEl.textContent = `${QUEST_STATE.maze.stars} / 3`;
    showMazeToast(`⭐ Bintang Memori ditemukan! (${QUEST_STATE.maze.stars}/3)`);
  }

  // 4. Silver Key Pickup
  if (tile === 4 && !QUEST_STATE.maze.hasSilverKey) {
    MAZE_MAP[newY][newX] = 0;
    QUEST_STATE.maze.hasSilverKey = true;
    playChimeSound();
    const keyEl = document.getElementById('mazeSilverKeyStatus');
    if (keyEl) keyEl.textContent = 'Tersedia di Kantong ✓';
    showMazeToast("🗝️ Kunci Perak ditemukan! Sekarang buka gerbang jeruji besi!");
  }

  // 5. Goal: Golden Key Pickup!
  if (tile === 2) {
    QUEST_STATE.maze.solved = true;
    playCelebrationFanfare();
    drawMaze();
    showMazeToast("🏆 Kunci Emas berhasil diraih! Membuka gerbang Studio Patisserie 3D... ✨", 2500);
    setTimeout(() => {
      switchStage(3);
    }, 1200);
    return;
  }

  // Check collision with moving guards
  QUEST_STATE.maze.guards.forEach(g => {
    if (g.x === player.x && g.y === player.y) {
      playTone(160, 'sawtooth', 0.2, 0.15);
      showMazeToast("👻 Haruru berpapasan dengan bayangan dan mundur selangkah!");
      player.x = Math.max(1, player.x - dx);
      player.y = Math.max(1, player.y - dy);
    }
  });

  drawMaze();
}

// Guard Patrol Interval
setInterval(() => {
  if (QUEST_STATE.stage !== 2 || QUEST_STATE.maze.solved) return;
  QUEST_STATE.maze.guards.forEach(g => {
    if (g.axis === 'x') {
      g.x += g.dir;
      if (g.x >= g.maxX || g.x <= g.minX) g.dir *= -1;
    } else {
      g.y += g.dir;
      if (g.y >= g.maxY || g.y <= g.minY) g.dir *= -1;
    }
  });
  if (QUEST_STATE.stage === 2) drawMaze();
}, 850);

// ==========================================================================
// 7. STAGE 3: GENUINELY 3D THREE.JS PATISSERIE CAKE & CANDLE BLOWOUT
// ==========================================================================
let cakeScene = null;
let cakeCamera = null;
let cakeRenderer = null;
let cakeRoot = null;
let cakeTierBottom = null;
let cakeTierTop = null;
let cakeGlazeBottom = null;
let cakeGlazeTop = null;
let cakeCandleMesh = null;
let cakeFlameMesh = null;
let cakeCandleLight = null;
let cakeToppingObjects = [];
let isDraggingCake = false;
let prevMousePos = { x: 0, y: 0 };
let cakeRotationVelocity = 0.003;
let cakeAnimFrameId = null;

function getGlazeMaterial(flavor) {
  const configs = {
    strawberry: { color: 0xFF6B8B, roughness: 0.18, metalness: 0.05 },
    matcha:     { color: 0x5B8C68, roughness: 0.28, metalness: 0.02 },
    chocolate:  { color: 0x3E2316, roughness: 0.12, metalness: 0.10 },
    caramel:    { color: 0xD4AF37, roughness: 0.15, metalness: 0.15 }
  };
  const cfg = configs[flavor] || configs.strawberry;
  return new THREE.MeshStandardMaterial({
    color: cfg.color,
    roughness: cfg.roughness,
    metalness: cfg.metalness
  });
}

function initCake3D() {
  const container = document.getElementById('cake3dContainer');
  if (!container || typeof THREE === 'undefined') return;
  if (cakeRenderer) return; // Already initialized

  const width = container.clientWidth || 380;
  const height = container.clientHeight || 360;

  // 1. Three.js Scene & Camera
  cakeScene = new THREE.Scene();
  cakeCamera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
  cakeCamera.position.set(0, 4.2, 9.6);
  cakeCamera.lookAt(0, 1.4, 0);

  // 2. WebGL Renderer
  cakeRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  cakeRenderer.setSize(width, height);
  cakeRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  cakeRenderer.shadowMap.enabled = true;
  container.appendChild(cakeRenderer.domElement);

  // 3. Realistic Studio Lighting
  const ambientLight = new THREE.AmbientLight(0xFFF7EB, 0.85);
  cakeScene.add(ambientLight);

  const mainLight = new THREE.DirectionalLight(0xFFFFFF, 0.8);
  mainLight.position.set(5, 12, 7);
  cakeScene.add(mainLight);

  const warmRimLight = new THREE.DirectionalLight(0xFFE0B2, 0.45);
  warmRimLight.position.set(-6, 5, -5);
  cakeScene.add(warmRimLight);

  // Warm flickering candlelight point light
  cakeCandleLight = new THREE.PointLight(0xFFA000, 0, 12);
  cakeCandleLight.position.set(0, 4.0, 0);
  cakeScene.add(cakeCandleLight);

  // 4. Cake Root Hierarchy
  cakeRoot = new THREE.Group();
  cakeScene.add(cakeRoot);

  // 5. White Porcelain Cake Stand & Plate
  const plateGeo = new THREE.CylinderGeometry(3.6, 3.8, 0.28, 44);
  const plateMat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.2, metalness: 0.08 });
  const cakePlate = new THREE.Mesh(plateGeo, plateMat);
  cakePlate.position.y = 0.14;
  cakeRoot.add(cakePlate);

  const standBaseGeo = new THREE.CylinderGeometry(2.0, 2.7, 0.35, 40);
  const standBaseMat = new THREE.MeshStandardMaterial({ color: 0xF3EAE0, roughness: 0.3 });
  const standBase = new THREE.Mesh(standBaseGeo, standBaseMat);
  standBase.position.y = -0.16;
  cakeRoot.add(standBase);

  // 6. Tier 1 (Bottom Tier)
  const tier1Geo = new THREE.CylinderGeometry(2.9, 2.95, 1.6, 44);
  const spongeCreamMat = new THREE.MeshStandardMaterial({ color: 0xFFF9F0, roughness: 0.55 });
  cakeTierBottom = new THREE.Mesh(tier1Geo, spongeCreamMat);
  cakeTierBottom.position.y = 1.1;
  cakeRoot.add(cakeTierBottom);

  // Bottom Glaze Drip
  const glaze1Geo = new THREE.CylinderGeometry(2.96, 2.99, 0.48, 44);
  cakeGlazeBottom = new THREE.Mesh(glaze1Geo, getGlazeMaterial(QUEST_STATE.cake.glaze));
  cakeGlazeBottom.position.y = 1.72;
  cakeRoot.add(cakeGlazeBottom);

  // 7. Tier 2 (Top Tier)
  const tier2Geo = new THREE.CylinderGeometry(1.9, 1.95, 1.35, 40);
  cakeTierTop = new THREE.Mesh(tier2Geo, spongeCreamMat);
  cakeTierTop.position.y = 2.58;
  cakeRoot.add(cakeTierTop);

  // Top Glaze Drip
  const glaze2Geo = new THREE.CylinderGeometry(1.96, 1.99, 0.42, 40);
  cakeGlazeTop = new THREE.Mesh(glaze2Geo, getGlazeMaterial(QUEST_STATE.cake.glaze));
  cakeGlazeTop.position.y = 3.12;
  cakeRoot.add(cakeGlazeTop);

  // 8. Birthday Candle (Aesthetic spiral candle, NO NUMBER 28!)
  const candleGroup = new THREE.Group();
  candleGroup.position.set(0, 3.32, 0);

  const candleBodyGeo = new THREE.CylinderGeometry(0.12, 0.12, 1.0, 20);
  const candleBodyMat = new THREE.MeshStandardMaterial({ color: 0xFFD54F, roughness: 0.25, metalness: 0.15 });
  const candleBody = new THREE.Mesh(candleBodyGeo, candleBodyMat);
  candleBody.position.y = 0.5;
  candleGroup.add(candleBody);

  // Candle wick
  const wickGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.18, 8);
  const wickMat = new THREE.MeshBasicMaterial({ color: 0x222222 });
  const wick = new THREE.Mesh(wickGeo, wickMat);
  wick.position.y = 1.06;
  candleGroup.add(wick);

  // Candle Flame (Teardrop mesh with animated pulsing flame)
  const flameGeo = new THREE.SphereGeometry(0.13, 16, 16);
  flameGeo.scale(0.75, 2.0, 0.75);
  const flameMat = new THREE.MeshBasicMaterial({ color: 0xFFA000 });
  cakeFlameMesh = new THREE.Mesh(flameGeo, flameMat);
  cakeFlameMesh.position.y = 1.28;
  cakeFlameMesh.visible = false;
  candleGroup.add(cakeFlameMesh);

  cakeCandleMesh = candleGroup;
  cakeRoot.add(cakeCandleMesh);
  cakeCandleMesh.visible = QUEST_STATE.cake.candlePlaced;

  // 9. Interactive 360° Drag to Rotate (Mouse + Touch)
  const dom = cakeRenderer.domElement;

  function onPointerDown(e) {
    isDraggingCake = true;
    prevMousePos = {
      x: e.clientX || (e.touches && e.touches[0].clientX),
      y: e.clientY || (e.touches && e.touches[0].clientY)
    };
  }

  function onPointerMove(e) {
    if (!isDraggingCake) return;
    const currentX = e.clientX || (e.touches && e.touches[0].clientX);
    const currentY = e.clientY || (e.touches && e.touches[0].clientY);
    const deltaX = currentX - prevMousePos.x;
    const deltaY = currentY - prevMousePos.y;

    if (cakeRoot) {
      cakeRoot.rotation.y += deltaX * 0.012;
      cakeRoot.rotation.x = Math.max(-0.25, Math.min(0.4, cakeRoot.rotation.x + deltaY * 0.008));
    }

    prevMousePos = { x: currentX, y: currentY };
  }

  function onPointerUp() {
    isDraggingCake = false;
  }

  dom.addEventListener('mousedown', onPointerDown);
  window.addEventListener('mousemove', onPointerMove);
  window.addEventListener('mouseup', onPointerUp);

  dom.addEventListener('touchstart', onPointerDown, { passive: true });
  window.addEventListener('touchmove', onPointerMove, { passive: true });
  window.addEventListener('touchend', onPointerUp);

  // Resize Handler
  window.addEventListener('resize', () => {
    if (!cakeRenderer || !cakeCamera || !container) return;
    const w = container.clientWidth || 380;
    const h = container.clientHeight || 360;
    cakeCamera.aspect = w / h;
    cakeCamera.updateProjectionMatrix();
    cakeRenderer.setSize(w, h);
  });

  // Render loop
  animateCake3D();
}

function animateCake3D() {
  cakeAnimFrameId = requestAnimationFrame(animateCake3D);

  if (cakeRoot && !isDraggingCake) {
    cakeRoot.rotation.y += cakeRotationVelocity;
  }

  // Flame flicker animation & warm candlelight pulse
  if (QUEST_STATE.cake.candleLit && cakeFlameMesh) {
    const time = Date.now() * 0.01;
    const flicker = 1.0 + Math.sin(time * 3) * 0.08 + Math.cos(time * 7) * 0.05;
    cakeFlameMesh.scale.set(0.75 * flicker, 2.0 * flicker, 0.75 * flicker);
    cakeFlameMesh.rotation.z = Math.sin(time * 4) * 0.08;

    if (cakeCandleLight) {
      cakeCandleLight.intensity = 1.8 + Math.sin(time * 5) * 0.4;
    }
  }

  if (cakeRenderer && cakeScene && cakeCamera) {
    cakeRenderer.render(cakeScene, cakeCamera);
  }
}

function setCakeGlaze(flavor) {
  playClickSound();
  QUEST_STATE.cake.glaze = flavor;

  document.querySelectorAll('.btn-glaze').forEach(btn => btn.classList.remove('active'));
  if (event && event.currentTarget) event.currentTarget.classList.add('active');

  const newMat = getGlazeMaterial(flavor);
  if (cakeGlazeBottom) cakeGlazeBottom.material = newMat;
  if (cakeGlazeTop) cakeGlazeTop.material = newMat;
}

function addCakeTopping(type) {
  playClickSound();
  if (!cakeRoot || typeof THREE === 'undefined') return;

  const toppingGroup = new THREE.Group();
  const isTopTier = Math.random() > 0.4;
  const radius = isTopTier ? (1.4 + Math.random() * 0.4) : (2.3 + Math.random() * 0.5);
  const angle = Math.random() * Math.PI * 2;
  const heightY = isTopTier ? 3.32 : 1.94;

  if (type === 'strawberry') {
    // 3D Strawberry (Red cone with green leafy calyx)
    const strawGeo = new THREE.ConeGeometry(0.2, 0.42, 16);
    const strawMat = new THREE.MeshStandardMaterial({ color: 0xE53935, roughness: 0.25, metalness: 0.05 });
    const berry = new THREE.Mesh(strawGeo, strawMat);
    berry.rotation.x = Math.PI; // point downwards
    toppingGroup.add(berry);

    const leafGeo = new THREE.CylinderGeometry(0.22, 0.05, 0.04, 6);
    const leafMat = new THREE.MeshStandardMaterial({ color: 0x43A047, roughness: 0.4 });
    const leaf = new THREE.Mesh(leafGeo, leafMat);
    leaf.position.y = 0.2;
    toppingGroup.add(leaf);
  } else if (type === 'macaron') {
    // 3D Macaron (Dual pink shells with creamy white ganache)
    const shellGeo = new THREE.CylinderGeometry(0.26, 0.26, 0.08, 16);
    const shellMat = new THREE.MeshStandardMaterial({ color: 0xF48FB1, roughness: 0.35 });
    const shellTop = new THREE.Mesh(shellGeo, shellMat);
    shellTop.position.y = 0.07;
    const shellBottom = new THREE.Mesh(shellGeo, shellMat);
    shellBottom.position.y = -0.07;
    const creamGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.07, 16);
    const creamMat = new THREE.MeshStandardMaterial({ color: 0xFFF9C4, roughness: 0.5 });
    const cream = new THREE.Mesh(creamGeo, creamMat);
    toppingGroup.add(shellTop);
    toppingGroup.add(shellBottom);
    toppingGroup.add(cream);
  } else if (type === 'cherry') {
    // 3D Cherry
    const cherryGeo = new THREE.SphereGeometry(0.18, 16, 16);
    const cherryMat = new THREE.MeshStandardMaterial({ color: 0xC2185B, roughness: 0.15, metalness: 0.1 });
    const cherry = new THREE.Mesh(cherryGeo, cherryMat);
    toppingGroup.add(cherry);
  } else if (type === 'blossom') {
    // 3D Sakura Blossom (Soft pink disc)
    const flowerGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.05, 5);
    const flowerMat = new THREE.MeshStandardMaterial({ color: 0xF8BBD0, roughness: 0.4 });
    const flower = new THREE.Mesh(flowerGeo, flowerMat);
    toppingGroup.add(flower);
  } else if (type === 'pearl') {
    // White chocolate pearl
    const pearlGeo = new THREE.SphereGeometry(0.12, 14, 14);
    const pearlMat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.1, metalness: 0.25 });
    const pearl = new THREE.Mesh(pearlGeo, pearlMat);
    toppingGroup.add(pearl);
  }

  toppingGroup.position.set(Math.cos(angle) * radius, heightY, Math.sin(angle) * radius);
  toppingGroup.rotation.y = Math.random() * Math.PI;
  cakeRoot.add(toppingGroup);
  cakeToppingObjects.push(toppingGroup);
  QUEST_STATE.cake.toppings.push(type);
}

function clearCakeToppings() {
  playClickSound();
  if (!cakeRoot) return;
  cakeToppingObjects.forEach(obj => cakeRoot.remove(obj));
  cakeToppingObjects = [];
  QUEST_STATE.cake.toppings = [];
}

function updateCandleButtonUI() {
  const btn = document.getElementById('btnToppingCandle');
  if (!btn) return;
  if (QUEST_STATE.cake.candlePlaced) {
    btn.classList.add('active');
    btn.innerHTML = '<span class="topping-emoji">🕯️</span><span>Lilin Terpasang ✓</span>';
  } else {
    btn.classList.remove('active');
    btn.innerHTML = '<span class="topping-emoji">🕯️</span><span>Pasang Lilin Cantik</span>';
  }
}

function toggleCandle(forceState) {
  if (forceState !== undefined) {
    QUEST_STATE.cake.candlePlaced = forceState;
  } else {
    QUEST_STATE.cake.candlePlaced = !QUEST_STATE.cake.candlePlaced;
    playClickSound();
  }

  if (cakeCandleMesh) {
    cakeCandleMesh.visible = QUEST_STATE.cake.candlePlaced;
  }

  // Extinguish flame if candle is removed
  if (!QUEST_STATE.cake.candlePlaced) {
    QUEST_STATE.cake.candleLit = false;
    if (cakeFlameMesh) cakeFlameMesh.visible = false;
    if (cakeCandleLight) cakeCandleLight.intensity = 0;
    const btnIgnite = document.getElementById('btnCakeIgnite');
    if (btnIgnite && !QUEST_STATE.cake.candleBlown) {
      btnIgnite.innerHTML = '<span>Nyalakan Lilin ✨</span>';
      btnIgnite.style.background = '';
    }
  }

  updateCandleButtonUI();
}

function igniteOrBlowCandle() {
  const btn = document.getElementById('btnCakeIgnite');

  // If candle hasn't been placed on the cake yet, place it automatically!
  if (!QUEST_STATE.cake.candlePlaced) {
    QUEST_STATE.cake.candlePlaced = true;
    if (cakeCandleMesh) cakeCandleMesh.visible = true;
    updateCandleButtonUI();
  }

  if (!QUEST_STATE.cake.candleLit && !QUEST_STATE.cake.candleBlown) {
    // Ignite Candle
    playTone(700, 'triangle', 0.25, 0.2);
    QUEST_STATE.cake.candleLit = true;

    if (cakeFlameMesh) cakeFlameMesh.visible = true;
    if (cakeCandleLight) cakeCandleLight.intensity = 2.0;

    if (btn) {
      btn.innerHTML = '<span>Tiup Lilin 🎂 (Hembus Doa Indah!)</span>';
      btn.style.background = '#E67E22';
    }
  } else if (QUEST_STATE.cake.candleLit) {
    // Blow Candle!
    playBlowSound();
    QUEST_STATE.cake.candleLit = false;
    QUEST_STATE.cake.candleBlown = true;

    if (cakeFlameMesh) cakeFlameMesh.visible = false;
    if (cakeCandleLight) cakeCandleLight.intensity = 0;

    if (btn) {
      btn.innerHTML = '<span>Lilin Berhasil Ditiup! ✨</span>';
      btn.disabled = true;
      btn.style.background = '#27AE60';
    }

    playCelebrationFanfare();
    fireConfettiShower();

    setTimeout(() => {
      switchStage(4);
    }, 1200);
  }
}

// ==========================================================================
// 8. STAGE 4: CELEBRATION, REAL LUXURY COUPONS & DETECTIVE LICENSE
// ==========================================================================

// Confetti Shower Cannon
function fireConfettiShower() {
  const canvas = document.getElementById('confettiCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const confettiPieces = [];
  const colors = ['#E86A82', '#F7D070', '#7CA982', '#8E7CC3', '#5DADE2', '#F39C12', '#E91E63'];

  for (let i = 0; i < 150; i++) {
    confettiPieces.push({
      x: Math.random() * canvas.width,
      y: Math.random() * -canvas.height,
      w: Math.random() * 9 + 5,
      h: Math.random() * 6 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      dy: Math.random() * 3 + 2.5,
      dx: Math.random() * 2 - 1,
      rot: Math.random() * 360,
      dRot: Math.random() * 6 - 3
    });
  }

  let frames = 0;
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    confettiPieces.forEach(p => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rot * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();

      p.y += p.dy;
      p.x += p.dx;
      p.rot += p.dRot;
    });

    frames++;
    if (frames < 280) {
      requestAnimationFrame(animate);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }
  animate();
}

// Luxury Treat Coupons Scratch & Claim Logic
function initScratchCards() {
  for (let i = 1; i <= 4; i++) {
    setupScratchCanvas(`scratchCanvas${i}`, i);
  }
}

function setupScratchCanvas(canvasId, couponId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // Fill gold metallic foil
  const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  grad.addColorStop(0, '#E5C175');
  grad.addColorStop(0.3, '#FFF2D1');
  grad.addColorStop(0.7, '#D4AF37');
  grad.addColorStop(1, '#9A771E');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.font = 'bold 13px sans-serif';
  ctx.fillStyle = '#5A3D05';
  ctx.textAlign = 'center';
  ctx.fillText('✨ GOSOK FOIL EMAS DI SINI ✨', canvas.width / 2, canvas.height / 2 + 5);

  let isScratching = false;

  function scratch(e) {
    if (!isScratching) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
    const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 18, 0, Math.PI * 2);
    ctx.fill();

    playTone(1200 + Math.random() * 400, 'sine', 0.04, 0.04);
  }

  canvas.addEventListener('mousedown', () => (isScratching = true));
  canvas.addEventListener('mousemove', scratch);
  window.addEventListener('mouseup', () => (isScratching = false));

  canvas.addEventListener('touchstart', () => (isScratching = true));
  canvas.addEventListener('touchmove', scratch);
  window.addEventListener('touchend', () => (isScratching = false));
}

function claimCoupon(id) {
  playChimeSound();
  const canvas = document.getElementById(`scratchCanvas${id}`);
  const stamp = document.getElementById(`stampCoupon${id}`);

  // Clear scratch foil
  if (canvas) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.style.pointerEvents = 'none';
  }

  // Stamp officially
  if (stamp) {
    stamp.classList.add('stamped');
  }

  QUEST_STATE.coupons[id] = true;
  alert(`🎉 Kupon #${id} berhasil diklaim secara resmi! Voucher ini berlaku seumur hidup dan siap kamu tagihkan ke Mas Ilham kapan saja!`);
}

function generateCustomCoupon() {
  const input = document.getElementById('customCouponInput');
  const result = document.getElementById('customCouponResult');
  const text = input ? input.value.trim() : '';

  if (!text) {
    alert("Ketik traktiran atau permintaan khususmu terlebih dahulu!");
    return;
  }

  playCelebrationFanfare();
  const serial = `CUSTOM-HR28-${Math.floor(1000 + Math.random() * 9000)}`;

  if (result) {
    result.style.display = 'block';
    result.innerHTML = `
      <div style="font-family: var(--font-display); font-weight: 800; color: #E86A82; font-size: 1.1rem; margin-bottom: 6px;">
        🎫 VOUCHER RESMI REQUEST HARURU
      </div>
      <div style="font-size: 1.05rem; font-weight: 700; color: #2D1A13; margin-bottom: 8px;">
        "${escapeHtml(text)}"
      </div>
      <div style="font-size: 0.8rem; color: #5D4037; margin-bottom: 10px;">
        SERIAL: <code>${serial}</code> &bull; STATUS: <strong>100% DISETUJUI OLEH MAS ILHAM</strong>
      </div>
      <div style="display: inline-block; border: 2px dashed #C0392B; color: #C0392B; font-weight: 900; padding: 4px 12px; border-radius: 4px; transform: rotate(-3deg); background: #FFF;">
        RESMI TERVERIFIKASI &bull; TANGGAL: 28 OKTOBER 2026
      </div>
    `;
  }
}

// Detective License Generator & High-Res Image Downloader
function downloadDetectiveLicense() {
  playClickSound();

  const canvas = document.createElement('canvas');
  // High-Resolution 1200 x 740 Canvas
  canvas.width = 1200;
  canvas.height = 740;
  const ctx = canvas.getContext('2d');

  // 1. Premium Aged Parchment Gradient Background
  const bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  bgGrad.addColorStop(0, '#FFFDF8');
  bgGrad.addColorStop(0.5, '#FFFBF2');
  bgGrad.addColorStop(1, '#FFF5E6');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 2. Dual Luxury Gold Borders
  // Heavy outer border
  ctx.lineWidth = 6;
  ctx.strokeStyle = '#D4AF37';
  ctx.strokeRect(26, 26, canvas.width - 52, canvas.height - 52);

  // Hairline inner fillet border
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = '#C5A059';
  ctx.strokeRect(38, 38, canvas.width - 76, canvas.height - 76);

  // Corner flourishes
  function drawCornerBracket(x, y, scaleX, scaleY) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scaleX, scaleY);
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(0, 24);
    ctx.lineTo(0, 0);
    ctx.lineTo(24, 0);
    ctx.stroke();

    ctx.fillStyle = '#D4AF37';
    ctx.beginPath();
    ctx.arc(8, 8, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  drawCornerBracket(50, 50, 1, 1);
  drawCornerBracket(canvas.width - 50, 50, -1, 1);
  drawCornerBracket(50, canvas.height - 50, 1, -1);
  drawCornerBracket(canvas.width - 50, canvas.height - 50, -1, -1);

  // 3. Top Agency Header Row
  ctx.textAlign = 'left';
  ctx.font = 'bold 24px Georgia, serif';
  ctx.fillStyle = '#3E271D';
  ctx.fillText('BIRO DETEKTIF RESMI HARURU', 70, 84);

  ctx.font = '600 13px Georgia, serif';
  ctx.fillStyle = '#8D6E63';
  ctx.fillText('KASUS SPESIAL • 28 OKTOBER 2026', 70, 108);

  // Dedicated Rank Pill Badge (Right Aligned, NO TEXT COLLISION!)
  const pillW = 200;
  const pillH = 40;
  const pillX = canvas.width - 70 - pillW;
  const pillY = 66;

  ctx.save();
  ctx.fillStyle = '#C0392B';
  ctx.beginPath();
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(pillX, pillY, pillW, pillH, 8);
  } else {
    ctx.rect(pillX, pillY, pillW, pillH);
  }
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#F1C40F';
  ctx.stroke();

  ctx.font = 'bold 15px "Segoe UI", sans-serif';
  ctx.fillStyle = '#FFFDF8';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('RANK: S-CLASS MASTER', pillX + pillW / 2, pillY + pillH / 2);
  ctx.restore();

  // Header dividing gold rule
  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(70, 128);
  ctx.lineTo(canvas.width - 70, 128);
  ctx.stroke();

  // 4. Photo Identification Frame (Left Column)
  const photoX = 70;
  const photoY = 162;
  const photoW = 180;
  const photoH = 240;

  ctx.fillStyle = '#FFF2DF';
  ctx.beginPath();
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(photoX, photoY, photoW, photoH, 8);
  } else {
    ctx.rect(photoX, photoY, photoW, photoH);
  }
  ctx.fill();
  ctx.strokeStyle = '#C5B09E';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Chibi avatar
  ctx.font = '68px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('🕵️‍♀️', photoX + photoW / 2, photoY + 95);

  // Plaque underneath avatar
  const plaqueW = 140;
  const plaqueH = 32;
  const plaqueX = photoX + (photoW - plaqueW) / 2;
  const plaqueY = photoY + photoH - 48;

  ctx.fillStyle = '#F5EBE1';
  ctx.beginPath();
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(plaqueX, plaqueY, plaqueW, plaqueH, 4);
  } else {
    ctx.rect(plaqueX, plaqueY, plaqueW, plaqueH);
  }
  ctx.fill();
  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.font = 'bold 15px "Segoe UI", sans-serif';
  ctx.fillStyle = '#7A5608';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('HARURU', photoX + photoW / 2, plaqueY + plaqueH / 2);

  // 5. Official Details Column (Middle)
  const infoX = 290;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';

  // Detective title
  ctx.font = 'bold 28px Georgia, serif';
  ctx.fillStyle = '#2D2320';
  ctx.fillText('HARURU • DETEKTIF UTAMA', infoX, 204);

  // Metadata key-values with comfortable line height
  const fieldStartY = 254;
  const fieldGap = 42;
  const fields = [
    { label: 'NOMOR LISENSI', val: 'HR-2810-2026' },
    { label: 'TANGGAL RESMI', val: '28 OKTOBER 2026' },
    { label: 'STATUS', val: 'AKTIF & TERVERIFIKASI RESMI' },
    { label: 'WILAYAH KERJA', val: 'KOTA BANDUNG & SQUAD DISCORD RTM' }
  ];

  fields.forEach((f, idx) => {
    const y = fieldStartY + idx * fieldGap;

    ctx.font = '600 16px Georgia, serif';
    ctx.fillStyle = '#795548';
    ctx.fillText(`${f.label.padEnd(14, ' ')} :`, infoX, y);

    ctx.font = 'bold 16px "Segoe UI", sans-serif';
    ctx.fillStyle = '#2D1B13';
    ctx.fillText(f.val, infoX + 210, y);
  });

  // 6. Right Column Official Red Wax Seal Stamp
  const sealX = 1040;
  const sealY = 282;
  const sealR = 68;

  ctx.save();
  ctx.shadowColor = 'rgba(192, 57, 43, 0.4)';
  ctx.shadowBlur = 18;
  ctx.shadowOffsetY = 6;

  ctx.beginPath();
  ctx.arc(sealX, sealY, sealR, 0, Math.PI * 2);
  ctx.fillStyle = '#B71C1C';
  ctx.fill();

  ctx.lineWidth = 3;
  ctx.strokeStyle = '#E57373';
  ctx.stroke();

  ctx.shadowColor = 'transparent';
  ctx.beginPath();
  ctx.arc(sealX, sealY, sealR - 8, 0, Math.PI * 2);
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = '#FFCDD2';
  ctx.stroke();

  ctx.font = 'bold 18px "Segoe UI", sans-serif';
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('🌸 RESMI', sealX, sealY - 14);

  ctx.font = 'bold 15px "Segoe UI", sans-serif';
  ctx.fillText('28 OKT', sealX, sealY + 10);

  ctx.font = 'bold 10px "Segoe UI", sans-serif';
  ctx.fillStyle = '#FFE082';
  ctx.fillText('VERIFIED', sealX, sealY + 28);
  ctx.restore();

  // 7. Bottom Footnote & Endorsements
  ctx.strokeStyle = '#E0D0B8';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(70, 480);
  ctx.lineTo(canvas.width - 70, 480);
  ctx.stroke();

  ctx.font = 'italic 15px Georgia, serif';
  ctx.fillStyle = '#5D4037';
  ctx.textAlign = 'center';
  ctx.fillText(
    'Lisensi resmi ini diterbitkan secara sah atas keberhasilan memecahkan Kasus Spesial 28 Oktober.',
    canvas.width / 2,
    520
  );

  // Authority signatures
  const sigY = 585;
  ctx.font = 'bold 16px Georgia, serif';
  ctx.fillStyle = '#3E271D';
  ctx.textAlign = 'center';
  ctx.fillText('Mas Ilham Endriadi', 260, sigY);
  ctx.font = '13px "Segoe UI", sans-serif';
  ctx.fillStyle = '#795548';
  ctx.fillText('Kawan Seberang Pulau (Padang)', 260, sigY + 22);

  ctx.font = '24px sans-serif';
  ctx.fillText('⭐ 🌸 ⭐', canvas.width / 2, sigY + 10);

  ctx.font = 'bold 16px Georgia, serif';
  ctx.fillStyle = '#3E271D';
  ctx.fillText('Segenap Sahabat Discord RTM', canvas.width - 260, sigY);
  ctx.font = '13px "Segoe UI", sans-serif';
  ctx.fillStyle = '#795548';
  ctx.fillText('Keluarga Server & Squad Mabar', canvas.width - 260, sigY + 22);

  // Bottom Security Serial
  ctx.font = '11px monospace';
  ctx.fillStyle = '#A1887F';
  ctx.textAlign = 'center';
  ctx.fillText('ID OTENTIKASI RESMI: HR-28102026-BDG-SQUAD-RTM-VERIFIED', canvas.width / 2, 680);

  // 8. Trigger Download
  const link = document.createElement('a');
  link.download = 'Lisensi_Detektif_Haruru_28_Oktober.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
}

// ==========================================================================
// 9. CORKBOARD MEMO WALL: DATABASE PERSISTENCE & MODERATION (API/WISHES)
// ==========================================================================

async function loadWishesFromDatabase() {
  const grid = document.getElementById('corkboardGrid');
  if (!grid) return;

  // 1. Initial Instant Render from Cache or Defaults
  let localWishes = DEFAULT_WISHES;
  try {
    const cached = localStorage.getItem('haruru_cached_wishes');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) localWishes = parsed;
    }
  } catch (_) {}
  renderWishesGrid(localWishes);

  // 2. Fetch live data from /api/wishes backend database
  try {
    const res = await fetch(WISHES_API_URL, { timeout: 4000 });
    if (res.ok) {
      const data = await res.json();
      if (data && data.status === 'success' && Array.isArray(data.wishes)) {
        // Filter out irrelevant or test wishes, prioritize Haruru's
        const validWishes = data.wishes.filter(w => w.name && w.message);
        if (validWishes.length > 0) {
          localStorage.setItem('haruru_cached_wishes', JSON.stringify(validWishes));
          renderWishesGrid(validWishes);
        }
      }
    }
  } catch (err) {
    console.log("Menggunakan kartu ucapan lokal (offline/cache):", err);
  }
}

function renderWishesGrid(wishesList) {
  const grid = document.getElementById('corkboardGrid');
  if (!grid) return;

  const rotations = [-2.2, 1.8, -1.2, 2.4, -1.8, 1.4, -2.5, 2.0];
  const themes = ['theme-rose', 'theme-butter', 'theme-mint', 'theme-sky', 'theme-lavender', 'theme-peach'];
  const pinTypes = ['gold', 'rose', 'silver'];
  const washiTypes = ['', 'tape-matcha', 'tape-gold'];
  const isModMode = getModerationToken();

  grid.innerHTML = wishesList.map((w, idx) => {
    const rot = rotations[idx % rotations.length];
    const theme = themes[idx % themes.length];
    const name = escapeHtml(w.name || 'Sahabat');
    const role = escapeHtml(w.role || 'Kawan Discord');
    const msg = escapeHtml(w.message || '');
    const avatar = escapeHtml(w.avatar || '🌸');
    const time = escapeHtml(w.time || 'Hari ini');

    // Alternate between 3D metallic push pin and textured washi tape
    const usePin = (idx % 2 === 0);
    let topAttachmentHtml = '';
    if (usePin) {
      const pinVariant = pinTypes[Math.floor(idx / 2) % pinTypes.length];
      topAttachmentHtml = `<div class="pin-metallic-3d pin-${pinVariant}"></div>`;
    } else {
      const washiVariant = washiTypes[Math.floor(idx / 2) % washiTypes.length];
      const tapeRot = (idx % 3 === 0) ? -2 : 2;
      topAttachmentHtml = `<div class="washi-strip-tape ${washiVariant}" style="--tape-rot: ${tapeRot}deg;"></div>`;
    }

    const deleteBtn = isModMode ? `
      <button type="button" class="btn-delete-wish" onclick="deleteWish('${escapeAttr(name)}', '${escapeAttr(msg)}')">
        ✕ Hapus
      </button>
    ` : '';

    return `
      <div class="sticky-note-card ${theme}" style="--rot: ${rot}deg;">
        ${topAttachmentHtml}
        <div class="note-header-row">
          <span class="note-avatar">${avatar}</span>
          <div class="note-author-info">
            <div class="note-author-name">${name}</div>
            <span class="note-author-role">${role}</span>
          </div>
        </div>
        <p class="note-message">"${msg}"</p>
        <div class="note-footer-row">
          <span>${time}</span>
          <span class="note-stamp-mark">🌸 28 Okt</span>
          ${deleteBtn}
        </div>
      </div>
    `;
  }).join('');
}

async function submitNewWish(e) {
  e.preventDefault();
  playClickSound();

  const nameInput = document.getElementById('inputName');
  const roleInput = document.getElementById('inputRole');
  const msgInput = document.getElementById('inputMsg');
  const avatarChecked = document.querySelector('input[name="wishAvatar"]:checked');
  const submitBtn = document.getElementById('btnSubmitWish');

  const name = nameInput ? nameInput.value.trim() : '';
  const role = roleInput ? roleInput.value.trim() || 'Sahabat' : 'Sahabat';
  const message = msgInput ? msgInput.value.trim() : '';
  const avatar = avatarChecked ? avatarChecked.value : '🌸';

  if (!name || !message) {
    alert("Silakan isi nama dan pesan ucapan terlebih dahulu.");
    return;
  }

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Menempelkan kartu... ⏳';
  }

  const newWishObj = {
    name: name,
    role: role,
    avatar: avatar,
    message: message,
    time: 'Baru saja'
  };

  // 1. Optimistic Local Update
  try {
    const cached = localStorage.getItem('haruru_cached_wishes');
    let list = cached ? JSON.parse(cached) : [...DEFAULT_WISHES];
    list.unshift(newWishObj);
    localStorage.setItem('haruru_cached_wishes', JSON.stringify(list));
    renderWishesGrid(list);
  } catch (_) {}

  // 2. Post to Database Server
  try {
    await fetch(WISHES_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newWishObj)
    });
  } catch (err) {
    console.log("Penyimpanan lokal berhasil, sinkronisasi server tertunda:", err);
  }

  playChimeSound();
  alert("🎉 Kartu ucapanmu berhasil ditempelkan di papan memo Haruru!");

  // Reset form
  if (nameInput) nameInput.value = '';
  if (roleInput) roleInput.value = '';
  if (msgInput) msgInput.value = '';
  if (submitBtn) {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Tempelkan ke Papan Memo 📌';
  }
}

// Moderation PIN Controller
function getModerationToken() {
  return sessionStorage.getItem('rtm_mod_token') || localStorage.getItem('rtm_mod_token') || '';
}

function toggleModerationMode() {
  playClickSound();
  const token = getModerationToken();
  if (token) {
    if (confirm("Keluar dari mode moderasi papan kartu ucapan?")) {
      sessionStorage.removeItem('rtm_mod_token');
      localStorage.removeItem('rtm_mod_token');
      updateModState();
      loadWishesFromDatabase();
    }
  } else {
    openModal('boardModModal');
  }
}

function updateModState() {
  const token = getModerationToken();
  const btn = document.getElementById('modToggleBtn');
  const icon = document.getElementById('modToggleIcon');
  const text = document.getElementById('modToggleText');
  if (btn && icon && text) {
    if (token) {
      btn.classList.add('active');
      icon.textContent = '🔓';
      text.textContent = 'Mode Moderasi Aktif';
    } else {
      btn.classList.remove('active');
      icon.textContent = '🔒';
      text.textContent = 'Moderasi Papan';
    }
  }
}

async function submitModerationPin(e) {
  e.preventDefault();
  const input = document.getElementById('boardModPinInput');
  const err = document.getElementById('boardModError');
  const pin = input ? input.value.trim() : '';
  if (!pin) return;

  try {
    const res = await fetch(`${ADMIN_API_BASE}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin: pin, password: pin })
    });
    const data = await res.json();
    if (res.ok && data.token) {
      sessionStorage.setItem('rtm_mod_token', data.token);
      localStorage.setItem('rtm_mod_token', data.token);
      closeModal('boardModModal');
      updateModState();
      loadWishesFromDatabase();
      alert("Akses moderasi aktif! Anda sekarang bisa menghapus catatan.");
    } else {
      if (err) { err.textContent = data.message || "PIN tidak valid."; err.style.display = 'block'; }
    }
  } catch (_) {
    // Offline / demo fallback PIN 1234
    if (pin === '1234' || pin === 'admin123') {
      sessionStorage.setItem('rtm_mod_token', 'local_admin');
      closeModal('boardModModal');
      updateModState();
      loadWishesFromDatabase();
    } else {
      if (err) { err.textContent = "PIN salah."; err.style.display = 'block'; }
    }
  }
}

async function deleteWish(name, message) {
  if (!confirm(`Hapus kartu ucapan dari "${name}"?`)) return;

  playClickSound();
  const token = getModerationToken();

  // 1. Remove from local storage
  try {
    const cached = localStorage.getItem('haruru_cached_wishes');
    if (cached) {
      let list = JSON.parse(cached);
      list = list.filter(w => !(w.name === name && w.message === message));
      localStorage.setItem('haruru_cached_wishes', JSON.stringify(list));
      renderWishesGrid(list);
    }
  } catch (_) {}

  // 2. Call delete API
  try {
    await fetch(WISHES_API_URL, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ name, message })
    });
  } catch (_) {}

  alert("Kartu ucapan berhasil dihapus.");
}

// ==========================================================================
// 10. UTILITY HELPERS
// ==========================================================================
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.style.display = 'flex';
}

function closeModal(id) {
  playClickSound();
  const modal = document.getElementById(id);
  if (modal) modal.style.display = 'none';
}

function updateDialogue(msg) {
  const el = document.getElementById('dialogueText');
  if (el) el.textContent = `"${msg}"`;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function escapeAttr(str) {
  return String(str).replace(/'/g, "\\'").replace(/"/g, '&quot;');
}
