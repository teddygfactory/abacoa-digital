(() => {
  const root = document.documentElement;
  const toggle = document.getElementById('themeToggle');
  const meta = document.querySelector('meta[name="theme-color"]');
  function apply(choice) {
    root.dataset.theme = choice === 'light' ? 'light' : 'dark';
    const label = root.dataset.theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
    toggle?.setAttribute('aria-label', label);
    toggle?.setAttribute('title', label);
    meta?.setAttribute('content', root.dataset.theme === 'light' ? '#fbf0d7' : '#0d0f12');
    document.dispatchEvent(new Event('abacoa-theme-change'));
  }
  apply(root.dataset.theme);
  toggle?.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    apply(next);
    try { localStorage.setItem('abacoa-theme', next); } catch (_) {}
  });
  window.addEventListener('storage', event => {
    if (event.key === 'abacoa-theme' || event.key === null) apply(event.newValue);
  });
})();

(() => {
  const brain = document.querySelector('.brain');
  const shell = document.querySelector('.brain-shell');
  const canvas = document.getElementById('brainCanvas');
  const nodes = [...document.querySelectorAll('[data-brain-node]')];
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const motion = document.getElementById('motionToggle');
  const reset = document.getElementById('brainReset');
  const title = document.getElementById('brainDetailTitle');
  const kicker = document.getElementById('brainDetailKicker');
  const copy = document.getElementById('brainDetailCopy');
  const links = document.getElementById('brainDetailLinks');
  const status = document.getElementById('brainStatus');
  if (!brain || !nodes.length || !title || !links) return;

  const content = {
    business: {
      title: 'One business. Connected.', kicker: 'Explore the connections',
      copy: 'Your calls, customer details, and daily work belong together. Explore a connection to see what we can build.',
      links: [['Explore services', '#services'], ['Watch Elliot', '#system-film']], related: []
    },
    knowledge: {
      title: 'Your knowledge, put to work.', kicker: 'Private AI',
      copy: 'Turn your documents, FAQs, and working knowledge into an assistant that helps your team find useful answers.',
      links: [['Explore private AI', '#service-voice'], ['How we build', '#approach']],
      related: ['voice', 'software', 'workflows']
    },
    voice: {
      title: 'Someone answers. You keep moving.', kicker: 'Voice agents',
      copy: 'An AI receptionist can answer questions, capture the details, and book available appointments using your business rules.',
      links: [['Watch Elliot in action', '#system-film'], ['Explore an AI receptionist', '#contact']],
      related: ['knowledge', 'leads', 'workflows']
    },
    leads: {
      title: 'Keep the conversation connected.', kicker: 'Customer engagement',
      copy: 'Bring calls, forms, and messages into one place, with the customer context and next step ready for your team.',
      links: [['Explore customer engagement', '#service-leads'], ['Talk about your system', '#contact']],
      related: ['voice', 'software', 'analytics']
    },
    workflows: {
      title: 'Less chasing. Clear next steps.', kicker: 'Workflow systems',
      copy: 'Connect intake, scheduling, follow-up, and team handoffs so useful information moves with the work.',
      links: [['Explore workflows', '#service-workflows'], ['Our build process', '#process']],
      related: ['voice', 'leads', 'software']
    },
    software: {
      title: 'Software that fits your day.', kicker: 'Web & app development',
      copy: 'Custom websites, CRMs, portals, and internal tools built around how your customers and team actually work.',
      links: [['Explore custom software', '#service-software'], ['See our work', '#work']],
      related: ['knowledge', 'workflows', 'analytics']
    },
    analytics: {
      title: 'Know where to act next.', kicker: 'Data & analytics',
      copy: 'See your inquiries, activity, and follow-up together in dashboards that make the next decision easier.',
      links: [['Explore analytics', '#service-analytics'], ['Talk about your data', '#contact']],
      related: ['leads', 'software', 'workflows']
    },
    brand: {
      title: 'Make the right first impression.', kicker: 'Brand & digital presence',
      copy: 'Bring your identity, message, and website together so people understand your business and know how to reach you.',
      links: [['Explore brand & presence', '#service-brand'], ['See our work', '#work']],
      related: ['leads', 'software', 'products']
    },
    products: {
      title: 'See the thinking in the work.', kicker: 'Independent products',
      copy: 'Explore the products we build ourselves, and the care we bring to practical, connected software.',
      links: [['Explore our products', '#work'], ['Meet the studio', '#approach']],
      related: ['brand', 'software', 'analytics']
    }
  };
  const anchors = nodes.map(node => ({
    x: parseFloat(node.style.getPropertyValue('--x')) / 100,
    y: parseFloat(node.style.getPropertyValue('--y')) / 100
  }));
  const renderer = window.createNeuralRenderer?.(canvas, brain, anchors);

  let active = 0, paused = reduce.matches, visible = true, raf = 0, last = 0, time = 0;
  const mouse = { x: 0, y: 0 }, tilt = { x: 0, y: 0 };

  function select(index, announce = false) {
    active = index;
    const item = content[nodes[index].dataset.brainNode];
    brain.classList.toggle('is-exploring', index !== 0);
    nodes.forEach((node, i) => {
      node.setAttribute('aria-pressed', String(i === index));
      node.classList.toggle('is-related', item.related.includes(node.dataset.brainNode));
    });
    title.textContent = item.title;
    kicker.textContent = item.kicker;
    copy.textContent = item.copy;
    reset.hidden = index === 0;
    links.replaceChildren(...item.links.map(([text, href]) => {
      const link = document.createElement('a');
      link.href = href;
      if (href === '#system-film') link.dataset.storyLink = 'home';
      if (href === '#contact') link.dataset.agentTopic = ({ voice: 'calls', leads: 'followup', workflows: 'operations', software: 'website', analytics: 'operations', brand: 'website' })[nodes[index].dataset.brainNode] || 'general';
      link.append(document.createTextNode(text));
      const arrow = document.createElement('span');
      arrow.textContent = '↗';
      arrow.setAttribute('aria-hidden', 'true');
      link.append(arrow);
      return link;
    }));
    if (announce && status) status.textContent = `${item.title} ${item.copy}`;
    draw();
  }

  nodes.forEach((node, index) => {
    node.setAttribute('role', 'button');
    node.setAttribute('aria-controls', 'brainDetail');
    node.addEventListener('pointerenter', event => {
      if (event.pointerType !== 'touch') select(index);
    });
    node.addEventListener('focus', () => select(index, true));
    node.addEventListener('click', event => { event.preventDefault(); select(index, true); });
    node.addEventListener('keydown', event => {
      if (event.key === ' ') { event.preventDefault(); select(index, true); }
    });
  });
  reset.addEventListener('click', () => { select(0, true); nodes[0].focus({ preventScroll: true }); });
  shell.addEventListener('keydown', event => {
    if (event.key === 'Escape' && active) {
      event.preventDefault(); select(0, true); nodes[0].focus({ preventScroll: true });
    }
  });
  brain.addEventListener('pointermove', event => {
    if (paused || event.pointerType === 'touch') return;
    const rect = brain.getBoundingClientRect();
    mouse.x = (event.clientX - rect.left) / rect.width - .5;
    mouse.y = (event.clientY - rect.top) / rect.height - .5;
  });
  brain.addEventListener('pointerleave', () => { mouse.x = mouse.y = 0; });

  function draw() {
    const related = content[nodes[active].dataset.brainNode].related;
    const relatedIndexes = nodes.map((node, i) => related.includes(node.dataset.brainNode) ? i : -1).filter(i => i > 0);
    renderer?.render(time, tilt, active, relatedIndexes);
  }

  function frame(now) {
    raf = 0;
    if (paused || !visible || document.hidden) return;
    if (now - last >= 32) {
      time += Math.min(now - last, 48); last = now;
      tilt.x += (mouse.x - tilt.x) * .08; tilt.y += (mouse.y - tilt.y) * .08;
      draw();
    }
    raf = requestAnimationFrame(frame);
  }
  function sync() {
    cancelAnimationFrame(raf); raf = 0; last = performance.now();
    document.documentElement.classList.toggle('motion-paused', paused);
    if (motion) {
      motion.textContent = paused ? '▶ Enable motion' : 'Ⅱ Pause motion';
      motion.setAttribute('aria-pressed', String(paused));
    }
    draw();
    if (renderer && !paused && visible && !document.hidden) raf = requestAnimationFrame(frame);
  }
  if (renderer) {
    new ResizeObserver(() => { renderer.resize(); draw(); }).observe(brain);
    new IntersectionObserver(entries => { visible = entries[0].isIntersecting; sync(); }).observe(brain);
  }
  document.addEventListener('abacoa-theme-change', draw);

  motion?.addEventListener('click', () => {
    paused = !paused;
    if (paused) document.querySelectorAll('video').forEach(video => video.pause());
    sync();
  });
  reduce.addEventListener('change', () => {
    paused = reduce.matches;
    if (paused) document.querySelectorAll('video').forEach(video => video.pause());
    sync();
  });
  document.addEventListener('visibilitychange', sync);
  window.addEventListener('pagehide', () => cancelAnimationFrame(raf));
  if (!reduce.matches) document.documentElement.classList.add('motion-ready');
  select(0); sync();
})();

