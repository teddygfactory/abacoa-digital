(() => {
  const story = document.getElementById('start-here');
  const machine = document.getElementById('automationMachine');
  if (!story || !machine) return;
  const steps = [...story.querySelectorAll('[data-automation-step]')];
  const panels = [...story.querySelectorAll('[data-automation-panel]')];
  const trail = [...story.querySelectorAll('[data-machine-trail]')];
  const previous = document.getElementById('automationPrevious');
  const next = document.getElementById('automationNext');
  const status = document.getElementById('automationStatus');
  const count = document.getElementById('automationCount');
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const narrow = matchMedia('(max-width: 760px)');
  let current = -1, frame = 0, manualAt = null, suspended = false;
  const labels = ['Incoming call','AI answers','Lead captured','People take it forward'];
  function select(index, manual = false) {
    index = Math.max(0, Math.min(steps.length - 1,index));
    if (manual) manualAt = window.scrollY;
    if (index === current) return;
    current = index;
    steps.forEach((step,i) => {
      step.classList.toggle('is-active',i === index);
      step.querySelector('button').setAttribute('aria-pressed',String(i === index));
    });
    panels.forEach((panel,i) => { panel.hidden = i !== index; });
    trail.forEach((node,i) => {
      node.classList.toggle('is-current',i === index);
      node.classList.toggle('is-complete',i < index);
      node.setAttribute('aria-current',i === index ? 'step' : 'false');
    });
    previous.disabled = index === 0; next.disabled = index === steps.length - 1;
    count.textContent = `${index + 1} / ${steps.length} · ${labels[index]}`;
    machine.dataset.stage = String(index);
    // Only explicit interactions announce the scene; scrolling never interrupts reading.
    if (manual) status.textContent = labels[index];
    document.dispatchEvent(new CustomEvent('abacoa:automation-stage',{detail:{index}}));
  }
  function follow() {
    frame = 0;
    if (suspended || document.hidden || root.classList.contains('motion-paused')) return;
    // A clicked scene stays selected until the visitor deliberately scrolls again.
    if (manualAt !== null && Math.abs(window.scrollY-manualAt) < 36) return;
    manualAt = null;
    const readingLine = window.innerHeight * (narrow.matches ? .86 : .55);
    let nearest = 0, distance = Infinity;
    steps.forEach((step,i) => {
      const box = step.getBoundingClientRect();
      const delta = Math.abs(box.top + Math.min(box.height*.4,100) - readingLine);
      if (delta < distance) { nearest=i; distance=delta; }
    });
    select(nearest);
  }
  function schedule() {
    if (!frame && !suspended && !document.hidden) frame = requestAnimationFrame(follow);
  }
  steps.forEach((step,i) => step.querySelector('button').addEventListener('click',() => select(i,true)));
  previous.addEventListener('click',() => select(current-1,true));
  next.addEventListener('click',() => select(current+1,true));
  window.addEventListener('scroll',schedule,{passive:true});
  window.addEventListener('resize',schedule,{passive:true});
  document.addEventListener('toggle',schedule,true);
  reduce.addEventListener('change',schedule);
  narrow.addEventListener('change',schedule);
  new MutationObserver(schedule).observe(root,{attributes:true,attributeFilter:['class']});
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      machine.classList.toggle('is-in-view',entries.some(entry=>entry.isIntersecting));
    }).observe(machine);
  } else machine.classList.add('is-in-view');
  if ('ResizeObserver' in window) new ResizeObserver(schedule).observe(document.body);
  document.addEventListener('visibilitychange',() => {
    machine.classList.toggle('is-page-hidden',document.hidden);
    if (document.hidden) { cancelAnimationFrame(frame); frame=0; } else schedule();
  });
  window.addEventListener('pagehide',() => { suspended=true; cancelAnimationFrame(frame); frame=0; });
  window.addEventListener('pageshow',() => { suspended=false; schedule(); });
  select(0); schedule();
})();
