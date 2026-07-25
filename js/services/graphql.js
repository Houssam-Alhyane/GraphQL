import { getToken, removeToken } from '../utils/storage.js';
import { GRAPHQL_URL } from '../config/config.js';
import { query } from './query.js';

export async function getUser() {
  const token = getToken();
  if (!token) return null;

  const response = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });

  if (response.status === 401 || response.status === 403) {
    removeToken();
    window.location.href = '/index.html';
    return null;
  }

  const result = await response.json();

  if (result.errors) {
    console.error(result.errors);
    return null;
  }

  const grades = result.data.results;

  const passed = grades.filter((r) => r.grade >= 1).length;
  const failed = grades.filter((r) => r.grade < 1).length;

  return {
    ...result.data.user[0],
    passed,
    failed,
    totalXP: result.data.totalXP.aggregate.sum.amount,
    audits: result.data.user[0].audits,
  };
}
