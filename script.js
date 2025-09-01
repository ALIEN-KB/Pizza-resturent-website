// Mobile nav toggle (accessible)
(function () {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('primary-nav');

  if (!toggle || !nav) return;

  function setOpen(isOpen) {
    toggle.setAttribute('aria-expanded', String(isOpen));
    nav.classList.toggle('open', isOpen);
  }

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.contains('open');
    setOpen(!isOpen);
  });

  // Close menu on link click (mobile)
  nav.addEventListener('click', (e) => {
    const target = e.target;
    if (target instanceof Element && target.tagName === 'A' && nav.classList.contains('open')) {
      setOpen(false);
    }
  });
})();

// Dynamic year in footer
(function () {
  const y = document.getElementById('year');
  if (y) y.textContent = String(new Date().getFullYear());
})();

// Menu/Deals category preview swap (hover/focus) for all sections
(function () {
  const layouts = document.querySelectorAll('.menu-layout');
  if (!layouts.length) return;

  layouts.forEach((menuLayout) => {
    const previewBox = menuLayout.querySelector('.menu-preview');
    const previewImg = previewBox ? previewBox.querySelector('img') : null;
    const grid = menuLayout.querySelector('.menu-grid');
    const cards = menuLayout.querySelectorAll('.menu-card[data-image]');
    if (!previewImg || !previewBox || !grid || cards.length === 0) return;

    function swap(src) {
      if (!src) return;
      // Normalize possible backslashes from Windows paths
      src = src.replace(/\\/g, '/');
      // Add transition class
      previewImg.classList.add('swap');
      // Preload to avoid flicker
      const img = new Image();
      img.onload = () => {
        previewImg.src = src;
        // If data-alt provided, update alt for accessibility
        if (swap.lastAlt) {
          previewImg.alt = swap.lastAlt;
        }
        // allow one frame for src swap, then remove class for fade-in
        requestAnimationFrame(() => previewImg.classList.remove('swap'));
      };
      img.src = src;
    }

    let hideTimer = null;
    const clearHideTimer = () => { if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; } };
    const show = () => { clearHideTimer(); previewBox.classList.add('active'); menuLayout.classList.add('has-preview'); };
    const hide = () => { clearHideTimer(); previewBox.classList.remove('active'); menuLayout.classList.remove('has-preview'); };
    const hideDebounced = () => { clearHideTimer(); hideTimer = setTimeout(hide, 120); };

    cards.forEach((card) => {
      const src = card.getAttribute('data-image');
      const alt = card.getAttribute('data-alt') || previewImg.alt;
      const run = () => { swap.lastAlt = alt; swap(src); show(); };
      card.addEventListener('mouseenter', run);
      card.addEventListener('focusin', run);
      // Optional: also respond to touchstart for mobile tap
      card.addEventListener('touchstart', run, { passive: true });
      card.addEventListener('focusout', (e) => {
        if (grid && !grid.contains(e.relatedTarget)) hideDebounced();
      });
    });

    // Container-level hover handling to prevent flicker while moving between cards and preview
    menuLayout.addEventListener('mouseenter', clearHideTimer);
    menuLayout.addEventListener('mouseleave', hideDebounced);
    previewBox.addEventListener('mouseenter', clearHideTimer);
    previewBox.addEventListener('mouseleave', hideDebounced);
  });
})();
