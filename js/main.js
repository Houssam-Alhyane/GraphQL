import { getToken } from './utils/storage.js';

const page = window.location.pathname;
const token = getToken();

if (page.endsWith('profile.html') && !token) {
  window.location.replace('/index.html');
}

if (
  (page.endsWith('index.html') || page === '/' || page.endsWith('/GraphQL/')) &&
  token
) {
  window.location.replace('/profile.html');
}

if (page.endsWith('profile.html')) {
  import('./pages/profile.js');
} else {
  import('./pages/login.js');
}
