import { Apartment, User } from 'entities';
import { createEntity } from 'utils/typeorm';
import { getManager } from 'typeorm';
import { Express } from 'express';
import chai from 'chai';

export const cleanTestDb = async () => {
  await Apartment.createQueryBuilder('apartment')
    .delete()
    .execute();
  await User.createQueryBuilder('user')
    .delete()
    .execute();
};

const registerUser = async (app: Express, user: {}) => {
  await chai
    .request(app)
    .post('/register')
    .send(user);
};

const seedUsers = async (app: Express) => {
  await registerUser(app, {
    email: 'admin@toprentals.com',
    name: 'admin',
    password: 'admin',
    type: 'ADMIN',
  });
  await registerUser(app, {
    email: 'realtor1@toprentals.com',
    name: 'Realtor1',
    password: 'realtor1',
    type: 'REALTOR',
  });
  await registerUser(app, {
    email: 'realtor2@toprentals.com',
    name: 'Realtor2',
    password: 'realtor2',
    type: 'REALTOR',
  });
  await registerUser(app, {
    email: 'client1@toprentals.com',
    name: 'Client1',
    password: 'client1',
    type: 'CLIENT',
  });
  await registerUser(app, {
    email: 'client2@toprentals.com',
    name: 'Client2',
    password: 'client2',
    type: 'CLIENT',
  });
  await registerUser(app, {
    email: 'client3@toprentals.com',
    name: 'Client3',
    password: 'client3',
    type: 'CLIENT',
  });
};

const seedApartments = async () => {
  await createEntity(Apartment, {
    name: '2 Bedroom Apartment Militari',
    description: 'A lovely 2 bedroom apartment perfect for a young family',
    size: 55,
    price: 450,
    room_nr: 2,
    latitude: 44.4441997,
    longitude: 26.0285873,
    owner_id: 2,
    rental_status: 'AVAILABLE',
  });
  await createEntity(Apartment, {
    name: '2 Bedroom Apartment Grozavesti',
    description: 'Wonderful place',
    size: 57,
    price: 590,
    room_nr: 2,
    latitude: 45.4441997,
    longitude: 28.0285873,
    owner_id: 2,
    rental_status: 'AVAILABLE',
  });
  await createEntity(Apartment, {
    name: '3 Bedroom Apartment Militari',
    description: 'A lovely 3 bedroom apartment perfect for a young family',
    size: 75,
    price: 750,
    room_nr: 3,
    latitude: 44.4441997,
    longitude: 26.0285873,
    owner_id: 2,
    rental_status: 'RENTED',
  });
  await createEntity(Apartment, {
    name: '3 Bedroom Apartment Unirii',
    description: 'Great for families',
    size: 85,
    price: 850,
    room_nr: 3,
    latitude: 44.4441997,
    longitude: 26.0285873,
    owner_id: 2,
    rental_status: 'AVAILABLE',
  });
  await createEntity(Apartment, {
    name: '4 Bedroom Apartment Tineretului',
    description: 'A lovely 4 bedroom apartment perfect for a young family',
    size: 175,
    price: 1950,
    room_nr: 4,
    latitude: 44.4441997,
    longitude: 26.0285873,
    owner_id: 3,
    rental_status: 'RENTED',
  });
  await createEntity(Apartment, {
    name: '4 Bedroom Apartment Ploiesti',
    description: 'Great for large families',
    size: 105,
    price: 1050,
    room_nr: 4,
    latitude: 44.4441997,
    longitude: 26.0285873,
    owner_id: 3,
    rental_status: 'AVAILABLE',
  });
};

export const populateTestDb = async (app: Express) => {
  await seedUsers(app);
  await seedApartments();
};

export const dropTables = async () => {
  const entityManager = getManager();
  await entityManager.query('DROP TABLE IF EXISTS "user", apartment', []);
};
