const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export type AuthTokens = {
  access: string;
  refresh: string;
};

const STORAGE_KEY = 'school229_auth_tokens';

export function getStoredAuthTokens(): AuthTokens | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as AuthTokens) : null;
  } catch {
    return null;
  }
}

export function setStoredAuthTokens(tokens: AuthTokens) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tokens));
}

export function clearAuthTokens() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(STORAGE_KEY);
}

export function isAuthenticated() {
  const tokens = getStoredAuthTokens();
  return Boolean(tokens?.access);
}

export async function login(username: string, password: string) {
  const response = await fetch(`${API_URL}/api/auth/token/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => null);
    throw new Error(err?.detail || 'Échec de la connexion.');
  }

  const tokens = await response.json();
  setStoredAuthTokens(tokens);
  return tokens;
}

export async function refreshToken() {
  const tokens = getStoredAuthTokens();
  if (!tokens?.refresh) {
    clearAuthTokens();
    return null;
  }

  const response = await fetch(`${API_URL}/api/auth/token/refresh/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refresh: tokens.refresh }),
  });

  if (!response.ok) {
    clearAuthTokens();
    return null;
  }

  const refreshed = await response.json();
  const updatedTokens = { access: refreshed.access, refresh: tokens.refresh };
  setStoredAuthTokens(updatedTokens);
  return refreshed.access;
}

export async function fetchWithAuth(input: RequestInfo, init: RequestInit = {}) {
  const tokens = getStoredAuthTokens();

  const headers = new Headers(init.headers ?? {});
  headers.set('Content-Type', 'application/json');
  if (tokens?.access) {
    headers.set('Authorization', `Bearer ${tokens.access}`);
  }

  let response = await fetch(input, { ...init, headers });
  if (response.status !== 401) {
    return response;
  }

  const refreshedAccess = await refreshToken();
  if (!refreshedAccess) {
    return response;
  }

  headers.set('Authorization', `Bearer ${refreshedAccess}`);
  response = await fetch(input, { ...init, headers });
  if (response.status === 401) {
    clearAuthTokens();
  }

  return response;
}

export function logout() {
  clearAuthTokens();
}
