/* ===========================
   Global UI Behaviors
   - sticky header shadow
   - mobile nav toggle + close on link
   - active nav link indicator
   - scroll reveal animations
   - year in footer
   - contact form validation
   - comments (localStorage) on post page
   =========================== */

(function () {
  const header = document.querySelector('.site-header');
  const nav = document.querySelector('.nav');
  const toggle = document.querySelector('.menu-toggle');

  // Sticky header elevation
  const onScroll = () => {
    if (window.scrollY > 6) header?.classList.add('scrolled');
    else header?.classList.remove('scrolled');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Mobile nav toggle
  toggle?.addEventListener('click', () => {
    const open = nav?.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  // Close mobile menu when a nav link is clicked
  nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    if (nav.classList.contains('open')) {
      nav.classList.remove('open');
      toggle?.setAttribute('aria-expanded', 'false');
    }
  }));

  // Active link indicator
  (function setActiveNav() {
    const current = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    const mapPostToBlog = current.includes('post.html');
    const target = mapPostToBlog ? 'blog.html' : current;
    document.querySelectorAll('.nav a').forEach(a => {
      const href = a.getAttribute('href')?.toLowerCase();
      if (href && (href === target || (href.endsWith('index.html') && target === 'index.html'))) {
        a.classList.add('active');
      }
    });
  })();

  // Scroll reveal
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 });
    revealEls.forEach(el => io.observe(el));
  }

  // Footer year
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // Contact form validation
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    const status = document.getElementById('formStatus');
    const get = sel => contactForm.querySelector(sel);
    const fields = {
      name: get('[name=name]'),
      email: get('[name=email]'),
      subject: get('[name=subject]'),
      message: get('[name=message]')
    };
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let ok = true;
      for (const key in fields) {
        const el = fields[key];
        el.classList.remove('invalid');
        const val = el.value.trim();
        if (!val || (el.name === 'email' && !emailRegex.test(val))) {
          el.classList.add('invalid');
          ok = false;
        }
      }
      if (!ok) {
        status.textContent = 'Please correct the highlighted fields.';
        status.style.color = '#ff8686';
        return;
      }
      // Simulate successful send (integrate your backend here)
      setTimeout(() => {
        status.textContent = 'Message sent! I will get back to you shortly.';
        status.style.color = '#8cf8ff';
        contactForm.reset();
      }, 300);
    });
  }

  // Comments (localStorage) on post page
  const commentsWrap = document.getElementById('comments');
  if (commentsWrap) {
    const params = new URLSearchParams(location.search);
    const postId = params.get('id') || 'demo-post';
    const listEl = document.getElementById('commentList');
    const form = document.getElementById('commentForm');
    const emptyState = document.getElementById('noComments');
    const STORAGE_KEY = `comments-${postId}`;

    const load = () => {
      try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      } catch { return []; }
    };
    const save = (data) => localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    const render = () => {
      const data = load();
      listEl.innerHTML = '';
      if (!data.length) {
        emptyState.hidden = false;
        return;
      }
      emptyState.hidden = true;
      data.forEach(({ name, time, text }) => {
        const li = document.createElement('li');
        li.className = 'comment';
        li.innerHTML = `
          <div class="who">${escapeHtml(name)}</div>
          <div class="when" style="color:var(--muted); font-size:.9rem; margin:.2rem 0 .4rem;">${new Date(time).toLocaleString()}</div>
          <p>${escapeHtml(text)}</p>
        `;
        listEl.appendChild(li);
      });
    };
    const escapeHtml = (s) => s.replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m]));

    render();

    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.querySelector('[name=cname]');
      const text = form.querySelector('[name=ctext]');
      [name, text].forEach(el => el.classList.remove('invalid'));

      if (!name.value.trim()) { name.classList.add('invalid'); return; }
      if (!text.value.trim()) { text.classList.add('invalid'); return; }

      const data = load();
      data.unshift({ name: name.value.trim(), text: text.value.trim(), time: Date.now() });
      save(data);
      form.reset();
      render();
    });
  }
  //btn used in copy link in post page
  function copyLink() {
    const currentUrl = window.location.href; // get current page URL
    navigator.clipboard.writeText(currentUrl) // copy to clipboard
      .then(() => {
        alert("Link copied to clipboard!");
      })
      .catch(err => {
        console.error("Failed to copy: ", err);
      });
  }

})();