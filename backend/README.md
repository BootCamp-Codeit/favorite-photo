# 📘 최애의 포토 API

이 프로젝트는 **포토카드 등록 / 마켓플레이스 판매·구매 / 랜덤 포인트 / 마이갤러리** 기능을 제공하는 백엔드입니다.

---

# 🚀 Base URL

- 모든 요청 및 응답은 **JSON** 형식입니다. (이미지 업로드는 `multipart/form-data`)
- 날짜·시간은 MySQL `DATETIME` 기준으로 내려가며, ISO 8601 문자열로 직렬화될 수 있습니다.
- 로컬 개발 기본 포트: **3000**

| 환경 | URL |
|------|-----|
| 로컬 | `http://localhost:3000` |
| 배포 | 팀에서 사용 중인 API 서버 URL (Render 등) |

---

# 🧱 API 구조

API는 다음 도메인으로 구성됩니다:

| 영역 | Prefix | 기능 |
|------|--------|------|
| **User** | `/users` | 로그인·로그아웃, 내 정보, **보유 카드 목록** |
| **PhotoCard** | `/api/photo-cards` | 포토카드 생성·조회·수정 |
| **Upload** | `/api/uploads` | 포토카드 이미지 업로드 |
| **Listing** | `/api/listings` | 마켓 **판매 등록**·목록·수정·취소 |
| **Sell** | `/api/sell` | 인증 사용자 **판매 요청** 등록 |
| **Purchase** | `/api/purchases` | **포인트 결제** 구매·구매/판매 내역 |
| **PointBoxDraw** | `/api/point-box-draws` | **랜덤 포인트** 뽑기·포인트/내역 조회 |

정적 이미지 파일:

```
GET /public/{...}   → public/ 폴더에 저장된 업로드 이미지
```

API 예시·테스트 파일:

```
http/
 ├─ photocard.http
 ├─ listing.http
 ├─ purchase.http
 └─ point_box_draw.http
```

> 이 프로젝트 BE에는 Swagger UI가 없습니다. 위 `http/` 파일과 본 README를 함께 참고하세요.

---

# ✅ 공통 성공 응답 형식

대부분의 API는 다음 형태로 내려갑니다.

```json
{
  "ok": true,
  "data": { }
}
```

일부 User API는 예외적으로 다음 형태를 사용합니다.

```json
{ "user": { } }
```

```json
{ "data": [ ] }
```

---

# ⚠️ 공통 에러 응답 형식

### 1) 컨트롤러 단순 검증 실패

```json
{
  "ok": false,
  "error": "에러 설명"
}
```

### 2) 전역 에러 핸들러 (`errorHandler`)

```json
{
  "path": "/api/...",
  "method": "POST",
  "message": "에러 설명",
  "data": null,
  "date": "2026-01-15T12:00:00.000Z"
}
```

### 공통 상태 코드

| 코드 | 의미 |
|------|------|
| 400 | 잘못된 요청 (필수 값 누락 / 형식 오류) |
| 401 | 인증 필요 (쿠키·JWT 없음) |
| 404 | 존재하지 않는 리소스 |
| 429 | 랜덤 포인트 **1시간 쿨다운** 미충족 |
| 500 | 서버 내부 에러 |

---

# 🔐 인증 (프론트 필수)

- 로그인 성공 시 **httpOnly 쿠키**(`token`)에 JWT가 저장됩니다.
- 이후 API 호출 시 **`credentials: 'include'`** (axios `withCredentials: true`)가 필요합니다.
- CORS는 `CORS_ORIGIN` 환경 변수에 지정한 FE Origin만 허용합니다. (기본: `http://localhost:3000`)

```
POST /users/login
```

```json
{
  "email": "user@example.com",
  "password": "password12"
}
```

인증이 필요한 API 예: `GET /users/me`, `GET /users/me/cards`, `POST /api/sell`

---

# 📚 도메인 규칙 설명

프론트 개발자가 꼭 알아야 하는 핵심 규칙을 정리했습니다.

---

# 🟦 1. User (사용자·마이갤러리)

### 로그인 / 로그아웃

| Method | Path | 설명 |
|--------|------|------|
| POST | `/users/login` | JWT 쿠키 발급 |
| POST | `/users/logout` | 쿠키 삭제 |
| GET | `/users/me` | 내 정보 (인증) |
| GET | `/users/me/cards` | **보유 포토카드 목록** (인증) |

### Google OAuth (선택)

| Method | Path |
|--------|------|
| GET | `/users/auth/google` |
| GET | `/users/auth/google/callback` |

### 보유 카드 응답 필드 (FE 매핑 참고)

백엔드 필드명이 `grade`, `image_url`, `name` 등 **snake_case**와 **camelCase**가 섞여 올 수 있습니다.  
프론트에서는 등급·이미지 URL·이름을 **화면용 형태로 정규화**한 뒤 사용하는 것을 권장합니다.

---

# 🟩 2. PhotoCard (포토카드 생성)

포토카드 생성은 **multipart/form-data** 입니다.

```
POST /api/photo-cards
```

| 필드 | 설명 |
|------|------|
| `creatorUserId` | 생성자 user id |
| `name` | 카드 이름 |
| `genre` | 장르 (예: 팬싸) |
| `grade` | 등급 (예: common, rare, super_rare) |
| `totalSupply` | 총 발행 수량 |
| `description` | 설명 |
| `minPrice` | 최저 가격(포인트) |
| `file` | 이미지 파일 |

조회:

```
GET /api/photo-cards?limit=10
GET /api/photo-cards/:id
PATCH /api/photo-cards/:id
```

