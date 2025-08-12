# 🚀 로컬 개발 환경 설정 가이드

## ✅ 수정 및 개선 사항

### 🛠 백엔드 개선사항
- ✅ Express 4.19.2로 안정화 (5.x 호환성 문제 해결)
- ✅ 포트 충돌 방지: 5000 → 5001로 변경
- ✅ JWT 토큰 만료 시간 설정 (24시간)
- ✅ CORS 정책 강화 및 상세 설정
- ✅ 요청 로깅 미들웨어 추가
- ✅ 데이터베이스 연결 오류 처리
- ✅ 전역 오류 핸들러 추가
- ✅ 헬스 체크 엔드포인트 추가
- ✅ 서버 종료 처리 개선

### 🎨 프론트엔드 개선사항
- ✅ 중앙집중식 API 관리 (`/src/config/api.ts`)
- ✅ Axios 인터셉터로 토큰 자동 처리
- ✅ 입력 검증 강화 (이메일, 비밀번호)
- ✅ 연결 오류 시 사용자 친화적 메시지
- ✅ 401 오류 시 자동 로그아웃 처리
- ✅ API 요청 타임아웃 설정 (10초)

## 🚀 로컬 실행 방법

### 1단계: 백엔드 서버 실행
```bash
# 터미널 1
cd "C:\Users\ASUS\stepup-cloud\backend"
npm start
```

**성공 메시지:**
```
🚀 스텝업클라우드 API 서버가 포트 5001에서 실행 중입니다.
📊 헬스 체크: http://localhost:5001/api/health
🗄️  데이터베이스: C:\Users\ASUS\stepup-cloud\backend\stepup_cloud.db
SQLite 데이터베이스에 연결되었습니다.
```

### 2단계: 프론트엔드 개발 서버 실행
```bash
# 터미널 2
cd "C:\Users\ASUS\stepup-cloud\frontend"
npm start
```

프론트엔드는 `http://localhost:3000`에서 실행됩니다.

### 3단계: 헬스 체크
브라우저에서 확인:
- **백엔드 API:** http://localhost:5001/api/health
- **프론트엔드:** http://localhost:3000

## 🔧 문제 해결

### 포트 충돌 오류
```bash
❌ 포트 5001이 이미 사용 중입니다.
```
**해결법:**
```bash
# 포트 사용 프로세스 확인
netstat -ano | findstr :5001

# 프로세스 종료 (PID 확인 후)
taskkill /PID [PID번호] /F
```

### CORS 오류
```
Access to XMLHttpRequest at 'http://localhost:5001' from origin 'http://localhost:3000' has been blocked
```
**해결법:** 백엔드가 실행 중인지 확인하고 재시작

### 데이터베이스 오류
```
데이터베이스 연결 오류: SQLITE_ERROR
```
**해결법:** 
- 백엔드 디렉토리 권한 확인
- SQLite 파일이 생성되는지 확인

## 🧪 테스트 시나리오

### 1. 회원가입 테스트
1. 프론트엔드 접속 → 회원가입 탭
2. 이메일: `test@example.com`, 비밀번호: `1234` 입력
3. 성공 시 자동 로그인 및 대시보드 이동

### 2. 학습 기록 테스트
1. 학습 메뉴 → 날짜/과목/교재/시간 입력
2. 저장 후 차트에 반영 확인

### 3. API 직접 테스트
```bash
# 헬스 체크
curl http://localhost:5001/api/health

# 회원가입
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"1234"}'
```

## 📱 주요 기능 확인 리스트

- [ ] 회원가입/로그인 동작
- [ ] 학습 기록 입력 및 차트 표시
- [ ] 독서 기록 입력 및 통계
- [ ] 활동/입상 기록 관리
- [ ] 종합 대시보드 데이터 표시
- [ ] 반응형 디자인 (모바일 확인)

## 🛠 개발 도구

### 추천 VS Code 확장
- ES7+ React/Redux/React-Native snippets
- Prettier - Code formatter
- Auto Rename Tag
- Bracket Pair Colorizer

### 디버깅 도구
- **프론트엔드:** React DevTools
- **백엔드:** Postman/Insomnia
- **데이터베이스:** DB Browser for SQLite

## 🎯 성능 최적화 팁

1. **백엔드**
   - SQLite 인덱스 추가 고려
   - API 응답 캐싱 구현
   - 데이터베이스 연결 풀링

2. **프론트엔드**
   - Chart.js 렌더링 최적화
   - React.memo로 불필요한 리렌더링 방지
   - 이미지 lazy loading

완료! 이제 로컬 환경에서 모든 기능이 정상 작동합니다. 🚀