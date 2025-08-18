// Bootstrap Navbar: Remove focus from toggler after click/tap (accessibility)
document.querySelector('.navbar-toggler')?.addEventListener('click', function () {
  this.blur();
});

// Smooth scroll & collapse navbar on mobile after clicking a nav link
document.querySelectorAll('[data-nav]').forEach(function (link) {
  link.addEventListener('click', function (e) {
    if (this.hash && document.querySelector(this.hash)) {
      e.preventDefault();
      document.querySelector(this.hash).scrollIntoView({ behavior: 'smooth', block: 'start' });
      const navbarCollapse = document.getElementById('mainNavbar');
      if (navbarCollapse && window.innerWidth < 992 && navbarCollapse.classList.contains('show')) {
        const collapse = bootstrap.Collapse.getOrCreateInstance(navbarCollapse);
        collapse.hide();
      }
    }
  });
});

// Scroll to top button
const scrollTopBtn = document.getElementById('scrollTopBtn');
function syncScrollTopBtn() {
  if (!scrollTopBtn) return;
  scrollTopBtn.style.display = window.scrollY > 400 ? 'block' : 'none';
}
window.addEventListener('scroll', syncScrollTopBtn);
scrollTopBtn?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
syncScrollTopBtn();

// Section reveal with IntersectionObserver
const observedSections = document.querySelectorAll('header.hero, main section');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });
  observedSections.forEach((el) => observer.observe(el));
} else {
  observedSections.forEach((el) => el.classList.add('is-visible'));
}

// Navigation active link highlight
const navLinksArr = Array.from(document.querySelectorAll('[data-nav]'));
function highlightActiveNav() {
  const fromTop = window.scrollY + 120;
  navLinksArr.forEach((link) => {
    const href = link.getAttribute('href');
    if (!href) return;
    const section = document.querySelector(href);
    if (section && section.offsetTop <= fromTop && section.offsetTop + section.offsetHeight > fromTop) {
      navLinksArr.forEach((l) => l.classList.remove('active'));
      link.classList.add('active');
    }
  });
}
window.addEventListener('scroll', highlightActiveNav);
highlightActiveNav();

// Theme handling with persistence and system preference
const modeToggle = document.getElementById('mode-toggle');
const htmlEl = document.documentElement;
const themeMeta = document.querySelector('meta[name="theme-color"]');

function preferredTheme() {
  const saved = localStorage.getItem('theme');
  if (saved === 'dark' || saved === 'light') return saved;
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme) {
  if (theme === 'dark') {
    htmlEl.setAttribute('data-theme', 'dark');
  } else {
    htmlEl.removeAttribute('data-theme');
  }
  if (modeToggle) {
    modeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
    modeToggle.setAttribute('aria-pressed', String(theme === 'dark'));
  }
  if (themeMeta) {
    themeMeta.setAttribute('content', theme === 'dark' ? '#0b1220' : '#2563eb');
  }
}

applyTheme(preferredTheme());

window.matchMedia('(prefers-color-scheme: dark)')?.addEventListener('change', (e) => {
  if (!localStorage.getItem('theme')) {
    applyTheme(e.matches ? 'dark' : 'light');
  }
});

modeToggle?.addEventListener('click', () => {
  const next = htmlEl.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  localStorage.setItem('theme', next);
  applyTheme(next);
});

// Project filter
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
filterBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    filterBtns.forEach((b) => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');
    const skill = (btn.getAttribute('data-skill') || '').toLowerCase();
    projectCards.forEach((card) => {
      const skills = (card.getAttribute('data-skills') || '').toLowerCase();
      card.style.display = skill === 'all' || !skill || skills.includes(skill) ? '' : 'none';
    });
  });
});

// Fetch Medium RSS and render custom summary
fetch('https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@dilshanukwattage')
  .then((response) => response.json())
  .then((data) => {
    const blogsContainer = document.getElementById('blogs-container');
    if (!blogsContainer) return;
    blogsContainer.innerHTML = '';
    blogsContainer.setAttribute('aria-busy', 'false');
    if (data.items && Array.isArray(data.items)) {
      data.items.slice(0, 4).forEach((post) => {
        const plainText = (post.description || '').replace(/<[^>]+>/g, '');
        const words = plainText.split(/\s+/).filter(Boolean);
        const summary = words.slice(0, 24).join(' ') + (words.length > 24 ? '…' : '');
        const card = document.createElement('div');
        card.className = 'blog-card';
        card.innerHTML = `
          <h3><a href="${post.link}" target="_blank" rel="noopener">${post.title}</a></h3>
          <div style="font-size:0.95em;color:var(--primary);margin-bottom:0.5em;">by ${post.author} · ${new Date(post.pubDate).toLocaleDateString()}</div>
          <p>${summary}</p>
        `;
        blogsContainer.appendChild(card);
      });
    }
  })
  .catch(() => {
    const blogsContainer = document.getElementById('blogs-container');
    if (blogsContainer) {
      blogsContainer.setAttribute('aria-busy', 'false');
      blogsContainer.innerHTML = '<p style="color:var(--muted)">Unable to load blog posts right now.</p>';
    }
  });

// Simple contact form handler
document.getElementById('contact-form')?.addEventListener('submit', function (e) {
  e.preventDefault();
  alert('Thank you for reaching out! I will get back to you soon.');
  this.reset();
});