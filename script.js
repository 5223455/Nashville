/* ═══════════════════════════════════════════
   THE NASHVILLE — Main Script
   ═══════════════════════════════════════════ */

// ─── LOADING SCREEN ───
(function initLoader() {
  const loader = document.getElementById('loader');
  const fill = document.getElementById('loaderFill');
  let progress = 0;

  const interval = setInterval(() => {
    progress += Math.random() * 15 + 5;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      setTimeout(() => {
        loader.classList.add('done');
        document.body.style.overflow = '';
        triggerHeroAnimations();
      }, 400);
    }
    fill.style.width = progress + '%';
  }, 120);

  document.body.style.overflow = 'hidden';
})();

// ─── HERO ANIMATIONS (after loader) ───
function triggerHeroAnimations() {
  const popElements = document.querySelectorAll('.hero [data-anim="pop"]');
  popElements.forEach((el, i) => {
    setTimeout(() => {
      el.classList.add('visible');
    }, 150 * i);
  });

  const fadeElements = document.querySelectorAll('.hero [data-anim="fade"]');
  fadeElements.forEach((el, i) => {
    setTimeout(() => {
      el.classList.add('visible');
    }, 600 + 200 * i);
  });
}

// ─── FLOW MOTION ANIMATION ENGINE (with real-time Chroma Key) ───
function initFlowMotionEngine() {
  const canvas = document.getElementById('flowCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const totalFrames = 30;
  const frames = []; // stores offscreen transparent canvases
  let loadedCount = 0;
  let currentFrame = 0;

  // Helper function: apply chroma key to remove green screen, shadow box & watermark
  function processChromaKey(img) {
    const offCanvas = document.createElement('canvas');
    offCanvas.width = img.width;
    offCanvas.height = img.height;
    const offCtx = offCanvas.getContext('2d');
    offCtx.drawImage(img, 0, 0);

    const imageData = offCtx.getImageData(0, 0, img.width, img.height);
    const data = imageData.data;
    const w = img.width;
    const h = img.height;

    for (let p = 0; p < data.length; p += 4) {
      const r = data[p];
      const g = data[p + 1];
      const b = data[p + 2];
      const a = data[p + 3];

      const x = (p / 4) % w;
      const y = Math.floor((p / 4) / w);

      // Mask out watermark at bottom right corner
      if (x > w * 0.85 && y > h * 0.88) {
        data[p + 3] = 0;
        continue;
      }

      const maxRB = Math.max(r, b);
      const diff = g - maxRB;

      // Pure green background removal
      if ((g > 100 && diff > 50 && r < 85) || (g > 120 && g > r * 2.2 && g > b * 2.2)) {
        data[p + 3] = 0;
      } else if (g > 90 && diff > 30 && r < 95) {
        // Soft edge / anti-aliasing despill
        let alpha = Math.round(((50 - diff) / 20.0) * 255);
        alpha = Math.max(0, Math.min(255, alpha));
        data[p] = maxRB;
        data[p + 1] = maxRB;
        data[p + 3] = Math.round((a * alpha) / 255);
      } else if (diff > 15 && r < 100) {
        // Slight despill on green fringes
        data[p + 1] = maxRB;
      }
    }

    offCtx.putImageData(imageData, 0, 0);
    return offCanvas;
  }

  // ── Preload and process all 30 frames ──
  for (let i = 1; i <= totalFrames; i++) {
    const img = new Image();
    const padNum = String(i).padStart(3, '0');
    img.src = 'ezgif-7fe0658a264c2877-jpg/ezgif-frame-' + padNum + '.jpg';
    img.onload = () => {
      const processedCanvas = processChromaKey(img);
      frames[i] = processedCanvas;
      loadedCount++;
      // Show first frame as soon as it's ready
      if (i === 1) renderFrame(1);
      // Once all loaded, sync to current scroll position
      if (loadedCount === totalFrames) updateFrameFromScroll();
    };
  }

  // ── Render a frame directly to the visible canvas ──
  function renderFrame(num) {
    const frame = frames[num];
    if (!frame) return;

    // Resize canvas to match the frame dimensions
    if (canvas.width !== frame.width || canvas.height !== frame.height) {
      canvas.width = frame.width;
      canvas.height = frame.height;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(frame, 0, 0);
    currentFrame = num;
  }

  // ── Map scroll position → frame number ──
  function updateFrameFromScroll() {
    const hero = document.getElementById('hero');
    if (!hero) return;

    const heroRect = hero.getBoundingClientRect();
    const heroTop = window.scrollY + heroRect.top;
    const scrollRange = hero.offsetHeight - window.innerHeight;
    const scrolled = window.scrollY - heroTop;
    const progress = Math.min(Math.max(scrolled / Math.max(scrollRange, 1), 0), 1);
    const frameIndex = Math.round(1 + progress * (totalFrames - 1));

    if (frameIndex !== currentFrame && frames[frameIndex]) {
      renderFrame(frameIndex);
    }
  }

  window.addEventListener('scroll', updateFrameFromScroll, { passive: true });
  window.addEventListener('resize', () => { if (currentFrame) renderFrame(currentFrame); }, { passive: true });
}

// Start immediately so frames begin loading
initFlowMotionEngine();

// ─── NAVBAR SCROLL ───
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });

