(() => {
  const field = document.getElementById('connectedBackground');
  const canvas = document.getElementById('connectedField');
  const ctx = canvas?.getContext('2d', { alpha:true });
  if (!field || !ctx) return;
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  let width = 0, height = 0, pixelRatio = 1, raf = 0, last = 0, clock = 0;
  let progress = 0, destination = 0, stopped = false, suspended = false;
  let light = root.dataset.theme === 'light', milestones = [];
  let sections = [], activeSection = null, burst = null;
  const sectionElements = [...document.querySelectorAll('main > .hero, main section[id]')];
  const energy = new Float32Array(76);
  sectionElements.forEach(element => {
    if (element.hidden || element.classList.contains('hero')) return;
    const anchor = document.createElement('span');
    anchor.className = 'section-network-anchor'; anchor.setAttribute('aria-hidden','true');
    element.appendChild(anchor);
  });
  let seed = 73;
  const random = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  const nodes = Array.from({length:76}, (_, i) => ({
    lane:i % 4, order:Math.floor(i / 4), scatterX:random(), scatterY:random(),
    phase:random() * Math.PI * 2, depth:.45 + random() * .55
  }));
  const clamp = value => Math.max(0, Math.min(1, value));
  const mix = (a, b, amount) => a + (b - a) * amount;

  function measure() {
    const nextWidth = window.innerWidth, nextHeight = window.innerHeight;
    if (nextWidth !== width || nextHeight !== height) {
      width = nextWidth; height = nextHeight;
      // Crisp at high DPI without allocating an unbounded full-screen bitmap.
      pixelRatio = Math.min(window.devicePixelRatio || 1, 2, Math.sqrt(3000000 / (width * height)));
      canvas.width = Math.round(width * pixelRatio); canvas.height = Math.round(height * pixelRatio);
      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    }
    milestones = ['system-film','owner-dashboard','services','contact'].map(id => {
      const element = document.getElementById(id);
      return element ? element.getBoundingClientRect().top + window.scrollY : 0;
    });
    // Closed demo sections and unpublished placeholders cannot activate a circuit.
    sections = sectionElements.map((element,index) => ({
      element, index, key:element.id || 'overview', top:element.getBoundingClientRect().top + window.scrollY
    })).filter(section => !section.element.hidden && section.element.getClientRects().length > 0);
    followScroll();
    if (stopped && !document.hidden) draw();
  }
  function followScroll() {
    if (suspended) return;
    if (stopped && !reduce.matches) return;
    const readingLine = window.scrollY + height * .4;
    let current = sections[0];
    for (const section of sections) if (section.top <= readingLine) current = section;
    activate(current);
    if (reduce.matches) { draw(); return; }
    const position = window.scrollY + height * .2;
    const stops = [0, ...milestones];
    let stage = 0;
    for (let i = 0; i < stops.length - 1; i++) {
      if (position >= stops[i]) stage = (i + clamp((position - stops[i]) / Math.max(1, stops[i + 1] - stops[i]))) / 4;
    }
    destination = clamp(stage);
  }
  function activate(section) {
    if (!section || section.key === activeSection?.key) return;
    const direction = activeSection && section.index < activeSection.index ? -1 : 1;
    activeSection?.element.classList.remove('network-active');
    activeSection = section;
    section.element.classList.add('network-active');
    field.dataset.activeSection = section.key;
    burst = !stopped && !reduce.matches ? { start:clock, direction } : null;
    if (reduce.matches) nodes.forEach((node,i) => { energy[i] = sectionEnergy(node); });
  }
  function sectionEnergy(node) {
    if (!activeSection) return 0;
    const focusRow = 4 + (activeSection.index * 3) % 11;
    const side = activeSection.index % 2;
    const laneWeight = Math.floor(node.lane / 2) === side ? 1 : .3;
    return Math.exp(-Math.pow((node.order - focusRow) / 4.5,2)) * laneWeight;
  }
  function pulseEnergy(node) {
    if (!burst) return 0;
    const age = (clock - burst.start) / 1900;
    if (age >= 1) return 0;
    const row = burst.direction > 0 ? age * 23 - 2 : 21 - age * 23;
    return Math.exp(-Math.pow((node.order - row) / 1.45,2)) * (1 - age * .35);
  }
  function point(node) {
    const ordered = .12 + progress * .78;
    const row = node.order / 18;
    const side = node.lane < 2 ? .075 : .925;
    const wave = Math.sin(row * Math.PI * 2.2 + progress * 3.1 + node.lane * .34);
    const x = mix(node.scatterX, side + wave * (.16 - progress * .055) + (node.lane % 2) * .045, ordered);
    const y = mix(node.scatterY, row * 1.26 - .13 + Math.sin(node.lane + progress * 2) * .055, ordered);
    return {
      x:x * width + Math.sin(clock * .00012 + node.phase) * 5 * node.depth,
      y:y * height + Math.cos(clock * .00009 + node.phase) * 7 * node.depth,
      depth:node.depth
    };
  }
  function stroke(a, b, alpha, thickness = .65, charge = 0) {
    ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
    ctx.strokeStyle = `rgba(${light ? '153,112,32' : '243,202,111'},${Math.min(1,alpha)})`;
    ctx.lineWidth = thickness;
    ctx.shadowColor = light ? 'rgba(193,135,25,.3)' : 'rgba(245,192,85,.7)';
    ctx.shadowBlur = charge > .4 ? charge * 9 : 0;
    ctx.stroke(); ctx.shadowBlur = 0;
  }
  function draw() {
    if (!width || !height) return;
    ctx.clearRect(0,0,width,height);
    const points = nodes.map(point);
    const charges = nodes.map((node,i) => energy[i] * .65 + pulseEnergy(node));
    const strength = light ? .49 : .6;
    // Local links become four ordered lanes as the page reaches the working systems.
    for (let i = 0; i < points.length; i++) {
      const a = points[i];
      for (const offset of [1,4,5]) {
        const j = i + offset;
        if (j >= points.length) continue;
        const b = points[j], distance = Math.hypot(a.x - b.x, a.y - b.y);
        const charge = Math.min(charges[i],charges[j]);
        if (distance < width * .3) stroke(a, b,
          strength * (1 - distance / (width * .36)) * Math.min(a.depth,b.depth) + charge * .65,
          .65 + charge * 1.1, charge);
      }
      const charge = charges[i];
      const radius = .7 + a.depth * 1.4 + charge * 1.4;
      ctx.beginPath(); ctx.arc(a.x,a.y,radius,0,Math.PI * 2);
      ctx.fillStyle = `rgba(${light ? '153,111,24' : '255,224,154'},${Math.min(1,.25 + a.depth * .45 + charge * .45)})`; ctx.fill();
      if (i % 12 === 0 || charge > .42) {
        const spread = 18 + charge * 13;
        const glow = ctx.createRadialGradient(a.x,a.y,0,a.x,a.y,spread);
        glow.addColorStop(0,`rgba(${light ? '205,154,44' : '235,197,112'},${(light ? .16 : .2) + charge * .12})`);
        glow.addColorStop(1,'rgba(219,177,83,0)');
        ctx.fillStyle=glow; ctx.fillRect(a.x-spread,a.y-spread,spread*2,spread*2);
        ctx.beginPath(); ctx.arc(a.x,a.y,6 + progress * 3,0,Math.PI * 2);
        ctx.strokeStyle=`rgba(${light ? '153,112,32' : '219,186,110'},${.2 + charge * .25})`; ctx.lineWidth=.7; ctx.stroke();
      }
    }
    // A few light packets suggest useful information passing between people and tools.
    for (let lane = 0; lane < 4; lane++) {
      const position = (clock * .000045 + lane * 3.7 + progress * 5) % 18;
      const index = Math.floor(position) * 4 + lane;
      const a = points[index], b = points[index + 4];
      if (!a || !b) continue;
      const t = position % 1, x = mix(a.x,b.x,t), y = mix(a.y,b.y,t);
      ctx.beginPath(); ctx.arc(x,y,2.1,0,Math.PI * 2);
      ctx.fillStyle=light?'rgba(142,92,16,.65)':'rgba(255,226,155,.85)'; ctx.fill();
    }
    field.style.setProperty('--field-shift', `${-progress * 80}px`);
    field.style.setProperty('--field-turn', `${progress * 12}deg`);
  }
  function frame(now) {
    if (stopped || document.hidden || suspended) { raf = 0; return; }
    if (now - last >= 42) {
      clock += Math.min(now - last, 65); last = now;
      progress += (destination - progress) * .075;
      nodes.forEach((node,i) => { energy[i] += (sectionEnergy(node) - energy[i]) * .08; });
      if (burst && clock - burst.start >= 1900) burst = null;
      draw();
    }
    raf = requestAnimationFrame(frame);
  }
  function sync() {
    cancelAnimationFrame(raf); raf = 0;
    stopped = reduce.matches || root.classList.contains('motion-paused');
    if (stopped) burst = null;
    light = root.dataset.theme === 'light';
    if (reduce.matches) progress = destination = .28;
    followScroll();
    if (!document.hidden && !suspended) {
      draw(); last = performance.now();
      if (!stopped) raf = requestAnimationFrame(frame);
    }
  }
  window.addEventListener('scroll', followScroll, {passive:true});
  window.addEventListener('resize', measure, {passive:true});
  if ('ResizeObserver' in window) new ResizeObserver(measure).observe(document.body);
  new MutationObserver(sync).observe(root,{attributes:true,attributeFilter:['class','data-theme']});
  reduce.addEventListener('change',sync);
  document.addEventListener('visibilitychange',sync);
  document.addEventListener('toggle',measure,true);
  window.addEventListener('pagehide',()=>{ suspended=true; cancelAnimationFrame(raf); raf=0; });
  window.addEventListener('pageshow',()=>{ suspended=false; measure(); sync(); });
  measure(); sync();
})();
