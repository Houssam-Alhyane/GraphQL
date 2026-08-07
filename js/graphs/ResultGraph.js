const NS = 'http://www.w3.org/2000/svg';

function el(tag, attrs = {}) {
  const node = document.createElementNS(NS, tag);
  for (const key in attrs) node.setAttribute(key, attrs[key]);
  return node;
}

export function renderResultGraph(passed = 0, failed = 0) {
  const container = document.getElementById('resultGraph');
  if (!container) return;
  container.innerHTML = '';

  const total = passed + failed;
  const passedPct = total ? Math.round((passed / total) * 100) : 0;

  const size = 220;
  const strokeWidth = 20;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const passedLen = total ? (passed / total) * circumference : 0;
  const failedLen = total ? circumference - passedLen : 0;

  const wrap = document.createElement('div');
  wrap.style.cssText =
    'display:flex;flex-direction:column;align-items:center;gap:18px;width:100%;padding:8px 0;';

  const svg = el('svg', {
    viewBox: `0 0 ${size} ${size}`,
    width: '220',
    height: '220',
  });
  svg.style.overflow = 'visible';

  const defs = el('defs');
  const gradPassed = el('linearGradient', {
    id: 'gradPassed',
    x1: '0%',
    y1: '0%',
    x2: '100%',
    y2: '100%',
  });
  gradPassed.append(
    el('stop', { offset: '0%', 'stop-color': '#5EEAD4' }),
    el('stop', { offset: '100%', 'stop-color': '#22C55E' })
  );
  const gradFailed = el('linearGradient', {
    id: 'gradFailed',
    x1: '0%',
    y1: '0%',
    x2: '100%',
    y2: '100%',
  });
  gradFailed.append(
    el('stop', { offset: '0%', 'stop-color': '#F87171' }),
    el('stop', { offset: '100%', 'stop-color': '#EF4444' })
  );
  defs.append(gradPassed, gradFailed);
  svg.append(defs);

  const cx = size / 2;
  const cy = size / 2;

  // Track
  svg.append(
    el('circle', {
      cx,
      cy,
      r: radius,
      fill: 'none',
      stroke: 'rgba(255,255,255,0.06)',
      'stroke-width': strokeWidth,
    })
  );

  // Failed arc (drawn first, sits behind visually where passed ends)
  const failedArc = el('circle', {
    cx,
    cy,
    r: radius,
    fill: 'none',
    stroke: 'url(#gradFailed)',
    'stroke-width': strokeWidth,
    'stroke-linecap': 'round',
    'stroke-dasharray': `${failedLen} ${circumference}`,
    'stroke-dashoffset': 0,
    transform: `rotate(${-90 + (passedPct / 100) * 360} ${cx} ${cy})`,
  });

  // Passed arc
  const passedArc = el('circle', {
    cx,
    cy,
    r: radius,
    fill: 'none',
    stroke: 'url(#gradPassed)',
    'stroke-width': strokeWidth,
    'stroke-linecap': 'round',
    'stroke-dasharray': `0 ${circumference}`,
    transform: `rotate(-90 ${cx} ${cy})`,
    style: 'transition: stroke-dasharray 1.1s cubic-bezier(.16,1,.3,1);',
  });

  failedArc.style.transition = 'stroke-dasharray 1.1s cubic-bezier(.16,1,.3,1)';
  failedArc.setAttribute('stroke-dasharray', `0 ${circumference}`);

  svg.append(failedArc, passedArc);

  // Center label group
  const pctText = el('text', {
    x: cx,
    y: cy - 4,
    'text-anchor': 'middle',
    fill: '#F8FAFC',
    'font-family': "'Space Grotesk', sans-serif",
    'font-weight': '700',
    'font-size': '34',
  });
  pctText.textContent = `${passedPct}%`;

  const subText = el('text', {
    x: cx,
    y: cy + 20,
    'text-anchor': 'middle',
    fill: '#94A3B8',
    'font-family': "'Inter', sans-serif",
    'font-size': '11',
    'letter-spacing': '0.05em',
  });
  subText.textContent = 'PASS RATE';

  svg.append(pctText, subText);

  // Hover interaction: subtle scale on the whole ring
  svg.addEventListener('mouseenter', () => {
    svg.style.transition = 'transform .2s ease';
    svg.style.transform = 'scale(1.02)';
  });
  svg.addEventListener('mouseleave', () => {
    svg.style.transform = 'scale(1)';
  });

  wrap.append(svg);

  // Legend
  const legend = document.createElement('div');
  legend.style.cssText = 'display:flex;gap:24px;flex-wrap:wrap;justify-content:center;';

  const makeLegendItem = (color, label, value) => {
    const item = document.createElement('div');
    item.style.cssText = 'display:flex;align-items:center;gap:8px;font-size:13px;color:#F8FAFC;font-family:Inter,sans-serif;';
    const dot = document.createElement('span');
    dot.style.cssText = `width:9px;height:9px;border-radius:50%;background:${color};box-shadow:0 0 8px ${color}66;`;
    const text = document.createElement('span');
    text.innerHTML = `${label} <span style="color:#94A3B8">${value}</span>`;
    item.append(dot, text);
    return item;
  };

  legend.append(
    makeLegendItem('#5EEAD4', 'Passed', passed),
    makeLegendItem('#EF4444', 'Failed', failed)
  );

  wrap.append(legend);
  container.append(wrap);

  // Trigger draw-in animation after mount
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      passedArc.setAttribute('stroke-dasharray', `${passedLen} ${circumference}`);
      failedArc.setAttribute('stroke-dasharray', `${failedLen} ${circumference}`);
    });
  });
}
