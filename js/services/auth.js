import { LOGIN_URL } from '../config/config.js';

export async function login(identifier, password) {
  const credentials = `${identifier}:${password}`;
  const encoded = btoa(credentials);
  const response = await fetch(LOGIN_URL, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${encoded}`,
    },
  });
  console.log(response.status);
}