(() => {
  const video = document.getElementById('elliotFilm');
  const play = document.getElementById('filmPlay');
  const label = document.getElementById('filmPlayLabel');
  const group = document.querySelector('.film-chapters');
  if (!video || !play || !group) return;
  const chapters = [...group.querySelectorAll('[data-film-seek]')];
  let pendingSeek = null;
  play.hidden = false; group.hidden = false;
  function updateChapter() {
    let active = 0;
    chapters.forEach((chapter, i) => { if (video.currentTime >= Number(chapter.dataset.filmSeek)) active = i; });
    chapters.forEach((chapter, i) => {
      if (i === active) chapter.setAttribute('aria-current', 'step');
      else chapter.removeAttribute('aria-current');
    });
  }
  function applySeek() {
    if (pendingSeek === null || video.readyState < 1) return;
    video.currentTime = Math.min(pendingSeek, Math.max(0, (video.duration || 40.042) - .1));
    pendingSeek = null;
    updateChapter();
  }
  function start(at) {
    if (Number.isFinite(at)) { pendingSeek = at; applySeek(); }
    const playback = video.play();
    playback?.catch(() => { play.hidden = false; });
    video.focus({ preventScroll: true });
  }
  play.addEventListener('click', () => start(video.ended ? 0 : undefined));
  chapters.forEach(chapter => chapter.addEventListener('click', () => start(Number(chapter.dataset.filmSeek))));
  video.addEventListener('loadedmetadata', applySeek);
  video.addEventListener('play', () => { play.hidden = true; });
  video.addEventListener('ended', () => { play.hidden = false; label.textContent = 'Watch again'; });
  video.addEventListener('timeupdate', updateChapter);
  updateChapter();
})();
