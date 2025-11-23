import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize(
  process.env.DB_NAME || 'mp_dicri_db',
  process.env.DB_USER || 'sa',
  process.env.DB_PASSWORD || 'MiPasswrodFuerte123',
  {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 1433,
    dialect: 'mssql',
    dialectOptions: {
      options: {
        encrypt: true,
        trustServerCertificate: true, // importante para entornos locales
      }
    },
    logging: process.env.ENV === 'DEV' ? console.log : false,
  }
);