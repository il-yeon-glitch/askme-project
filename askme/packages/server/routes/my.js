const express = require('express');
const db = require('../db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// 모든 라우트에 인증 적용
router.use(authMiddleware);

// 내 질문 목록 조회
router.get('/questions', (req, res) => {
    const dateOrder = req.query.sort === 'oldest' ? 'ASC' : 'DESC';

    const questions = db.prepare(`
        SELECT
            q.id, q.content, q.is_answered, q.is_pinned, q.created_at,
            a.content AS answer_content, a.created_at AS answer_created_at
        FROM questions q
        LEFT JOIN answers a ON a.question_id = q.id
        WHERE q.owner_id = ?
        ORDER BY q.is_pinned DESC, q.created_at ${dateOrder}
    `).all(req.user.userId);

    const formatted = questions.map(q => ({
        id: q.id,
        content: q.content,
        isAnswered: Boolean(q.is_answered),
        isPinned: Boolean(q.is_pinned),
        createdAt: q.created_at,
        answer: q.answer_content ? {
            content: q.answer_content,
            createdAt: q.answer_created_at
        } : null
    }));

    res.json({ questions: formatted });
});

// 답변 작성
router.post('/questions/:id/answer', (req, res) => {
    const questionId = parseInt(req.params.id);
    const { content } = req.body;

    if (!content || content.trim().length === 0) {
        return res.status(400).json({ error: '답변 내용을 입력해주세요' });
    }

    // 질문 확인 + 소유권 확인
    const question = db.prepare(
        'SELECT * FROM questions WHERE id = ? AND owner_id = ?'
    ).get(questionId, req.user.userId);

    if (!question) {
        return res.status(404).json({ error: '질문을 찾을 수 없습니다' });
    }

    if (question.is_answered) {
        return res.status(409).json({ error: '이미 답변된 질문입니다' });
    }

    // 트랜잭션으로 답변 + 상태 업데이트
    const answerTransaction = db.transaction(() => {
        const result = db.prepare(
            'INSERT INTO answers (question_id, content) VALUES (?, ?)'
        ).run(questionId, content.trim());

        db.prepare(
            'UPDATE questions SET is_answered = 1 WHERE id = ?'
        ).run(questionId);

        return result;
    });

    const result = answerTransaction();

    const answer = db.prepare('SELECT * FROM answers WHERE id = ?')
        .get(result.lastInsertRowid);

    res.status(201).json(answer);
});

// 답변 수정
router.patch('/questions/:id/answer', (req, res) => {
    const questionId = parseInt(req.params.id);
    const { content } = req.body;

    if (!content || content.trim().length === 0) {
        return res.status(400).json({ error: '답변 내용을 입력해주세요' });
    }

    const question = db.prepare(
        'SELECT * FROM questions WHERE id = ? AND owner_id = ?'
    ).get(questionId, req.user.userId);

    if (!question) {
        return res.status(404).json({ error: '질문을 찾을 수 없습니다' });
    }

    db.prepare(
        'UPDATE answers SET content = ? WHERE question_id = ?'
    ).run(content.trim(), questionId);

    res.json({ questionId, content: content.trim() });
});

// 고정 토글
router.patch('/questions/:id/pin', (req, res) => {
    const questionId = parseInt(req.params.id);

    const question = db.prepare(
        'SELECT * FROM questions WHERE id = ? AND owner_id = ?'
    ).get(questionId, req.user.userId);

    if (!question) {
        return res.status(404).json({ error: '질문을 찾을 수 없습니다' });
    }

    const newPinned = question.is_pinned ? 0 : 1;
    db.prepare('UPDATE questions SET is_pinned = ? WHERE id = ?').run(newPinned, questionId);

    res.json({ id: questionId, isPinned: Boolean(newPinned) });
});

// 질문 삭제
router.delete('/questions/:id', (req, res) => {
    const questionId = parseInt(req.params.id);

    // 소유권 확인
    const question = db.prepare(
        'SELECT * FROM questions WHERE id = ? AND owner_id = ?'
    ).get(questionId, req.user.userId);

    if (!question) {
        return res.status(404).json({ error: '질문을 찾을 수 없습니다' });
    }

    db.prepare('DELETE FROM questions WHERE id = ?').run(questionId);

    res.status(204).send();
});

module.exports = router;
