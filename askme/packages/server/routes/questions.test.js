import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import db from '../db/index.js';

describe('Questions API', () => {
  beforeEach(() => {
    db.prepare('DELETE FROM answers').run();
    db.prepare('DELETE FROM questions').run();
    db.prepare('DELETE FROM users').run();
    db.prepare(
      'INSERT INTO users (id, username, password_hash, display_name) VALUES (?, ?, ?, ?)'
    ).run(1, 'testuser', 'hashed_password', '테스트유저');
  });

  // ─── POST /api/questions ───────────────────────────────────────────────────
  describe('POST /api/questions — 질문 등록', () => {
    it('질문을 성공적으로 작성할 수 있다', async () => {
      const response = await request(app)
        .post('/api/questions')
        .send({ content: '오늘 점심 뭐 먹었어?', ownerId: 1 });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.content).toBe('오늘 점심 뭐 먹었어?');
    });

    it('앞뒤 공백은 제거 후 저장된다', async () => {
      const response = await request(app)
        .post('/api/questions')
        .send({ content: '  공백 테스트  ', ownerId: 1 });

      expect(response.status).toBe(201);
      expect(response.body.content).toBe('공백 테스트');
    });

    it('빈 내용은 400을 반환한다', async () => {
      const response = await request(app)
        .post('/api/questions')
        .send({ content: '', ownerId: 1 });

      expect(response.status).toBe(400);
    });

    it('공백만 있는 내용은 400을 반환한다', async () => {
      const response = await request(app)
        .post('/api/questions')
        .send({ content: '   ', ownerId: 1 });

      expect(response.status).toBe(400);
    });

    it('300자 초과 질문은 400을 반환한다', async () => {
      const response = await request(app)
        .post('/api/questions')
        .send({ content: 'A'.repeat(301), ownerId: 1 });

      expect(response.status).toBe(400);
    });

    it('정확히 300자 질문은 정상 등록된다', async () => {
      const response = await request(app)
        .post('/api/questions')
        .send({ content: 'A'.repeat(300), ownerId: 1 });

      expect(response.status).toBe(201);
    });

    it('존재하지 않는 사용자에게는 404를 반환한다', async () => {
      const response = await request(app)
        .post('/api/questions')
        .send({ content: '질문입니다', ownerId: 9999 });

      expect(response.status).toBe(404);
    });
  });

  // ─── GET /api/questions/users/:username ───────────────────────────────────
  describe('GET /api/questions/users/:username — 공개 Q&A 목록', () => {
    it('사용자의 전체 질문 목록을 반환한다', async () => {
      await request(app).post('/api/questions').send({ content: '첫 번째 질문', ownerId: 1 });
      await request(app).post('/api/questions').send({ content: '두 번째 질문', ownerId: 1 });

      const response = await request(app).get('/api/questions/users/testuser');

      expect(response.status).toBe(200);
      expect(response.body.questions).toHaveLength(2);
    });

    it('질문이 없으면 빈 배열을 반환한다', async () => {
      const response = await request(app).get('/api/questions/users/testuser');

      expect(response.status).toBe(200);
      expect(response.body.questions).toHaveLength(0);
    });

    it('응답에 사용자 정보가 포함된다', async () => {
      const response = await request(app).get('/api/questions/users/testuser');

      expect(response.body.user).toMatchObject({
        username: 'testuser',
        displayName: '테스트유저',
      });
    });

    it('존재하지 않는 사용자는 404를 반환한다', async () => {
      const response = await request(app).get('/api/questions/users/nobody');

      expect(response.status).toBe(404);
    });
  });

  // ─── GET /api/questions/:username/answered ────────────────────────────────
  describe('GET /api/questions/:username/answered — 답변된 Q&A 목록', () => {
    beforeEach(() => {
      // 답변 완료된 질문 세팅
      const answered = db.prepare(
        'INSERT INTO questions (owner_id, content, is_answered) VALUES (?, ?, 1)'
      ).run(1, '답변된 질문');
      db.prepare('INSERT INTO answers (question_id, content) VALUES (?, ?)').run(
        answered.lastInsertRowid, '답변 내용입니다'
      );
      // 미답변 질문 (응답에 포함되면 안 됨)
      db.prepare('INSERT INTO questions (owner_id, content) VALUES (?, ?)').run(1, '미답변 질문');
    });

    it('답변된 질문만 반환한다', async () => {
      const response = await request(app).get('/api/questions/testuser/answered');

      expect(response.status).toBe(200);
      expect(response.body.questions).toHaveLength(1);
      expect(response.body.questions[0].content).toBe('답변된 질문');
    });

    it('응답에 answer 필드가 포함된다', async () => {
      const response = await request(app).get('/api/questions/testuser/answered');

      expect(response.body.questions[0]).toHaveProperty('answer');
      expect(response.body.questions[0].answer.content).toBe('답변 내용입니다');
    });

    it('답변된 질문이 없으면 빈 배열을 반환한다', async () => {
      db.prepare('DELETE FROM answers').run();
      db.prepare('UPDATE questions SET is_answered = 0').run();

      const response = await request(app).get('/api/questions/testuser/answered');

      expect(response.status).toBe(200);
      expect(response.body.questions).toHaveLength(0);
    });

    it('존재하지 않는 사용자는 404를 반환한다', async () => {
      const response = await request(app).get('/api/questions/nobody/answered');

      expect(response.status).toBe(404);
    });
  });

  // ─── POST /api/questions/:id/like ─────────────────────────────────────────
  describe('POST /api/questions/:id/like — 좋아요', () => {
    it('좋아요를 누르면 likeCount가 1 증가한다', async () => {
      const created = await request(app)
        .post('/api/questions')
        .send({ content: '좋아요 테스트', ownerId: 1 });

      const response = await request(app).post(`/api/questions/${created.body.id}/like`);

      expect(response.status).toBe(200);
      expect(response.body.likeCount).toBe(1);
    });

    it('연속으로 누르면 likeCount가 누적된다', async () => {
      const created = await request(app)
        .post('/api/questions')
        .send({ content: '누적 테스트', ownerId: 1 });
      const id = created.body.id;

      await request(app).post(`/api/questions/${id}/like`);
      await request(app).post(`/api/questions/${id}/like`);
      const response = await request(app).post(`/api/questions/${id}/like`);

      expect(response.body.likeCount).toBe(3);
    });

    it('존재하지 않는 질문은 404를 반환한다', async () => {
      const response = await request(app).post('/api/questions/9999/like');

      expect(response.status).toBe(404);
    });
  });

  // ─── SQL 인젝션 ───────────────────────────────────────────────────────────
  describe('SQL 인젝션 방어', () => {
    it('질문 내용에 SQL 구문이 있어도 안전하게 저장된다', async () => {
      const malicious = "'; DROP TABLE questions; --";

      const response = await request(app)
        .post('/api/questions')
        .send({ content: malicious, ownerId: 1 });

      // prepared statement가 SQL 구문을 일반 문자열로 처리해야 함
      expect(response.status).toBe(201);
      expect(response.body.content).toBe(malicious);
    });

    it('SQL 인젝션 후에도 questions 테이블이 정상적으로 동작한다', async () => {
      await request(app)
        .post('/api/questions')
        .send({ content: "' OR '1'='1", ownerId: 1 });

      // 테이블이 살아있고 정상 조회 가능해야 함
      const response = await request(app).get('/api/questions/users/testuser');

      expect(response.status).toBe(200);
      expect(response.body.questions).toHaveLength(1);
    });
  });
});
