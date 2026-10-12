const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export type AuthTokens = {
  access: string;
  refresh: string;
};

const ACCESS_COOKIE_NAME = 'school229_access_token';
const REFRESH_COOKIE_NAME = 'school229_refresh_token';
const LEGACY_STORAGE_KEY = 'school229_auth_tokens';

export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const cookies = document.cookie ? document.cookie.split('; ') : [];
  for (const cookie of cookies) {
    const [key, ...valParts] = cookie.split('=');
    if (key.trim() === name) {
      return decodeURIComponent(valParts.join('='));
    }
  }
  return null;
}

export function setCookie(
  name: string,
  value: string,
  options: { maxAge?: number; path?: string; sameSite?: 'lax' | 'strict' | 'none'; secure?: boolean } = {}
) {
  if (typeof document === 'undefined') return;

  const { maxAge = 60 * 60 * 24 * 7, path = '/', sameSite = 'lax' } = options;
  const isSecure = options.secure ?? (typeof window !== 'undefined' && window.location.protocol === 'https:');

  let cookieStr = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; path=${path}; max-age=${maxAge}; samesite=${sameSite}`;
  if (isSecure) {
    cookieStr += '; secure';
  }
  document.cookie = cookieStr;
}

export function deleteCookie(name: string, path = '/') {
  if (typeof document === 'undefined') return;
  document.cookie = `${encodeURIComponent(name)}=; path=${path}; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}

export function getStoredAuthTokens(): AuthTokens | null {
  if (typeof window === 'undefined') return null;

  const access = getCookie(ACCESS_COOKIE_NAME);
  const refresh = getCookie(REFRESH_COOKIE_NAME);

  if (access || refresh) {
    return {
      access: access || '',
      refresh: refresh || '',
    };
  }

  // Rétrocompatibilité : migration si un ancien token réside dans localStorage
  try {
    const legacy = window.localStorage.getItem(LEGACY_STORAGE_KEY);
    if (legacy) {
      const parsed = JSON.parse(legacy) as AuthTokens;
      if (parsed?.access || parsed?.refresh) {
        setStoredAuthTokens(parsed);
        window.localStorage.removeItem(LEGACY_STORAGE_KEY);
        return parsed;
      }
    }
  } catch {
    // ignore
  }

  return null;
}

export function setStoredAuthTokens(tokens: AuthTokens) {
  if (typeof window === 'undefined') return;

  if (tokens.access) {
    setCookie(ACCESS_COOKIE_NAME, tokens.access, { maxAge: 60 * 60 * 24 * 7 });
  } else {
    deleteCookie(ACCESS_COOKIE_NAME);
  }

  if (tokens.refresh) {
    setCookie(REFRESH_COOKIE_NAME, tokens.refresh, { maxAge: 60 * 60 * 24 * 30 });
  } else {
    deleteCookie(REFRESH_COOKIE_NAME);
  }

  // Nettoyage de l'ancien localStorage
  try {
    window.localStorage.removeItem(LEGACY_STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function clearAuthTokens() {
  if (typeof window === 'undefined') return;

  deleteCookie(ACCESS_COOKIE_NAME);
  deleteCookie(REFRESH_COOKIE_NAME);

  try {
    window.localStorage.removeItem(LEGACY_STORAGE_KEY);
  } catch {
    // ignore
  }
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
