// ---------- typing effect ----------
const roles = [
  "Robotics Engineer",
  "ML Researcher",
  "ROS 2 Developer",
  "Blockchain Tinkerer",
];
const typedEl = document.getElementById("typed");
let roleIdx = 0, charIdx = 0, deleting = false;

function typeLoop() {
  const word = roles[roleIdx];
  typedEl.textContent = word.slice(0, charIdx);
  let delay = deleting ? 45 : 95;
  if (!deleting && charIdx === word.length) { deleting = true; delay = 1600; }
  else if (deleting && charIdx === 0) { deleting = false; roleIdx = (roleIdx + 1) % roles.length; delay = 350; }
  else charIdx += deleting ? -1 : 1;
  setTimeout(typeLoop, delay);
}
typeLoop();

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

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const p of particles) {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(34, 211, 238, 0.35)";
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
        ctx.strokeStyle = `rgba(34, 211, 238, ${0.12 * (1 - d / (130 * 130))})`;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(drawParticles);
}
drawParticles();
