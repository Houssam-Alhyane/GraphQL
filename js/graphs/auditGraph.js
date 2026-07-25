export function renderAuditGraph(audits) {
  const container = document.getElementById('auditGraph');

  if (!audits || audits.length === 0) {
    container.textContent = 'No audit data yet.';
    return;
  }

  // Count audits
  const counts = {
    succeeded: 0,
    failed: 0,
    expired: 0,
  };

  for (const audit of audits) {
    if (counts[audit.closureType] !== undefined) {
      counts[audit.closureType]++;
    }
  }

    const max = Math.max(counts.succeeded, counts.failed, counts.expired);

    const w = 300;
    const h = 180;
    const barW = 100;

  // Heights of the lines
  const succeededH = (counts.succeeded / max) * (h - 30);
  const failedH = (counts.failed / max) * (h - 30);
  const expiredH = (counts.expired / max) * (h - 30);

  // Y positions of the lines
  const succeededY = h - succeededH;
  const failedY = h - failedH;
  const expiredY = h - expiredH;

  container.innerHTML = `
    <svg viewBox="0 0 ${w} ${h + 20}" width="100%" height="100%">

      <rect x="25" y="${succeededY}" width="50" height="${succeededH}" fill="#5eead4"/>
      <text x="50" y="${succeededY - 6}" text-anchor="middle" fill="#e8eaed">${counts.succeeded}</text>
      <text x="50" y="${h + 15}" text-anchor="middle" fill="#8b93a1">Succeeded</text>

      <rect x="125" y="${failedY}" width="50" height="${failedH}" fill="#f87171"/>
      <text x="150" y="${failedY - 6}" text-anchor="middle" fill="#e8eaed">${counts.failed}</text>
      <text x="150" y="${h + 15}" text-anchor="middle" fill="#8b93a1">Failed</text>

      <rect x="225" y="${expiredY}" width="50" height="${expiredH}" fill="#8b93a1"/>
      <text x="250" y="${expiredY - 6}" text-anchor="middle" fill="#e8eaed">${counts.expired}</text>
      <text x="250" y="${h + 15}" text-anchor="middle" fill="#8b93a1">Expired</text>

    </svg>
  `;
}
