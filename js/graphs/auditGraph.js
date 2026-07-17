
export function renderAuditGraph(audits) {
  const container = document.getElementById('auditGraph');
  if (!audits || audits.length === 0) {
    container.textContent = 'No audit data yet.';
    return;
  }

  // count audits per closureType
  const counts = {};
  for (const a of audits) {
    counts[a.closureType] = (counts[a.closureType] || 0) + 1;
  }

  const colors = {
    succeeded: '#5eead4',
    failed: '#f87171',
    expired: '#8b93a1',
  };
  const labels = Object.keys(counts);
  const max = Math.max(...Object.values(counts));

  const w = 300,
    h = 180,
    barW = w / labels.length;

  const bars = labels
    .map((label, i) => {
      const value = counts[label];
      const barH = (value / max) * (h - 30);
      const x = i * barW + barW * 0.25;
      const y = h - barH;

      return `
        <rect x="${x}" y="${y}" width="${barW * 0.5}" height="${barH}" fill="${
        colors[label]
      }" />
        <text x="${x + barW * 0.25}" y="${
        y - 6
      }" text-anchor="middle" font-size="12" fill="#e8eaed">${value}</text>
        <text x="${x + barW * 0.25}" y="${
        h + 15
      }" text-anchor="middle" font-size="11" fill="#8b93a1">${label}</text>
      `;
    })
    .join('');

  container.innerHTML = `<svg viewBox="0 0 ${w} ${
    h + 20
  }" width="100%" height="100%">${bars}</svg>`;
}
