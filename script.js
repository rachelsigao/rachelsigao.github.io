// Select DOM elements
const menuButton = document.getElementById("menuButton");
const nav = document.getElementById("nav");
const progressBar = document.getElementById("progressBar");
const year = document.getElementById("year");

// Set current year in footer
year.textContent = new Date().getFullYear();

// Mobile menu toggle
menuButton?.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(open));
});

// Close menu when navigation link is clicked
document.querySelectorAll(".nav a").forEach(link => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuButton?.setAttribute("aria-expanded", "false");
  });
});

// Progress bar follows scroll position
window.addEventListener("scroll", () => {
  const scrollTop = window.scrollY;
  const height = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = `${height ? (scrollTop / height) * 100 : 0}%`;
});

// Intersection Observer for scroll reveal animations
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

// Observe all elements with reveal class
document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
