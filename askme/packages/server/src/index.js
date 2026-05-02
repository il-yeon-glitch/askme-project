const express = require('express');
const authRouter = require('../routes/auth');
const questionsRouter = require('../routes/questions');
const myRouter = require('../routes/my');

const app = express();
const PORT = process.env.PORT ?? 4000;

app.use(express.json());
app.use('/api/auth', authRouter);
app.use('/api/questions', questionsRouter);
app.use('/api', questionsRouter);
app.use('/api/my', myRouter);

app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
