/* ==========================================================================
   ILHAM ENDRIADI & HARURU: OKTOBER BIRTHDAY SCRAPBOOK INTERACTIVE ENGINE
   Ilham: 7 Oktober (Padang) | Haruru: 28 Oktober (Bandung)
   Autoplay Soundtrack: YdpiHMVL4C0 (Ghea Indrawari - Jiwa Yang Bersedih)
   Features: Auto Love Rain, Scroll Reveal, Discord Greetings Wall, Zero Em Dashes
   ========================================================================== */

// --- YOUTUBE ON-DEMAND / LAZY AUDIO ENGINE (ZERO NETWORK SPAM AT LAUNCH) ---
const YOUTUBE_VIDEO_ID = 'YdpiHMVL4C0';
let ytPlayer = null;
let isAudioPlaying = false;
let isYtLoading = false;

function loadYouTubePlayer(autoStart = true) {
  if (ytPlayer && typeof ytPlayer.playVideo === 'function') {
    if (autoStart) {
      ytPlayer.playVideo();
      isAudioPlaying = true;
      updateCassetteVisuals(true);
    }
    return;
  }
  if (isYtLoading) return;
  isYtLoading = true;

  const text = document.getElementById('audioBtnText');
  if (text) text.textContent = 'Memuat Musik... ⏳';

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
        onReady: function(event) {
          isYtLoading = false;
          try {
            if (autoStart) {
              event.target.playVideo();
              isAudioPlaying = true;
              updateCassetteVisuals(true);
            }
          } catch (e) {}
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
    updateCassetteVisuals(true);
  } else if (typeof YT !== 'undefined' && (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.ENDED)) {
    isAudioPlaying = false;
    updateCassetteVisuals(false);
  }
}

