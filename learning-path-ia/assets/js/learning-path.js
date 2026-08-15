/**
 * Learning Path IA — Shared JavaScript
 * Funcionalidad común: reveal, claw animation, navigation, video player
 */

// ===== SCROLL REVEAL =====
function initReveal() {
  const revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    revealEls.forEach(el => el.classList.add('in'));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

  revealEls.forEach(el => io.observe(el));
}

// ===== CLAW ANIMATION =====
function initClawAnimation() {
  const clawTop = document.getElementById('clawTop');
  const clawBottom = document.getElementById('clawBottom');
  const taskChip = document.querySelector('.task-chip');

  if (!clawTop || !clawBottom) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function updateClaw() {
    const heroSection = document.getElementById('hero') || document.getElementById('introduccion');
    if (!heroSection) return;

    const heroHeight = heroSection.offsetHeight || window.innerHeight;
    const progress = Math.min(Math.max(window.scrollY / (heroHeight * 0.6), 0), 1);
    const angle = progress * 16;

    if (!prefersReducedMotion) {
      clawTop.style.transform = `rotate(${angle}deg)`;
      clawBottom.style.transform = `rotate(${-angle}deg)`;
    }

    if (taskChip) {
      taskChip.style.opacity = progress > 0.6 ? Math.min((progress - 0.6) / 0.4, 1) : 0;
    }
  }

  window.addEventListener('scroll', updateClaw, { passive: true });
  updateClaw();

  // Initial animation on load
  window.addEventListener('load', () => {
    if (!prefersReducedMotion) {
      clawTop.style.transition = 'transform 1.4s cubic-bezier(.2,.8,.2,1)';
      clawBottom.style.transition = 'transform 1.4s cubic-bezier(.2,.8,.2,1)';
      setTimeout(updateClaw, 50);
    }
  });
}

// ===== VIDEO PLAYER =====
function initVideoPlayer() {
  const videoWrappers = document.querySelectorAll('.video-wrapper');
  videoWrappers.forEach(wrapper => {
    const video = wrapper.querySelector('video');
    const poster = wrapper.querySelector('.video-poster');
    const playBtn = wrapper.querySelector('.video-play-btn');

    if (!video || !poster || !playBtn) return;

    playBtn.addEventListener('click', () => {
      video.play().then(() => {
        poster.classList.add('hidden');
        video.controls = true;
      }).catch(err => {
        console.warn('Video play failed:', err);
        video.controls = true;
        poster.classList.add('hidden');
      });
    });

    video.addEventListener('pause', () => {
      if (video.currentTime > 0 && video.currentTime < video.duration) {
        poster.classList.remove('hidden');
      }
    });

    video.addEventListener('ended', () => {
      poster.classList.remove('hidden');
      video.controls = false;
    });
  });
}

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const navHeight = document.querySelector('nav')?.offsetHeight || 72;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        // Update URL without jumping
        history.pushState(null, '', targetId);
      }
    });
  });
}

// ===== MODULE PROGRESS TRACKING (localStorage) =====
function initModuleProgress() {
  const STORAGE_KEY = 'learning-path-progress';
  const completedModules = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

  // Mark completed modules in nav
  document.querySelectorAll('[data-module]').forEach(link => {
    const moduleNum = link.getAttribute('data-module');
    if (completedModules.includes(moduleNum)) {
      link.classList.add('completed');
      link.setAttribute('aria-label', `${link.textContent} — Completado`);
    }
  });

  // Expose API
  window.LearningPath = {
    markComplete: function(moduleNum) {
      if (!completedModules.includes(moduleNum)) {
        completedModules.push(moduleNum);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(completedModules));
        document.querySelectorAll(`[data-module="${moduleNum}"]`).forEach(el => {
          el.classList.add('completed');
          el.setAttribute('aria-label', `${el.textContent} — Completado`);
        });
      }
    },
    getProgress: function() {
      return completedModules;
    },
    reset: function() {
      localStorage.removeItem(STORAGE_KEY);
      location.reload();
    }
  };
}

// ===== KEYBOARD NAVIGATION ENHANCEMENT =====
function initKeyboardNav() {
  // Trap focus in mobile menu if needed
  // Add visible focus styles for keyboard users
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-nav');
    }
  });

  document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
  });
}

// ===== INITIALIZE ALL =====
document.addEventListener('DOMContentLoaded', () => {
  initReveal();
  initClawAnimation();
  initVideoPlayer();
  initSmoothScroll();
  initModuleProgress();
  initKeyboardNav();
});

// ===== EXPORT FOR MODULE USE =====
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initReveal,
    initClawAnimation,
    initVideoPlayer,
    initSmoothScroll,
    initModuleProgress,
    initKeyboardNav
  };
}