import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { adminUserCredsFixture } from './fixtures';

describe('LogsController (e2e)', () => {
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

  describe('/ (GET)', () => {
    it('should query user-account logs', async () => {
      const loginRes = await request(app.getHttpServer())
        .post('/auth/login')
        .send(adminUserCredsFixture);

      return request(app.getHttpServer())
        .get('/logs')
        .query({
          accountName: 'super',
          userName: 'admin',
          startDate: '2023-06-14'
        })
        .set('Authorization', `Bearer ${loginRes.body.access_token}`)
        .expect(200)
        .expect((res: request.Response) => {
          // TODO: validate response
        });
    });
  });
});