function toggleAudio() {
  if (!ytPlayer) {
    loadYouTubePlayer(true);
    return;
  }
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

// Global user interaction for click sparkle
document.addEventListener('click', function(e) {
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

// --- CONTINUOUS BIDIRECTIONAL SCROLL ANIMATION & PROGRESS (TANPA BATAS) ---
function initScrollAnimations() {
  const progressBar = document.getElementById('scrollProgressBar');
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  const flyingPlane = document.getElementById('flyingPlane');
  const ldrTrack = document.querySelector('.distance-track');

  let lastScrollY = window.scrollY;
  let scrollDirection = 'down';
  let ticking = false;

  function onScrollFrame() {
    const currentScrollY = window.scrollY;
    if (Math.abs(currentScrollY - lastScrollY) > 2) {
      scrollDirection = currentScrollY > lastScrollY ? 'down' : 'up';
      lastScrollY = currentScrollY;
    }

    // 1. Reading progress bar
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = totalHeight > 0 ? (currentScrollY / totalHeight) * 100 : 0;
    if (progressBar) progressBar.style.width = progress + '%';

    // 2. Scroll-to-top button
    if (scrollTopBtn) {
      if (currentScrollY > 260) scrollTopBtn.classList.add('visible');
      else scrollTopBtn.classList.remove('visible');
    }

    // 3. Parallax flight of the plane across LDR track
    if (flyingPlane && ldrTrack) {
      const trackRect = ldrTrack.getBoundingClientRect();
      if (trackRect.top < window.innerHeight && trackRect.bottom > 0) {
        const factor = Math.max(0, Math.min(1, (window.innerHeight - trackRect.top) / (window.innerHeight + trackRect.height)));
        const trackWidth = Math.max(0, ldrTrack.clientWidth - 40);
        flyingPlane.style.transform = `translateX(${factor * trackWidth}px)`;
      }
    }

    // 4. Continuous bidirectional reveal without limits
    const vh = window.innerHeight;
    revealElements.forEach(el => {
      if (el.classList.contains('hero-scrapbook')) {
        el.classList.add('is-revealed');
        return;
      }

      const rect = el.getBoundingClientRect();
      const inView = rect.top < vh * 0.90 && rect.bottom > vh * 0.08;

      if (inView) {
        if (!el.classList.contains('is-revealed')) {
          el.setAttribute('data-scroll-dir', scrollDirection);
          el.classList.add('is-revealed');
        }
      } else {
        el.classList.remove('is-revealed');
      }
    });

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(onScrollFrame);
      ticking = true;
    }
  }, { passive: true });

  // Initial trigger
  requestAnimationFrame(onScrollFrame);
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

    // Hadiah Spesial: Haruru (Gadis Bandung & Ultah 28 Oktober)
    const grandPrize = GACHA_CANDIDATES[GACHA_CANDIDATES.length - 1];
    nameEl.textContent = '🌸 ' + grandPrize.name;
    badgeEl.className = 'gacha-percent-badge percent-grand';
    badgeEl.textContent = '💖 Kecocokan: ' + grandPrize.percent + '% (SSR Grand Jackpot!)';
    statusEl.innerHTML = '<strong>' + grandPrize.status + '</strong><br><br><span style="color:#d97706;font-weight:600;">✨ Hadiah Spesial Terbuka: Haruru dari Bandung siap kirim ucapan termanis untuk Mas Ilham! ✨</span>';
    playCelebrationChimes();
    fireConfetti();

    if (waBtn) {
      const waMsg = encodeURIComponent(
        'Halo Haruru! 🌸✨ Aku baru buka Kotak Kado Kejutan di web milad Mas Ilham (7 Oktober), dan ternyata dapet kado spesial Haruru (Kecocokan 99.99%)! Wilujeng milad buat Mas Ilham & selamat menyambut ultah Haruru 28 Oktober nanti! 🎂🎉'
      );
      waBtn.href = `https://wa.me/?text=${waMsg}`;
      waBtn.style.display = 'inline-flex';
      const waSpan = waBtn.querySelector('span');
      if (waSpan) waSpan.textContent = '💌 Kirim Pesan Manis ke Haruru via WhatsApp';
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
  blowBtn.textContent = 'Lilin Telah Padam! Semoga Berkah Selalu 🎂';

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
const LETTER_TEXT = `Untuk Mas Ilham Endriadi,

Happy belated birthday yaa Mas Ilham! Maaf kalau ucapan ini baru sempat sampai hari ini, telat sehari dari tanggal 7 kemarin.

Dari Bandung, aku kirim doa yang paling tulus untuk Mas Ilham di Padang:
Semoga Mas Ilham senantiasa diberi limpahan kesehatan, panjang umur dalam keberkahan, rezeki makin luas melimpah, dan sukses selalu dalam setiap langkah hidup serta cita-citanya.

Oh iya, jangan lupa yaa... 21 hari lagi gantian aku yang ulang tahun tanggal 28 Oktober! Awas kalau sampai lupa ngucapin balik yaa! Hehe 😄`;

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

// --- RTM COMMUNITY GREETINGS & SECURE PIN MODERATION ---
const WISHES_API_URL = 'https://api.rtmbot.biz.id/api/wishes';
const ADMIN_API_BASE = 'https://api.rtmbot.biz.id';
const EXCLUDED_WISH_NAMES = ['Kawan Mabar Discord RTM', 'Kerabat Urang Awak', 'Haruru'];

function getModerationToken() {
  return sessionStorage.getItem('rtm_mod_token') || localStorage.getItem('rtm_mod_token') || localStorage.getItem('rtm_admin_token') || '';
}

function getAdminToken() {
  return getModerationToken();
}

function updateModerationState() {
  const token = getModerationToken();
  const toggleBtn = document.getElementById('modToggleBtn');
  const icon = document.getElementById('modToggleIcon');
  const text = document.getElementById('modToggleText');
  if (toggleBtn && icon && text) {
    if (token) {
      toggleBtn.classList.add('active');
      icon.textContent = '🔓';
      text.textContent = 'Mode Moderasi Aktif';
    } else {
      toggleBtn.classList.remove('active');
      icon.textContent = '🔒';
      text.textContent = 'Moderasi Papan';
    }
  }
}

function toggleModerationMode() {
  const token = getModerationToken();
  if (token) {
    if (confirm('Keluar dari mode moderasi papan ucapan?')) {
      sessionStorage.removeItem('rtm_mod_token');
      localStorage.removeItem('rtm_mod_token');
      localStorage.removeItem('rtm_admin_token');
      updateModerationState();
      initGreetingsWall();
    }
  } else {
    openModerationModal();
  }
}

function openModerationModal() {
  const modal = document.getElementById('boardModModal');
  const input = document.getElementById('boardModPinInput');
  const err = document.getElementById('boardModError');
  if (modal) {
    modal.style.display = 'flex';
    if (err) err.style.display = 'none';
    if (input) {
      input.value = '';
      setTimeout(() => input.focus(), 100);
    }
  }
}

function closeModerationModal() {
  const modal = document.getElementById('boardModModal');
  if (modal) modal.style.display = 'none';
}

async function submitModerationPin(e) {
  if (e) e.preventDefault();
  const input = document.getElementById('boardModPinInput');
  const errEl = document.getElementById('boardModError');
  const submitBtn = document.getElementById('btnModSubmit');
  const pin = input ? input.value.trim() : '';

  if (!pin) return;

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Memverifikasi...';
  }
  if (errEl) errEl.style.display = 'none';

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
      closeModerationModal();
      updateModerationState();
      initGreetingsWall();
    } else {
      if (errEl) {
        errEl.textContent = data.message || 'PIN tidak valid.';
        errEl.style.display = 'block';
      }
    }
  } catch (err) {
    if (errEl) {
      errEl.textContent = 'Kendala koneksi ke server.';
      errEl.style.display = 'block';
    }
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Buka Akses';
    }
  }
}

