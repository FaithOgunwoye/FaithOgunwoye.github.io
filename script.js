// ---------- colour theme: system default, remembered once chosen ----------
const root = document.documentElement;
const darkQuery = matchMedia("(prefers-color-scheme: dark)");
const isDark = () => (root.dataset.theme ? root.dataset.theme === "dark" : darkQuery.matches);
function syncTheme() {
  const dark = isDark();
  root.classList.toggle("is-dark", dark);
  const btn = document.getElementById("theme-toggle");
  btn.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
}
document.getElementById("theme-toggle").addEventListener("click", () => {
  root.dataset.theme = isDark() ? "light" : "dark";
  try { localStorage.setItem("theme", root.dataset.theme); } catch (e) {}
  syncTheme();
});
darkQuery.addEventListener("change", syncTheme);
syncTheme();

// ---------- reveal on scroll ----------
const observer = new IntersectionObserver(
  (entries) => entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("visible"); observer.unobserve(e.target); }
  }),
  { threshold: 0.15 }
);
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

// ---------- navbar: hide on scroll down, active link ----------
const nav = document.getElementById("navbar");
let lastY = 0;
window.addEventListener("scroll", () => {
  const y = window.scrollY;
  nav.classList.toggle("hidden", y > lastY && y > 120);
  nav.classList.toggle("scrolled", y > 40);
  lastY = y;

  document.querySelectorAll("main section, header").forEach((sec) => {
    const top = sec.offsetTop - 140;
    if (y >= top && y < top + sec.offsetHeight) {
      document.querySelectorAll("#nav-links a").forEach((a) =>
        a.classList.toggle("active", a.getAttribute("href") === "#" + sec.id));
    }
  });
});

// mobile menu
const toggle = document.getElementById("nav-toggle");
const links = document.getElementById("nav-links");
toggle.addEventListener("click", () => links.classList.toggle("open"));
links.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => links.classList.remove("open")));

// ---------- particle background ----------
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");
let particles = [];

function resize() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  const count = Math.min(90, Math.floor(innerWidth / 16));
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.35,
    vy: (Math.random() - 0.5) * 0.35,
    r: Math.random() * 1.8 + 0.6,
  }));
}
resize();
window.addEventListener("resize", resize);

const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");
function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (!isDark() || reduceMotion.matches) { requestAnimationFrame(drawParticles); return; }
  const rgb = getComputedStyle(root).getPropertyValue("--particle").trim();
  for (const p of particles) {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${rgb}, 0.22)`;
    ctx.fill();
  }
  // connect nearby particles
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const d = dx * dx + dy * dy;
      if (d < 130 * 130) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(${rgb}, ${0.08 * (1 - d / (130 * 130))})`;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(drawParticles);
}
drawParticles();

// YouTube facade: load the player only when asked, and let chapter buttons jump to a time
document.querySelectorAll(".yt").forEach((box) => {
  const id = box.dataset.yt;
  const chapters = box.closest(".feature").querySelectorAll(".chapters button");
  const load = (t) => {
    box.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&start=${t}" title="HapticVLA project video" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`;
    chapters.forEach((b) => b.classList.toggle("active", +b.dataset.t === t));
  };
  box.querySelector(".yt-play").addEventListener("click", () => load(0));
  chapters.forEach((b) => b.addEventListener("click", () => load(+b.dataset.t)));
});

// ---------- copy BibTeX ----------
document.querySelectorAll(".copy-bib").forEach((btn) => {
  btn.addEventListener("click", async () => {
    const text = btn.parentElement.querySelector("code").textContent;
    try { await navigator.clipboard.writeText(text); btn.textContent = "Copied"; }
    catch (e) { btn.textContent = "Select and copy"; }
    setTimeout(() => (btn.textContent = "Copy"), 1600);
  });
});