// ─── MOBILE MENU TOGGLE ───
const menuBtn = document.getElementById('menuBtn');
const navDropdown = document.getElementById('navDropdown');

menuBtn.addEventListener('click', () => {
  const isOpen = navDropdown.classList.contains('open');
  navDropdown.classList.toggle('open');
  menuBtn.classList.toggle('active');
  menuBtn.setAttribute('aria-expanded', !isOpen);
});

// Close dropdown when clicking a link
navDropdown.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navDropdown.classList.remove('open');
    menuBtn.classList.remove('active');
    menuBtn.setAttribute('aria-expanded', 'false');
  });
});

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
  if (!menuBtn.contains(e.target) && !navDropdown.contains(e.target)) {
    navDropdown.classList.remove('open');
    menuBtn.classList.remove('active');
    menuBtn.setAttribute('aria-expanded', 'false');
  }
});

// ─── SCROLL REVEAL ANIMATIONS ───
function revealOnScroll() {
  const elements = document.querySelectorAll('[data-anim]:not(.hero [data-anim])');
  const windowHeight = window.innerHeight;

  elements.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < windowHeight - 80) {
      el.classList.add('visible');
    }
  });
}

window.addEventListener('scroll', revealOnScroll, { passive: true });
// Initial check
setTimeout(revealOnScroll, 100);

// ─── SMOOTH SCROLL FOR ANCHOR LINKS ───
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;

    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const navHeight = navbar.offsetHeight;
      const targetPos = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

      window.scrollTo({
        top: targetPos,
        behavior: 'smooth'
      });
    }
  });
});

// ─── PARALLAX FLOATING ELEMENTS ───
function applyParallax() {
  const floatElements = document.querySelectorAll('[data-anim="float"]');
  const scrollY = window.scrollY;

  floatElements.forEach(el => {
    const rect = el.getBoundingClientRect();
    const centerY = rect.top + rect.height / 2;
    const windowCenter = window.innerHeight / 2;
    const offset = (centerY - windowCenter) * 0.04;

    el.style.transform = el.style.transform.replace(/translateY\([^)]*\)/g, '') +
      ` translateY(${offset}px)`;
  });
}

// Only parallax on desktop
if (window.innerWidth > 820) {
  window.addEventListener('scroll', applyParallax, { passive: true });
}

// ─── PHOTO CARD TILT EFFECT ───
const photoCards = document.querySelectorAll('.photo-card');

photoCards.forEach(card => {
  card.addEventListener('mousemove', (e) => {
    if (window.innerWidth <= 820) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.04)`;
  });

  card.addEventListener('mouseleave', () => {
    // Restore original rotation
    const index = Array.from(photoCards).indexOf(card);
    if (index === 0) card.style.transform = 'rotate(5deg) translateY(10px)';
    else if (index === 1) card.style.transform = 'rotate(-5deg) translateY(-20px)';
    else card.style.transform = 'rotate(8deg) translateY(10px)';
  });
});

// ─── COOKIE BANNER ───
const cookieBanner = document.getElementById('cookieBanner');
const acceptCookies = document.getElementById('acceptCookies');

if (acceptCookies && cookieBanner) {
  acceptCookies.addEventListener('click', () => {
    cookieBanner.classList.add('hidden');
  });
}

// ─── MARQUEE DUPLICATION ───
// Duplicate marquee content for seamless loop
const marqueeContent = document.querySelector('.marquee-content');
if (marqueeContent) {
  const clone = marqueeContent.cloneNode(true);
  marqueeContent.parentElement.appendChild(clone);
}

// ─── MENU CARD STAGGER ANIMATION ───
const menuCards = document.querySelectorAll('.menu-card');
const menuObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const cards = entry.target.parentElement.querySelectorAll('.menu-card');
      cards.forEach((card, i) => {
        setTimeout(() => {
          card.classList.add('visible');
        }, i * 120);
      });
      menuObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

if (menuCards.length > 0) {
  menuObserver.observe(menuCards[0]);
}

// ─── KEYBOARD ACCESSIBILITY ───
document.addEventListener('keydown', (e) => {
  // Escape closes menu
  if (e.key === 'Escape') {
    navDropdown.classList.remove('open');
    menuBtn.classList.remove('active');
    menuBtn.setAttribute('aria-expanded', 'false');
  }
});

// ─── COUNTER ANIMATION FOR STATS ───
function animateCounter(element, target, suffix = '') {
  const duration = 1500;
  const startTime = performance.now();

  // Extract numeric part
  const numericTarget = parseFloat(target);
  if (isNaN(numericTarget)) {
    element.textContent = target;
    return;
  }

  const isDecimal = target.includes('.');
  const step = (timestamp) => {
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic

    const current = numericTarget * eased;
    element.textContent = (isDecimal ? current.toFixed(1) : Math.floor(current)) + suffix;

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  };

  requestAnimationFrame(step);
}

// Observe stats for counter animation
const statNums = document.querySelectorAll('.stat-num');
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const text = el.textContent.trim();

      if (text.includes('-')) {
        // "10-20" range - just pop it in
        el.style.opacity = '1';
      } else if (text.includes('★')) {
        animateCounter(el, text.replace('★', ''), '★');
      } else if (text.includes('%')) {
        animateCounter(el, text.replace('%', ''), '%');
      }

      statsObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

statNums.forEach(el => statsObserver.observe(el));
