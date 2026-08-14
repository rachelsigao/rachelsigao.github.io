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
const totalCommits = document.getElementById("totalCommits");
const contributionsCount = document.getElementById("contributionsCount");

if (repoCount && followersCount && followingCount && totalCommits && contributionsCount) {
  const statItems = [repoCount, followersCount, followingCount, totalCommits, contributionsCount];

  statItems.forEach(item => {
    item.textContent = "Loading...";
    item.closest(".github-stat-item")?.classList.add("is-loading");
  });

  const headers = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28"
  };

  Promise.all([
    fetch("https://api.github.com/users/rachelsigao", { headers }),
    fetch("https://api.github.com/search/commits?q=author:rachelsigao&per_page=1", {
      headers: {
        ...headers,
        Accept: "application/vnd.github.cloak-preview+json"
      }
    })
  ])
    .then(async ([profileResponse, commitResponse]) => {
      if (!profileResponse.ok || !commitResponse.ok) {
        throw new Error("GitHub API request failed");
      }

      const profile = await profileResponse.json();
      const commitData = await commitResponse.json();

      const contributionTotal = commitData.total_count ?? "--";

      repoCount.textContent = profile.public_repos ?? "--";
      followersCount.textContent = profile.followers ?? "--";
      followingCount.textContent = profile.following ?? "--";
      totalCommits.textContent = contributionTotal;
      contributionsCount.textContent = contributionTotal;
    })
    .catch(() => {
      repoCount.textContent = "N/A";
      followersCount.textContent = "N/A";
      followingCount.textContent = "N/A";
      totalCommits.textContent = "N/A";
      contributionsCount.textContent = "N/A";
    })
    .finally(() => {
      statItems.forEach(item => {
        item.closest(".github-stat-item")?.classList.remove("is-loading");
      });
    });
}

const snakeSource = document.querySelector('.snake-wrap source');
const snakeImage = document.querySelector('.snake-wrap img');
if (snakeSource && snakeImage) {
  const cacheBust = Date.now();
  const snakeBase = 'https://rachelsigao.github.io/output';
  const darkSnakeUrl = `${snakeBase}/github-contribution-grid-snake-dark.svg?v=${cacheBust}`;
  const lightSnakeUrl = `${snakeBase}/github-contribution-grid-snake.svg?v=${cacheBust}`;

  snakeSource.srcset = darkSnakeUrl;
  snakeImage.src = lightSnakeUrl;
  snakeImage.onerror = () => {
    snakeImage.src = `https://raw.githubusercontent.com/rachelsigao/rachelsigao.github.io/main/output/github-contribution-grid-snake.svg?v=${cacheBust}`;
  };
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


