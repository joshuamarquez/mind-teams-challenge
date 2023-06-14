import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { adminUserCredsFixture, newUserTestFxiture } from './fixtures';

describe('AuthController (e2e)', () => {
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

  describe('/auth/login (POST)', () => {
    it('should be able to login providing correct credentials', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send(adminUserCredsFixture)
        .expect(200)
        .expect(res => {
          expect(res.body.access_token).toBeDefined();
        });
    });
  });

  describe('/auth/signup (POST)', () => {
    it('should be able to sign up', async () => {
      const loginRes = await request(app.getHttpServer())
        .post('/auth/login')
        .send(adminUserCredsFixture);

      return request(app.getHttpServer())
        .post('/auth/signup')
        .set('Authorization', `Bearer ${loginRes.body.access_token}`)
        .send(newUserTestFxiture)
        .expect(201)
        .expect((res: request.Response) => {
          expect(res.body.name).toEqual(newUserTestFxiture.name);
          expect(res.body.email).toEqual(newUserTestFxiture.email);
          expect(res.body.role).toEqual(newUserTestFxiture.role);
          expect(res.body.password).toBeUndefined();
        });
    });
  });

  describe('/auth/profile (GET)', () => {
    it('should be able get profile', async () => {
      const loginRes = await request(app.getHttpServer())
        .post('/auth/login')
        .send(newUserTestFxiture);

      return request(app.getHttpServer())
        .get('/auth/profile')
        .set('Authorization', `Bearer ${loginRes.body.access_token}`)
        .expect(200)
        .expect((res: request.Response) => {
          expect(res.body.name).toEqual(newUserTestFxiture.name);
          expect(res.body.email).toEqual(newUserTestFxiture.email);
          expect(res.body.role).toEqual(newUserTestFxiture.role);
          expect(res.body.password).toBeUndefined();
        });
    });
  });
});
