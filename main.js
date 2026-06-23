'use strict';

/* ── Mobile Nav ─────────────────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const drawer    = document.getElementById('navDrawer');

function openDrawer() {
  drawer.classList.add('is-open');
  drawer.setAttribute('aria-hidden', 'false');
  hamburger.setAttribute('aria-expanded', 'true');
  hamburger.setAttribute('aria-label', 'Close navigation menu');
  document.body.style.overflow = 'hidden';
}

function closeDrawer() {
  drawer.classList.remove('is-open');
  drawer.setAttribute('aria-hidden', 'true');
  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.setAttribute('aria-label', 'Open navigation menu');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', () => {
  hamburger.getAttribute('aria-expanded') === 'true' ? closeDrawer() : openDrawer();
});

// Close when a drawer link is clicked
drawer.querySelectorAll('a').forEach(link => link.addEventListener('click', closeDrawer));

// Close on Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
    closeDrawer();
    hamburger.focus();
  }
});

// Close if clicking outside the nav on mobile
document.addEventListener('click', e => {
  if (drawer.classList.contains('is-open') && !e.target.closest('.nav')) closeDrawer();
});

/* ── Transparent nav → solid on scroll ──────────────────────── */
const siteHeader = document.querySelector('.site-header');
window.addEventListener('scroll', () => {
  siteHeader.classList.toggle('is-scrolled', window.scrollY > 80);
}, { passive: true });

/* ── Scroll-to-top ───────────────────────────────────────────── */
const scrollTopBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
  scrollTopBtn.classList.toggle('is-visible', window.scrollY > 400);
}, { passive: true });

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ── Scroll-spy (active nav link) ───────────────────────────── */
const navLinks = Array.from(document.querySelectorAll('.nav-link[data-section]'));
const spySections = navLinks
  .map(link => document.getElementById(link.dataset.section))
  .filter(Boolean);

const spyObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const id = entry.target.id;
    navLinks.forEach(link => {
      const active = link.dataset.section === id;
      link.setAttribute('aria-current', active ? 'true' : 'false');
    });
  });
}, { threshold: 0.3, rootMargin: '-64px 0px -40% 0px' });

spySections.forEach(s => spyObserver.observe(s));

/* ── Fade-in on scroll ───────────────────────────────────────── */
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const fadeEls = document.querySelectorAll('.fade-up');
  const fadeObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      fadeObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  fadeEls.forEach(el => fadeObserver.observe(el));
} else {
  // Reduced motion: make all visible immediately
  document.querySelectorAll('.fade-up').forEach(el => el.classList.add('is-visible'));
}

/* ── CTA form → mailto ───────────────────────────────────────── */
const ctaForm  = document.getElementById('ctaForm');
const ctaInput = document.getElementById('ctaEmail');

if (ctaForm && ctaInput) {
  ctaForm.addEventListener('submit', e => {
    e.preventDefault();
    const email   = encodeURIComponent(ctaInput.value.trim());
    const subject = encodeURIComponent('Inquiry — Augere Global');
    const body    = encodeURIComponent(
      `Hello,\n\nI would like to get in touch regarding Augere Global's services.\n\nReply to: ${ctaInput.value.trim()}\n\nSent from augereglobal.com`
    );
    window.location.href =
      `mailto:a.mwongela@augereglobal.com?subject=${subject}&body=${body}`;
  });
}

/* ── Hero Slideshow ─────────────────────────────────────────── */
(function () {
  const slides = Array.from(document.querySelectorAll('.hero-slide'));
  if (!slides.length) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) {
    slides[0].classList.add('is-active');
    return;
  }

  let current = 0;
  slides[0].classList.add('is-active');

  setInterval(() => {
    slides[current].classList.remove('is-active');
    current = (current + 1) % slides.length;
    slides[current].classList.add('is-active');
  }, 6000);
})();

/* ── Smooth-scroll polyfill for anchor buttons (non-link) ───── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    closeDrawer();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // Update URL without jump
    history.pushState(null, '', anchor.getAttribute('href'));
  });
});
