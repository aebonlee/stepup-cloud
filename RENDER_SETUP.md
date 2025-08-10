# 🚀 Render 무료 배포 가이드

## Render로 백엔드 + PostgreSQL 무료 배포하기

### 1. Render 계정 생성
1. [Render.com](https://render.com) 가입
2. GitHub 계정으로 로그인

### 2. Web Service 생성
1. Dashboard → "New" → "Web Service"
2. GitHub 저장소 `aebonlee/stepup-cloud` 연결
3. 설정:
   - **Name**: `stepup-cloud-backend`
   - **Runtime**: `Node`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Plan**: `Free`

### 3. 환경변수 설정
**Environment Variables**에 다음 추가:
```
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key-here-make-it-very-long-and-random
PORT=10000
DATABASE_URL=[자동으로 설정됨]
```

### 4. PostgreSQL 데이터베이스 생성
1. Dashboard → "New" → "PostgreSQL"
2. 설정:
   - **Name**: `stepup-cloud-db`
   - **Database Name**: `stepup_cloud`
   - **Plan**: `Free`

### 5. 데이터베이스 연결
1. PostgreSQL 생성 후 **Internal Database URL** 복사
2. Web Service의 Environment Variables에 추가:
   ```
   DATABASE_URL=[복사한 Internal Database URL]
   ```

### 6. 자동 배포 설정 (선택사항)
**GitHub Actions**에서 자동 배포하려면:

Repository → Settings → Secrets에 추가:
- `RENDER_API_KEY`: Render Account Settings → API Keys에서 생성
- `RENDER_SERVICE_ID`: Web Service URL에서 srv-xxx 부분

### 7. 배포 확인
배포 완료 후 다음 URL에서 확인:
- **백엔드**: `https://stepup-cloud-backend.onrender.com/api/health`
- **프론트엔드**: `https://aebonlee.github.io/stepup-cloud`

## 🔧 주요 특징

### ✅ 장점:
- **완전 무료**: 750시간/월 (충분함)
- **PostgreSQL 포함**: 무료 DB 제공
- **자동 SSL**: HTTPS 지원
- **쉬운 설정**: GitHub 연동

### ⚠️ 주의사항:
- **Cold Start**: 15분 비활성 시 슬립 모드
- **빌드 시간**: 매 배포마다 빌드 필요
- **대역폭 제한**: 100GB/월

## 🚀 배포 상태

### 현재 설정:
- **프론트엔드**: GitHub Pages (`https://aebonlee.github.io/stepup-cloud`)
- **백엔드**: Render (`https://stepup-cloud-backend.onrender.com`)
- **데이터베이스**: PostgreSQL (Render)

### 자동 배포:
- `main` 브랜치 푸시 → GitHub Actions → 자동 배포
- 프론트엔드와 백엔드 동시 업데이트
- 환경별 API URL 자동 설정