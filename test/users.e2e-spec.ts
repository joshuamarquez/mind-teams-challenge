import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { adminUserCredsFixture } from './fixtures';

describe('UsersController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/users (GET)', () => {
    it('should get list of users', async () => {
      const loginRes = await request(app.getHttpServer())
        .post('/auth/login')
        .send(adminUserCredsFixture);

      return request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${loginRes.body.access_token}`)
        .expect(200)
        .expect((res: request.Response) => {
          expect(res.body.length).toBeGreaterThan(0);
          expect(res.body[0].password).toBeUndefined();
        });
    });
  });

  describe('/users/:id (PUT)', () => {
    it('should update existing user', async () => {
      const loginRes = await request(app.getHttpServer())
        .post('/auth/login')
        .send(adminUserCredsFixture);

      const usersRes = await request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${loginRes.body.access_token}`);

      const user =  usersRes.body.find(user => user.email == 'super@gmail.com');
      const NEW_NAME = 'foobar';

      return request(app.getHttpServer())
        .put(`/users/${user.id}`)
        .set('Authorization', `Bearer ${loginRes.body.access_token}`)
        .send({ name: NEW_NAME })
        .expect(200)
        .expect((res: request.Response) => {
          expect(res.body.id).toEqual(user.id);
          expect(res.body.name).toEqual(NEW_NAME);
          expect(res.body.password).toBeUndefined();
        });
    });
  });

  describe('/users/:id/addToAccount/:accountId (POST)', () => {
    it('should add user to account', async () => {
      const loginRes = await request(app.getHttpServer())
        .post('/auth/login')
        .send(adminUserCredsFixture);

      const usersRes = await request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${loginRes.body.access_token}`);

      const accountRes = await request(app.getHttpServer())
        .get('/account')
        .set('Authorization', `Bearer ${loginRes.body.access_token}`);

      const [ user ] =  usersRes.body;
      const [ account ] = accountRes.body;

      return request(app.getHttpServer())
        .post(`/users/${user.id}/addToAccount/${account.id}`)
        .set('Authorization', `Bearer ${loginRes.body.access_token}`)
        .expect(201)
        .expect((res: request.Response) => {
          expect(res.body.startDate).toBeDefined();
          expect(res.body.user.id).toEqual(user.id);
          expect(res.body.account.id).toEqual(account.id);
        });
    });
  });
});
