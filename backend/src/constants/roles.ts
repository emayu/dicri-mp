export const ROLES = {
  ADMIN: 'ADMIN',
  TECNICO: 'TECNICO',
  COORDINADOR: 'COORDINADOR',
} as const;

export type Role = typeof ROLES[keyof typeof ROLES]