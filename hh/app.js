/* ==========================================================================
   ILHAM ENDRIADI & HARURU: OKTOBER BIRTHDAY SCRAPBOOK INTERACTIVE ENGINE
   Ilham: 7 Oktober (Padang) | Haruru: 28 Oktober (Bandung)
   Autoplay Soundtrack: YdpiHMVL4C0 (Ghea Indrawari - Jiwa Yang Bersedih)
   Features: Auto Love Rain, Scroll Reveal, Discord Greetings Wall, Zero Em Dashes
   ========================================================================== */

// --- YOUTUBE AUTOPLAY INTEGRATION ---
const YOUTUBE_VIDEO_ID = 'YdpiHMVL4C0';
let ytPlayer = null;
let isAudioPlaying = false;
let hasUserInteracted = false;

// Load YouTube IFrame API
const ytScriptTag = document.createElement('script');
ytScriptTag.src = 'https://www.youtube.com/iframe_api';
const firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(ytScriptTag, firstScriptTag);

window.onYouTubeIframeAPIReady = function() {
  ytPlayer = new YT.Player('ytPlayerContainer', {
    height: '1',
    width: '1',
    videoId: YOUTUBE_VIDEO_ID,
    playerVars: {
      autoplay: 1,
      loop: 1,
      playlist: YOUTUBE_VIDEO_ID,
      controls: 0,
      modestbranding: 1,
      playsinline: 1,
      enablejsapi: 1
    },
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange
    }
  });
};

function onPlayerReady(event) {
  try {
    event.target.playVideo();
  } catch (e) {}
}

function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.PLAYING) {
    isAudioPlaying = true;
    updateCassetteVisuals(true);
  } else if (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.ENDED) {
    isAudioPlaying = false;
    updateCassetteVisuals(false);
  }
}

function toggleAudio() {
  if (!ytPlayer || typeof ytPlayer.playVideo !== 'function') return;
  if (isAudioPlaying) {
    ytPlayer.pauseVideo();
    isAudioPlaying = false;
    updateCassetteVisuals(false);
  } else {
    ytPlayer.playVideo();
    isAudioPlaying = true;
    updateCassetteVisuals(true);
  }
}

function updateCassetteVisuals(playing) {
  const spools = document.querySelectorAll('.spool');
  const btn = document.getElementById('audioToggleBtn');
  const text = document.getElementById('audioBtnText');
  
  spools.forEach(s => {
    if (playing) s.classList.add('spinning');
    else s.classList.remove('spinning');
  });

  if (btn && text) {
    if (playing) {
      text.textContent = 'Jeda Musik';
      btn.style.background = '#0D9488';
    } else {
      text.textContent = 'Putar Musik';
      btn.style.background = '#E11D48';
    }
  }
}

// Global user interaction trigger for autoplay fallback & click sparkle
document.addEventListener('click', function unlockAutoplay(e) {
  if (!hasUserInteracted) {
    hasUserInteracted = true;
    if (ytPlayer && typeof ytPlayer.playVideo === 'function' && !isAudioPlaying) {
      ytPlayer.playVideo();
    }
  }
  spawnClickHeart(e);
}, { passive: true });

// --- NATIVE WEB AUDIO API SYNTHESIZER ---
let audioCtx = null;
function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) audioCtx = new AudioContextClass();
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playTickSound() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(600, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.05);
  gain.gain.setValueAtTime(0.12, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.05);
}

function playBlowSound() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const bufferSize = ctx.sampleRate * 0.4;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.15));
  }
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(800, ctx.currentTime);
  filter.frequency.linearRampToValueAtTime(200, ctx.currentTime + 0.4);
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.3, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  noise.start();
}

function playCelebrationChimes() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6
  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
    gain.gain.setValueAtTime(0.15, ctx.currentTime + idx * 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.5);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime + idx * 0.08);
    osc.stop(ctx.currentTime + idx * 0.08 + 0.55);
  });
}

