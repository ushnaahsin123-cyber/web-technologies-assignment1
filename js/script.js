/* =========================================================
   Ushna Ahsin — SOC Portfolio
   Vanilla JS, no dependencies. Each feature checks for its
   own DOM hooks so this single file works across every page.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  initNavToggle();
  initTerminal();
  initStatCounters();
  initTabs();
  initAccordion();
  initGalleryFilter();
  initProjectModal();
  initContactForm();
  initYear();
});

/* ---------- Responsive hamburger nav ---------- */
function initNavToggle() {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const isOpen = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

    // Close the menu once a link is chosen (mobile UX)
  links.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Close the menu if the user presses Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && links.classList.contains('open')) {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
}

/* ---------- Home hero: simulated SIEM terminal typing ---------- */
function initTerminal() {
  const body = document.querySelector('[data-terminal]');
  if (!body) return;

  const lines = [
    { text: 'ushna@soc-console:~$ tail -f auth.log', type: 'cmd' },
    { text: '[10:41:02] session opened for user devops', type: 'plain' },
    { text: 'ushna@soc-console:~$ indictra scan --source auth.log', type: 'cmd' },
    { text: '[10:41:07] 214 events parsed, 20 rules loaded', type: 'ok' },
    { text: '[10:41:08] ALERT: 12 failed SMB logins in 60s — src 192.168.10.20', type: 'alert' },
    { text: '[10:41:08] mapped to MITRE ATT&CK T1110 (Brute Force)', type: 'warn' },
    { text: '[10:41:09] report written -> report.html', type: 'ok' },
  ];

  let lineIndex = 0;

  function typeLine() {
    if (lineIndex >= lines.length) return;
    const { text, type } = lines[lineIndex];
    const el = document.createElement('div');
    el.className = 'line';
    body.appendChild(el);

    let charIndex = 0;
    const speed = type === 'cmd' ? 32 : 10;

    function typeChar() {
      if (charIndex <= text.length) {
        el.textContent = text.slice(0, charIndex);
        if (type !== 'plain') el.classList.add(type === 'cmd' ? 'cmd' : type);
        charIndex++;
        setTimeout(typeChar, speed);
      } else {
        lineIndex++;
        setTimeout(typeLine, 260);
      }
    }
    typeChar();
  }

  // Only run the animation once it scrolls into view
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        typeLine();
        observer.disconnect();
      }
    });
  }, { threshold: 0.3 });
  observer.observe(body);
}

/* ---------- Home stats: count up on scroll into view ---------- */
function initStatCounters() {
  const stats = document.querySelectorAll('[data-count]');
  if (!stats.length) return;

  const animate = (el) => {
    const target = parseInt(el.dataset.count, 10);
    const duration = 1100;
    const start = performance.now();

    function frame(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target).toString();
      if (progress < 1) requestAnimationFrame(frame);
      else el.textContent = target.toString();
    }
    requestAnimationFrame(frame);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animate(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  stats.forEach((el) => observer.observe(el));
}

/* ---------- About page: tab switcher ---------- */
function initTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  if (!tabButtons.length) return;

  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.tab;

      tabButtons.forEach((b) => b.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach((p) => p.classList.remove('active'));

      btn.classList.add('active');
      document.getElementById(targetId).classList.add('active');
    });
  });
}

/* ---------- Services page: accordion ---------- */
function initAccordion() {
  const items = document.querySelectorAll('.accordion-item');
  if (!items.length) return;

  items.forEach((item) => {
    const trigger = item.querySelector('.accordion-trigger');
    const panel = item.querySelector('.accordion-panel');

    // Respect an item marked "open" in the markup (e.g. the first one)
    if (item.classList.contains('open')) {
      panel.style.maxHeight = panel.scrollHeight + 'px';
      trigger.setAttribute('aria-expanded', 'true');
    }

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close any other open item (single-open accordion)
      items.forEach((other) => {
        other.classList.remove('open');
        other.querySelector('.accordion-panel').style.maxHeight = null;
        other.querySelector('.accordion-trigger').setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.classList.add('open');
        trigger.setAttribute('aria-expanded', 'true');
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  });
}

/* ---------- Gallery: category filter ---------- */
function initGalleryFilter() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card');
  if (!filterButtons.length || !cards.length) return;

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      cards.forEach((card) => {
        const show = filter === 'all' || card.dataset.category === filter;
        card.style.display = show ? '' : 'none';
      });
    });
  });
}

/* ---------- Gallery: project detail modal ---------- */
function initProjectModal() {
  const overlay = document.querySelector('.modal-overlay');
  const cards = document.querySelectorAll('.project-card');
  if (!overlay || !cards.length) return;

  const modal = overlay.querySelector('.modal');
  const closeBtn = overlay.querySelector('.modal-close');

  const openModal = (card) => {
    modal.querySelector('[data-modal-title]').textContent = card.dataset.title;
    modal.querySelector('[data-modal-meta]').textContent = card.dataset.meta;
    modal.querySelector('[data-modal-desc]').textContent = card.dataset.desc;

    const chipWrap = modal.querySelector('[data-modal-chips]');
    chipWrap.innerHTML = '';
    card.dataset.tools.split(',').forEach((tool) => {
      const span = document.createElement('span');
      span.textContent = tool.trim();
      chipWrap.appendChild(span);
    });

    const link = modal.querySelector('[data-modal-link]');
    if (card.dataset.link) {
      link.href = card.dataset.link;
      link.style.display = '';
    } else {
      link.style.display = 'none';
    }

    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  cards.forEach((card) => card.addEventListener('click', () => openModal(card)));
  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
}

/* ---------- Contact: client-side validation ---------- */
function initContactForm() {
  const form = document.querySelector('#incident-form');
  if (!form) return;

  const successBox = form.querySelector('.form-success');

  const validators = {
    name: (v) => v.trim().length >= 2 || 'Enter your full name.',
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || 'Enter a valid email address.',
    priority: (v) => v !== '' || 'Select a priority.',
    message: (v) => v.trim().length >= 12 || 'Message should be at least 12 characters.',
  };

  const setError = (field, message) => {
    const row = field.closest('.form-row');
    row.classList.toggle('has-error', Boolean(message));
    row.querySelector('.error-msg').textContent = message || '';
  };

  const validateField = (field) => {
    const rule = validators[field.name];
    if (!rule) return true;
    const result = rule(field.value);
    setError(field, result === true ? '' : result);
    return result === true;
  };

  form.querySelectorAll('input, textarea, select').forEach((field) => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      if (field.closest('.form-row').classList.contains('has-error')) validateField(field);
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    successBox.classList.remove('show');

    let valid = true;
    form.querySelectorAll('input, textarea, select').forEach((field) => {
      if (!validateField(field)) valid = false;
    });

    if (!valid) {
      form.querySelector('.has-error input, .has-error textarea, .has-error select')?.focus();
      return;
    }

    // No backend — simulate a ticket being filed client-side.
    const ticketId = 'INC-' + Math.floor(1000 + Math.random() * 9000);
    successBox.querySelector('span').textContent =
      `✓ Ticket ${ticketId} filed — thanks, I'll reply within a couple of days.`;
    successBox.classList.add('show');
    form.reset();
  });
}

/* ---------- Footer year ---------- */
function initYear() {
  const el = document.querySelector('[data-year]');
  if (el) el.textContent = new Date().getFullYear();
}
