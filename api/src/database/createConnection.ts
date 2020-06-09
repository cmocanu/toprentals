import { createConnection, Connection } from 'typeorm';

import * as entities from 'entities';

const createDatabaseConnection = (testing: boolean): Promise<Connection> => {
  const database = testing ? process.env.DB_DATABASE_TEST : process.env.DB_DATABASE;
  return createConnection({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: database,
    entities: Object.values(entities),
    synchronize: true,
    ssl: true,
    logging: testing ? ['error', 'warn', 'info', 'log'] : false,
  });
};

export default createDatabaseConnection;
