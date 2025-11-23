import session from 'express-session';
import SequelizeStoreFactory from 'connect-session-sequelize';
import { sequelize } from './db';

const SequelizeStore = SequelizeStoreFactory(session.Store);

const store = new SequelizeStore({
    db: sequelize,
    tableName: 'sesiones',
    checkExpirationInterval: 15 * 60 * 1000, //15 minutos
    expiration: 24 * 60 * 60 * 1000 // 24 hrs
  });

store.sync();

export const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || 'supersecret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // true en producción con HTTPS
    httpOnly: true,
    maxAge: 8 * 60 * 60 * 2, // 8 horas
  },
  store
});