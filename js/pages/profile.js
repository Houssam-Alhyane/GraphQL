import { getUser } from '../services/graphql.js';
import { getToken, removeToken } from '../utils/storage.js';
import { renderAuditGraph } from '../graphs/auditGraph.js';
import { renderResultGraph } from '../graphs/ResultGraph.js';
import { formatXP } from '../utils/helpers.js';

document.getElementById('logoutBtn').addEventListener('click', () => {
  removeToken();
  window.location.reload();
  window.location.replace('/index.html');
});

const token = getToken();
if (!token) {
  window.location.replace('/index.html');
} else {
  const user = await getUser();
  if (user) {
    document.getElementById('userLogin').textContent = user.login;
    document.getElementById('userId').textContent = `ID: ${user.id}`;
    document.getElementById('avatar').src = user.avatarUrl;
    document.getElementById('auditRatio').textContent =
      user.auditRatio.toFixed(2);
    document.getElementById('userLevel').textContent = user.events[0].level;
    document.getElementById('xpTotal').textContent = formatXP(user.totalXP);
  }
  renderResultGraph(user.passed, user.failed);
  renderAuditGraph(user.audits);
}
