import express from 'express'
import db from './db.js'

const app = express()
const PORT = process.env.PORT ?? 4000

app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

app.get('/api/questions', (_req, res) => {
  const rows = db.prepare('SELECT * FROM questions ORDER BY created_at DESC').all()
  res.json(rows)
})

app.post('/api/questions', (req, res) => {
  const { content } = req.body
  if (!content?.trim()) return res.status(400).json({ error: 'content is required' })
  const stmt = db.prepare('INSERT INTO questions (content) VALUES (?)')
  const result = stmt.run(content.trim())
  res.status(201).json({ id: result.lastInsertRowid, content: content.trim() })
})

app.get('/api/questions/:id/answers', (req, res) => {
  const answers = db
    .prepare('SELECT * FROM answers WHERE question_id = ? ORDER BY created_at ASC')
    .all(req.params.id)
  res.json(answers)
})

app.post('/api/questions/:id/answers', (req, res) => {
  const { content } = req.body
  if (!content?.trim()) return res.status(400).json({ error: 'content is required' })
  const stmt = db.prepare('INSERT INTO answers (question_id, content) VALUES (?, ?)')
  const result = stmt.run(Number(req.params.id), content.trim())
  res.status(201).json({ id: result.lastInsertRowid, content: content.trim() })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
