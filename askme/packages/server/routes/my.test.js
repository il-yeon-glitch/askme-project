import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../src/app.js';
import db from '../db/index.js';

const JWT_SECRET = 'dev-secret-change-in-production';

function makeToken(userId, username) {
  return jwt.sign({ userId, username }, JWT_SECRET);
}

describe('My API (인증 필요)', () => {
  // 테스트 전체에서 재사용하는 토큰 (userId=1로 고정)
  const token = makeToken(1, 'testuser');
  let questionId;

  beforeEach(() => {
    db.prepare('DELETE FROM answers').run();
    db.prepare('DELETE FROM questions').run();
    db.prepare('DELETE FROM users').run();
    db.prepare(
      'INSERT INTO users (id, username, password_hash, display_name) VALUES (?, ?, ?, ?)'
    ).run(1, 'testuser', 'hashed_password', '테스트유저');

    const result = db.prepare(
      'INSERT INTO questions (owner_id, content) VALUES (?, ?)'
    ).run(1, '테스트 질문입니다');
    questionId = result.lastInsertRowid;
  });

  // ─── GET /api/my/questions ────────────────────────────────────────────────
  describe('GET /api/my/questions — 내 질문 목록', () => {
    it('인증 없이 접근하면 401을 반환한다', async () => {
      const response = await request(app).get('/api/my/questions');

      expect(response.status).toBe(401);
    });

    it('내 질문 목록을 반환한다', async () => {
      const response = await request(app)
        .get('/api/my/questions')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.questions).toHaveLength(1);
    });

    it('질문이 없으면 빈 배열을 반환한다', async () => {
      db.prepare('DELETE FROM questions').run();

      const response = await request(app)
        .get('/api/my/questions')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.questions).toHaveLength(0);
    });
  });

  // ─── POST /api/my/questions/:id/answer ───────────────────────────────────
  describe('POST /api/my/questions/:id/answer — 답변 작성', () => {
    it('인증 없이 답변 작성 시 401을 반환한다', async () => {
      const response = await request(app)
        .post(`/api/my/questions/${questionId}/answer`)
        .send({ content: '답변입니다' });

      expect(response.status).toBe(401);
    });

    it('빈 답변은 400을 반환한다', async () => {
      const response = await request(app)
        .post(`/api/my/questions/${questionId}/answer`)
        .set('Authorization', `Bearer ${token}`)
        .send({ content: '' });

      expect(response.status).toBe(400);
    });

    it('답변을 성공적으로 작성할 수 있다', async () => {
      const response = await request(app)
        .post(`/api/my/questions/${questionId}/answer`)
        .set('Authorization', `Bearer ${token}`)
        .send({ content: '답변입니다!' });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
    });

    it('이미 답변된 질문에 재답변 시 409를 반환한다', async () => {
      await request(app)
        .post(`/api/my/questions/${questionId}/answer`)
        .set('Authorization', `Bearer ${token}`)
        .send({ content: '첫 답변' });

      const response = await request(app)
        .post(`/api/my/questions/${questionId}/answer`)
        .set('Authorization', `Bearer ${token}`)
        .send({ content: '두 번째 답변 시도' });

      expect(response.status).toBe(409);
    });

    it('다른 사용자의 질문에는 답변할 수 없다', async () => {
      db.prepare(
        'INSERT INTO users (id, username, password_hash, display_name) VALUES (?, ?, ?, ?)'
      ).run(2, 'other', 'hash', '다른유저');
      const other = db.prepare(
        'INSERT INTO questions (owner_id, content) VALUES (?, ?)'
      ).run(2, '다른 유저 질문');

      const response = await request(app)
        .post(`/api/my/questions/${other.lastInsertRowid}/answer`)
        .set('Authorization', `Bearer ${token}`)
        .send({ content: '내가 답변 시도' });

      expect(response.status).toBe(404);
    });
  });

  // ─── PATCH /api/my/questions/:id/answer ──────────────────────────────────
  describe('PATCH /api/my/questions/:id/answer — 답변 수정', () => {
    beforeEach(() => {
      db.prepare('INSERT INTO answers (question_id, content) VALUES (?, ?)').run(questionId, '원래 답변');
      db.prepare('UPDATE questions SET is_answered = 1 WHERE id = ?').run(questionId);
    });

    it('인증 없이 수정 시 401을 반환한다', async () => {
      const response = await request(app)
        .patch(`/api/my/questions/${questionId}/answer`)
        .send({ content: '수정 시도' });

      expect(response.status).toBe(401);
    });

    it('빈 내용으로 수정 시 400을 반환한다', async () => {
      const response = await request(app)
        .patch(`/api/my/questions/${questionId}/answer`)
        .set('Authorization', `Bearer ${token}`)
        .send({ content: '' });

      expect(response.status).toBe(400);
    });

    it('답변을 성공적으로 수정할 수 있다', async () => {
      const response = await request(app)
        .patch(`/api/my/questions/${questionId}/answer`)
        .set('Authorization', `Bearer ${token}`)
        .send({ content: '수정된 답변' });

      expect(response.status).toBe(200);
      expect(response.body.content).toBe('수정된 답변');
    });

    it('존재하지 않는 질문 수정 시 404를 반환한다', async () => {
      const response = await request(app)
        .patch('/api/my/questions/9999/answer')
        .set('Authorization', `Bearer ${token}`)
        .send({ content: '수정 시도' });

      expect(response.status).toBe(404);
    });
  });

  // ─── PATCH /api/my/questions/:id/pin ─────────────────────────────────────
  describe('PATCH /api/my/questions/:id/pin — 고정 토글', () => {
    it('인증 없이 고정 시 401을 반환한다', async () => {
      const response = await request(app).patch(`/api/my/questions/${questionId}/pin`);

      expect(response.status).toBe(401);
    });

    it('질문을 고정할 수 있다', async () => {
      const response = await request(app)
        .patch(`/api/my/questions/${questionId}/pin`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.isPinned).toBe(true);
    });

    it('고정된 질문을 다시 누르면 고정 해제된다', async () => {
      await request(app)
        .patch(`/api/my/questions/${questionId}/pin`)
        .set('Authorization', `Bearer ${token}`);

      const response = await request(app)
        .patch(`/api/my/questions/${questionId}/pin`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.body.isPinned).toBe(false);
    });

    it('다른 사용자의 질문은 고정할 수 없다', async () => {
      db.prepare(
        'INSERT INTO users (id, username, password_hash, display_name) VALUES (?, ?, ?, ?)'
      ).run(2, 'other', 'hash', '다른유저');
      const other = db.prepare(
        'INSERT INTO questions (owner_id, content) VALUES (?, ?)'
      ).run(2, '다른 유저 질문');

      const response = await request(app)
        .patch(`/api/my/questions/${other.lastInsertRowid}/pin`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
    });
  });

  // ─── DELETE /api/my/questions/:id ────────────────────────────────────────
  describe('DELETE /api/my/questions/:id — 질문 삭제', () => {
    it('인증 없이 삭제 시 401을 반환한다', async () => {
      const response = await request(app).delete(`/api/my/questions/${questionId}`);

      expect(response.status).toBe(401);
    });

    it('내 질문을 삭제할 수 있다', async () => {
      const response = await request(app)
        .delete(`/api/my/questions/${questionId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(204);
    });

    it('존재하지 않는 질문 삭제 시 404를 반환한다', async () => {
      const response = await request(app)
        .delete('/api/my/questions/9999')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
    });

    it('다른 사용자의 질문은 삭제할 수 없다', async () => {
      db.prepare(
        'INSERT INTO users (id, username, password_hash, display_name) VALUES (?, ?, ?, ?)'
      ).run(2, 'other', 'hash', '다른유저');
      const other = db.prepare(
        'INSERT INTO questions (owner_id, content) VALUES (?, ?)'
      ).run(2, '다른 유저 질문');

      const response = await request(app)
        .delete(`/api/my/questions/${other.lastInsertRowid}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
    });
  });
});
