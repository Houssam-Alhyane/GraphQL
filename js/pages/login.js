import { login } from '../services/auth.js';

const form = document.getElementById('loginForm');
const identifier = document.getElementById('identifier');
const password = document.getElementById('password');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  await login(identifier.value, password.value);
});
