# 📗 최애의 포토 — Frontend

포토카드 **생성·마켓플레이스·교환·구매·마이갤러리·랜덤 포인트** UI를 제공하는 **Next.js (App Router)** 프론트엔드입니다.  
백엔드 API·비즈니스 규칙은 **middle-project-BE** README 및 `http/` 테스트 파일을 기준으로 합니다.

---

# 🚀 배포 URL

| 구분 | URL |
|------|-----|
| **프론트 (Vercel)** | `https://fe-eight-omega.vercel.app` |
| **백엔드 (Render)** | `https://be-1-yqrf.onrender.com` |
| **로컬 FE** | `http://localhost:3000` (Next.js 기본) |
| **로컬 BE** | `http://localhost:3000` (BE 단독 실행 시 포트 충돌 → FE는 `3001` 등으로 변경) |

> BE에는 Swagger가 없습니다. API 상세는 **middle-project-BE README** + `http/*.http` 를 참고하세요.

---

# 🛠 기술 스택

| 구분 | 사용 |
|------|------|
| 프레임워크 | Next.js 16 (App Router) |
| UI | React 19 |
| 스타일 | Tailwind CSS 4, CSS Modules |
| HTTP | axios (`src/lib/http/client.js`) |
| 구조 | **Atomic Design** — `atoms` / `molecules` / `organisms` / `layout` |
| 배포 | Vercel |

---

# 🧱 화면·라우트

| 경로 | 기능 |
|------|------|
| `/auth`, `/auth/login`, `/auth/signup` | 로그인·회원가입 |
| `/marketplace` | 마켓 목록·필터 |
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
# 끝에 슬래시 없이 BE Origin (axios·fetch 공통)
NEXT_PUBLIC_API_BASE_URL=https://be-1-yqrf.onrender.com
```

로컬 예:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

## HTTP 클라이언트

| 파일 | 역할 |
|------|------|
| `src/lib/http/client.js` | axios — `withCredentials: true`, `baseURL = NEXT_PUBLIC_API_BASE_URL` |
| `src/lib/http/baseUrl.js` | `apiUrl('/api/...')` — `/api` 로 시작하는 경로만 허용 |

### 경로 규칙

- **User·세션**: `/users/login`, `/users/me`, `/users/me/cards` → axios `baseURL` + 경로  
- **도메인 API**: `/api/photo-cards`, `/api/listings`, `/api/point-box-draws/...` → `apiUrl()` 또는 `API_BASE + '/api/...'`

`next.config.mjs`의 `images.remotePatterns`에 BE 호스트(`be-1-yqrf.onrender.com`)가 등록되어 있어야 카드 이미지가 표시됩니다.

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
- FE는 **`credentials: 'include'`** 필수 (axios `withCredentials: true`)  
- 인증 API 예: `GET /users/me`, `GET /users/me/cards`, `POST /api/sell`  
- BE `CORS_ORIGIN`에 Vercel·로컬 FE Origin 등록 필요  

```js
// client.js
export const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});
```

---

# 📚 프론트에서 알아둘 규칙

### 마이갤러리 — BE 응답 매핑

`GET /users/me/cards` 응답은 `userCard` 래핑·`photoCard` 단독 등 형태가 섞일 수 있습니다.  
`mygallery/page.jsx`의 `mapMyCardToCard`에서 화면용으로 정규화합니다.

- 등급: `SUPER_RARE` → `SUPER RARE`  
- 이미지: `/public/...` 제거 후 `API_BASE` 붙이기  
- 필드: `grade` / `image_url` / `name` 등 snake·camel 혼용 대응  

### 랜덤 포인트 (1시간 쿨다운)

- `RandomPointManager` — `(main)/layout`에 전역 마운트  
- `POST /api/point-box-draws/draw`  
- `GET /api/point-box-draws/draw-history` — 마지막 뽑기 시각으로 남은 시간 계산  
- FE 상수: `COOLDOWN_SECONDS = 3600`, 429 시 BE 메시지 표시  
- ⚠️ 현재 `userId = 1` 하드코딩(TODO) — 로그인 연동 후 제거 예정  

### 이미지 URL

```js
// /public 접두 제거 + 상대경로면 API_BASE 결합
normalizeImageUrl(pc?.imageUrl ?? pc?.image_url)
```

### 성공/에러 응답 (BE)

- 성공(대부분): `{ ok: true, data: ... }`  
- User 일부: `{ user: ... }`, `{ data: [...] }`  
- 에러: `{ ok: false, error: "..." }` 또는 전역 `errorHandler` 형식 — **BE README** 참고  

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

BE를 먼저 띄우고, FE·BE 포트가 겹치면 `next dev -p 3001` 등으로 분리하세요.

---

# 📁 폴더 구조

```
src/
├── app/
│   ├── auth/              login, signup
│   └── (main)/            marketplace, mygallery, create-card
├── components/
│   ├── atoms/             Button, Modal, Image …
│   ├── molecules/         InputEmail, InputPassword …
│   ├── organisms/         Card*, RandomPoint, MyCard …
│   └── layout/            Header
├── lib/
│   ├── http/              client.js, baseUrl.js
│   └── auth/              requireAuth.js
├── hooks/                 useBreakpoint, useDevAuth
└── constants/
```

---

# ✅ 배포 체크리스트

- [ ] Vercel `NEXT_PUBLIC_API_BASE_URL` = BE Origin (슬래시 없음)  
- [ ] BE `CORS_ORIGIN`에 `https://fe-eight-omega.vercel.app`  
- [ ] `next.config.mjs` `images.remotePatterns`에 BE 호스트  
- [ ] 로그인 후 `withCredentials`로 `/users/me`·마이갤러리 동작  
- [ ] 랜덤 포인트 1시간 쿨다운·429 UI 확인  

---

# 👥 관련 저장소

| Repo | 역할 |
|------|------|
| middle-project-FE | Next.js UI (본 repo) |
| middle-project-BE | Express + MySQL API |
