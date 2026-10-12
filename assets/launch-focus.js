(() => {
  const menu = document.getElementById('mainNavLinks');
  const toggle = document.getElementById('navMenuToggle');
  const mobile = matchMedia('(max-width: 1100px)');
  function closeMenu(returnFocus = false) {
    menu.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    if (returnFocus) toggle.focus();
  }
  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') !== 'true';
    menu.classList.toggle('is-open', expanded);
    toggle.setAttribute('aria-expanded', String(expanded));
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') closeMenu(true);
  });
  document.addEventListener('click', event => {
    if (event.target.closest('#mainNavLinks a')) closeMenu();
    else if (!event.target.closest('#nav')) closeMenu();
  });
  mobile.addEventListener('change', () => closeMenu());

  function revealTarget(hash) {
    let target;
    try { target = document.getElementById(decodeURIComponent(hash.slice(1))); } catch (_) { return; }
    if (!target) return;
    const ancestors = [];
    for (let element = target; element; element = element.parentElement) {
      if (element.tagName === 'DETAILS') ancestors.push(element);
    }
    ancestors.reverse().forEach(details => { details.open = true; });
    return target;
  }
  // Open before default anchor scrolling, including links added by the demos.
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href^="#"]');
    if (link && !link.hasAttribute('data-brain-node') && !link.hasAttribute('data-agent-topic')) revealTarget(link.hash);
  }, true);
  function revealHash() {
    const target = revealTarget(location.hash);
    if (target) requestAnimationFrame(() => target.scrollIntoView({ block:'start' }));
  }
  window.addEventListener('hashchange', revealHash);
  revealHash();
})();
