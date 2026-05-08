const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

// DB_PATH 환경변수가 있으면 사용 (테스트 시 :memory: 를 주입)
const DB_PATH = process.env.DB_PATH || path.join(__dirname, '../../data/askme.db');
const SCHEMA_PATH = path.join(__dirname, 'schema.sql');

const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(DB_PATH);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

const schema = fs.readFileSync(SCHEMA_PATH, 'utf-8');
db.exec(schema);

// 기존 DB에 like_count 컬럼이 없으면 추가
const cols = db.pragma('table_info(questions)').map(c => c.name);
if (!cols.includes('like_count')) {
    db.exec('ALTER TABLE questions ADD COLUMN like_count INTEGER DEFAULT 0');
}

module.exports = db;
