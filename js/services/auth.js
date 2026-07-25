import { LOGIN_URL } from '../config/config.js';
import { saveToken } from '../utils/storage.js';

export async function login(identifier, password) {
  try {
    const credentials = `${identifier}:${password}`;
    const encoded = btoa(credentials);

    const response = await fetch(LOGIN_URL, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${encoded}`,
      },
    });

    if (response.status === 401 || !response.ok) {
      return { error: 'Invalid username/email or password.' };
    }

    const token = await response.text();

    saveToken(token.slice(1, -1));

    window.location.replace('/profile.html');
  } catch (error) {
    console.error(`Error trying to login${error}`);
  }
}
