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
'SDE-2 @ Gruve.ai',
'Backend Engineer',
'Distributed Systems Dev',
'Microservices · Kafka · Redis',
'Async Python · FastAPI',
'GenAI · LLM · RAG · LangGraph'
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

/* ---------- Network canvas (nodes = services, links = messages) ---------- */
const canvas = document.getElementById('netCanvas');
if (canvas && !prefersReduced) {
const ctx = canvas.getContext('2d');
let w, h, nodes = [], mouse = { x: -9999, y: -9999 };
const dpr = Math.min(window.devicePixelRatio || 1, 2);
const resize = () => {
w = canvas.width = window.innerWidth * dpr;
h = canvas.height = window.innerHeight * dpr;
const count = Math.min(90, Math.floor((window.innerWidth * window.innerHeight) / 16000));
nodes = Array.from({ length: count }, () => ({
x: Math.random() * w, y: Math.random() * h,
vx: (Math.random() - 0.5) * 0.35 * dpr, vy: (Math.random() - 0.5) * 0.35 * dpr
}));
};
resize();
window.addEventListener('resize', resize);
window.addEventListener('mousemove', (e) => { mouse.x = e.clientX * dpr; mouse.y = e.clientY * dpr; });
const linkDist = 140 * dpr;
const draw = () => {
ctx.clearRect(0, 0, w, h);
for (const n of nodes) {
n.x += n.vx; n.y += n.vy;
if (n.x < 0 || n.x > w) n.vx *= -1;
if (n.y < 0 || n.y > h) n.vy *= -1;
const dx = mouse.x - n.x, dy = mouse.y - n.y, d = Math.hypot(dx, dy);
if (d < 180 * dpr) { n.x += dx * 0.004; n.y += dy * 0.004; }
}
for (let i = 0; i < nodes.length; i++) {
for (let j = i + 1; j < nodes.length; j++) {
const a = nodes[i], b = nodes[j];
const d = Math.hypot(a.x - b.x, a.y - b.y);
if (d < linkDist) {
ctx.strokeStyle = 'rgba(0, 229, 255,' + (1 - d / linkDist) * 0.35 + ')';
ctx.lineWidth = dpr * 0.8;
ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
}
}
}
for (const n of nodes) {
ctx.fillStyle = 'rgba(124, 92, 255, 0.9)';
ctx.beginPath(); ctx.arc(n.x, n.y, 1.8 * dpr, 0, Math.PI * 2); ctx.fill();
}
requestAnimationFrame(draw);
};
draw();
}

/* ---------- Cursor glow ---------- */
const glow = document.getElementById('cursorGlow');
if (glow && !prefersReduced && window.matchMedia('(pointer: fine)').matches) {
window.addEventListener('mousemove', (e) => {
glow.classList.add('is-on');
glow.style.transform = 'translate(' + e.clientX + 'px,' + e.clientY + 'px)';
}, { passive: true });
}

/* ---------- 3D tilt on cards ---------- */
if (!prefersReduced && window.matchMedia('(pointer: fine)').matches) {
document.querySelectorAll('.pcard, .skill-cat').forEach(card => {
card.classList.add('tilt');
card.addEventListener('mousemove', (ev) => {
const r = card.getBoundingClientRect();
const px = (ev.clientX - r.left) / r.width - 0.5;
const py = (ev.clientY - r.top) / r.height - 0.5;
card.style.setProperty('--ry', (px * 8) + 'deg');
card.style.setProperty('--rx', (-py * 8) + 'deg');
});
});
}