async function deleteWish(name, message) {
  const token = getModerationToken();
  if (!token) {
    openModerationModal();
    return;
  }

  const snippet = message.length > 50 ? message.substring(0, 50) + '...' : message;
  if (!confirm(`Hapus ucapan ini dari papan kenangan?\n\nPengirim: ${name}\nPesan: "${snippet}"`)) {
    return;
  }

  try {
    const res = await fetch(WISHES_API_URL, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ name: name, message: message })
    });
    const data = await res.json();
    if (res.ok && data.status === 'success') {
      try {
        const saved = localStorage.getItem('rtm_ilham_wishes');
        if (saved) {
          let list = JSON.parse(saved);
          list = list.filter(w => !(w.name === name && w.message === message));
          localStorage.setItem('rtm_ilham_wishes', JSON.stringify(list));
        }
        const mySaved = localStorage.getItem('rtm_ilham_my_wishes');
        if (mySaved) {
          let myList = JSON.parse(mySaved);
          myList = myList.filter(w => !(w.name === name && w.message === message));
          localStorage.setItem('rtm_ilham_my_wishes', JSON.stringify(myList));
        }
      } catch (e) {}

      initGreetingsWall();
    } else {
      alert(data.message || 'Gagal menghapus ucapan.');
    }
  } catch (err) {
    alert('Kendala koneksi saat menghapus ucapan.');
  }
}

const DEFAULT_GREETINGS = [
  {
    name: 'Segenap Keluarga Discord RTM',
    role: 'Komunitas & Admin Discord RTM',
    avatar: '🤖',
    roleClass: 'role-discord',
    message: 'Barakallahu fii umrik Mas Ilham Endriadi! Maaf kami dari segenap keluarga Discord RTM baru sempat ngucapin hari ini, telat sehari dari tanggal 7 kemarin. Doa tulus dari kami semua: semoga Mas Ilham selalu diberikan kesehatan, panjang umur dalam keberkahan, pintu rezekinya makin luas membentang tanpa batas, dimudahkan segala urusan dan pekerjaan, serta sukses selalu dalam setiap langkah hidupnya! Salam hangat dan respek dari seluruh member Discord RTM.',
    time: 'Kemarin'
  }
];

function initGreetingsWall() {
  const container = document.getElementById('wishesBoard');
  if (!container) return;

  // 1. Instant local render from storage or defaults (Zero network lag on initial paint)
  let allWishes = DEFAULT_GREETINGS;
  try {
    const saved = localStorage.getItem('rtm_ilham_wishes');
    const mySaved = localStorage.getItem('rtm_ilham_my_wishes');
    let localList = [];
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) localList = parsed;
    }
    if (mySaved) {
      const myParsed = JSON.parse(mySaved);
      if (Array.isArray(myParsed)) {
        myParsed.forEach(mw => {
          if (!localList.some(w => w.name === mw.name && w.message === mw.message)) {
            localList.push(mw);
          }
        });
      }
    }
    if (localList.length > 0) {
      localList = localList.filter(w => !EXCLUDED_WISH_NAMES.includes(w.name));
      allWishes = localList.length > 0 ? localList : DEFAULT_GREETINGS;
      localStorage.setItem('rtm_ilham_wishes', JSON.stringify(allWishes));
    }
  } catch (e) {
    allWishes = DEFAULT_GREETINGS;
  }
  renderWishes(allWishes);

  // 2. Gentle deferred server sync that MERGES instead of clobbering local wishes
  setTimeout(() => {
    fetch(WISHES_API_URL)
      .then(res => res.json())
      .then(data => {
        if (data && data.status === 'success' && Array.isArray(data.wishes)) {
          const serverWishes = data.wishes.filter(w => !EXCLUDED_WISH_NAMES.includes(w.name));
          
          // Get any locally cached wishes & user's own wishes
          let currentLocal = [];
          try {
            const saved = localStorage.getItem('rtm_ilham_wishes');
            if (saved) currentLocal = JSON.parse(saved) || [];
            const myWishesRaw = localStorage.getItem('rtm_ilham_my_wishes');
            if (myWishesRaw) {
              const myParsed = JSON.parse(myWishesRaw) || [];
              myParsed.forEach(mw => {
                if (!currentLocal.some(w => w.name === mw.name && w.message === mw.message)) {
                  currentLocal.push(mw);
                }
              });
            }
          } catch (e) {}

          // Merge: start with server wishes, preserve any local wishes missing on server
          const merged = [...serverWishes];
          const missingOnServer = [];

          currentLocal.forEach(localW => {
            const existsOnServer = merged.some(sw => sw.name === localW.name && sw.message === localW.message);
            if (!existsOnServer && !EXCLUDED_WISH_NAMES.includes(localW.name)) {
              merged.push(localW);
              missingOnServer.push(localW);
            }
          });

          const finalWishes = merged.length > 0 ? merged : DEFAULT_GREETINGS;
          renderWishes(finalWishes);
          localStorage.setItem('rtm_ilham_wishes', JSON.stringify(finalWishes));

          // Auto-sync missing wishes to server in background
          if (missingOnServer.length > 0) {
            missingOnServer.forEach(pendingWish => {
              fetch(WISHES_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  name: pendingWish.name,
                  role: pendingWish.role || 'Sahabat',
                  message: pendingWish.message,
                  avatar: pendingWish.avatar || '💌'
                })
              }).catch(() => {});
            });
          }
        }
      })
      .catch(err => {
        console.log('Server wishes sync fallback to local cache:', err);
      });
  }, 750);
}