업로드된 이미지 URL은 `/public/...` 경로로 접근할 수 있습니다.

---

# 🟨 3. Listing (마켓플레이스 판매 등록)

보유 카드(`userCardId`)를 마켓에 올립니다.

```
POST /api/listings
```

```json
{
  "sellerUserId": 1,
  "userCardId": 1,
  "quantity": 1,
  "pricePerUnit": 5000
}
```

목록 조회 (커서 페이지네이션·정렬):

```
GET /api/listings?limit=10&sortBy=reg_date&sortOrder=DESC&status=ACTIVE
GET /api/listings?limit=10&cursor=5
```

| Query | 설명 |
|-------|------|
| `limit` | 개수 |
| `cursor` | 무한 스크롤 커서 |
| `sortBy` | `reg_date` \| `price` |
| `sortOrder` | `ASC` \| `DESC` |
| `status` | 기본 `ACTIVE` |

```
GET /api/listings/:id
PATCH /api/listings/:id
DELETE /api/listings/:id   → 판매 취소 (body에 sellerUserId)
```

---

# 🟧 4. Sell (판매 요청 · 인증)

로그인(JWT 쿠키) 후 판매 요청을 등록합니다.

```
POST /api/sell
```

```json
{
  "userCardId": 1,
  "quantity": 1,
  "pricePerUnit": 5000,
  "desired_grade": "rare",
  "desired_genre": "팬싸",
  "desired_desc": "희귀 등급 희망"
}
```

---

# 🟥 5. Purchase (포인트 구매)

리스팅을 **포인트**로 구매합니다. 구매 시 포인트 차감·재고 반영은 서비스 레이어에서 처리됩니다.

```
POST /api/purchases
```

```json
{
  "buyerUserId": 2,
  "listingId": 1,
  "quantity": 1
}
```

내역:

```
GET /api/purchases/buyer?buyerUserId=2
GET /api/purchases/seller?sellerUserId=1
GET /api/purchases/:purchaseId
```

---

# 🟪 6. PointBoxDraw (랜덤 포인트)

### 포인트 뽑기 규칙

- **1시간(3600초) 쿨다운**: 마지막 뽑기 후 1시간이 지나지 않으면 **429**와 남은 시간 메시지 반환
- 지급 포인트: **1~10** (랜덤)
- `SELECT FOR UPDATE` + 트랜잭션으로 **연속 뽑기·중복 지급** 방지
- `user.points` 와 `point_history` 를 함께 갱신

### API

```
POST /api/point-box-draws/draw
```

```json
{
  "userId": 2
}
```

성공 응답 예:

```json
{
  "ok": true,
  "data": {
    "earnedPoints": 5,
    "newBalance": 120
  }
}
```

쿨다운 중 (429):

```json
{
  "message": "45분 30초 후 시도해주세요."
}
```

기타:

```
GET /api/point-box-draws/draw-history?userId=2&limit=1&offset=0
GET /api/point-box-draws/history?userId=2
GET /api/point-box-draws/user?userId=2
```

`draw-history`의 최근 1건으로 FE에서 **남은 쿨다운 시간**을 계산할 수 있습니다.

---

# 📁 폴더 구조

```
src/
 ├─ routes/          # Express 라우터
 ├─ controllers/     # 요청·응답 처리
 ├─ services/       # 비즈니스 로직
 ├─ repositories/   # DB 쿼리
 ├─ middlewares/    # 인증·에러 처리
 ├─ db/             # MySQL pool
 └─ app.js           # 미들웨어·라우트 마운트
http/                # REST Client 예시
public/              # 업로드 이미지 정적 파일
```

---

# 🧪 테스트 방법 (Postman / REST Client)

## 로그인

```
POST http://localhost:3000/users/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password12"
}
```

## 보유 카드 조회 (쿠키 필요)

```
GET http://localhost:3000/users/me/cards
```

## 마켓 목록

```
GET http://localhost:3000/api/listings?limit=10
```

## 랜덤 포인트

```
POST http://localhost:3000/api/point-box-draws/draw
Content-Type: application/json

{
  "userId": 2
}
```

## 카드 구매

```
POST http://localhost:3000/api/purchases
Content-Type: application/json

{
  "buyerUserId": 2,
  "listingId": 1,
  "quantity": 1
}
```

---

# ⚙️ 로컬 실행

### 1) MySQL (Docker)

```bash
docker compose up -d db
```

- 호스트 포트: **3307** → 컨테이너 3306
- `.env`에 `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` 설정

### 2) 서버

```bash
npm install
npm run dev
```

### 주요 환경 변수

| 변수 | 설명 |
|------|------|
| `PORT` | 서버 포트 (기본 3000) |
| `DB_*` | MySQL 연결 |
| `JWT_SECRET` | JWT 서명 키 |
| `CORS_ORIGIN` | 허용할 FE Origin |
| `FRONTEND_URL` | OAuth 리다이렉트 등 |

---

# 👨‍💻 개발자 정보

- **Express.js** 기반 REST API
- **MySQL** (mysql2 pool, Raw SQL)
- **JWT** httpOnly 쿠키 인증
- **bcrypt** 비밀번호 해싱
- 포인트 지급·차감 **트랜잭션** 처리
- 이미지 **multer** 업로드 + `/public` 정적 서빙

---

# ✔ 상태

현재 기능 기준으로 `http/` 예시 파일과 본 README가 최신 API 구조를 반영합니다.  
프론트 개발자는 **본 README + `http/` + FE `NEXT_PUBLIC_API_BASE_URL`** 만으로 연동할 수 있습니다.

끝.
