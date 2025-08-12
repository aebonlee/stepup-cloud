const sqlite3 = require('sqlite3').verbose();
const { Pool } = require('pg');
const path = require('path');

// 데이터베이스 설정
const isProduction = process.env.NODE_ENV === 'production';
const DATABASE_URL = process.env.DATABASE_URL;

let db;

// DATABASE_URL 유효성 검사
const isValidDatabaseUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === 'postgresql:' || parsedUrl.protocol === 'postgres:';
  } catch {
    return false;
  }
};

if (isProduction && isValidDatabaseUrl(DATABASE_URL)) {
  // PostgreSQL (Production - Render)
  console.log('🐘 PostgreSQL 데이터베이스에 연결 중...');
  console.log('🔗 DATABASE_URL 확인됨');
  console.log('🔧 환경변수 상태:', {
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL_EXISTS: !!DATABASE_URL,
    DATABASE_URL_PREVIEW: DATABASE_URL ? DATABASE_URL.slice(0, 20) + '...' : null
  });
  
  try {
    const pool = new Pool({
      connectionString: DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    });

    // 연결 테스트
    pool.connect((err, client, release) => {
      if (err) {
        console.error('PostgreSQL 연결 실패:', err.message);
        console.log('🔄 SQLite로 폴백합니다...');
        setupSQLiteDatabase();
        return;
      }
      console.log('✅ PostgreSQL 연결 성공!');
      if (client) release();
    });

    db = {
      // PostgreSQL 쿼리 래퍼
      run: (query, params, callback) => {
        const pgQuery = query.replace(/\?/g, (_, offset) => {
          const index = query.slice(0, offset).split('?').length;
          return `$${index}`;
        });
        
        pool.query(pgQuery, params, (err, result) => {
          if (callback) {
            if (err) {
              callback(err);
            } else {
              // SQLite 스타일의 this 객체 시뮬레이션
              const context = {
                lastID: result.rows.length > 0 ? result.rows[0].id : null
              };
              callback.call(context, null);
            }
          }
        });
      },

      get: (query, params, callback) => {
        const pgQuery = query.replace(/\?/g, (_, offset) => {
          const index = query.slice(0, offset).split('?').length;
          return `$${index}`;
        });
        
        pool.query(pgQuery, params, (err, result) => {
          if (callback) {
            callback(err, result && result.rows ? result.rows[0] : null);
          }
        });
      },

      all: (query, params, callback) => {
        const pgQuery = query.replace(/\?/g, (_, offset) => {
          const index = query.slice(0, offset).split('?').length;
          return `$${index}`;
        });
        
        pool.query(pgQuery, params, (err, result) => {
          if (callback) {
            callback(err, result && result.rows ? result.rows : []);
          }
        });
      },

      serialize: (callback) => {
        if (callback) callback();
      }
    };
  } catch (error) {
    console.error('PostgreSQL 설정 오류:', error.message);
    console.log('🔄 SQLite로 폴백합니다...');
    setupSQLiteDatabase();
  }
} else {
  setupSQLiteDatabase();
}

function setupSQLiteDatabase() {
  // SQLite (Development)
  console.log('📁 SQLite 데이터베이스에 연결 중...');
  
  const dbPath = path.join(__dirname, 'stepup_cloud.db');
  db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('데이터베이스 연결 오류:', err.message);
      process.exit(1);
    }
    console.log('SQLite 데이터베이스에 연결되었습니다.');
  });
}

// 테이블 생성 (PostgreSQL과 SQLite 호환)
const initializeDatabase = () => {
  const queries = isProduction && DATABASE_URL ? [
    // PostgreSQL 쿼리
    `CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    
    `CREATE TABLE IF NOT EXISTS study_records (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      date DATE NOT NULL,
      subject VARCHAR(100) NOT NULL,
      book VARCHAR(255),
      minutes INTEGER NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    `CREATE TABLE IF NOT EXISTS reading_records (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      date DATE NOT NULL,
      book_title VARCHAR(255) NOT NULL,
      review TEXT,
      category VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    `CREATE TABLE IF NOT EXISTS awards_activities (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      date DATE NOT NULL,
      title VARCHAR(255) NOT NULL,
      type VARCHAR(50) NOT NULL,
      subject VARCHAR(100),
      hours INTEGER,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`
  ] : [
    // SQLite 쿼리
    `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,

    `CREATE TABLE IF NOT EXISTS study_records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      date TEXT NOT NULL,
      subject TEXT NOT NULL,
      book TEXT,
      minutes INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )`,

    `CREATE TABLE IF NOT EXISTS reading_records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      date TEXT NOT NULL,
      book_title TEXT NOT NULL,
      review TEXT,
      category TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )`,

    `CREATE TABLE IF NOT EXISTS awards_activities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      date TEXT NOT NULL,
      title TEXT NOT NULL,
      type TEXT NOT NULL,
      subject TEXT,
      hours INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )`
  ];

  db.serialize(() => {
    queries.forEach(query => {
      db.run(query, (err) => {
        if (err) {
          console.error('테이블 생성 오류:', err.message);
        }
      });
    });
  });
};

module.exports = { db, initializeDatabase };