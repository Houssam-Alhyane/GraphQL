const path = window.location.pathname;

if (path.endsWith('index.html') || path === '/') {
  import('./pages/login.js');
}

if (path.endsWith('profile.html')) {
  import('./pages/profile.js');
}