/* ---------- Shared links ---------- */
const LINKS = {
resume: 'https://drive.google.com/file/d/19_RhvogvO401x6xOO7PbsNGkXWMxYwpz/view?usp=sharing',
github: 'https://github.com/sshubham07',
linkedin: 'https://www.linkedin.com/in/shubham-kumar-gupta-25a028182/',
leetcode: 'https://leetcode.com/u/shubhamkumargupta2_gmail_com/',
nyayaai: 'https://github.com/sshubham07/anuchhed-ai',
writeup: 'writing/nyayaai-retrieval.html',
email: 'shubhamkumargupta2@gmail.com'
};
const openUrl = (url) => window.open(url, '_blank', 'noopener');
const goTo = (id) => { const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth' }); };

/* ---------- Interactive terminal ---------- */
const term = document.getElementById('term');
const termOut = document.getElementById('termOut');
const termForm = document.getElementById('termForm');
const termInput = document.getElementById('termInput');
if (term && termOut && termForm && termInput) {
const a = (href, text) => '<a href="' + href + '" target="_blank" rel="noopener">' + text + '</a>';
const COMMANDS = {
help: () => [
'Available commands:',
'  <span class="tok-cmd">whoami</span>      who I am',
'  <span class="tok-cmd">skills</span>      what I work with',
'  <span class="tok-cmd">experience</span>  where I have worked',
'  <span class="tok-cmd">projects</span>    things I have built',
'  <span class="tok-cmd">education</span>   degrees',
'  <span class="tok-cmd">resume</span>      open my resume',
'  <span class="tok-cmd">contact</span>     how to reach me',
'  <span class="tok-cmd">github</span> · <span class="tok-cmd">linkedin</span> · <span class="tok-cmd">leetcode</span>',
'  <span class="tok-cmd">clear</span>       clear the screen',
'Tip: press <span class="tok-cmd">⌘K</span> / <span class="tok-cmd">Ctrl+K</span> anywhere for the command menu.'
],
whoami: () => ['Shubham Kumar Gupta: SDE-2 @ Gruve.ai.', 'Backend engineer for Python microservices, Kubernetes and distributed systems,', 'shipping GenAI to production with RAG, LangGraph and pgvector.'],
skills: () => [
'<span class="tok-k">backend</span>   Python · FastAPI · Django · Flask · REST',
'<span class="tok-k">systems</span>   Kubernetes · Docker · Kafka · Redis · Celery',
'<span class="tok-k">genai</span>     LangGraph · RAG · pgvector · hybrid search · reranking',
'<span class="tok-k">data</span>      PostgreSQL · MySQL · AWS (S3, CloudWatch)'
],
experience: () => [
'<span class="tok-n">2026-</span>      SDE-2, Gruve.ai: multi-tenant GPU platform on K8s',
'<span class="tok-n">2024-2026</span>  Backend Developer, Codvo.ai: Katapult payment financing',
'<span class="tok-n">2023-2024</span>  Software Engineer, Advarisk: Advasmart',
'<span class="tok-n">2022-2023</span>  Trainee Developer, Velocis Systems',
'Run <span class="tok-cmd">cd experience</span> to scroll there.'
],
projects: () => [
a(LINKS.nyayaai, 'NyayaAI') + '        Constitution of India RAG · 0.93 Recall@5',
a('https://github.com/sshubham07/StudyBud', 'StudyBuddy') + '     Django discussion rooms',
a('https://github.com/sshubham07/the-midnight-times', 'Midnight Times') + ' async news aggregator',
'Write-up: <a href="' + LINKS.writeup + '">How NyayaAI reached 0.93 Recall@5</a>'
],
education: () => ['MCA, Jawaharlal Nehru University (2021-2023)', 'BCA, St. Xavier\'s College, Patna (2018-2021)'],
contact: () => ['email     <a href="mailto:' + LINKS.email + '">' + LINKS.email + '</a>', 'linkedin  ' + a(LINKS.linkedin, 'shubham-kumar-gupta'), 'github    ' + a(LINKS.github, 'sshubham07')],
resume: () => { openUrl(LINKS.resume); return ['Opening resume…']; },
github: () => { openUrl(LINKS.github); return ['Opening GitHub…']; },
linkedin: () => { openUrl(LINKS.linkedin); return ['Opening LinkedIn…']; },
leetcode: () => { openUrl(LINKS.leetcode); return ['Opening LeetCode…']; },
ls: () => ['about/  skills/  projects/  experience/  education/  contact/'],
pwd: () => ['/home/shubham/portfolio'],
date: () => [new Date().toString()],
'sudo hire-me': () => { window.location.href = 'mailto:' + LINKS.email + '?subject=Let%27s%20talk'; return ['[sudo] permission granted. Opening your mail client…']; }
};
const esc = (t) => t.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const print = (lines, cls) => lines.forEach(l => {
const div = document.createElement('div');
div.className = 'term-line' + (cls ? ' ' + cls : '');
div.innerHTML = l;
termOut.appendChild(div);
});
const history = [];
let hIdx = 0;
const run = (raw) => {
const cmd = raw.trim().replace(/\s+/g, ' ');
print(['<span class="tok-c">$</span> ' + esc(cmd)], 'term-cmd');
if (!cmd) return;
history.push(cmd); hIdx = history.length;
const lower = cmd.toLowerCase();
if (lower === 'clear') { termOut.innerHTML = ''; return; }
const cd = lower.match(/^cd\s+(\w+)/);
if (cd) {
const id = { about: 'about', skills: 'skills', projects: 'projects', experience: 'experience', education: 'education', contact: 'contact', profiles: 'profiles' }[cd[1]];
if (id) { goTo(id); print(['→ ' + id]); } else print(['cd: no such directory: ' + esc(cd[1])], 'term-err');
return;
}
if (lower.startsWith('sudo') && lower !== 'sudo hire-me') { print(['Nice try. Try <span class="tok-cmd">sudo hire-me</span> instead.']); return; }
const fn = COMMANDS[lower];
if (fn) print(fn());
else print(['command not found: ' + esc(cmd) + '. Type <span class="tok-cmd">help</span>.'], 'term-err');
};
termForm.addEventListener('submit', (e) => {
e.preventDefault();
run(termInput.value);
termInput.value = '';
term.scrollTop = term.scrollHeight;
});
termInput.addEventListener('keydown', (e) => {
if (e.key === 'ArrowUp' && history.length) { hIdx = Math.max(0, hIdx - 1); termInput.value = history[hIdx]; e.preventDefault(); }
else if (e.key === 'ArrowDown' && history.length) { hIdx = Math.min(history.length, hIdx + 1); termInput.value = history[hIdx] || ''; e.preventDefault(); }
else if (e.key === 'Tab') {
const v = termInput.value.toLowerCase();
const hit = Object.keys(COMMANDS).concat('clear').find(k => v && k.startsWith(v));
if (hit) { termInput.value = hit; e.preventDefault(); }
}
});
term.addEventListener('click', (e) => { if (!e.target.closest('a') && !window.getSelection().toString()) termInput.focus({ preventScroll: true }); });
}

/* ---------- Command palette (⌘K / Ctrl+K) ---------- */
const palette = document.getElementById('palette');
const pInput = document.getElementById('paletteInput');
const pList = document.getElementById('paletteList');
if (palette && pInput && pList) {
const ITEMS = [
{ label: 'About', icon: 'fa-user', hint: 'section', run: () => goTo('about') },
{ label: 'Skills & live activity', icon: 'fa-layer-group', hint: 'section', run: () => goTo('skills') },
{ label: 'Projects', icon: 'fa-rocket', hint: 'section', run: () => goTo('projects') },
{ label: 'Experience', icon: 'fa-briefcase', hint: 'section', run: () => goTo('experience') },
{ label: 'Education & achievements', icon: 'fa-graduation-cap', hint: 'section', run: () => goTo('education') },
{ label: 'Coding profiles', icon: 'fa-code', hint: 'section', run: () => goTo('profiles') },
{ label: 'Contact', icon: 'fa-paper-plane', hint: 'section', run: () => goTo('contact') },
{ label: 'Open resume', icon: 'fa-file-alt', hint: 'link', run: () => openUrl(LINKS.resume) },
{ label: 'Read: How NyayaAI reached 0.93 Recall@5', icon: 'fa-pen-nib', hint: 'write-up', run: () => { window.location.href = LINKS.writeup; } },
{ label: 'NyayaAI on GitHub', icon: 'fa-scale-balanced', hint: 'link', run: () => openUrl(LINKS.nyayaai) },
{ label: 'GitHub profile', icon: 'fa-github', brand: true, hint: 'link', run: () => openUrl(LINKS.github) },
{ label: 'LinkedIn', icon: 'fa-linkedin', brand: true, hint: 'link', run: () => openUrl(LINKS.linkedin) },
{ label: 'Copy email address', icon: 'fa-copy', hint: 'action', run: () => navigator.clipboard && navigator.clipboard.writeText(LINKS.email) },
{ label: 'Send an email', icon: 'fa-envelope', hint: 'action', run: () => { window.location.href = 'mailto:' + LINKS.email; } }
];
let shown = ITEMS, active = 0, lastFocus = null;
const render = () => {
const q = pInput.value.trim().toLowerCase();
shown = ITEMS.filter(it => it.label.toLowerCase().includes(q));
active = Math.min(active, Math.max(shown.length - 1, 0));
pList.innerHTML = shown.length ? '' : '<li class="palette__empty">No matches</li>';
shown.forEach((it, i) => {
const li = document.createElement('li');
li.className = 'palette__item' + (i === active ? ' is-active' : '');
li.setAttribute('role', 'option');
li.innerHTML = '<i class="' + (it.brand ? 'fab ' : 'fas ') + it.icon + '"></i><span></span><small>' + it.hint + '</small>';
li.querySelector('span').textContent = it.label;
li.addEventListener('mousemove', () => { if (active !== i) { active = i; render(); } });
li.addEventListener('click', () => choose(i));
pList.appendChild(li);
});
const cur = pList.querySelector('.is-active');
if (cur) cur.scrollIntoView({ block: 'nearest' });
};
const open = () => { lastFocus = document.activeElement; palette.hidden = false; pInput.value = ''; active = 0; render(); pInput.focus(); };
const close = () => { palette.hidden = true; if (lastFocus) lastFocus.focus({ preventScroll: true }); };
const choose = (i) => { const it = shown[i]; if (!it) return; close(); it.run(); };
document.addEventListener('keydown', (e) => {
if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); palette.hidden ? open() : close(); }
else if (!palette.hidden) {
if (e.key === 'Escape') close();
else if (e.key === 'ArrowDown') { active = (active + 1) % Math.max(shown.length, 1); render(); e.preventDefault(); }
else if (e.key === 'ArrowUp') { active = (active - 1 + shown.length) % Math.max(shown.length, 1); render(); e.preventDefault(); }
else if (e.key === 'Enter') { choose(active); e.preventDefault(); }
}
});
pInput.addEventListener('input', () => { active = 0; render(); });
palette.querySelector('[data-close]').addEventListener('click', close);
const btn = document.getElementById('paletteOpen');
if (btn) btn.addEventListener('click', open);
if (!/Mac|iPhone|iPad/.test(navigator.platform) && btn) btn.querySelector('kbd').textContent = 'Ctrl';
}
})();