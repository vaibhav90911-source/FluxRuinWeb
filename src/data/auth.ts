// Authentication utility for Owner Panel

const OWNER_EMAIL = 'fluxruinmc@gmail.com';
const OWNER_PASSWORD = 'GAMINGPOWERISOP23';
const AUTH_STORAGE_KEY = 'flux_owner_auth_session';

export function loginOwner(email: string, pass: string): boolean {
  if (email.trim().toLowerCase() === OWNER_EMAIL.toLowerCase() && pass === OWNER_PASSWORD) {
    const session = {
      authenticated: true,
      email: OWNER_EMAIL,
      loginTimestamp: Date.now(),
    };
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
    } catch {
      // fallback
    }
    return true;
  }
  return false;
}

export function isOwnerAuthenticated(): boolean {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return false;
    const session = JSON.parse(raw);
    return Boolean(session?.authenticated && session?.email?.toLowerCase() === OWNER_EMAIL.toLowerCase());
  } catch {
    return false;
  }
}

export function logoutOwner(): void {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch {
    // fallback
  }
}

export function getOwnerInfo(): { email: string; role: string } | null {
  if (!isOwnerAuthenticated()) return null;
  return {
    email: OWNER_EMAIL,
    role: 'Flux Owner / Administrator',
  };
}
