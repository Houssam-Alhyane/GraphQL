const NS = 'http://www.w3.org/2000/svg';

function el(tag, attrs = {}) {
  const node = document.createElementNS(NS, tag);
  for (const key in attrs) node.setAttribute(key, attrs[key]);
  return node;
}

function formatKXP(amount) {
  const kb = amount / 1000;
  if (kb >= 1000) return (kb / 1000).toFixed(1) + 'M';
  if (kb >= 1) return Math.round(kb) + 'k';
  return Math.round(amount).toString();
}

function formatDate(d) {
  return d.toLocaleDateString(undefined, { month: 'short', year: '2-digit' });
}

function emptyState(container) {
  const msg = document.createElement('div');
  msg.style.cssText = 'color:#5b6577;font-size:13px;font-family:Inter,sans-serif;';
  msg.textContent = 'No XP history available yet.';
  container.append(msg);
}

export function renderXPGraph(history = []) {
  const container = document.getElementById('xpGraph');
  if (!container) return;
  container.innerHTML = '';

  if (!Array.isArray(history) || history.length === 0) {
    emptyState(container);
    return;
  }

  const sorted = [...history].sort(
    (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
  );

  let running = 0;
  const points = sorted.map((t) => {
    running += t.amount;
    return { date: new Date(t.createdAt), value: running };
  });

  const width = 900;
  const height = 300;
  const padding = { top: 24, right: 24, bottom: 34, left: 54 };
  const plotW = width - padding.left - padding.right;
  const plotH = height - padding.top - padding.bottom;

  const maxVal = points[points.length - 1].value;
  const minVal = 0;
  const minDate = points[0].date.getTime();
  const maxDate = points[points.length - 1].date.getTime();
  const dateSpan = Math.max(maxDate - minDate, 1);

  const xFor = (d) => padding.left + ((d.getTime() - minDate) / dateSpan) * plotW;
  const yFor = (v) => padding.top + plotH - ((v - minVal) / (maxVal - minVal || 1)) * plotH;

  const coords = points.map((p) => ({ x: xFor(p.date), y: yFor(p.value), p }));

  const svg = el('svg', { viewBox: `0 0 ${width} ${height}`, preserveAspectRatio: 'none' });
  svg.style.cssText = 'width:100%;height:100%;display:block;overflow:visible;';

  const defs = el('defs');
  const lineGrad = el('linearGradient', { id: 'xpLineGrad', x1: '0%', y1: '0%', x2: '100%', y2: '0%' });
  lineGrad.append(
    el('stop', { offset: '0%', 'stop-color': '#5EEAD4' }),
    el('stop', { offset: '100%', 'stop-color': '#60A5FA' })
  );
  const areaGrad = el('linearGradient', { id: 'xpAreaGrad', x1: '0%', y1: '0%', x2: '0%', y2: '100%' });
  areaGrad.append(
    el('stop', { offset: '0%', 'stop-color': '#5EEAD4', 'stop-opacity': '0.28' }),
    el('stop', { offset: '100%', 'stop-color': '#5EEAD4', 'stop-opacity': '0' })
  );
  defs.append(lineGrad, areaGrad);
  svg.append(defs);

  // Grid lines (horizontal)
  const gridGroup = el('g');
  const gridSteps = 4;
  for (let i = 0; i <= gridSteps; i++) {
    const y = padding.top + (plotH / gridSteps) * i;
    gridGroup.append(
      el('line', {
        x1: padding.left,
        x2: width - padding.right,
        y1: y,
        y2: y,
        stroke: 'rgba(255,255,255,0.06)',
        'stroke-width': 1,
      })
    );
    const val = maxVal - (maxVal / gridSteps) * i;
    const label = el('text', {
      x: padding.left - 10,
      y: y + 4,
      'text-anchor': 'end',
      fill: '#5b6577',
      'font-family': "'Inter', sans-serif",
      'font-size': '11',
    });
    label.textContent = formatKXP(val);
    gridGroup.append(label);
  }
  svg.append(gridGroup);

  // X axis labels (start, mid, end)
  const xLabelGroup = el('g');
  const labelIdxs = [0, Math.floor(points.length / 2), points.length - 1];
  [...new Set(labelIdxs)].forEach((idx) => {
    const c = coords[idx];
    const label = el('text', {
      x: c.x,
      y: height - padding.bottom + 20,
      'text-anchor': idx === 0 ? 'start' : idx === points.length - 1 ? 'end' : 'middle',
      fill: '#5b6577',
      'font-family': "'Inter', sans-serif",
      'font-size': '11',
    });
    label.textContent = formatDate(c.p.date);
    xLabelGroup.append(label);
  });
  svg.append(xLabelGroup);

  // Build path
  const linePath = coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x.toFixed(2)} ${c.y.toFixed(2)}`).join(' ');
  const areaPath = `${linePath} L ${coords[coords.length - 1].x.toFixed(2)} ${padding.top + plotH} L ${coords[0].x.toFixed(2)} ${padding.top + plotH} Z`;

  const area = el('path', { d: areaPath, fill: 'url(#xpAreaGrad)', stroke: 'none' });
  svg.append(area);

  const path = el('path', {
    d: linePath,
    fill: 'none',
    stroke: 'url(#xpLineGrad)',
    'stroke-width': 2.5,
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
  });
  svg.append(path);

  // Tooltip guide line
  const guide = el('line', {
    x1: 0, x2: 0, y1: padding.top, y2: padding.top + plotH,
    stroke: 'rgba(255,255,255,0.12)', 'stroke-width': 1, opacity: 0,
  });
  svg.append(guide);

  // Dots
  const dotsGroup = el('g');
  const dots = coords.map((c) => {
    const dot = el('circle', {
      cx: c.x, cy: c.y, r: 3.5,
      fill: '#0b0f19', stroke: 'url(#xpLineGrad)', 'stroke-width': 2,
      opacity: 0,
    });
    dot.style.transition = 'opacity .4s ease, r .15s ease';
    dotsGroup.append(dot);
    return dot;
  });
  svg.append(dotsGroup);

  container.append(svg);

  // Tooltip (HTML overlay)
  const tooltip = document.createElement('div');
  tooltip.style.cssText =
    'position:absolute;pointer-events:none;background:#1A2233;border:1px solid rgba(255,255,255,0.12);border-radius:8px;padding:8px 12px;font-family:Inter,sans-serif;font-size:12px;color:#F8FAFC;box-shadow:0 8px 24px rgba(0,0,0,0.45);opacity:0;transition:opacity .15s ease;white-space:nowrap;z-index:5;';
  container.append(tooltip);

  // Hover overlay to capture mouse position across full chart width
  const overlay = el('rect', {
    x: padding.left, y: padding.top, width: plotW, height: plotH,
    fill: 'transparent',
  });
  overlay.style.cursor = 'crosshair';
  svg.append(overlay);

  const containerRect = () => container.getBoundingClientRect();

  overlay.addEventListener('mousemove', (e) => {
    const rect = containerRect();
    const svgRect = svg.getBoundingClientRect();
    const scaleX = width / svgRect.width;
    const mouseX = (e.clientX - svgRect.left) * scaleX;

    let nearest = 0;
    let minDist = Infinity;
    coords.forEach((c, i) => {
      const d = Math.abs(c.x - mouseX);
      if (d < minDist) {
        minDist = d;
        nearest = i;
      }
    });

    const c = coords[nearest];
    guide.setAttribute('x1', c.x);
    guide.setAttribute('x2', c.x);
    guide.setAttribute('opacity', 1);

    dots.forEach((d, i) => {
      d.setAttribute('opacity', i === nearest ? 1 : 0);
      d.setAttribute('r', i === nearest ? 5 : 3.5);
    });

    tooltip.innerHTML = `<strong>${formatKXP(c.p.value)} XP</strong><br/><span style="color:#94A3B8">${c.p.date.toLocaleDateString()}</span>`;
    tooltip.style.opacity = '1';

    const tX = (c.x / width) * svgRect.width;
    const tY = (c.y / height) * svgRect.height;
    tooltip.style.left = `${Math.min(Math.max(tX + 12, 4), rect.width - 130)}px`;
    tooltip.style.top = `${Math.max(tY - 44, 4)}px`;
  });

  overlay.addEventListener('mouseleave', () => {
    guide.setAttribute('opacity', 0);
    tooltip.style.opacity = '0';
    dots.forEach((d) => d.setAttribute('opacity', 0));
  });

  // Trigger draw-in animation for the line + area fill.
  // getTotalLength() gives an exact value so the dash animation
  // always completes cleanly regardless of chart width or point count.
  const pathLength = path.getTotalLength();
  path.style.strokeDasharray = String(pathLength);
  path.style.strokeDashoffset = String(pathLength);
  path.style.transition = 'stroke-dashoffset 1.2s cubic-bezier(.16,1,.3,1)';

  area.style.opacity = '0';
  area.style.transition = 'opacity .8s ease .4s';

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      path.style.strokeDashoffset = '0';
      area.style.opacity = '1';
    });
  });
}
