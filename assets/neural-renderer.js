/* A perspective-rendered network: the same service regions drive the detail panel. */
window.createNeuralRenderer = function (canvas, brain, anchors) {
  const ctx = canvas?.getContext('2d');
  if (!ctx) return null;
  const tau = Math.PI * 2;
  const points = [];
  const edges = [];
  const seen = new Set();
  let width = 1, height = 1, ratio = 1;

  for (const [count, shell] of [[540, 1], [120, .57]]) {
    for (let i = 0; i < count; i++) {
      const y = 1 - 2 * (i + .5) / count;
      const angle = i * 2.39996323;
      const r = Math.sqrt(1 - y * y);
      const ripple = shell === 1 ? .96 + .09 * Math.sin(angle * 3 + y * 6) + .025 * Math.cos(i * 1.73) : 1;
      points.push({ x: Math.cos(angle) * r * shell * ripple, y: y * shell, z: Math.sin(angle) * r * shell * ripple, inner: shell < 1 });
    }
  }
  function connect(a, b) {
    const key = `${Math.min(a, b)}:${Math.max(a, b)}`;
    if (seen.has(key)) return;
    seen.add(key); edges.push([a, b]);
  }
  points.forEach((p, i) => {
    const neighbours = points.map((q, j) => ({ j, distance: (p.x - q.x) ** 2 + (p.y - q.y) ** 2 + (p.z - q.z) ** 2 }))
      .filter(q => q.j !== i).sort((a, b) => a.distance - b.distance);
    neighbours.slice(0, p.inner ? 5 : 7).forEach(q => connect(i, q.j));
    if (!p.inner && i % 4 === 0) connect(i, neighbours[14].j);
    // Struts connect the inner network to the outer shell rather than two isolated spheres.
    if (p.inner && i % 4 === 0) connect(i, neighbours.find(q => !points[q.j].inner).j);
  });

  function resize() {
    const rect = brain.getBoundingClientRect();
    width = Math.max(1, rect.width); height = Math.max(1, rect.height);
    ratio = Math.min(window.devicePixelRatio || 1, 3);
    canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  }
  function render(time, tilt, active, related) {
    if (ratio !== Math.min(window.devicePixelRatio || 1, 3)) resize();
    const light = document.documentElement.dataset.theme === 'light';
    const line = light ? '140,93,19' : '228,191,102';
    const bright = light ? '116,80,10' : '255,228,163';
    const accent = light ? '165,117,31' : '217,183,102';
    const yaw = .38 + time * .000032 + tilt.x * .62;
    const pitch = -.16 + Math.sin(time * .00007) * .06 + tilt.y * .42;
    const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
    ctx.clearRect(0, 0, width, height);
    const projected = points.map((p, i) => {
      const x = p.x * cy + p.z * sy, z0 = p.z * cy - p.x * sy;
      const y = p.y * cp - z0 * sp, z = p.y * sp + z0 * cp;
      const perspective = 3.6 / (3.6 - z);
      const nx = .5 + x * .345 * perspective, ny = .49 + y * .365 * perspective;
      let sector = 1, distance = Infinity;
      for (let j = 1; j < anchors.length; j++) {
        const d = (nx - anchors[j].x) ** 2 + (ny - anchors[j].y) ** 2;
        if (d < distance) { sector = j; distance = d; }
      }
      return { x: nx * width, y: ny * height, z, depth: Math.max(0, Math.min(1, (z + 1.08) / 2.16)), sector, inner: p.inner, i };
    });

    // Low-contrast volume sits behind the fine lines, with the light source above left.
    const body = ctx.createRadialGradient(width * .37, height * .33, width * .01, width * .5, height * .49, width * .39);
    body.addColorStop(0, light ? 'rgba(255,233,183,.14)' : 'rgba(69,76,68,.09)');
    body.addColorStop(.55, light ? 'rgba(229,185,102,.06)' : 'rgba(20,33,40,.08)');
    body.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = body; ctx.fillRect(0, 0, width, height);

    // Depth bands keep the inner and rear connections behind the crisp foreground nodes.
    const bands = Array.from({ length: 12 }, () => ({ lines: [], nodes: [] }));
    for (const [a, b] of edges) {
      const p = projected[a], q = projected[b];
      const depth = (p.depth + q.depth) / 2;
      bands[Math.min(11, Math.floor(depth * 12))].lines.push([p, q, depth]);
    }
    for (const p of projected) bands[Math.min(11, Math.floor(p.depth * 12))].nodes.push(p);
    for (const band of bands) {
      for (const [p, q, depth] of band.lines) {
        const selected = active && (p.sector === active || q.sector === active);
        const linked = related.includes(p.sector) || related.includes(q.sector);
        const front = Math.pow(depth, 1.6);
        const emphasis = active ? selected ? 1.5 : linked ? 1 : .7 : 1;
        const alpha = Math.min(.94, ((light ? .12 : .1) + front * (light ? .4 : .55)) * emphasis * (p.inner || q.inner ? .8 : 1));
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
        ctx.strokeStyle = `rgba(${selected ? bright : p.inner && q.inner ? accent : line},${alpha})`;
        ctx.lineWidth = (selected ? .8 : .35) + front * .64;
        ctx.stroke();
      }
      for (const p of band.nodes) {
        const selected = active === p.sector;
        const emphasis = active ? selected ? 1 : related.includes(p.sector) ? .9 : .65 : 1;
        const radius = .38 + Math.pow(p.depth, 2) * (p.i % 13 === 0 ? 2.45 : 1.3);
        if (p.depth > .7 && p.i % 13 === 0) {
          const halo = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius * 4.5);
          halo.addColorStop(0, `rgba(${line},${.22 * emphasis})`); halo.addColorStop(1, `rgba(${line},0)`);
          ctx.fillStyle = halo; ctx.beginPath(); ctx.arc(p.x, p.y, radius * 4.5, 0, tau); ctx.fill();
        }
        ctx.fillStyle = `rgba(${p.inner ? accent : bright},${(.16 + .84 * p.depth) * emphasis})`;
        ctx.beginPath(); ctx.arc(p.x, p.y, radius + (selected ? .35 : 0), 0, tau); ctx.fill();
        if (p.depth > .85 && p.i % 13 === 0 && !light) {
          ctx.fillStyle = `rgba(255,250,226,${emphasis})`;
          ctx.beginPath(); ctx.arc(p.x - .3, p.y - .3, radius * .42, 0, tau); ctx.fill();
        }
      }
    }

    // The service paths terminate at the real controls, so the interaction stays legible.
    anchors.slice(1).forEach((anchor, i) => {
      const index = i + 1, selected = active === index, linked = related.includes(index);
      const x0 = anchors[0].x * width, y0 = anchors[0].y * height, x1 = anchor.x * width, y1 = anchor.y * height;
      const bend = index % 2 ? .13 : -.13;
      const cx = (x0 + x1) / 2 - (y1 - y0) * bend;
      const cy = (y0 + y1) / 2 + (x1 - x0) * bend;
      ctx.beginPath(); ctx.moveTo(x0, y0); ctx.quadraticCurveTo(cx, cy, x1, y1);
      ctx.strokeStyle = `rgba(${selected ? bright : line},${selected ? .95 : linked ? .5 : .2})`;
      ctx.lineWidth = selected ? 1.7 : .8; ctx.stroke();
      if (!active || selected || linked) {
        const t = (time * .00013 + index * .113) % 1, u = 1 - t;
        const x = u * u * x0 + 2 * u * t * cx + t * t * x1;
        const y = u * u * y0 + 2 * u * t * cy + t * t * y1;
        if (selected) {
          ctx.beginPath(); ctx.arc(x, y, 6, 0, tau); ctx.fillStyle = `rgba(${line},.17)`; ctx.fill();
        }
        ctx.beginPath(); ctx.arc(x, y, selected ? 2.7 : 1.4, 0, tau);
        ctx.fillStyle = `rgba(${bright},${selected ? 1 : .72})`; ctx.fill();
      }
    });
    brain.classList.add('network-ready');
  }
  resize();
  return { render, resize };
};
