CREATE TABLE IF NOT EXISTS users (
    id            INTEGER  PRIMARY KEY AUTOINCREMENT,
    username      TEXT     UNIQUE NOT NULL,
    password_hash TEXT     NOT NULL,
    display_name  TEXT     NOT NULL,
    created_at    DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS questions (
    id          INTEGER  PRIMARY KEY AUTOINCREMENT,
    owner_id    INTEGER  NOT NULL,
    content     TEXT     NOT NULL CHECK(length(content) <= 300),
    is_answered BOOLEAN  DEFAULT 0,
    is_pinned   BOOLEAN  DEFAULT 0,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS answers (
    id          INTEGER  PRIMARY KEY AUTOINCREMENT,
    question_id INTEGER  UNIQUE NOT NULL,
    content     TEXT     NOT NULL,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);
