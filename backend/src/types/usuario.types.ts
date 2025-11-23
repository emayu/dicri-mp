export interface UsuarioDbRow {
  id: string;             
  nombre: string;
  correo: string;
  rol: string;
  password_hash: string;
  activo: boolean;
  fecha_creacion: Date;
  usuario_creacion: string;  
  fecha_modificacion?: Date | null;
  usuario_modificacion?: string;
}

export interface Usuario {
  id: string;
  nombre: string;
  correo: string;
  rol: string;
  activo: boolean;
}