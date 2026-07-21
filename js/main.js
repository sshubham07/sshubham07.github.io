(function () {
'use strict';

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Footer year ---------- */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ---------- Navbar: scrolled state + mobile toggle ---------- */
const nav = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

const onScroll = () => {
if (nav) nav.classList.toggle('is-scrolled', window.scrollY > 20);

// Scroll progress bar
const bar = document.getElementById('scrollProgress');
if (bar) {
const h = document.documentElement;
const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight);
bar.style.width = (scrolled * 100) + '%';
}
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

if (navToggle && navLinks) {
navToggle.addEventListener('click', () => navLinks.classList.toggle('is-open'));
navLinks.querySelectorAll('a').forEach(a =>
a.addEventListener('click', () => navLinks.classList.remove('is-open'))
);
}

/* ---------- Typing effect (hero role) ---------- */
const typedEl = document.getElementById('typedRole');
if (typedEl) {
const roles = [
'Backend Engineer',
'Distributed Systems Dev',
'Microservices · Kafka · Redis',
'Async Python · FastAPI',
'LLM · RAG · Vector Search'
];
if (prefersReduced) {
typedEl.textContent = roles[0];
} else {
let r = 0, c = 0, deleting = false;
const tick = () => {
const word = roles[r];
c += deleting ? -1 : 1;
typedEl.textContent = word.slice(0, c);
let delay = deleting ? 45 : 90;
if (!deleting && c === word.length) { delay = 1600; deleting = true; }
else if (deleting && c === 0) { deleting = false; r = (r + 1) % roles.length; delay = 400; }
setTimeout(tick, delay);
};
tick();
}
}

/* ---------- Scroll reveal ---------- */
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !prefersReduced) {
const io = new IntersectionObserver((entries) => {
entries.forEach((e, i) => {
if (e.isIntersecting) {
// slight stagger for siblings entering together
e.target.style.transitionDelay = Math.min(i * 60, 240) + 'ms';
e.target.classList.add('is-visible');
io.unobserve(e.target);
}
});
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
revealEls.forEach(el => io.observe(el));
} else {
revealEls.forEach(el => el.classList.add('is-visible'));
}

/* ---------- Animated stat counters ---------- */
const counters = document.querySelectorAll('.stat__num');
const runCounter = (el) => {
const target = parseFloat(el.dataset.target);
const suffix = el.dataset.suffix || '';
const decimals = parseInt(el.dataset.decimals || '0', 10);
const duration = 1400;
let start = null;
const step = (ts) => {
if (!start) start = ts;
const p = Math.min((ts - start) / duration, 1);
const eased = 1 - Math.pow(1 - p, 3);
const val = target * eased;
el.textContent = val.toFixed(decimals) + suffix;
if (p < 1) requestAnimationFrame(step);
else el.textContent = target.toFixed(decimals) + suffix;
};
requestAnimationFrame(step);
};
if ('IntersectionObserver' in window && !prefersReduced) {
const cio = new IntersectionObserver((entries) => {
entries.forEach(e => {
if (e.isIntersecting) { runCounter(e.target); cio.unobserve(e.target); }
});
}, { threshold: 0.5 });
counters.forEach(c => cio.observe(c));
} else {
counters.forEach(c => {
const d = parseInt(c.dataset.decimals || '0', 10);
c.textContent = parseFloat(c.dataset.target).toFixed(d) + (c.dataset.suffix || '');
});
}

/* ---------- Proficiency bars ---------- */
const fills = document.querySelectorAll('.prof__fill');
if ('IntersectionObserver' in window) {
const pio = new IntersectionObserver((entries) => {
entries.forEach(e => {
if (e.isIntersecting) {
e.target.style.width = e.target.dataset.fill + '%';
pio.unobserve(e.target);
}
});
}, { threshold: 0.4 });
fills.forEach(f => pio.observe(f));
} else {
fills.forEach(f => f.style.width = f.dataset.fill + '%');
}

/* ---------- Project card spotlight (mouse-follow glow) ---------- */
if (!prefersReduced) {
document.querySelectorAll('.pcard').forEach(card => {
card.addEventListener('mousemove', (ev) => {
const rect = card.getBoundingClientRect();
card.style.setProperty('--mx', ((ev.clientX - rect.left) / rect.width * 100) + '%');
card.style.setProperty('--my', ((ev.clientY - rect.top) / rect.height * 100) + '%');
});
});
}

/* ---------- Active nav link on scroll ---------- */
const sections = document.querySelectorAll('section[id]');
const links = document.querySelectorAll('.nav__link');
if ('IntersectionObserver' in window && links.length) {
const sio = new IntersectionObserver((entries) => {
entries.forEach(e => {
if (e.isIntersecting) {
const id = e.target.id;
links.forEach(l => l.style.color = l.getAttribute('href') === '#' + id ? '#fff' : '');
}
});
}, { threshold: 0.5 });
sections.forEach(s => sio.observe(s));
}
})();