// --- CLICK HEARTS SPARKLE ---
const heartSymbols = ['💖', '✨', '🌸', '💫', '❤️', '🌹', '💌'];
function spawnClickHeart(e) {
  if (!e.clientX || !e.clientY) return;
  const heart = document.createElement('div');
  heart.className = 'click-heart';
  heart.textContent = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
  heart.style.left = e.clientX + 'px';
  heart.style.top = e.clientY + 'px';
  document.body.appendChild(heart);
  setTimeout(() => heart.remove(), 1200);
}

// --- AUTOMATIC BACKGROUND LOVE RAIN ENGINE ---
function initLoveRainEngine() {
  const canvas = document.getElementById('rainCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const particles = [];
  const maxParticles = 32;
  const symbols = ['♥', '🌸', '✨', '💕', '🌷'];

  for (let i = 0; i < maxParticles; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 12 + 10,
      speedY: Math.random() * 0.8 + 0.4,
      speedX: Math.random() * 0.4 - 0.2,
      opacity: Math.random() * 0.45 + 0.2,
      symbol: symbols[Math.floor(Math.random() * symbols.length)],
      sway: Math.random() * Math.PI * 2,
      swaySpeed: Math.random() * 0.02 + 0.01
    });
  }

  function renderRain() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      p.y += p.speedY;
      p.sway += p.swaySpeed;
      p.x += Math.sin(p.sway) * 0.6 + p.speedX;

      if (p.y > canvas.height + 20) {
        p.y = -20;
        p.x = Math.random() * canvas.width;
      }
      if (p.x > canvas.width + 20) p.x = -20;
      if (p.x < -20) p.x = canvas.width + 20;

      ctx.save();
      ctx.globalAlpha = p.opacity;
      ctx.font = p.size + 'px Inter, sans-serif';
      ctx.fillStyle = '#E11D48';
      ctx.fillText(p.symbol, p.x, p.y);
      ctx.restore();
    });

    requestAnimationFrame(renderRain);
  }

  renderRain();
}

// --- SCROLL ANIMATIONS & SCROLL PROGRESS ---
function initScrollAnimations() {
  const progressBar = document.getElementById('scrollProgressBar');
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  // Track scroll position
  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (window.scrollY / totalHeight) * 100;
    if (progressBar) progressBar.style.width = progress + '%';

    // Show/hide scroll top button
    if (scrollTopBtn) {
      if (window.scrollY > 320) scrollTopBtn.classList.add('visible');
      else scrollTopBtn.classList.remove('visible');
    }
  }, { passive: true });

  // Ensure all elements are immediately revealed
  revealElements.forEach(el => el.classList.add('is-revealed'));

  // Intersection Observer for scroll up & down reveals
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
        }
      });
    }, {
      threshold: 0.05,
      rootMargin: '0px 0px 50px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
  }
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
  playTickSound();
}

// --- GACHA MESIN JODOH / MAK COMBLANG INTERAKTIF ---
const GACHA_CANDIDATES = [
  {
    name: 'Chen',
    percent: 21,
    status: 'Tipe: Teman Mabar. Sering ngajak push rank tapi kalau kalah Ilham yang disalahin.',
    tier: 'low'
  },
  {
    name: 'Si Anu',
    percent: 14,
    status: 'Tipe: Ratu Ghosting. Membalas chat tiga hari sekali. Pas ditanya bilangnya ketiduran.',
    tier: 'low'
  },
  {
    name: 'Mbak-Mbak SCBD',
    percent: 33,
    status: 'Tipe: High Maintenance. Nongkrong minta kopi impor Rp 80rb, dompet Ilham menangis.',
    tier: 'low'
  },
  {
    name: 'Ukhti Misterius',
    percent: 45,
    status: 'Tipe: Sedingin Salju. Balas pesan cuma pakai huruf Y. Suka ngilang tanpa kabar.',
    tier: 'low'
  },
  {
    name: 'Kakak Tingkat',
    percent: 28,
    status: 'Tipe: Manfaatin. Ramah cuma kalau ada tugas kuliah dan perlu tebengan motor.',
    tier: 'low'
  },
  {
    name: 'Haruru (Gadis Bandung & Ultah 28 Oktober)',
    percent: 99.99,
    status: 'SSR Grand Jackpot! Takdir Sejati Padang dan Bandung! Lahir sama-sama di bulan Oktober (Ilham 7 Oktober & Haruru 28 Oktober). Senyumnya Haruru adalah rumah paling damai untuk Ilham. Jarak 1.340 KM takluk di hadapan doa tulus. Jodoh dunia akhirat!',
    tier: 'grand'
  }
];

