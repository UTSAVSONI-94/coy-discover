const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

/**
 * Generic API request helper
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const config = {
    ...options,
    headers,
  };

  try {
    const res = await fetch(url, config);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || data.message || `Request failed with status ${res.status}`);
    }
    return data;
  } catch (err) {
    console.error(`[API Error] ${options.method || 'GET'} ${url}:`, err.message);
    throw err;
  }
}

export const api = {
  /**
   * Health check endpoint
   */
  async checkHealth() {
    return request('/health');
  },

  /**
   * Fetch unswiped feed profiles for the demo user
   */
  async getFeed() {
    return request('/feed');
  },

  /**
   * Record a LIKE or PASS swipe
   */
  async swipe(profileId, action) {
    return request('/swipe', {
      method: 'POST',
      body: JSON.stringify({ profileId, action }),
    });
  },

  /**
   * Fetch mutual matches for the demo user
   */
  async getMatches() {
    return request('/matches');
  },
};

export default api;
