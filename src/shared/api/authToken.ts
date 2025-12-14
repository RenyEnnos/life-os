const TOKEN_KEY = 'auth_token';

function isStorageAvailable() {
  try {
    const testKey = '__auth_test__';
    localStorage.setItem(testKey, '1');
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

export function getAuthToken(): string | null {
  if (!isStorageAvailable()) return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token?: string | null) {
  if (!isStorageAvailable()) return;
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export function clearAuthToken() {
  if (!isStorageAvailable()) return;
  localStorage.removeItem(TOKEN_KEY);
}
