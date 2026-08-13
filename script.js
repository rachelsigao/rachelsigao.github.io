// Select DOM elements
const menuButton = document.getElementById("menuButton");
const nav = document.getElementById("nav");
const progressBar = document.getElementById("progressBar");
const year = document.getElementById("year");
const themeToggle = document.getElementById("themeToggle");

// Set current year in footer
if (year) {
  year.textContent = new Date().getFullYear();
}

function applyTheme(theme) {
  const isDark = theme === "dark";
  document.body.classList.toggle("dark-theme", isDark);

  if (themeToggle) {
    themeToggle.textContent = isDark ? "☀" : "☾";
    themeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
  }

  try {
    localStorage.setItem("theme", theme);
  } catch (error) {
    console.warn("Theme preference could not be saved.", error);
  }
}

try {
  const savedTheme = localStorage.getItem("theme") || "light";
  applyTheme(savedTheme);
} catch (error) {
  applyTheme("light");
}

// Theme toggle
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const nextTheme = document.body.classList.contains("dark-theme") ? "light" : "dark";
    applyTheme(nextTheme);
  });
}

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
  if (progressBar) {
    progressBar.style.width = `${height ? (scrollTop / height) * 100 : 0}%`;
  }
});

const repoCount = document.getElementById("repoCount");
const followersCount = document.getElementById("followersCount");
const followingCount = document.getElementById("followingCount");

if (repoCount && followersCount && followingCount) {
  const statItems = [repoCount, followersCount, followingCount];

  statItems.forEach(item => {
    item.textContent = "Loading...";
    item.closest(".github-stat-item")?.classList.add("is-loading");
  });

  fetch("https://api.github.com/users/rachelsigao")
    .then(response => {
      if (!response.ok) {
        throw new Error("GitHub API request failed");
      }
      return response.json();
    })
    .then(data => {
      repoCount.textContent = data.public_repos ?? "--";
      followersCount.textContent = data.followers ?? "--";
      followingCount.textContent = data.following ?? "--";
    })
    .catch(() => {
      repoCount.textContent = "N/A";
      followersCount.textContent = "N/A";
      followingCount.textContent = "N/A";
    })
    .finally(() => {
      statItems.forEach(item => {
        item.closest(".github-stat-item")?.classList.remove("is-loading");
      });
    });
}

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


