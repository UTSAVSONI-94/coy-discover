const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  };

  const res = await fetch(url, config);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || `Request failed with status ${res.status}`);
  }

  return data;
}

export const api = {
  getHealth: () => request('/health'),
  getFeed: () => request('/feed'),
  swipe: (profileId, action) =>
    request('/swipe', {
      method: 'POST',
      body: JSON.stringify({ profileId, action }),
    }),
  getMatches: () => request('/matches'),
};

export default api;
