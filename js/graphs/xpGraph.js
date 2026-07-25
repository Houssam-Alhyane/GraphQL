export function renderResultGraph(passed, failed) {
  const container = document.getElementById('resultGraph');

  const total = passed + failed;

  if (total === 0) {
    container.textContent = 'No results yet.';
    return;
  }

  const radius = 70;
  const circumference = 2 * Math.PI * radius;

  const passedLength = (passed / total) * circumference;
  const failedLength = circumference - passedLength;

  container.innerHTML = `
    <svg viewBox="0 0 220 220" width="100%" height="100%">
      
      <!-- Background -->
      <circle
        cx="110"
        cy="110"
        r="${radius}"
        fill="none"
        stroke="#2b303a"
        stroke-width="18"
      />

      <!-- Passed -->
      <circle
        cx="110"
        cy="110"
        r="${radius}"
        fill="none"
        stroke="#5eead4"
        stroke-width="18"
        stroke-dasharray="${passedLength} ${circumference}"
        stroke-linecap="round"
        transform="rotate(-90 110 110)"
      />

      <!-- Failed -->
      <circle
        cx="110"
        cy="110"
        r="${radius}"
        fill="none"
        stroke="#ef4444"
        stroke-width="18"
        stroke-dasharray="${failedLength} ${circumference}"
        stroke-dashoffset="-${passedLength}"
        stroke-linecap="round"
        transform="rotate(-90 110 110)"
      />
      <!-- Legend -->
      <text
        x="20"
        y="205"
        fill="#5eead4"
        font-size="13">
        ● Passed (${passed})
      </text>

      <text
        x="120"
        y="205"
        fill="#ef4444"
        font-size="13">
        ● Failed (${failed})
      </text>

    </svg>
  `;
}
