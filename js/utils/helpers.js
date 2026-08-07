export function formatXP(bytes) {
  const kb = bytes / 1000;
  if (kb >= 1000) {
    return (kb / 1000).toFixed(2) + ' MB';
  }
  return Math.round(kb).toLocaleString() + ' KB';
}
