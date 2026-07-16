import { LOGIN_URL } from '../config/config.js';
import { saveToken } from '../utils/storage.js';

export async function login(identifier, password) {
  const credentials = `${identifier}:${password}`;
  const encoded = btoa(credentials);

  const response = await fetch(LOGIN_URL, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${encoded}`,
    },
  });

  if (!response.ok) {
    console.log('Login failed');
    return;
  }

  const token = await response.text();

  saveToken(token.slice(1, -1));
  window.location.href = '/profile.html';
}
