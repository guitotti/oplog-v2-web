import type { User } from "../store/auth";

export const STORAGE_KEYS = {
  token: "@oplog:token",
  user: "@oplog:user",
} as const;

export function getStoredToken(): string | null {
  return localStorage.getItem(STORAGE_KEYS.token);
}

export function getStoredJSON<T>(key: string): T | null {
  const raw = localStorage.getItem(key);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as T;
  } catch {
    localStorage.removeItem(key);
    return null;
  }
}

export function saveSession(token: string, user: User) {
  localStorage.setItem(STORAGE_KEYS.token, token);
  saveUser(user);
}

export function saveUser(user: User) {
  localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem(STORAGE_KEYS.token);
  localStorage.removeItem(STORAGE_KEYS.user);
}
