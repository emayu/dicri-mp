import 'express-session';
import { Role } from '../constants';


declare module 'express-session' {
  interface SessionData {
    user: {
      id: string;
      nombre: string;
      correo: string;
      roles: Role[];
    };
  }
}