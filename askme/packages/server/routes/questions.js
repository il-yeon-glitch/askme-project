const express = require('express');
const db = require('../db');

const router = express.Router();

// 익명 질문 등록
router.post('/', (req, res) => {
    const { content, ownerId } = req.body;

    // 내용 검증
    if (!content || content.trim().length === 0) {
        return res.status(400).json({ error: '질문 내용은 1~300자여야 합니다' });
    }
    if (content.length > 300) {
        return res.status(400).json({ error: '질문 내용은 1~300자여야 합니다' });
    }

    // 사용자 존재 확인
    const owner = db.prepare('SELECT id FROM users WHERE id = ?').get(ownerId);
    if (!owner) {
        return res.status(404).json({ error: '존재하지 않는 사용자입니다' });
    }

    // 질문 등록
    const result = db.prepare(
        'INSERT INTO questions (owner_id, content) VALUES (?, ?)'
    ).run(ownerId, content.trim());

    const question = db.prepare('SELECT * FROM questions WHERE id = ?')
        .get(result.lastInsertRowid);

    res.status(201).json(question);
});

// 공개 Q&A 조회
router.get('/users/:username', (req, res) => {
    const { username } = req.params;

    // 사용자 확인
    const user = db.prepare(
        'SELECT id, username, display_name FROM users WHERE username = ?'
    ).get(username);

    if (!user) {
        return res.status(404).json({ error: '존재하지 않는 사용자입니다' });
    }

    // 질문 + 답변 조회 (LEFT JOIN)
    const questions = db.prepare(`
        SELECT
            q.id, q.content, q.is_answered, q.created_at,
            a.content AS answer_content, a.created_at AS answer_created_at
        FROM questions q
        LEFT JOIN answers a ON a.question_id = q.id
        WHERE q.owner_id = ?
        ORDER BY q.created_at DESC
    `).all(user.id);

    // 응답 형태 가공
    const formatted = questions.map(q => ({
        id: q.id,
        content: q.content,
        isAnswered: Boolean(q.is_answered),
        createdAt: q.created_at,
        answer: q.answer_content ? {
            content: q.answer_content,
            createdAt: q.answer_created_at
        } : null
    }));

    res.json({
        user: { id: user.id, username: user.username, displayName: user.display_name },
        questions: formatted
    });
});

module.exports = router;