let gachaSpinCount = 0;
let isGachaSpinning = false;

function pullGacha() {
  if (isGachaSpinning) return;
  isGachaSpinning = true;
  gachaSpinCount++;

  const giftBox = document.getElementById('mysteryGiftBox');
  const revealCard = document.getElementById('giftRevealCard');
  const nameEl = document.getElementById('gachaName');
  const badgeEl = document.getElementById('gachaBadge');
  const statusEl = document.getElementById('gachaStatus');
  const btn = document.getElementById('btnGacha');
  const waBtn = document.getElementById('btnGachaWa');

  if (giftBox) {
    giftBox.classList.remove('opened');
    giftBox.classList.add('shaking');
  }
  if (revealCard) {
    revealCard.style.display = 'none';
  }

  btn.disabled = true;
  badgeEl.className = 'gacha-percent-badge percent-low';
  badgeEl.textContent = 'Membuka Pita Kado...';
  statusEl.textContent = 'Mencocokkan tanggal lahir Oktober dan rasi bintang Padang-Bandung...';

  // Rapid cycling sound and temporary hints
  let counter = 0;
  const cycleInterval = setInterval(() => {
    playTickSound();
    const tempIndex = counter % (GACHA_CANDIDATES.length - 1);
    nameEl.textContent = GACHA_CANDIDATES[tempIndex].name;
    counter++;
  }, 95);

  setTimeout(() => {
    clearInterval(cycleInterval);
    isGachaSpinning = false;
    btn.disabled = false;

    if (giftBox) {
      giftBox.classList.remove('shaking');
      giftBox.classList.add('opened');
    }
    if (revealCard) {
      revealCard.style.display = 'block';
    }

    // Wajib 100% Mendapatkan Haruru (SSR Grand Jackpot Takdir Sejati)
    const selected = GACHA_CANDIDATES[GACHA_CANDIDATES.length - 1]; // HARURU SSR 99.99%

    nameEl.textContent = selected.name;

    if (selected.tier === 'grand') {
      badgeEl.className = 'gacha-percent-badge percent-grand';
      badgeEl.textContent = 'Kecocokan ' + selected.percent + '% (Takdir Sejati)';
      statusEl.textContent = selected.status;
      playCelebrationChimes();
      fireConfetti();

      // Enable WhatsApp sharing with Haruru
      waBtn.style.display = 'inline-flex';
      const msg = encodeURIComponent(
        'Halo Haruru! Aku baru aja narik Gacha Jodoh di website ultahku, dan hasilnya kamu keluar sebagai Grand Jackpot 99.99% Takdir Sejati Padang-Bandung! Ilham (7 Okt) & Haruru (28 Okt) jodoh bulan Oktober ❤️'
      );
      waBtn.href = 'https://api.whatsapp.com/send?text=' + msg;
    } else {
      badgeEl.className = 'gacha-percent-badge percent-low';
      badgeEl.textContent = 'Kecocokan ' + selected.percent + '%';
      statusEl.textContent = selected.status;
      waBtn.style.display = 'none';
    }
  }, 1600);
}

// --- TIUP LILIN 7 OKTOBER ---
let isCandleBlown = false;

function blowCandle() {
  if (isCandleBlown) return;
  isCandleBlown = true;

  playBlowSound();

  const flame = document.getElementById('candleFlame');
  const smoke = document.getElementById('candleSmoke');
  const wishCard = document.getElementById('wishCard');
  const blowBtn = document.getElementById('btnBlow');

  flame.classList.add('blown-out');
  smoke.style.display = 'block';
  blowBtn.disabled = true;
  blowBtn.textContent = 'Lilin Telah Padam! Doa Terkabul 🎂';

  setTimeout(() => {
    playCelebrationChimes();
    fireConfetti();
    wishCard.style.display = 'block';
  }, 400);
}

