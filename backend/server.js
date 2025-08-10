const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5002;
const JWT_SECRET = process.env.JWT_SECRET || 'stepup-cloud-secret-key-2024';

// CORS 설정을 더 구체적으로
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://localhost:3003', 'https://aebonlee.github.io'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));

// 요청 로깅 미들웨어
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// 데이터베이스 연결
const dbPath = path.join(__dirname, 'stepup_cloud.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('데이터베이스 연결 오류:', err.message);
    process.exit(1);
  }
  console.log('SQLite 데이터베이스에 연결되었습니다.');
});

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

  jwt.verify(token, JWT_SECRET, (err, user) => {
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
        
        const token = jwt.sign({ id: this.lastID, email }, JWT_SECRET, { expiresIn: '24h' });
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

      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });
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

// 헬스 체크 엔드포인트
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: '스텝업클라우드 API 서버가 정상 작동 중입니다.',
    timestamp: new Date().toISOString()
  });
});

// 404 핸들러
app.use('*', (req, res) => {
  res.status(404).json({ error: '요청한 API 엔드포인트를 찾을 수 없습니다.' });
});

// 전역 오류 핸들러
app.use((error, req, res, next) => {
  console.error('서버 오류:', error);
  res.status(500).json({ 
    error: '내부 서버 오류가 발생했습니다.',
    message: process.env.NODE_ENV === 'development' ? error.message : '서버 오류'
  });
});

// 데이터베이스 종료 처리
process.on('SIGINT', () => {
  console.log('\n서버를 종료합니다...');
  db.close((err) => {
    if (err) {
      console.error('데이터베이스 종료 오류:', err.message);
    } else {
      console.log('데이터베이스 연결이 종료되었습니다.');
    }
    process.exit(0);
  });
});

const server = app.listen(PORT, () => {
  console.log(`🚀 스텝업클라우드 API 서버가 포트 ${PORT}에서 실행 중입니다.`);
  console.log(`📊 헬스 체크: http://localhost:${PORT}/api/health`);
  console.log(`🗄️  데이터베이스: ${dbPath}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ 포트 ${PORT}이 이미 사용 중입니다. 다른 포트를 사용해주세요.`);
  } else {
    console.error('서버 시작 오류:', err);
  }
  process.exit(1);
});