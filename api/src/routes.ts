import * as users from 'controllers/users';
import * as apartments from 'controllers/apartments';

import { Express } from 'express';

export const attachPublicRoutes = (app: Express): void => {
  app.post('/register', users.registerUser);
  app.post('/login', users.login);
};

export const attachPrivateRoutes = (app: Express): void => {
  app.post('/logout', users.logout);

  app.get('/apartments', apartments.getAvailableApartments);
  app.post('/apartments', apartments.create);
  app.delete('/apartments/:id', apartments.remove);
  app.put('/apartments/:id', apartments.update);

  app.put('/users/:id', users.update);
  app.delete('/users/:id', users.remove);
  app.get('/users', users.getUsers);
  // app.get('/users/realtors', users.getRealtors);
};
