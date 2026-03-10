// frontend/src/lib/api.ts
import axios from 'axios';

// Use relative URL to leverage Next.js proxy (works in Codespaces)
export const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor — Bearer token қосу
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const state = JSON.parse(localStorage.getItem('ecoroute-auth') || '{}');
    const token = state?.state?.accessToken;
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — 401 болса refresh
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.response?.status === 401) {
      const state = JSON.parse(localStorage.getItem('ecoroute-auth') || '{}');
      const refresh = state?.state?.refreshToken;
      if (refresh) {
        try {
          const res = await axios.post('/api/auth/refresh', { refreshToken: refresh });
          // Store жаңарту
          state.state.accessToken = res.data.accessToken;
          state.state.refreshToken = res.data.refreshToken;
          localStorage.setItem('ecoroute-auth', JSON.stringify(state));
          // Қайта жіберу
          err.config.headers.Authorization = `Bearer ${res.data.accessToken}`;
          return api.request(err.config);
        } catch {
          localStorage.removeItem('ecoroute-auth');
          window.location.href = '/auth/login';
        }
      }
    }
    return Promise.reject(err);
  }
);
