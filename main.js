// Bootstrap toggler: remove focus after click
document.querySelector('.navbar-toggler')?.addEventListener('click', function () { this.blur(); });

// Smooth scroll and collapse on mobile
document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      const section = document.querySelector(href);
      if (section) {
        e.preventDefault();
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        const navbarCollapse = document.getElementById('mainNavbar');
        if (window.innerWidth < 992 && navbarCollapse?.classList.contains('show')) {
          const collapse = bootstrap.Collapse.getOrCreateInstance(navbarCollapse);
          collapse.hide();
        }
      }
    }
  });
});

// Scroll to top button
const scrollTopBtn = document.getElementById('scrollTopBtn');
window.addEventListener('scroll', () => {
  scrollTopBtn.style.display = window.scrollY > 400 ? 'block' : 'none';
});
scrollTopBtn?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// IntersectionObserver for section reveal
const io = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('reveal');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.section').forEach(sec => io.observe(sec));

// Active link highlight using IntersectionObserver
const navLinksArr = Array.from(document.querySelectorAll('.nav-link'));
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = '#' + entry.target.id;
      navLinksArr.forEach(link => link.classList.toggle('active', link.getAttribute('href') === id));
    }
  });
}, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });
document.querySelectorAll('main .section').forEach(sec => sectionObserver.observe(sec));

// Theme toggle with persistence
const modeToggle = document.getElementById('mode-toggle');
const THEME_KEY = 'theme-preference';
function applyTheme(theme) {
  if (theme === 'light') {
    document.documentElement.removeAttribute('data-theme');
    modeToggle.setAttribute('aria-pressed', 'false');
    modeToggle.textContent = '🌙';
  } else {
    document.documentElement.setAttribute('data-theme', 'dark');
    modeToggle.setAttribute('aria-pressed', 'true');
    modeToggle.textContent = '☀️';
  }
}
function getPreferredTheme() {
  const stored = localStorage.getItem(THEME_KEY);
  if (stored) return stored;
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}
applyTheme(getPreferredTheme());
modeToggle?.addEventListener('click', () => {
  const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  localStorage.setItem(THEME_KEY, next);
  applyTheme(next);
});

// Project filter
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const skill = btn.getAttribute('data-skill');
    projectCards.forEach(card => {
      const skills = (card.getAttribute('data-skills') || '').toLowerCase();
      card.style.display = skill === 'all' || skills.includes(String(skill)) ? '' : 'none';
    });
  });
});

// Blog: render skeletons first
const blogsContainer = document.getElementById('blogs-container');
if (blogsContainer) {
  blogsContainer.innerHTML = '';
  for (let i = 0; i < 4; i++) {
    const sk = document.createElement('div');
    sk.className = 'skeleton';
    blogsContainer.appendChild(sk);
  }
}

// Fetch Medium RSS and render custom summary
fetch('https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@dilshanukwattage')
  .then(response => response.json())
  .then(data => {
    if (!blogsContainer) return;
    blogsContainer.setAttribute('aria-busy', 'false');
    if (data.items && Array.isArray(data.items)) {
      blogsContainer.innerHTML = '';
      data.items.slice(0, 4).forEach(post => {
        const plainText = (post.description || '').replace(/<[^>]+>/g, '');
        const words = plainText.split(/\s+/).filter(Boolean);
        const summary = words.slice(0, 24).join(' ') + (words.length > 24 ? '...' : '');
        const card = document.createElement('div');
        card.className = 'blog-card';
        card.innerHTML = `
          <h3><a href="${post.link}" target="_blank" rel="noopener">${post.title}</a></h3>
          <div style="font-size:.97em;color:var(--muted);margin-bottom:.45em;">by ${post.author} · ${new Date(post.pubDate).toLocaleDateString()}</div>
          <p>${summary}</p>
        `;
        blogsContainer.appendChild(card);
      });
    } else {
      blogsContainer.innerHTML = '<p class="section-sub">Could not load articles right now.</p>';
    }
  })
  .catch(() => {
    if (!blogsContainer) return;
    blogsContainer.setAttribute('aria-busy', 'false');
    blogsContainer.innerHTML = '<p class="section-sub">Could not load articles right now.</p>';
  });

// Contact form client-side guard
document.getElementById('contact-form')?.addEventListener('submit', e => {
  e.preventDefault();
  const form = e.currentTarget;
  const name = document.getElementById('name');
  const email = document.getElementById('email');
  const message = document.getElementById('message');
  if (!name.value || !email.value || !message.value) {
    alert('Please fill in all fields.');
    return;
  }
  alert('Thank you! Your message has been received.');
  form.reset();
});