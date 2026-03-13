import { io } from 'socket.io-client';

// In production, frontend is served by the same Express server (same origin)
// In development, connect to localhost:3001
const SERVER_URL = import.meta.env.VITE_SERVER_URL || (import.meta.env.DEV ? 'http://localhost:3001' : '');

export const socket = io(SERVER_URL || window.location.origin, {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
});

export const API_BASE = (SERVER_URL || '') + '/api';

// Helper for API calls
export async function api(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  return res.json();
}

export async function apiPost(path, body) {
  return api(path, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}
