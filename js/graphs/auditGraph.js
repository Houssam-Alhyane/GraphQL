const NS = 'http://www.w3.org/2000/svg';

function el(tag, attrs = {}) {
  const node = document.createElementNS(NS, tag);
  for (const key in attrs) node.setAttribute(key, attrs[key]);
  return node;
}

const CATEGORIES = [
  { key: 'succeeded', label: 'Succeeded', color: '#22C55E', glow: '#22C55E66' },
  { key: 'failed', label: 'Failed', color: '#EF4444', glow: '#EF444466' },
  { key: 'expired', label: 'Expired', color: '#A78BFA', glow: '#A78BFA66' },
];

function ring(id, index, category, count, total) {
  const size = 108;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = total ? count / total : 0;
  const len = pct * circumference;

  const cell = document.createElement('div');
  cell.style.cssText =
    'display:flex;flex-direction:column;align-items:center;gap:10px;';

  const svg = el('svg', { viewBox: `0 0 ${size} ${size}`, width: size, height: size });
  const cx = size / 2;
  const cy = size / 2;

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

  const arc = el('circle', {
    cx,
    cy,
    r: radius,
    fill: 'none',
    stroke: category.color,
    'stroke-width': strokeWidth,
    'stroke-linecap': 'round',
    'stroke-dasharray': `0 ${circumference}`,
    transform: `rotate(-90 ${cx} ${cy})`,
    style: `transition: stroke-dasharray 1s cubic-bezier(.16,1,.3,1) ${index * 0.1}s; filter: drop-shadow(0 0 6px ${category.glow});`,
  });

  const text = el('text', {
    x: cx,
    y: cy + 5,
    'text-anchor': 'middle',
    fill: '#F8FAFC',
    'font-family': "'Space Grotesk', sans-serif",
    'font-weight': '600',
    'font-size': '18',
  });
  text.textContent = `${Math.round(pct * 100)}%`;

  svg.append(arc, text);

  svg.addEventListener('mouseenter', () => {
    svg.style.transition = 'transform .2s ease';
    svg.style.transform = 'scale(1.06)';
  });
  svg.addEventListener('mouseleave', () => {
    svg.style.transform = 'scale(1)';
  });

  const labelWrap = document.createElement('div');
  labelWrap.style.cssText = 'text-align:center;';

  const dotLabel = document.createElement('div');
  dotLabel.style.cssText =
    'display:flex;align-items:center;gap:6px;justify-content:center;font-size:12px;color:#94A3B8;font-family:Inter,sans-serif;';
  dotLabel.innerHTML = `<span style="width:7px;height:7px;border-radius:50%;background:${category.color};display:inline-block;"></span>${category.label}`;

  const countLabel = document.createElement('div');
  countLabel.style.cssText =
    'font-size:13px;color:#F8FAFC;font-family:Inter,sans-serif;font-weight:600;margin-top:2px;';
  countLabel.textContent = count;

  labelWrap.append(dotLabel, countLabel);
  cell.append(svg, labelWrap);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      arc.setAttribute('stroke-dasharray', `${len} ${circumference}`);
    });
  });

  return cell;
}

export function renderAuditGraph(audits = []) {
  const container = document.getElementById('auditGraph');
  if (!container) return;
  container.innerHTML = '';

  const counts = CATEGORIES.reduce((acc, c) => {
    acc[c.key] = 0;
    return acc;
  }, {});

  audits.forEach((a) => {
    if (counts[a.closureType] !== undefined) counts[a.closureType]++;
  });

  const total = audits.length;

  const wrap = document.createElement('div');
  wrap.style.cssText =
    'display:flex;justify-content:space-around;align-items:center;width:100%;flex-wrap:wrap;gap:16px;padding:8px 12px;';

  CATEGORIES.forEach((category, i) => {
    wrap.append(ring(container.id, i, category, counts[category.key], total));
  });

  container.append(wrap);
}
