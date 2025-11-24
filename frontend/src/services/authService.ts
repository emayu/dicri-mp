import type { Session } from '@toolpad/core/AppProvider';
import { apiFetch } from './apiClient';

const SESSION_STORAGE_KEY = 'us';

interface LoginResponseData {
  usuario: {
    id: string;
    nombre: string;
    correo: string;
    rol: string;
  };
}

export async function signInWithEmailPassword(email: string, password: string): Promise<Session> {
  const resp = await apiFetch<LoginResponseData>('/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      correo: email,
      contrasena: password,
    }),
  });

  const session: Session = {
    user: {
      name: resp.data?.usuario.nombre ?? '',
      email: resp.data?.usuario.correo ?? email,
    },
  };

  // Persistir sesión simple en localStorage
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));

  return session;
}

export function loadInitialSession(): Session | null {
  const savedUserData = localStorage.getItem(SESSION_STORAGE_KEY);
  if (!savedUserData) return null;

  try {
    return JSON.parse(savedUserData) as Session;
  } catch {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem(SESSION_STORAGE_KEY);
}