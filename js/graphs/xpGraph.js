export function renderXpGraph(transactions) {
  const container = document.getElementById('xpGraph');

  // nothing to draw
  if (!transactions || transactions.length === 0) {
    container.textContent = 'No XP data yet.';
    return;
  }

  // size of the drawing area
  const width = 600;
  const height = 200;

  // turn each transaction into a running total
  // e.g. amounts [100, 50, 200] become totals [100, 150, 350]
  let total = 0;
  const totals = [];
  for (const t of transactions) {
    total += t.amount;
    totals.push(total);
  }

  const maxXp = totals[totals.length - 1]; // last total = biggest value

  // convert each total into an (x, y) coordinate on the SVG
  let points = '';
  for (let i = 0; i < totals.length; i++) {
    const x = (i / (totals.length - 1)) * width; // spread evenly left to right
    const y = height - (totals[i] / maxXp) * height; // higher xp = higher up (smaller y)
    points += x + ',' + y + ' ';
  }

  // draw a single line connecting all the points
  container.innerHTML = `
    <svg viewBox="0 0 ${width} ${height}" width="100%" height="100%">
      <polyline points="${points}" fill="none" stroke="#5eead4" stroke-width="2" />
    </svg>
  `;
}