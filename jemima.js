
/* ============================================================
   1. ÉLÉMENTS DE BASE
   ============================================================ */
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.querySelectorAll('.nav-links a');
const progress = document.getElementById('progress');
const yearEl = document.getElementById('year');

if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ============================================================
   2. MENU MOBILE
   ============================================================ */
navToggle.addEventListener('click', () => {
  const isOpen = navbar.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
  navToggle.setAttribute('aria-label', isOpen ? 'Fermer le menu' : 'Ouvrir le menu');
});

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    navbar.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Ouvrir le menu');
  });
});

/* ============================================================
   3. NAVBAR ET PROGRESSION AU DÉFILEMENT
   ============================================================ */
function onScroll() {
  navbar.classList.toggle('scrolled', window.scrollY > 40);

  const max = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = max > 0 ? window.scrollY / max : 0;
  progress.style.width = `${ratio * 100}%`;
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ============================================================
   4. APPARITIONS AU DÉFILEMENT
   Éléments à animer : .reveal, cartes de compétences,
   chapitres, timeline, barres de progression.
   ============================================================ */
const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const el = entry.target;
      el.classList.add('visible');

      // Compteurs contenus dans l'élément
      el.querySelectorAll('.counter-num').forEach(animateCounter);

      // Barres du budget contenues dans l'élément
      el.querySelectorAll('.bar-fill').forEach((bar) => {
        bar.style.width = `${bar.dataset.width}%`;
      });

      observer.unobserve(el);
    });
  },
  { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
);

document
  .querySelectorAll('.reveal, .timeline-line, .skill-card, .chapter, .bars')
  .forEach((el) => revealObserver.observe(el));

/* ============================================================
   5. COMPTEURS ANIMÉS
   Chaque .counter-num porte data-target="valeur finale".
   ============================================================ */
const counted = new WeakSet();

function animateCounter(el) {
  if (counted.has(el)) return;
  counted.add(el);

  const target = Number(el.dataset.target) || 0;
  const duration = 1400;
  const start = performance.now();

  function step(now) {
    const elapsed = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - elapsed, 3);
    el.textContent = Math.round(eased * target);
    if (elapsed < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

/* ============================================================
   6. LIEN ACTIF DANS LA NAVBAR
   ============================================================ */
const sections = document.querySelectorAll('main section[id]');

const activeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      navLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    });
  },
  { threshold: 0.45 }
);

sections.forEach((section) => activeObserver.observe(section));

/* ============================================================
   7. DÉFILEMENT FLUIDE POUR LES ANCRES (secours)
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});