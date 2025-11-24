import { apiFetch } from './apiClient';
import { EstadoFiltroUI, Expediente } from '../types/expediente';

const baseAPI = "/v1/expedientes";
export async function getExpedientes(estado?: EstadoFiltroUI): Promise<Expediente[]> {

  const searchParams = new URLSearchParams();
  if (estado && estado !== 'TODOS') {
    searchParams.set('estado', estado);
  }

  const query = searchParams.toString();
  const path = query ? `${baseAPI}?${query}` : baseAPI;

  const resp = await apiFetch<Expediente[]>(path, {
    method: 'GET',
  });

  return resp.data ?? [];
}

export async function getExpedienteById(id: string): Promise<Expediente> {
  const resp = await apiFetch<Expediente>(`${baseAPI}/${id}`, {
    method: 'GET',
  });

  if (!resp.data) {
    throw new Error('Expediente no encontrado');
  }

  return resp.data;
}

export async function createExpediente(payload: {
  descripcion: string;
}): Promise<Expediente> {
  const resp = await apiFetch<Expediente>(baseAPI, {
    method: 'POST',
    body: JSON.stringify({
      descripcion: payload.descripcion,
    }),
  });

  if (!resp.data) {
    throw new Error('No se pudo crear el expediente');
  }

  return resp.data;
}

export async function updateExpediente(
  id: string,
  payload: { descripcion: string },
): Promise<Expediente> {
  const resp = await apiFetch<Expediente>(`${baseAPI}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  if (!resp.data) throw new Error('No se pudo actualizar el expediente');
  return resp.data;
}


export async function deleteExpediente(id: string): Promise<Expediente> {
  const resp = await apiFetch<Expediente>(`${baseAPI}/${id}`, {
    method: 'DELETE',
  });
  if (!resp.data) {
    throw new Error('No se pudo eliminar el expediente');
  }
  return resp.data;
}


export async function enviarExpedienteARevision(id: string): Promise<Expediente> {
  const resp = await apiFetch<Expediente>(`${baseAPI}/${id}/enviar-revision`, {
    method: 'POST',
  });
  if (!resp.data) throw new Error('No se pudo enviar a revisión');
  return resp.data;
}

export async function aprobarExpediente(id: string): Promise<Expediente> {
  const resp = await apiFetch<Expediente>(`${baseAPI}/${id}/aprobar`, {
    method: 'POST',
  });
  if (!resp.data) throw new Error('No se pudo aprobar el expediente');
  return resp.data;
}

export async function rechazarExpediente(
  id: string,
  payload: { justificacion: string; tipoRechazo?: string | null },
): Promise<Expediente> {
  const resp = await apiFetch<Expediente>(`${baseAPI}/${id}/rechazar`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  if (!resp.data) throw new Error('No se pudo rechazar el expediente');
  return resp.data;
}