// Smooth scroll navigation and active link
document.querySelectorAll('nav a.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            window.scrollTo({
                top: target.offsetTop - 60,
                behavior: 'smooth'
            });
        }
    });
});

window.addEventListener('scroll', () => {
    // Highlight active nav link
    const sections = document.querySelectorAll('main section');
    const scrollPos = window.scrollY + 75;
    let found = false;
    sections.forEach((sec, idx) => {
        if (scrollPos >= sec.offsetTop && scrollPos < sec.offsetTop + sec.offsetHeight) {
            document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
            document.querySelectorAll('nav a')[idx].classList.add('active');
            found = true;
        }
    });
    if (!found) {
        document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
        document.querySelector('nav a[href="#about"]').classList.add('active');
    }
    // Show/hide scroll-to-top button
    document.getElementById('scrollTopBtn').style.display = window.scrollY > 300 ? 'block' : 'none';
    // Section reveal effect
    document.querySelectorAll('section').forEach(sec => {
        const rect = sec.getBoundingClientRect();
        if (rect.top < window.innerHeight - 70) {
            sec.classList.add('reveal');
        }
    });
});

// Scroll to top button
document.getElementById('scrollTopBtn').onclick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Project filtering
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        const skill = this.dataset.skill;
        document.querySelectorAll('.project-card').forEach(card => {
            if (skill === 'all' || card.dataset.skills.includes(skill)) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// Light/dark mode toggle
const modeBtn = document.getElementById('mode-toggle');
const htmlEl = document.documentElement;
const theme = localStorage.getItem('theme');
if (theme) htmlEl.setAttribute('data-theme', theme);

modeBtn.onclick = () => {
    if (htmlEl.getAttribute('data-theme') === 'dark') {
        htmlEl.setAttribute('data-theme', 'light');
        modeBtn.textContent = '🌙';
        localStorage.setItem('theme', 'light');
    } else {
        htmlEl.setAttribute('data-theme', 'dark');
        modeBtn.textContent = '☀️';
        localStorage.setItem('theme', 'dark');
    }
};
// Set initial mode button icon
if (htmlEl.getAttribute('data-theme') === 'dark') modeBtn.textContent = '☀️';

// Contact form handler
document.getElementById('contact-form').onsubmit = function(e) {
    e.preventDefault();
    const name = this.name.value.trim();
    const email = this.email.value.trim();
    const message = this.message.value.trim();
    const subject = encodeURIComponent("Portfolio contact from " + name);
    const body = encodeURIComponent(message + "\n\nFrom: " + name + " <" + email + ">");
    window.location.href = `mailto:dilshanushara16@gmail.com?subject=${subject}&body=${body}`;
    this.reset();
};


// Medium Blog Fetcher
(function fetchMediumBlogs() {
    const container = document.getElementById('medium-blogs');
    const mediumFeed = 'https://medium.com/feed/@dilshanukwattage';
    // Use rss2json public API to convert RSS to JSON
    const api = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(mediumFeed)}`;
    fetch(api)
        .then(response => response.json())
        .then(data => {
            if (!data.items || !data.items.length) throw new Error("No posts found.");
            let html = '';
            data.items.slice(0, 4).forEach(item => {
                html += `
                <article class="blog-post">
                    <h3><a href="${item.link}" target="_blank" rel="noopener">${item.title}</a></h3>
                    <small>${new Date(item.pubDate).toLocaleDateString()}</small>
                    <p>${item.description.replace(/<[^>]+>/g, '').substring(0, 140)}...</p>
                </article>`;
            });
            container.innerHTML = html;
        })
        .catch(() => {
            container.innerHTML = `
                <p>Unable to load Medium posts. See all my blogs on 
                <a href="https://medium.com/@dilshanukwattage" target="_blank">Medium</a>.</p>`;
        });
})();