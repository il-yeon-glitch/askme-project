const express = require('express');
const path = require('path');
const authRouter = require('../routes/auth');
const questionsRouter = require('../routes/questions');
const myRouter = require('../routes/my');

const app = express();

// 1. JSON 파싱
app.use(express.json());

// 2. API 라우트 (정적 파일보다 먼저 등록해야 /api/* 요청이 index.html로 가지 않음)
app.use('/api/auth', authRouter);
app.use('/api/questions', questionsRouter);
app.use('/api/my', myRouter);

app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
});

// 3. React 빌드 결과물 서빙 (packages/client/dist)
const clientDist = path.join(__dirname, '../../client/dist');
app.use(express.static(clientDist));

// 4. SPA 폴백: /api가 아닌 모든 경로를 index.html로 보내 React Router가 처리하게 함
app.get('*', (_req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
});

// 5. 전역 에러 핸들러: 스택 트레이스가 클라이언트에 노출되지 않도록 차단
// Express는 (err, req, res, next) 4개 인자일 때 에러 핸들러로 인식
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
    console.error(err);
    res.status(500).json({ error: '서버 오류가 발생했습니다' });
});

module.exports = app;