// --- POLAROID 3D FLIP ---
function initPolaroids() {
  const cards = document.querySelectorAll('.polaroid-card');
  cards.forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('is-flipped');
      playTickSound();
    });
  });
}

// --- INTERACTIVE SCRATCH CARD ---
function initScratchCard() {
  const canvas = document.getElementById('scratchCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const rect = canvas.getBoundingClientRect();
  const w = rect.width > 0 ? Math.round(rect.width) : (canvas.offsetWidth || 440);
  const h = rect.height > 0 ? Math.round(rect.height) : (canvas.offsetHeight || 220);
  canvas.width = w;
  canvas.height = h;

  // Fill canvas with premium gold metallic gradient
  ctx.globalCompositeOperation = 'source-over';
  const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  grad.addColorStop(0, '#D97706');
  grad.addColorStop(0.35, '#FBBF24');
  grad.addColorStop(0.7, '#F59E0B');
  grad.addColorStop(1, '#B45309');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Decorative border
  ctx.strokeStyle = '#78350F';
  ctx.lineWidth = 3;
  ctx.strokeRect(8, 8, canvas.width - 16, canvas.height - 16);

  ctx.fillStyle = '#78350F';
  ctx.font = 'bold 15px "Plus Jakarta Sans", Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('✨ GOSOK DENGAN JARI / MOUSE ✨', canvas.width / 2, canvas.height / 2 - 8);
  ctx.font = '13px "Plus Jakarta Sans", Inter, sans-serif';
  ctx.fillText('Untuk Membuka Hadiah Rahasia Ilham', canvas.width / 2, canvas.height / 2 + 16);

  let isDrawing = false;
  let isRevealed = false;

  function getCoords(clientX, clientY) {
    const r = canvas.getBoundingClientRect();
    const scaleX = r.width > 0 ? (canvas.width / r.width) : 1;
    const scaleY = r.height > 0 ? (canvas.height / r.height) : 1;
    return {
      x: (clientX - r.left) * scaleX,
      y: (clientY - r.top) * scaleY
    };
  }

  function scratch(x, y) {
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 24, 0, Math.PI * 2);
    ctx.fill();

    if (!isRevealed) checkScratchPercentage();
  }

  function checkScratchPercentage() {
    try {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      let transparentCount = 0;
      const step = 24;
      for (let i = 3; i < imgData.data.length; i += step * 4) {
        if (imgData.data[i] === 0) transparentCount++;
      }
      const totalSamples = imgData.data.length / (step * 4);
      const percent = (transparentCount / totalSamples) * 100;

      const statusEl = document.getElementById('scratchStatus');
      if (statusEl && !isRevealed) {
        statusEl.textContent = 'Tergosok: ' + Math.min(100, Math.round(percent)) + '%';
      }

      if (percent > 45 && !isRevealed) {
        isRevealed = true;
        canvas.style.transition = 'opacity 0.6s ease';
        canvas.style.opacity = '0';
        setTimeout(() => { canvas.style.display = 'none'; }, 600);
        if (statusEl) statusEl.textContent = 'Selamat! Voucher Hadiah Berhasil Terbuka!';
        playCelebrationChimes();
        fireConfetti();
      }
    } catch (err) {}
  }

  canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    const pt = getCoords(e.clientX, e.clientY);
    scratch(pt.x, pt.y);
  });
  window.addEventListener('mouseup', () => { isDrawing = false; });
  canvas.addEventListener('mousemove', (e) => {
    if (!isDrawing) return;
    const pt = getCoords(e.clientX, e.clientY);
    scratch(pt.x, pt.y);
  });

  // Touch support for mobile
  canvas.addEventListener('touchstart', (e) => {
    isDrawing = true;
    const t = e.touches[0];
    const pt = getCoords(t.clientX, t.clientY);
    scratch(pt.x, pt.y);
  }, { passive: true });
  canvas.addEventListener('touchend', () => { isDrawing = false; });
  canvas.addEventListener('touchmove', (e) => {
    if (!isDrawing) return;
    const t = e.touches[0];
    const pt = getCoords(t.clientX, t.clientY);
    scratch(pt.x, pt.y);
  }, { passive: true });
}

