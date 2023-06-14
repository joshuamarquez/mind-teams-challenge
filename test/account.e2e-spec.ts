import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { adminUserCredsFixture, newAccountTestFxiture } from './fixtures';

describe('AccountController (e2e)', () => {
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

  describe('/account (GET)', () => {
    it('should get list of accounts', async () => {
      const loginRes = await request(app.getHttpServer())
        .post('/auth/login')
        .send(adminUserCredsFixture);

      return request(app.getHttpServer())
        .get('/account')
        .set('Authorization', `Bearer ${loginRes.body.access_token}`)
        .expect(200)
        .expect((res: request.Response) => {
          expect(res.body.length).toBeGreaterThan(0);
          expect(res.body[0].id).toBeDefined();
          expect(res.body[0].name).toBeDefined();
        });
    });
  });

  describe('/account (POST)', () => {
    it('should create account', async () => {
      const loginRes = await request(app.getHttpServer())
        .post('/auth/login')
        .send(adminUserCredsFixture);

      return request(app.getHttpServer())
        .post('/account')
        .set('Authorization', `Bearer ${loginRes.body.access_token}`)
        .send(newAccountTestFxiture)
        .expect(201)
        .expect((res: request.Response) => {
          expect(res.body.name).toEqual(newAccountTestFxiture.name);
        });
    });
  });

  describe('/account/:id (PUT)', () => {
    it('should update existing account', async () => {
      const loginRes = await request(app.getHttpServer())
        .post('/auth/login')
        .send(adminUserCredsFixture);

      const accountsRes = await request(app.getHttpServer())
        .get('/account')
        .set('Authorization', `Bearer ${loginRes.body.access_token}`);

      const account =  accountsRes.body.find(account => account.name == newAccountTestFxiture.name);
      const NEW_NAME = 'foobar';

      return request(app.getHttpServer())
        .put(`/account/${account.id}`)
        .set('Authorization', `Bearer ${loginRes.body.access_token}`)
        .send({ name: NEW_NAME })
        .expect(200)
        .expect((res: request.Response) => {
          expect(res.body.id).toEqual(account.id);
          expect(res.body.name).toEqual(NEW_NAME);
        });
    });
  });

  describe('/account/:id (DELETE)', () => {
    it('should update existing account', async () => {
      const loginRes = await request(app.getHttpServer())
        .post('/auth/login')
        .send(adminUserCredsFixture);

      const accountRes = await request(app.getHttpServer())
        .post('/account')
        .send(newAccountTestFxiture)
        .set('Authorization', `Bearer ${loginRes.body.access_token}`);

      return request(app.getHttpServer())
        .delete(`/account/${accountRes.body.id}`)
        .set('Authorization', `Bearer ${loginRes.body.access_token}`)
        .expect(200)
        .expect((res: request.Response) => {
          expect(res.body.affected).toEqual(1);
        });
    });
  });
});
