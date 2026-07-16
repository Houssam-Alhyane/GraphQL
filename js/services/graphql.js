import { getToken } from '../utils/storage.js';
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

  const result = await response.json();

  if (result.errors) {
    console.error(result.errors);
    return null;
  }

  return {
    ...result.data.user[0],
    totalXP: result.data.totalXP.aggregate.sum.amount,
  };
} 
