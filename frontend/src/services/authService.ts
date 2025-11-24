
import { AppSession } from '../types/auth';
import { apiFetch } from './apiClient';

const SESSION_STORAGE_KEY = 'us';

interface LoginResponseData {
  usuario:String
}

interface SesionResponseData {
  usuario: {
    id: string;
    nombre: string;
    correo: string;
    roles: string[];
  };
}
const baseAPI = "/v1/auth";
export async function signInWithEmailPassword(email: string, password: string): Promise<Session> {
  const resp = await apiFetch<LoginResponseData>(`${baseAPI}/login`, {
    method: 'POST',
    body: JSON.stringify({
      correo: email,
      contrasena: password,
    }),
  });

  const sessionResponse = await apiFetch<SesionResponseData>(`${baseAPI}/sesion`,{
    method: 'GET'
  });

  const usuario = sessionResponse.data?.usuario;

  if(!usuario){
    throw new Error('No se pudo obtener los datos de la sesión');
  }
  const session: AppSession = {
    user: {
      id: usuario.id,
      name: usuario.nombre,
      email: usuario.correo,
      roles: usuario.roles
    },
  };

  // Persistir sesión simple en localStorage
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));

  return session;
}

export function loadInitialSession(): AppSession | null {
  const savedUserData = localStorage.getItem(SESSION_STORAGE_KEY);
  if (!savedUserData) return null;

  try {
    return JSON.parse(savedUserData) as AppSession;
  } catch {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem(SESSION_STORAGE_KEY);
}