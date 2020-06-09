import 'module-alias/register';
import 'dotenv/config';
import 'reflect-metadata';
import express from 'express';
import cors from 'cors';

import createDatabaseConnection from 'database/createConnection';
import { addRespondToResponse } from 'middleware/response';
import { authenticateUser } from 'middleware/authentication';
import { handleError } from 'middleware/errors';
import { RouteNotFoundError } from 'errors';

import { Express } from 'express';

import { attachPublicRoutes, attachPrivateRoutes } from './routes';
import { checkPermissions } from 'middleware/permissions';

export const establishDatabaseConnection = async (): Promise<void> => {
  try {
    await createDatabaseConnection(false);
  } catch (error) {
    console.log(error);
  }
};

export const establishTestDatabaseConnection = async (): Promise<void> => {
  try {
    await createDatabaseConnection(true);
  } catch (error) {
    console.log(error);
  }
};

export const initializeExpress = (): Express => {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded());

  app.use(addRespondToResponse);

  attachPublicRoutes(app);

  app.use('/', authenticateUser);
  app.use('/', checkPermissions);

  attachPrivateRoutes(app);

  app.use((req, _res, next) => next(new RouteNotFoundError(req.originalUrl)));
  app.use(handleError);

  if (!module.parent) {
    app.listen(process.env.PORT || 8000);
  }
  return app;
};

export const initializeApp = async (): Promise<Express> => {
  await establishDatabaseConnection();
  return initializeExpress();
};

initializeApp();
