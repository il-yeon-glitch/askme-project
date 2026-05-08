import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import db from '../db/index.js';

describe('Auth API', () => {
  beforeEach(() => {
    db.prepare('DELETE FROM answers').run();
    db.prepare('DELETE FROM questions').run();
    db.prepare('DELETE FROM users').run();
  });

  // ─── POST /api/auth/signup ────────────────────────────────────────────────
  describe('POST /api/auth/signup — 회원가입', () => {
    it('정상적으로 회원가입할 수 있다', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({ username: 'newuser', password: 'pass1234', displayName: '새유저' });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user.username).toBe('newuser');
    });

    it('같은 username으로 두 번 가입하면 409를 반환한다', async () => {
      await request(app)
        .post('/api/auth/signup')
        .send({ username: 'dupuser', password: 'pass1234', displayName: '첫번째' });

      const response = await request(app)
        .post('/api/auth/signup')
        .send({ username: 'dupuser', password: 'other1234', displayName: '두번째' });

      expect(response.status).toBe(409);
    });

    it('username이 없으면 400을 반환한다', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({ password: 'pass1234', displayName: '이름' });

      expect(response.status).toBe(400);
    });

    it('password가 없으면 400을 반환한다', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({ username: 'user', displayName: '이름' });

      expect(response.status).toBe(400);
    });

    it('displayName이 없으면 400을 반환한다', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({ username: 'user', password: 'pass1234' });

      expect(response.status).toBe(400);
    });
  });

  // ─── POST /api/auth/login ─────────────────────────────────────────────────
  describe('POST /api/auth/login — 로그인', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/auth/signup')
        .send({ username: 'loginuser', password: 'correct1234', displayName: '로그인유저' });
    });

    it('올바른 정보로 로그인하면 token을 반환한다', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ username: 'loginuser', password: 'correct1234' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
    });

    it('비밀번호가 틀리면 401을 반환한다', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ username: 'loginuser', password: 'wrongpass' });

      expect(response.status).toBe(401);
    });

    it('존재하지 않는 username으로 로그인하면 401을 반환한다', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ username: 'ghost', password: 'pass1234' });

      expect(response.status).toBe(401);
    });
  });
});
