# 🚀 스텝업클라우드 배포 가이드

## 개요
이 문서는 스텝업클라우드를 GitHub Pages와 Render를 사용하여 배포하는 방법을 설명합니다.

## 배포 아키텍처
- **프론트엔드**: GitHub Pages (aebonlee.github.io/stepup-cloud)
- **백엔드**: Render (stepup-cloud-uh79.onrender.com)
- **자동 배포**: GitHub Actions

## 1. GitHub Pages 설정

### Repository 설정:
1. GitHub Repository → Settings → Pages
2. Source: "GitHub Actions" 선택
3. Custom domain 설정 (선택사항)

### 도메인 설정:
- 기본: `https://username.github.io/repository-name`
- 커스텀: `https://aebonlee.github.io/stepup-cloud`

## 2. Render 백엔드 설정

### Render 계정 설정:
1. [Render.app](https://render.com) 접속
2. GitHub으로 로그인
3. 새 프로젝트 생성

### 프로젝트 연결:
1. "Deploy from GitHub repo" 선택
2. `stepup-cloud` 저장소 선택
3. Service 이름: `stepup-cloud-backend`

### 환경변수 설정:
```
JWT_SECRET=your-super-secret-jwt-key-here-make-it-very-long-and-random
NODE_ENV=production
PORT=5002
```

### 배포 설정:
- Root Directory: `/backend`
- Build Command: `npm install`
- Start Command: `node server.js`

## 3. GitHub Actions 시크릿 설정

Repository → Settings → Secrets and variables → Actions에서 다음 시크릿 추가:

- `RAILWAY_TOKEN`: Render Dashboard → Account → Tokens에서 생성

## 4. 배포 프로세스

### 자동 배포:
1. `main` 브랜치에 코드 푸시
2. GitHub Actions가 자동으로 빌드 시작
3. 프론트엔드: GitHub Pages에 배포
4. 백엔드: Render에 배포

### 수동 배포:
Repository → Actions → "Deploy Frontend to GitHub Pages and Backend to Render" → "Run workflow"

## 5. 환경별 URL

### Development:
- 프론트엔드: `http://localhost:3000`
- 백엔드: `http://localhost:5002`

### Production:
- 프론트엔드: `https://aebonlee.github.io/stepup-cloud`
- 백엔드: `https://stepup-cloud-uh79.onrender.com`

## 6. 트러블슈팅

### CORS 에러:
- Render 백엔드에서 프론트엔드 도메인이 CORS 허용 목록에 있는지 확인

### 404 에러:
- GitHub Pages에서 React Router 사용 시 발생
- `404.html` 파일이 자동으로 생성되어 해결

### API 연결 실패:
- 환경변수 `REACT_APP_API_URL`이 올바르게 설정되었는지 확인
- Network 탭에서 API 요청 URL 확인

## 7. 모니터링

### 백엔드 상태 확인:
```bash
curl https://stepup-cloud-uh79.onrender.com/api/health
```

### 프론트엔드 접속:
```bash
curl -I https://aebonlee.github.io/stepup-cloud
```

## 8. 업데이트 방법

1. 코드 수정
2. Git commit & push to main
3. GitHub Actions 자동 배포 확인
4. 배포 완료 후 사이트 접속 테스트

---

**주의사항**: 
- JWT_SECRET은 반드시 강력한 랜덤 문자열로 설정
- 프로덕션에서는 실제 도메인 사용 권장
- 데이터베이스는 Render에서 자동으로 SQLite 파일로 관리됩니다