// --- SURAT WAX SEAL TYPEWRITER ---
const LETTER_TEXT = `Untuk Ilham Endriadi, pria terhebat asal Padang yang kemarin bertambah usia pada 7 Oktober.

Pertama-tama, dari lubuk hati terdalam, maafkan aku yaa Ilhamku sayang kalau kejutan dan surat kecil ini datangnya telat sehari dari tanggal 7 kemarin... Tapi sungguh, doa tulus dan rasa sayangku kepadamu tak pernah sedetik pun terlambat.

Tahukah kamu betapa indahnya takdir kita? Dua insan yang sama-sama lahir di bulan Oktober: kamu kemarin tanggal 7 Oktober, dan aku tanggal 28 Oktober. Dua puluh satu hari yang memisahkan hari lahir kita, namun mengikat hati kita dalam satu bulan penuh cinta.

Terima kasih telah selalu sabar, tangguh, dan membuat hariku selalu berwarna. Semoga di usiamu yang baru ini, setiap langkahmu dimudahkan, rezekimu dilimpahkan, dan impian besarmu terwujud satu per satu.

Jangan pernah ragu, karena di setiap sujud dan doa malamku, namamu adalah yang paling rajin kuselipkan. Sampai jumpa di hari kita bisa merayakan hari bahagiamu bersama tanpa lagi ada jarak di antara kita.`;

let letterOpened = false;
function openWaxLetter() {
  if (letterOpened) return;
  letterOpened = true;

  playCelebrationChimes();

  const env = document.getElementById('envelopeWrapper');
  const sheet = document.getElementById('letterSheet');
  const content = document.getElementById('letterContent');

  env.style.display = 'none';
  sheet.style.display = 'block';

  let charIdx = 0;
  content.textContent = '';
  const typeInterval = setInterval(() => {
    if (charIdx < LETTER_TEXT.length) {
      content.textContent += LETTER_TEXT.charAt(charIdx);
      charIdx++;
      if (charIdx % 8 === 0) playTickSound();
    } else {
      clearInterval(typeInterval);
    }
  }, 24);
}

// --- COMMUNITY DISCORD & FRIENDS GREETINGS WALL ---
const DEFAULT_GREETINGS = [
  {
    name: 'Haruru',
    role: 'Gadis Bandung (Ultah 28 Okt)',
    avatar: '🌸',
    roleClass: 'role-bandung',
    message: 'Happy belated birthday Ilhamku sayang! Maafkan yaa aku telat sehari ngucapinnya dari tanggal 7 kemarin... Tapi cintaku dan doaku gak pernah terlambat sedetik pun buat kamu. Semoga sehat selalu, rezeki berkah melimpah, dan jangan lupa 21 hari lagi gantian aku yang ultah tanggal 28 Oktober yaa! Hehe ❤️',
    time: 'Kemarin, 7 Oktober'
  },
  {
    name: 'Segenap Keluarga Discord RTM',
    role: 'Komunitas & Admin Discord RTM',
    avatar: '🤖',
    roleClass: 'role-discord',
    message: 'Barakallahu fii umrik Bang Ilham Endriadi! Maaf kami dari segenap keluarga Discord RTM baru sempat ngucapin hari ini, telat sehari dari tanggal 7 kemarin. Doa tulus dari kami semua: semoga Bang Ilham selalu diberikan kesehatan, panjang umur dalam keberkahan, pintu rezekinya makin luas membentang tanpa batas, dimudahkan segala urusan dan pekerjaan, serta sukses selalu dalam setiap langkah hidupnya! Salam hangat dan respek dari seluruh member Discord RTM.',
    time: 'Kemarin'
  },
  {
    name: 'Kerabat Urang Awak',
    role: 'Komunitas Ranah Minang',
    avatar: '🏛️',
    roleClass: 'role-minang',
    message: 'Salamaik ulang tahun sanak Ilham! Kok jauah di mato dakek di hati. Maaf talambek sahari maucapkan. Semoga sehat salalu, dimudahkan sagalo urusan, rezeki makin malimpah jo makin luas, sarato taruih manjadi kabanggaan kaluarga!',
    time: '7 Oktober'
  },
  {
    name: 'Kawan Mabar Discord RTM',
    role: 'Squad Mabar Discord RTM',
    avatar: '🎮',
    roleClass: 'role-discord',
    message: 'Happy belated birthday Bang Ilham! Doa terbaik buat Abang: rezeki makin luas, karier makin melesat, dan sehat selalu. Sukses terus buat Bang Ilham!',
    time: '7 Oktober'
  }
];

