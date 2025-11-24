import * as React from 'react';
import { Chip } from '@mui/material';
import type { ExpedienteEstado } from '../types/expediente';

export interface ExpedienteEstadoChipProps {
  estado: ExpedienteEstado | string;
  size?: 'small' | 'medium';
}

function estadoToChipColor(estado: string): 'default' | 'info' | 'success' | 'warning' | 'error' {
  switch (estado) {
    case 'BORRADOR':
      return 'default';
    case 'EN_REVISION':
      return 'info';
    case 'APROBADO':
      return 'success';
    case 'RECHAZADO':
      return 'error';
    default:
      return 'default';
  }
}

function estadoLabel(estado: string): string {
  switch (estado) {
    case 'BORRADOR':
      return 'Borrador';
    case 'EN_REVISION':
      return 'En revisión';
    case 'APROBADO':
      return 'Aprobado';
    case 'RECHAZADO':
      return 'Rechazado';
    default:
      return estado;
  }
}

export function ExpedienteEstadoChip({ estado, size = 'small' }: ExpedienteEstadoChipProps) {
  return (
    <Chip
      size={size}
      label={estadoLabel(estado)}
      color={estadoToChipColor(estado)}
    />
  );
}