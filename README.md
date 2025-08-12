# 🚀 스텝업클라우드 (StepUp Cloud)

[![Deploy to GitHub Pages](https://github.com/aebonlee/stepup-cloud/actions/workflows/deploy.yml/badge.svg)](https://github.com/aebonlee/stepup-cloud/actions/workflows/deploy.yml)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18-green.svg)](https://nodejs.org/)

학생의 학습 루틴, 독서, 활동 등의 데이터를 기록·시각화하여, 학부모와 함께 자기주도 학습의 방향을 설계하고 성장을 지원하는 협력형 학습관리 서비스입니다. (Backend : https://dashboard.render.com/)

🌐 **[라이브 데모 보기](https://aebonlee.github.io/stepup-cloud)**

## 🎯 주요 기능

### 📚 학습시간 기록
- 날짜별, 과목별 학습시간 입력
- 문제집/교재별 상세 기록
- 과목별 학습량 원그래프 시각화
- 일일 학습시간 막대그래프 시각화

### 📖 독서 기록
- 책 제목, 카테고리, 독서감상문 기록
- 카테고리별 독서량 통계
- 월별 독서 추이 분석
- 독서감상문 작성 현황

### 🏆 입상 및 활동 정보
- 대회 입상 기록 관리
- 각종 활동 참여 이력
- 과목별 활동 분류
- 활동 시간 트래킹

### 📊 종합 대시보드
- 학습, 독서, 활동의 통합 분석
- 주간별 학습량 추이
- 월별 성과 분석
- 개인화된 성장 인사이트

## 📁 프로젝트 구조

```
stepup-cloud/
├── 📁 frontend/                           # React 프론트엔드
│   ├── 📁 public/                         # 정적 파일
│   ├── 📁 src/
│   │   ├── 📁 components/                  # 재사용 가능한 컴포넌트
│   │   │   ├── Auth.tsx                     # 로그인/회원가입 컴포넌트
│   │   │   └── Navigation.tsx               # 네비게이션 바
│   │   ├── 📁 pages/                       # 페이지 컴포넌트
│   │   │   ├── StudyPage.tsx                # 학습 기록 페이지
│   │   │   ├── ReadingPage.tsx              # 독서 기록 페이지
│   │   │   ├── ActivitiesPage.tsx           # 활동/입상 페이지
│   │   │   └── DashboardPage.tsx            # 종합 대시보드
│   │   ├── App.tsx                          # 메인 앱 컴포넌트
│   │   └── index.tsx                        # 앱 진입점
│   ├── package.json
│   ├── tailwind.config.js                   # Tailwind CSS 설정
│   └── craco.config.js                      # CRACO 설정
├── 📁 backend/                             # Node.js 백엔드
│   ├── server.js                            # Express 서버
│   ├── package.json
│   └── stepup_cloud.db                      # SQLite 데이터베이스
├── 📁 .github/
│   └── 📁 workflows/
│       └── deploy.yml                       # GitHub Actions 워크플로우
├── .gitignore
└── README.md
```

## 🛠 기술 스택

### Frontend
- **React 18** with TypeScript
- **React Router** for navigation
- **Chart.js & React-Chartjs-2** for data visualization
- **Tailwind CSS** for styling
- **Axios** for API communication

### Backend
- **Node.js** with Express
- **SQLite** database
- **JWT** authentication
- **bcryptjs** for password hashing

## 🚀 설치 및 실행

### 필수 요구사항
- Node.js 16+
- npm or yarn

### 백엔드 서버 실행

```bash
# 백엔드 디렉토리로 이동
cd backend

# 의존성 설치
npm install

# 서버 실행
npm start
```

백엔드 서버는 `http://localhost:5000`에서 실행됩니다.

### 프론트엔드 실행

```bash
# 프론트엔드 디렉토리로 이동
cd frontend

# 의존성 설치
npm install

# 개발 서버 실행
npm start
```

프론트엔드는 `http://localhost:3000`에서 실행됩니다.

  📱 프론트페이지 테스트 방법:

  1. 사이트 접속: https://aebonlee.github.io/stepup-cloud (약 2-3분 후 배포 완료)
  2. 임시 로그인 계정:
    - 이메일: test@sample.com
    - 비밀번호: 1234
  3. 내부 페이지 기능:
    - 📚 학습 기록 페이지
    - 📖 독서 기록 페이지
    - 🏆 입상/활동 기록 페이지
    - 📊 통계 및 차트 페이지

## 📱 사용법

### 1. 회원가입 및 로그인
- 이메일과 비밀번호로 간단한 회원가입
- 로그인 후 자동으로 대시보드로 이동

### 2. 학습 기록
- **학습** 메뉴에서 날짜, 과목, 교재, 학습시간 입력
- 실시간으로 과목별 통계 확인
- 최근 학습 기록 리스트 확인

### 3. 독서 기록
- **독서** 메뉴에서 책 제목, 카테고리, 감상문 입력
- 카테고리별 독서 분포 확인
- 독서 기록 클릭하여 감상문 상세보기

### 4. 활동/입상 기록
- **활동** 메뉴에서 활동과 입상을 구분하여 입력
- 과목별 활동 분류
- 월별 활동량 추이 확인

### 5. 통합 대시보드
- **통계** 메뉴에서 모든 데이터의 종합 분석
- 개인화된 성장 인사이트 제공
- 최근 활동 타임라인

## 📊 데이터베이스 구조

### users
- 사용자 계정 정보 (이메일, 암호화된 비밀번호)

### study_records
- 학습 기록 (날짜, 과목, 교재, 학습시간)

### reading_records
- 독서 기록 (날짜, 책제목, 카테고리, 감상문)

### awards_activities
- 입상/활동 기록 (날짜, 제목, 유형, 과목, 시간)

 ## 🆓 무료 백엔드 서비스 옵션

 ** 1. Render (추천)** ⭐

  - 무료 플랜: 750시간/월 (충분함)
  - 데이터베이스: PostgreSQL 무료 제공
  - 장점: 쉬운 설정, 자동 배포, SSL 지원
  - 단점: Cold start 지연

 ** 2. Railway**

  - 무료 플랜: $5 크레딧/월
  - 데이터베이스: PostgreSQL, MySQL 지원
  - 장점: 빠른 성능, 좋은 DX

  **3. Vercel + PlanetScale**

  - Vercel: 서버리스 함수 무료
  - PlanetScale: MySQL 호환 무료 DB
  - 장점: 글로벌 CDN, 빠른 성능

 ** 4. Supabase (추천) ⭐⭐
**
  - 무료 플랜: PostgreSQL + API + Auth
  - 장점: 완전한 BaaS, 실시간 기능
  - 특징: Firebase 대안, RESTful API 자동 생성

  Render를 사용해서 백엔드를 배포하고 PostgreSQL 연동하겠습니다!
  
  ---

## 🎨 디자인 특징

- **파스텔톤 컬러**: 아이보리, 하늘, 민트 등 따뜻하고 안정적인 색상
- **반응형 디자인**: 모바일, 태블릿, 데스크톱 모든 환경 지원
- **직관적 UI**: 입력 영역과 통계 영역의 명확한 구분
- **부드러운 애니메이션**: 사용자 경험을 향상시키는 마이크로 인터랙션

## 🔒 보안

- JWT 토큰 기반 인증
- bcryptjs를 이용한 비밀번호 해싱
- CORS 설정으로 안전한 API 통신

## 🚀 배포

### 자동 배포 시스템

이 프로젝트는 GitHub Actions를 통해 프론트엔드와 백엔드를 각각 자동 배포합니다:

- **프론트엔드**: GitHub Pages (https://aebonlee.github.io/stepup-cloud)
- **백엔드**: Railway (https://stepup-cloud-uh79.onrender.com)

#### 배포 과정:
1. `main` 브랜치에 푸시하면 자동으로 배포 시작
2. 프론트엔드는 GitHub Pages에 배포
3. 백엔드는 Railway에 배포
4. API 연동은 자동으로 프로덕션 URL로 설정

#### Railway 백엔드 설정:
1. Railway 계정 생성 (https://railway.app)
2. GitHub 저장소 연결
3. 환경변수 설정:
   - `JWT_SECRET`: 강력한 비밀 키
   - `NODE_ENV`: production
4. 자동 배포 활성화

#### GitHub Pages 설정:
- Repository → Settings → Pages
- Source: "GitHub Actions" 선택
- Custom domain: aebonlee.github.io (자동 설정됨)

### 로컬 프로덕션 빌드

```bash
# 프론트엔드 빌드
cd frontend
npm run build

# 백엔드 서버 실행
cd ../backend
npm start
```

### 환경 변수 설정

개발용 `.env` 파일 생성 (선택사항):
```bash
# backend/.env
PORT=5000
JWT_SECRET=your-secret-key-here
DB_PATH=./stepup_cloud.db
```

## 📞 지원

문의사항이 있으시면 다음으로 연락해주세요:
- 이메일: aebon@naver.com
- 웹사이트: https://aebonlee.github.io/stepup-cloud/

## 📄 라이센스

이 프로젝트는 MIT 라이센스를 따릅니다.

---

**스텝업클라우드**로 자기주도 학습의 여정을 시작해보세요! 📚✨
