import logger from '@selesterkft/express-logger';
import { DB } from '@selesterkft/sel-db';

export const sqlConfig = {
  server: process.env.DB_SERVER,
  options: {
    database: process.env.DB_DATABASE,
    encrypt: process.env.DB_ENCRYPT === 'true',
    trustServerCertificate: true,
    requestTimeout: process.env.DB_TIMEOUT
      ? parseInt(process.env.DB_TIMEOUT, 10)
      : 120000,
    cancelTimeout: 120000,
    rowCollectionOnDone: true,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 1433,
  },
  authentication: {
    type: 'default',
    options: {
      userName: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    },
  },
};

const db = new DB(sqlConfig, logger);
export default db;