function renderWishes(list) {
  const container = document.getElementById('wishesBoard');
  if (!container) return;
  container.innerHTML = '';

  const isAdmin = !!getModerationToken();

  list.forEach(item => {
    const note = document.createElement('article');
    note.className = 'wish-sticky-note';

    const safeName = escapeHTML(item.name).replace(/'/g, "\\'");
    const safeMsg = escapeHTML(item.message).replace(/'/g, "\\'");

    const deleteBtnHtml = isAdmin ? `
      <div class="wish-card-footer">
        <div class="wish-time">${escapeHTML(item.time || 'Hari ini')}</div>
        <button type="button" class="btn-delete-wish" onclick="deleteWish('${safeName}', '${safeMsg}')" title="Hapus ucapan ini">
          <span>🗑️ Hapus</span>
        </button>
      </div>
    ` : `
      <div class="wish-time">${escapeHTML(item.time || 'Hari ini')}</div>
    `;

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
      ${deleteBtnHtml}
    `;
    container.appendChild(note);
  });
}

function submitNewWish(event) {
  if (event) event.preventDefault();
  const nameInput = document.getElementById('newWishName');
  const roleInput = document.getElementById('newWishRole');
  const msgInput = document.getElementById('newWishMsg');
  const submitBtn = event && event.target ? event.target.querySelector('button[type="submit"]') : null;

  const name = nameInput ? nameInput.value.trim() : '';
  const role = roleInput ? roleInput.value.trim() || 'Sahabat' : 'Sahabat';
  const msg = msgInput ? msgInput.value.trim() : '';

  if (!name || !msg) return;

  const newEntry = {
    name: name,
    role: role,
    avatar: '💌',
    roleClass: 'role-discord',
    message: msg,
    time: 'Baru saja'
  };

  // Immediate optimistic local update + local permanent backup
  try {
    const saved = localStorage.getItem('rtm_ilham_wishes');
    const currentList = saved ? JSON.parse(saved) : [...DEFAULT_GREETINGS];
    if (!currentList.some(w => w.name === newEntry.name && w.message === newEntry.message)) {
      currentList.push(newEntry);
    }
    localStorage.setItem('rtm_ilham_wishes', JSON.stringify(currentList));

    // Also store in dedicated my-wishes collection for lifetime device persistence
    const mySaved = localStorage.getItem('rtm_ilham_my_wishes');
    const myList = mySaved ? JSON.parse(mySaved) : [];
    if (!myList.some(w => w.name === newEntry.name && w.message === newEntry.message)) {
      myList.push(newEntry);
    }
    localStorage.setItem('rtm_ilham_my_wishes', JSON.stringify(myList));

    renderWishes(currentList);
  } catch (e) {}

  if (nameInput) nameInput.value = '';
  if (roleInput) roleInput.value = '';
  if (msgInput) msgInput.value = '';

  playCelebrationChimes();
  fireConfetti();

  if (submitBtn) {
    const origHtml = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>✅ Terkirim ke Papan Kenangan!</span>';
    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = origHtml;
    }, 2800);
  }

  // Secure server-side persistence (saves to PostgreSQL / Supabase)
  fetch(WISHES_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: name,
      role: role,
      message: msg,
      avatar: '💌'
    })
  })
  .then(res => res.json())
  .then(resData => {
    if (resData && resData.status === 'success' && resData.wish) {
      try {
        const saved = localStorage.getItem('rtm_ilham_wishes');
        const list = saved ? JSON.parse(saved) : [...DEFAULT_GREETINGS];
        const exists = list.some(w => w.name === resData.wish.name && w.message === resData.wish.message);
        if (!exists) {
          list.push(resData.wish);
          localStorage.setItem('rtm_ilham_wishes', JSON.stringify(list));
          renderWishes(list);
        }
      } catch (e) {}
    }
  })
  .catch(err => {
    console.log('Server persistence fallback:', err);
  });
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
  updateModerationState();
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
