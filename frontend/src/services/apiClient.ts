export interface ApiResponse<T = unknown> {
  status: 'success' | 'fail' | 'error';
  message: string;
  error?: string;
  data?: T;
}

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';

interface ApiOptions extends RequestInit {
  auth?: boolean;
}

export async function apiFetch<T>(path: string, options: ApiOptions = {}): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${path}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    credentials: 'include',
  });

  const data = (await response.json()) as ApiResponse<T>;

  if (!response.ok || data.status === 'fail' || data.status === 'error') {
    throw new Error(data.message || data.error || 'Error en la petición');
  }

  return data;
}