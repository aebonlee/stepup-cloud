# 🛠 개발자 가이드

## 개발 환경 설정

### 필수 요구사항
- Node.js 18+ 
- npm 8+
- Git

### 로컬 개발 환경 구축

1. **저장소 클론**
```bash
git clone https://github.com/yourusername/stepup-cloud.git
cd stepup-cloud
```

2. **백엔드 설정**
```bash
cd backend
npm install
npm start
```
- 서버: http://localhost:5000

3. **프론트엔드 설정**
```bash
cd frontend
npm install
npm start
```
- 웹앱: http://localhost:3000

## API 엔드포인트

### 인증
- `POST /api/auth/register` - 회원가입
- `POST /api/auth/login` - 로그인

### 학습 기록
- `GET /api/study-records` - 학습 기록 조회
- `POST /api/study-records` - 학습 기록 생성
- `GET /api/stats/study` - 학습 통계

### 독서 기록
- `GET /api/reading-records` - 독서 기록 조회
- `POST /api/reading-records` - 독서 기록 생성
- `GET /api/stats/reading` - 독서 통계

### 활동/입상
- `GET /api/awards-activities` - 활동/입상 기록 조회
- `POST /api/awards-activities` - 활동/입상 기록 생성

## 데이터베이스 스키마

### users
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | INTEGER | 기본키 |
| email | TEXT | 이메일 (유니크) |
| password | TEXT | 해시된 비밀번호 |
| created_at | DATETIME | 생성일시 |

### study_records
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | INTEGER | 기본키 |
| user_id | INTEGER | 사용자 외래키 |
| date | TEXT | 학습 날짜 |
| subject | TEXT | 과목 |
| book | TEXT | 교재명 |
| minutes | INTEGER | 학습시간(분) |

### reading_records
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | INTEGER | 기본키 |
| user_id | INTEGER | 사용자 외래키 |
| date | TEXT | 독서 날짜 |
| book_title | TEXT | 책 제목 |
| review | TEXT | 독서감상문 |
| category | TEXT | 카테고리 |

### awards_activities
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | INTEGER | 기본키 |
| user_id | INTEGER | 사용자 외래키 |
| date | TEXT | 활동/입상 날짜 |
| title | TEXT | 활동/입상명 |
| type | TEXT | 유형 (활동/입상) |
| subject | TEXT | 과목/분야 |
| hours | INTEGER | 활동시간 |

## 컴포넌트 구조

### 페이지 컴포넌트
- `StudyPage` - 학습 기록 및 통계
- `ReadingPage` - 독서 기록 및 통계  
- `ActivitiesPage` - 활동/입상 기록
- `DashboardPage` - 종합 대시보드

### 공통 컴포넌트
- `Auth` - 로그인/회원가입
- `Navigation` - 네비게이션 바

## 스타일링

### Tailwind CSS 클래스
- `btn-primary` - 기본 버튼
- `form-input` - 입력 필드
- `card-hover` - 호버 효과가 있는 카드

### 색상 팔레트
- Primary: `blue-500`
- Success: `green-500` 
- Warning: `yellow-500`
- Danger: `red-500`
- Purple: `purple-500`

## 배포

### GitHub Actions
- `.github/workflows/deploy.yml` 파일로 자동 배포
- `main` 브랜치 푸시 시 GitHub Pages 배포

### 수동 배포
```bash
cd frontend
npm run deploy
```

## 개발 팁

### 디버깅
- React DevTools 사용
- 브라우저 개발자 도구 Network 탭에서 API 호출 확인

### 코드 포맷팅
- Prettier와 ESLint 설정 권장
- VS Code Extensions: ES7+ React/Redux/React-Native snippets

### 성능 최적화
- Chart.js 렌더링 최적화
- React.memo 사용 고려
- 이미지 최적화

## 문제 해결

### 일반적인 오류
1. **CORS 오류**: 백엔드 서버가 실행 중인지 확인
2. **빌드 오류**: node_modules 삭제 후 재설치
3. **차트 렌더링 오류**: Chart.js 등록 확인

### 개발 도구
- **Frontend**: React DevTools, Redux DevTools
- **Backend**: Postman/Insomnia for API testing
- **Database**: DB Browser for SQLite

## 기여 가이드

1. Fork 후 feature branch 생성
2. 변경사항 구현
3. 테스트 작성 및 실행
4. Pull Request 생성

## 라이센스

MIT License - 자세한 내용은 LICENSE 파일 참조