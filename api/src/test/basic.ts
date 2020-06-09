import mocha from 'mocha';
import chai from 'chai';
import chaiHttp from 'chai-http';
import { establishTestDatabaseConnection, initializeExpress } from '../index';
import { cleanTestDb, populateTestDb, dropTables } from './mock_data';
import { Apartment } from 'entities';

chai.use(chaiHttp);
chai.should();
const app = initializeExpress();

let client_token: string;
let realtor_token: string;
let admin_token: string;

const loginUser = async (email: string, password: string): Promise<string> => {
  const res = await chai
    .request(app)
    .post('/login')
    .send({ email, password });

  return res.body.authToken;
};

mocha.before(async function() {
  await establishTestDatabaseConnection();
  await cleanTestDb();
  await populateTestDb(app);
  client_token = await loginUser('client1@toprentals.com', 'client1');
  realtor_token = await loginUser('realtor1@toprentals.com', 'realtor1');
  admin_token = await loginUser('admin@toprentals.com', 'admin');
});

mocha.after(async function() {
  await dropTables();
});

describe('users', function() {
  it('client user can register', async function() {
    const user = {
      name: 'Andrei Crisan',
      email: 'andrei.crisan@toprentals.com',
      password: 'barosan',
      type: 'REALTOR',
    };
    const res = await chai
      .request(app)
      .post('/register')
      .send(user);
    res.should.have.status(200);
  });

  it('client user cannot login with wrong password', async function() {
    const res = await chai
      .request(app)
      .post('/login')
      .send({ email: 'andrei.crisan@toprentals.com', password: 'randomstring' });
    res.should.have.status(400);
    res.body.error.message.should.equal('Wrong password');
  });

  it('client user can login and logout', async function() {
    const loginRes = await chai
      .request(app)
      .post('/login')
      .send({ email: 'andrei.crisan@toprentals.com', password: 'barosan' });
    loginRes.should.have.status(200);

    const client = loginRes.body;
    client.hasOwnProperty('authToken').should.equal(true);

    const logoutRes = await chai
      .request(app)
      .post('/logout')
      .set('Authorization', `Bearer ${client.authToken}`);
    logoutRes.should.have.status(200);

    const getApartmentsRes = await chai
      .request(app)
      .get('/apartments')
      .set('Authorization', `Bearer ${client.authToken}`);
    getApartmentsRes.should.have.status(401);
  });
});

describe('filters', function() {
  it('client sees all available apartments', async function() {
    const res = await chai
      .request(app)
      .get('/apartments')
      .set('Authorization', `Bearer ${client_token}`);
    res.should.have.status(200);

    const apartments = res.body.apartments;
    apartments.length.should.equal(4);
  });

  it('realtor sees all apartments', async function() {
    const res = await chai
      .request(app)
      .get('/apartments')
      .set('Authorization', `Bearer ${realtor_token}`);
    res.should.have.status(200);

    const apartments = res.body.apartments;
    apartments.length.should.equal(6);
  });

  it('filter based on room_nr, price', async function() {
    const res = await chai
      .request(app)
      .get('/apartments?rooms=2,2&random=51&price=500,800')
      .set('Authorization', `Bearer ${realtor_token}`);
    res.should.have.status(200);

    const apartments = res.body.apartments;
    apartments.length.should.equal(1);
  });

  it('filter based on size', async function() {
    const res = await chai
      .request(app)
      .get('/apartments?size=80,90')
      .set('Authorization', `Bearer ${admin_token}`);
    res.should.have.status(200);

    const apartments = res.body.apartments;
    apartments.length.should.equal(1);
  });
});

describe('CRUD', function() {
  // TODO test that ADMIN cannot change owner_id to non_existant user ??

  // TODO test that admin cannot update user to new id?

  it('removing owner changes ownership to admin who removed him', async function() {
    const res = await chai
      .request(app)
      .delete('/users/3')
      .set('Authorization', `Bearer ${admin_token}`);
    res.should.have.status(200);

    const res2 = await chai
      .request(app)
      .get('/apartments')
      .set('Authorization', `Bearer ${admin_token}`);
    res.should.have.status(200);

    const apartments = res2.body.apartments;
    apartments.filter((apt: any) => apt.owner_id === '1').length.should.equal(2);
  });
});

describe('permissioning', function() {
  it('realtor can get list of realtors (including admins)', async function() {
    const res = await chai
      .request(app)
      .get('/users?type=REALTOR')
      .set('Authorization', `Bearer ${realtor_token}`);
    res.should.have.status(200);
    const users = res.body;
    users.length.should.equal(3);
  });

  it('realtor cannot get list of all users', async function() {
    const res = await chai
      .request(app)
      .get('/users')
      .set('Authorization', `Bearer ${realtor_token}`);
    res.should.have.status(402);
  });

  it('admin can get list of all users', async function() {
    const res = await chai
      .request(app)
      .get('/users')
      .set('Authorization', `Bearer ${admin_token}`);
    res.should.have.status(200);
    const users = res.body.users;
    users.length.should.be.at.least(6);
  });

  it('client cannot remove apartment', async function() {
    const res = await chai
      .request(app)
      .delete('/apartments/3')
      .set('Authorization', `Bearer ${client_token}`);
    res.should.have.status(402);
  });

  it('realtor can remove own apartment', async function() {
    const res = await chai
      .request(app)
      .delete('/apartments/2')
      .set('Authorization', `Bearer ${realtor_token}`);
    res.should.have.status(200);
  });

  it('realtor can remove other apartments', async function() {
    const res = await chai
      .request(app)
      .delete('/apartments/6')
      .set('Authorization', `Bearer ${realtor_token}`);
    res.should.have.status(200);
  });
});
