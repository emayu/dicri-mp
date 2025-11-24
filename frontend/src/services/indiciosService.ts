import { apiFetch } from './apiClient';
import type { Indicio, IndicioInput } from '../types/indicio';

const baseAPI = "/v1/expedientes";
export async function getIndiciosByExpediente(expedienteId: string): Promise<Indicio[]> {
  const resp = await apiFetch<Indicio[]>(`${baseAPI}/${expedienteId}/indicios`, {
    method: 'GET',
  });
  return resp.data ?? [];
}

export async function createIndicio(
  expedienteId: string,
  payload: IndicioInput,
): Promise<Indicio> {
  const resp = await apiFetch<Indicio>(`${baseAPI}/${expedienteId}/indicios`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  if (!resp.data) throw new Error('No se pudo crear el indicio');
  return resp.data;
}

export async function updateIndicio(
  expedienteId: string,
  indicioId: string,
  payload: IndicioInput,
): Promise<Indicio> {
  const resp = await apiFetch<Indicio>(`${baseAPI}/${expedienteId}/indicios/${indicioId}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  if (!resp.data) throw new Error('No se pudo actualizar el indicio');
  return resp.data;
}

export async function deleteIndicio(
  expedienteId: string,
  indicioId: string,
): Promise<Indicio> {
  const resp = await apiFetch<Indicio>(`${baseAPI}/${expedienteId}/indicios/${indicioId}`, {
    method: 'DELETE',
  });
  if (!resp.data) throw new Error('No se pudo eliminar el indicio');
  return resp.data;
}