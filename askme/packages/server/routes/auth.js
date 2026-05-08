const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';

// 회원가입
router.post('/signup', async (req, res) => {
    const { username, password, displayName } = req.body;

    // 필수값 검증
    if (!username || !password || !displayName) {
        return res.status(400).json({
            error: 'username, password, displayName은 필수입니다'
        });
    }

    // 비밀번호 최소 길이 (brute-force 방어)
    if (password.length < 8) {
        return res.status(400).json({ error: '비밀번호는 8자 이상이어야 합니다' });
    }

    // 중복 확인
    const existing = db.prepare('SELECT id FROM users WHERE username = ?').get(username);
    if (existing) {
        return res.status(409).json({ error: '이미 사용 중인 username입니다' });
    }

    try {
        // 비밀번호 해시 + 사용자 생성
        const passwordHash = await bcrypt.hash(password, 10);
        const result = db.prepare(
            'INSERT INTO users (username, password_hash, display_name) VALUES (?, ?, ?)'
        ).run(username, passwordHash, displayName);

        // JWT 발급
        const token = jwt.sign(
            { userId: result.lastInsertRowid, username },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            token,
            user: { id: result.lastInsertRowid, username, displayName }
        });
    } catch (err) {
        res.status(500).json({ error: '회원가입 처리 중 오류가 발생했습니다' });
    }
});

// 로그인
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = db.prepare(
            'SELECT id, username, password_hash, display_name FROM users WHERE username = ?'
        ).get(username);

        if (!user || !(await bcrypt.compare(password, user.password_hash))) {
            return res.status(401).json({
                error: 'username 또는 password가 올바르지 않습니다'
            });
        }

        const token = jwt.sign(
            { userId: user.id, username: user.username },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            token,
            user: { id: user.id, username: user.username, displayName: user.display_name }
        });
    } catch (err) {
        res.status(500).json({ error: '로그인 처리 중 오류가 발생했습니다' });
    }
});

module.exports = router;
