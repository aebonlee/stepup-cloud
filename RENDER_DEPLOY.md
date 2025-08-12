# Render 배포 가이드

## 1. Render 계정 생성 및 서비스 설정

1. [Render](https://render.com)에 계정을 생성합니다.
2. 새 Web Service를 생성합니다.
3. GitHub 저장소를 연결합니다.

## 2. 배포 설정

### Build & Deploy 설정
- **Root Directory**: `backend`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

### 환경변수 설정
Render 대시보드의 Environment Variables에서 다음 변수들을 설정하세요:

```
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
FRONTEND_URL=https://aebonlee.github.io
```

## 3. 백엔드 수정사항

다음 수정사항들이 Render 배포를 위해 적용되었습니다:

### server.js 변경사항:
1. **CORS 설정**: 환경변수 `FRONTEND_URL` 지원 추가
2. **데이터베이스 경로**: `DATABASE_URL` 환경변수 지원
3. **서버 바인딩**: `0.0.0.0`으로 바인딩하여 외부 접근 허용
4. **환경 로깅**: 현재 환경 표시

### package.json 변경사항:
1. **Node.js 버전**: 18.0.0 이상 요구
2. **패키지명**: `stepup-cloud-backend`로 변경
3. **빌드 스크립트**: 추가
4. **nodemon**: devDependencies로 이동

## 4. 데이터베이스 관리

- SQLite 데이터베이스는 Render의 영구 스토리지에 저장됩니다.
- 첫 배포시 자동으로 테이블이 생성됩니다.
- 데이터베이스 백업이 필요한 경우 Render의 영구 디스크 서비스를 고려하세요.

## 5. 프론트엔드 연동

프론트엔드의 API 엔드포인트를 Render에서 제공하는 URL로 변경해야 합니다:

```javascript
// 예시: config/api.ts
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-app-name.onrender.com/api'
  : 'http://localhost:5003/api';
```

## 6. 배포 후 확인사항

1. 헬스체크 엔드포인트 확인: `https://your-app-name.onrender.com/api/health`
2. CORS 설정 확인
3. 데이터베이스 연결 확인
4. 사용자 등록/로그인 테스트

## 7. 주의사항

- **무료 플랜**: 15분 비활성 후 서버가 슬립 모드로 전환됩니다.
- **Cold Start**: 첫 요청시 응답이 느릴 수 있습니다.
- **환경변수**: JWT_SECRET은 반드시 강력한 키로 변경하세요.
- **HTTPS**: Render는 자동으로 HTTPS를 제공합니다.

## 8. 모니터링

- Render 대시보드에서 로그 확인 가능
- 메트릭스 및 성능 모니터링 제공
- 오류 발생시 이메일 알림 설정 가능