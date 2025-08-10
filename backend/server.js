const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('stepup_cloud.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS study_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    date TEXT NOT NULL,
    subject TEXT NOT NULL,
    book TEXT,
    minutes INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS reading_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    date TEXT NOT NULL,
    book_title TEXT NOT NULL,
    review TEXT,
    category TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS awards_activities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    date TEXT NOT NULL,
    title TEXT NOT NULL,
    type TEXT NOT NULL,
    subject TEXT,
    hours INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
  )`);
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, 'your-secret-key', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

app.post('/api/auth/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    db.run(
      'INSERT INTO users (email, password) VALUES (?, ?)',
      [email, hashedPassword],
      function(err) {
        if (err) {
          return res.status(400).json({ error: '사용자 등록에 실패했습니다.' });
        }
        
        const token = jwt.sign({ id: this.lastID, email }, 'your-secret-key');
        res.json({ token, user: { id: this.lastID, email } });
      }
    );
  } catch (error) {
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  db.get(
    'SELECT * FROM users WHERE email = ?',
    [email],
    async (err, user) => {
      if (err) {
        return res.status(500).json({ error: '서버 오류가 발생했습니다.' });
      }

      if (!user) {
        return res.status(400).json({ error: '사용자를 찾을 수 없습니다.' });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(400).json({ error: '비밀번호가 틀렸습니다.' });
      }

      const token = jwt.sign({ id: user.id, email: user.email }, 'your-secret-key');
      res.json({ token, user: { id: user.id, email: user.email } });
    }
  );
});

app.post('/api/study-records', authenticateToken, (req, res) => {
  const { date, subject, book, minutes } = req.body;
  
  db.run(
    'INSERT INTO study_records (user_id, date, subject, book, minutes) VALUES (?, ?, ?, ?, ?)',
    [req.user.id, date, subject, book, minutes],
    function(err) {
      if (err) {
        return res.status(500).json({ error: '학습 기록 저장에 실패했습니다.' });
      }
      res.json({ id: this.lastID, message: '학습 기록이 저장되었습니다.' });
    }
  );
});

app.get('/api/study-records', authenticateToken, (req, res) => {
  db.all(
    'SELECT * FROM study_records WHERE user_id = ? ORDER BY date DESC',
    [req.user.id],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: '학습 기록을 불러올 수 없습니다.' });
      }
      res.json(rows);
    }
  );
});

app.post('/api/reading-records', authenticateToken, (req, res) => {
  const { date, book_title, review, category } = req.body;
  
  db.run(
    'INSERT INTO reading_records (user_id, date, book_title, review, category) VALUES (?, ?, ?, ?, ?)',
    [req.user.id, date, book_title, review, category],
    function(err) {
      if (err) {
        return res.status(500).json({ error: '독서 기록 저장에 실패했습니다.' });
      }
      res.json({ id: this.lastID, message: '독서 기록이 저장되었습니다.' });
    }
  );
});

app.get('/api/reading-records', authenticateToken, (req, res) => {
  db.all(
    'SELECT * FROM reading_records WHERE user_id = ? ORDER BY date DESC',
    [req.user.id],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: '독서 기록을 불러올 수 없습니다.' });
      }
      res.json(rows);
    }
  );
});

app.post('/api/awards-activities', authenticateToken, (req, res) => {
  const { date, title, type, subject, hours } = req.body;
  
  db.run(
    'INSERT INTO awards_activities (user_id, date, title, type, subject, hours) VALUES (?, ?, ?, ?, ?, ?)',
    [req.user.id, date, title, type, subject, hours],
    function(err) {
      if (err) {
        return res.status(500).json({ error: '입상/활동 기록 저장에 실패했습니다.' });
      }
      res.json({ id: this.lastID, message: '입상/활동 기록이 저장되었습니다.' });
    }
  );
});

app.get('/api/awards-activities', authenticateToken, (req, res) => {
  db.all(
    'SELECT * FROM awards_activities WHERE user_id = ? ORDER BY date DESC',
    [req.user.id],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: '입상/활동 기록을 불러올 수 없습니다.' });
      }
      res.json(rows);
    }
  );
});

app.get('/api/stats/study', authenticateToken, (req, res) => {
  const queries = {
    daily: `SELECT date, SUM(minutes) as total_minutes FROM study_records WHERE user_id = ? GROUP BY date ORDER BY date DESC LIMIT 30`,
    subjects: `SELECT subject, SUM(minutes) as total_minutes FROM study_records WHERE user_id = ? GROUP BY subject`,
    weekly: `SELECT strftime('%Y-%W', date) as week, SUM(minutes) as total_minutes FROM study_records WHERE user_id = ? GROUP BY week ORDER BY week DESC`
  };

  Promise.all([
    new Promise((resolve, reject) => {
      db.all(queries.daily, [req.user.id], (err, rows) => err ? reject(err) : resolve(rows));
    }),
    new Promise((resolve, reject) => {
      db.all(queries.subjects, [req.user.id], (err, rows) => err ? reject(err) : resolve(rows));
    }),
    new Promise((resolve, reject) => {
      db.all(queries.weekly, [req.user.id], (err, rows) => err ? reject(err) : resolve(rows));
    })
  ])
  .then(([daily, subjects, weekly]) => {
    res.json({ daily, subjects, weekly });
  })
  .catch(err => {
    res.status(500).json({ error: '통계를 불러올 수 없습니다.' });
  });
});

app.get('/api/stats/reading', authenticateToken, (req, res) => {
  const queries = {
    monthly: `SELECT strftime('%Y-%m', date) as month, COUNT(*) as book_count FROM reading_records WHERE user_id = ? GROUP BY month ORDER BY month DESC`,
    categories: `SELECT category, COUNT(*) as book_count FROM reading_records WHERE user_id = ? GROUP BY category`,
    reviews: `SELECT COUNT(*) as total_reviews FROM reading_records WHERE user_id = ? AND review IS NOT NULL AND review != ''`
  };

  Promise.all([
    new Promise((resolve, reject) => {
      db.all(queries.monthly, [req.user.id], (err, rows) => err ? reject(err) : resolve(rows));
    }),
    new Promise((resolve, reject) => {
      db.all(queries.categories, [req.user.id], (err, rows) => err ? reject(err) : resolve(rows));
    }),
    new Promise((resolve, reject) => {
      db.get(queries.reviews, [req.user.id], (err, row) => err ? reject(err) : resolve(row));
    })
  ])
  .then(([monthly, categories, reviews]) => {
    res.json({ monthly, categories, totalReviews: reviews.total_reviews });
  })
  .catch(err => {
    res.status(500).json({ error: '독서 통계를 불러올 수 없습니다.' });
  });
});

app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});