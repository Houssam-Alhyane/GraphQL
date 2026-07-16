import { getUser } from '../services/graphql.js';
import { getToken } from '../utils/storage.js';

const token = getToken();
if (!token) {
  window.location.href = '/index.html';
} else {
  const user = await getUser();
  if (user) {
    document.getElementById('userLogin').textContent = user.login;
    document.getElementById('userId').textContent = `ID: ${user.id}`;
    document.getElementById('avatar').src = user.avatarUrl;
    document.getElementById('auditRatio').textContent =
      user.auditRatio.toFixed(2);
    document.getElementById('userLevel').textContent = user.events[0].level;
    document.getElementById('xpTotal').textContent = user.totalXP;
  }
}
