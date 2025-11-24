export const ESTADO = {
  BORRADOR: 'BORRADOR',
  EN_REVISION: 'EN_REVISION',
  APROBADO: 'APROBADO',
  RECHAZADO: 'RECHAZADO'
} as const;

export type ExpedienteEstado = typeof ESTADO[keyof typeof ESTADO];