function initGreetingsWall() {
  const container = document.getElementById('wishesBoard');
  if (!container) return;

  let allWishes = DEFAULT_GREETINGS;
  try {
    const saved = localStorage.getItem('rtm_ilham_wishes');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        allWishes = parsed;
      }
    }
  } catch (e) {
    allWishes = DEFAULT_GREETINGS;
  }

  renderWishes(allWishes);
}

function renderWishes(list) {
  const container = document.getElementById('wishesBoard');
  if (!container) return;
  container.innerHTML = '';

  list.forEach(item => {
    const note = document.createElement('article');
    note.className = 'wish-sticky-note';
    note.innerHTML = `
      <div class="wish-note-tape"></div>
      <div class="wish-sender-bar">
        <div class="wish-avatar">${item.avatar || '💌'}</div>
        <div class="wish-sender-info">
          <span class="wish-sender-name">${escapeHTML(item.name)}</span>
          <span class="wish-sender-role ${item.roleClass || ''}">${escapeHTML(item.role)}</span>
        </div>
      </div>
      <div class="wish-message-body">"${escapeHTML(item.message)}"</div>
      <div class="wish-time">${escapeHTML(item.time || 'Hari ini')}</div>
    `;
    container.appendChild(note);
  });
}

function submitNewWish(event) {
  event.preventDefault();
  const nameInput = document.getElementById('newWishName');
  const roleInput = document.getElementById('newWishRole');
  const msgInput = document.getElementById('newWishMsg');

  const name = nameInput.value.trim();
  const role = roleInput.value.trim() || 'Sahabat Discord';
  const msg = msgInput.value.trim();

  if (!name || !msg) return;

  const newEntry = {
    name: name,
    role: role,
    avatar: '💌',
    roleClass: 'role-discord',
    message: msg,
    time: 'Baru saja'
  };

  const saved = localStorage.getItem('rtm_ilham_wishes');
  const currentList = saved ? JSON.parse(saved) : [...DEFAULT_GREETINGS];
  currentList.push(newEntry);
  localStorage.setItem('rtm_ilham_wishes', JSON.stringify(currentList));

  renderWishes(currentList);
  nameInput.value = '';
  roleInput.value = '';
  msgInput.value = '';

  playCelebrationChimes();
  fireConfetti();
}

function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, tag => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[tag] || tag));
}

// --- CELEBRATION CONFETTI ENGINE ---
function fireConfetti() {
  const canvas = document.getElementById('confettiCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const colors = ['#E11D48', '#F59E0B', '#10B981', '#3B82F6', '#EC4899', '#8B5CF6'];

  for (let i = 0; i < 90; i++) {
    particles.push({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      vx: (Math.random() - 0.5) * 16,
      vy: (Math.random() - 0.7) * 18,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 1,
      rotation: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 10
    });
  }

  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let activeCount = 0;

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.45;
      p.rotation += p.vRot;
      p.alpha -= 0.012;

      if (p.alpha > 0) {
        activeCount++;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      }
    });

    if (activeCount > 0) requestAnimationFrame(render);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  render();
}

// --- INITIALIZE ON DOM READY & CLOUDFLARE ROCKET LOADER RESILIENT ---
let appInitialized = false;
function startApp() {
  if (appInitialized) return;
  appInitialized = true;
  initLoveRainEngine();
  initScrollAnimations();
  initPolaroids();
  initScratchCard();
  initGreetingsWall();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startApp);
} else {
  startApp();
}
window.addEventListener('load', startApp);
setTimeout(startApp, 300);
