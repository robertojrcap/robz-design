(() => {
  const root = document.documentElement;
  const toggle = document.querySelector('.tg');
  const syncToggle = () => {
    const light = root.dataset.theme === 'light';
    toggle.setAttribute('aria-pressed', String(light));
    toggle.setAttribute('aria-label', light ? 'Switch to dark theme' : 'Switch to light theme');
  };
  syncToggle();
  toggle.addEventListener('click', () => {
    if (root.dataset.theme === 'light') delete root.dataset.theme;
    else root.dataset.theme = 'light';
    try { localStorage.setItem('robz-theme', root.dataset.theme || 'dark'); } catch (e) {}
    syncToggle();
  });

  const header = document.querySelector('.hd');
  if (header.hasAttribute('data-hide')) {
    let last = scrollY, queued = false;
    const update = () => {
      queued = false;
      const y = Math.max(0, scrollY);
      if (Math.abs(y - last) < 6) return;
      header.classList.toggle('away', y > last && y > innerHeight * 0.3);
      last = y;
    };
    addEventListener('scroll', () => {
      if (!queued) { queued = true; requestAnimationFrame(update); }
    }, { passive: true });
  }

  const reveals = [...document.querySelectorAll('.rv')];
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in');
      io.unobserve(entry.target);
    }), { rootMargin: '0px 0px -8% 0px' });
    reveals.forEach((el, i) => { el.style.transitionDelay = `${(i % 3) * 70}ms`; io.observe(el); });
  } else {
    reveals.forEach((el) => el.classList.add('in'));
  }
})();
