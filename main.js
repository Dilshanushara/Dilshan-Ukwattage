// Hamburger menu functionality
const navToggleBtn = document.getElementById('navToggleBtn');
const navLinks = document.querySelector('nav ul');
navToggleBtn?.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Close menu after clicking a link (on mobile)
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    if (window.innerWidth <= 700) {
      navLinks.classList.remove('open');
    }
  });
});

// Scroll to top button
const scrollTopBtn = document.getElementById('scrollTopBtn');
window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
        scrollTopBtn.style.display = 'block';
    } else {
        scrollTopBtn.style.display = 'none';
    }
});
scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Section reveal on scroll
const revealSections = document.querySelectorAll('section');
function revealOnScroll() {
    const triggerBottom = window.innerHeight * 0.92;
    revealSections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top < triggerBottom) {
            section.classList.add('reveal');
        }
    });
}
window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

// Navigation active link highlight
const navLinksArr = Array.from(document.querySelectorAll('.nav-link'));
window.addEventListener('scroll', () => {
    let fromTop = window.scrollY + 120;
    navLinksArr.forEach(link => {
        let section = document.querySelector(link.getAttribute('href'));
        if (section && section.offsetTop <= fromTop && section.offsetTop + section.offsetHeight > fromTop) {
            navLinksArr.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        }
    });
});

// Light/Dark mode
const modeToggle = document.getElementById('mode-toggle');
modeToggle.addEventListener('click', () => {
    document.body.toggleAttribute('data-theme', 'dark');
    if (document.body.getAttribute('data-theme') === 'dark') {
        modeToggle.textContent = '☀️';
    } else {
        modeToggle.textContent = '🌙';
    }
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
            if (skill === 'all' || card.getAttribute('data-skills').includes(skill)) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// Optionally: Fetch Medium posts (dummy loader in HTML, implement as needed)

// Example Medium fetch:
fetch('https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@dilshanukwattage')
  .then(response => response.json())
  .then(data => {
    if (data.items && Array.isArray(data.items)) {
      const blogDiv = document.getElementById('medium-blogs');
      blogDiv.innerHTML = '';
      data.items.slice(0,3).forEach(post => {
        const article = document.createElement('article');
        article.className = 'blog-post';
        article.innerHTML = `<h3><a href="${post.link}" target="_blank">${post.title}</a></h3>
          <small>${new Date(post.pubDate).toLocaleDateString()}</small>
          <p>${post.description.replace(/<[^>]+>/g, '').slice(0,120)}...</p>`;
        blogDiv.appendChild(article);
      });
    }
  });


// Simple contact form handler (optional, just disables default)
document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Thank you for reaching out! I will get back to you soon.');
    this.reset();
});