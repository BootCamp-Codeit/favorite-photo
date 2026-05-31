# 📗 최애의 포토 — Frontend

포토카드 **생성·마켓플레이스·교환·구매·마이갤러리·랜덤 포인트** UI를 제공하는 **Next.js (App Router)** 프론트엔드입니다.  
API·비즈니스 규칙은 [backend/README.md](../backend/README.md) 및 `backend/http/` 테스트 파일을 기준으로 합니다.

> monorepo: [BootCamp-Codeit/favorite-photo](https://github.com/BootCamp-Codeit/favorite-photo)

---

# 🚀 배포 URL

| 구분 | URL |
|------|-----|
| **프론트 (Vercel)** | https://favorite-photo-red.vercel.app |
| **백엔드 (Render)** | https://favorite-photo.onrender.com |
| **GitHub (monorepo)** | https://github.com/BootCamp-Codeit/favorite-photo |
| **로컬 FE** | http://localhost:3000 (BE와 포트 겹치면 `next dev -p 3001`) |
| **로컬 BE** | http://localhost:3000 |

### 데모 체험 (리뷰·포트폴리오)

| | |
|--|--|
| **이메일** | `demo@favorite-photo.dev` |
| **비밀번호** | `qwert12345!` |
| **닉네임** | 김명환 (85,000P) |

> BE에는 Swagger가 없습니다. API 상세는 [backend/README.md](../backend/README.md) + `backend/http/*.http` 참고.

---

# 🛠 기술 스택

| 구분 | 사용 |
|------|------|
| 프레임워크 | Next.js 16 (App Router) |
| UI | React 19 |
| 스타일 | Tailwind CSS 4, CSS Modules |
| HTTP | axios (`src/lib/http/client.js`) |
| 구조 | **Atomic Design** — `atoms` / `molecules` / `organisms` / `layout` |
| 배포 | Vercel (Root Directory: `frontend`) |

---

# 🧱 화면·라우트

| 경로 | 기능 |
|------|------|
| `/auth`, `/auth/login`, `/auth/signup` | 로그인·회원가입 |
| `/marketplace` | 마켓 목록·검색·필터·정렬 |
| `/marketplace/[cardId]` | 카드 상세·구매 |
| `/marketplace/exchange/propose` 등 | 교환 제안·성공/실패 |
| `/marketplace/purchase/success` 등 | 구매 결과 |
| `/mygallery` | 보유 카드(마이갤러리) |
| `/mygallery/create` | 카드 등록 진입 |
| `/mygallery/selling-card` | 판매 중 카드 |
| `/create-card` | 포토카드 생성 폼 |
| `/marketplace/sell` | 판매 등록 |

`(main)` 레이아웃: `Header` + 전역 `RandomPointManager` + `main`.

---

# 🔗 백엔드 연동

## 환경 변수

```env
# 끝에 슬래시 없이 BE Origin
NEXT_PUBLIC_API_BASE_URL=https://favorite-photo.onrender.com
```

로컬:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

## HTTP 클라이언트

| 파일 | 역할 |
|------|------|
| `src/lib/http/client.js` | axios — `withCredentials: true`, `baseURL = NEXT_PUBLIC_API_BASE_URL` |
| `src/lib/http/baseUrl.js` | `apiUrl('/api/...')` — `/api` 로 시작하는 경로만 허용 |

### 경로 규칙

- **User·세션**: `/users/login`, `/users/me`, `/users/me/cards`
- **도메인 API**: `/api/photo-cards`, `/api/listings`, `/api/point-box-draws/...`

`next.config.mjs`의 `images.remotePatterns`에 아래 호스트가 등록되어 있어야 카드 이미지가 표시됩니다.

- `favorite-photo.onrender.com`
- `favorite-photo-red.vercel.app`

### BE 도메인 대응

| BE | FE |
|----|-----|
| User | `auth/*`, `Header`, 로그인 상태 |
| PhotoCard / Upload | `create-card`, `CreateCardForm` |
| Listing / Sell | `marketplace`, `mygallery/selling-card` |
| Purchase | `marketplace/[cardId]`, purchase success/fail |
| PointBoxDraw | `RandomPointManager` (전역) |
| MyGallery | `mygallery` — `GET /users/me/cards` |

---

# 🔐 인증 (httpOnly 쿠키)

- 로그인 성공 시 BE가 **httpOnly 쿠키**(`token`)에 JWT 저장
- FE는 **`withCredentials: true`** 필수
- BE `CORS_ORIGIN`에 Vercel·로컬 FE Origin 등록 필요

---

# 📚 프론트에서 알아둘 규칙

### 마이갤러리 — BE 응답 매핑

`GET /users/me/cards` 응답을 `mapMyCardToCard`에서 화면용으로 정규화합니다.

- 등급: `SUPER_RARE` → `SUPER RARE`
- 이미지: `/public/...` 제거 후 `API_BASE` 결합
- snake_case / camelCase 혼용 대응

### 마켓플레이스 — 필터·검색·정렬

| UI | 동작 |
|----|------|
| **검색** | Enter / 돋보기 클릭 시 제목·설명·판매자·장르 기준 클라이언트 필터 |
| **장르** | `풍경` · `여행` · `인물` · `동물` |
| **매진** | `status=SOLD_OUT` / `ACTIVE` / `ALL` API 연동 |
| **정렬** | `sortBy=price\|reg_date`, `sortOrder=ASC\|DESC` API 연동 |

### 등급별 색상

`src/constants/rarityColors.js` — COMMON(노랑) · RARE(파랑) · SUPER RARE(보라) · LEGENDARY(빨강)  
카드 컴포넌트(`CardOriginal`, `MyCard` 등)에서 공통 사용.

### 랜덤 포인트 (1시간 쿨다운)

- `RandomPointManager` — `(main)/layout`에 전역 마운트
- `POST /api/point-box-draws/draw`
- `GET /api/point-box-draws/draw-history` — 남은 쿨다운 계산
- FE 상수: `COOLDOWN_SECONDS = 3600`, 429 시 BE 메시지 표시

### 이미지 URL

```js
normalizeImageUrl(pc?.imageUrl ?? pc?.image_url)
// /public 접두 제거 + 상대경로면 API_BASE 결합
```

---

# 🛠 로컬 실행

```bash
npm install
# .env.local
# NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
npm run dev
```

| 명령 | 설명 |
|------|------|
| `npm run dev` | 개발 서버 |
| `npm run build` | 프로덕션 빌드 |
| `npm run start` | 빌드 결과 실행 |
| `npm run lint` | ESLint |

BE를 먼저 띄우고, 포트 충돌 시 `next dev -p 3001` 사용.

---

# 📁 폴더 구조

```
src/
├── app/
│   ├── auth/              login, signup
│   └── (main)/            marketplace, mygallery, create-card
├── components/
│   ├── atoms/             Button, Modal, Label …
│   ├── molecules/         InputSearch, InputEmail …
│   ├── organisms/         Card*, SubHeader, RandomPoint …
│   └── layout/            Header
├── lib/http/              client.js, baseUrl.js
├── constants/             options.js, rarityColors.js
└── hooks/                 useBreakpoint
```

---

# ✅ 배포 체크리스트

- [x] Vercel Root Directory = `frontend`
- [x] `NEXT_PUBLIC_API_BASE_URL=https://favorite-photo.onrender.com`
- [x] BE `CORS_ORIGIN=https://favorite-photo-red.vercel.app`
- [x] `next.config.mjs` `images.remotePatterns`에 Render·Vercel 호스트
- [x] 로그인 후 `withCredentials`로 `/users/me`·마이갤러리 동작
- [x] 마켓 검색·장르·매진·정렬 필터 동작
- [x] 등급별 카드 색상 표시

env 변경 후 Vercel **Redeploy** 필수.

---

# 👥 관련 저장소

| Repo | 역할 |
|------|------|
| [BootCamp-Codeit/favorite-photo](https://github.com/BootCamp-Codeit/favorite-photo) | **포트폴리오 monorepo** (본 repo) |
| [codeit-fs-10th-middle/FE](https://github.com/codeit-fs-10th-middle/FE) | 팀 원본 FE |
| [codeit-fs-10th-middle/BE](https://github.com/codeit-fs-10th-middle/BE) | 팀 원본 BE |
