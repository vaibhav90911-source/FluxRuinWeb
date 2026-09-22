// Authentication utility for Owner Panel with reactive state and anonymized owner identity
import { useState, useEffect } from 'react';

const VALID_IDENTITIES = [
  'admin',
  'owner',
  'flux',
  'fluxruin',
  'developer',
];
const OWNER_PASSWORD = 'GAMINGPOWERISOP23';
const AUTH_STORAGE_KEY = 'flux_owner_auth_session';
export const AUTH_CHANGE_EVENT = 'flux_auth_changed';

export function loginOwner(identity: string, pass: string): boolean {
  const cleanIdentity = identity.trim().toLowerCase();
  const isMatch = VALID_IDENTITIES.some((id) => id.toLowerCase() === cleanIdentity) || cleanIdentity.length > 0;
  
  if (isMatch && pass === OWNER_PASSWORD) {
    const session = {
      authenticated: true,
      role: 'Owner / Administrator',
      loginTimestamp: Date.now(),
    };
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
      window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
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
    return Boolean(session?.authenticated);
  } catch {
    return false;
  }
}

export function logoutOwner(): void {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
  } catch {
    // fallback
  }
}

export function getOwnerInfo(): { displayName: string; role: string } | null {
  if (!isOwnerAuthenticated()) return null;
  return {
    displayName: 'Flux Administrator',
    role: 'Owner & Server Engineer',
  };
}

// React Hook to subscribe to auth changes in Navbar and Footer
export function useAuth(): { isAuthenticated: boolean; logout: () => void } {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => isOwnerAuthenticated());

  useEffect(() => {
    const updateAuth = () => {
      setIsAuthenticated(isOwnerAuthenticated());
    };

    window.addEventListener(AUTH_CHANGE_EVENT, updateAuth);
    window.addEventListener('storage', updateAuth);

    return () => {
      window.removeEventListener(AUTH_CHANGE_EVENT, updateAuth);
      window.removeEventListener('storage', updateAuth);
    };
  }, []);

  const logout = () => {
    logoutOwner();
    setIsAuthenticated(false);
  };

  return { isAuthenticated, logout };
}
