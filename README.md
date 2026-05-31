# 최애의 포토 (Favorite Photo)

Codeit 풀스택 10기 팀 프로젝트 · **FE + BE monorepo**  
포토카드 **생성·마켓플레이스·교환·구매·마이갤러리·랜덤 포인트** 플랫폼

> 개인 포트폴리오용 fork · Organization: [BootCamp-Codeit](https://github.com/BootCamp-Codeit)

---

## Live Demo

| | URL |
|--|-----|
| **Frontend (Vercel)** | https://favorite-photo-red.vercel.app |
| **Backend API (Render)** | https://favorite-photo.onrender.com |
| **GitHub** | https://github.com/BootCamp-Codeit/favorite-photo |

### 데모 체험

| | |
|--|--|
| **데모 계정** | `demo@favorite-photo.dev` |
| **비밀번호** | `qwert12345!` |
| **닉네임** | 김명환 |
| **시드** | 유저 20 · 포토카드 100 · 마켓 ACTIVE ~72 |
| **NPC** | `trader01@favorite-photo.dev` ~ `trader19@...` (동일 비밀번호) |

> Render Starter 사용 시 sleep 없음. 시드 재실행: `cd backend && npm run db:seed` (**전체 삭제 후 재생성**)

---

## Repository Layout

| 경로 | 설명 | README |
|------|------|--------|
| `frontend/` | Next.js 16 (App Router) + Atomic Design | [frontend/README.md](./frontend/README.md) |
| `backend/` | Express + MySQL (mysql2) | [backend/README.md](./backend/README.md) |

---

## 본인 역할 (김명환)

| 구분 | 담당 |
|------|------|
| **Frontend (주)** | Atomic Design 기반 공통 컴포넌트·Layout, **마이갤러리** (`mapMyCardToCard`), **랜덤 포인트** (`RandomPointManager`), CONTRIBUTING·팀 FE 리드 |
| **Backend (일부)** | `point-box-draws` API 연동 |
| **포트폴리오 (개인)** | monorepo 구성, Render/Vercel/TiDB 재배포, 데모 시드, 마켓 필터·검색·등급색 수정 |
| **팀** | 4명 · FE/BE 병렬 (마켓·구매·카드 생성 등은 팀원 담당 — 각 README 참고) |

---

## Quick Start (로컬)

```bash
# 1) Backend
cd backend
cp .env.example .env   # DB_*, JWT_SECRET 등 입력
npm install
npm run dev

# 2) Frontend (다른 터미널 — BE와 포트 겹치면 -p 3001)
cd frontend
# .env.local: NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
npm install && npm run dev
```

```bash
# Backend — TiDB 시드 (전체 삭제 후 재생성)
cd backend
npm run db:schema   # 최초 1회
npm run db:seed
```

| 로컬 URL | |
|----------|--|
| FE | http://localhost:3000 (또는 `next dev -p 3001`) |
| BE | http://localhost:3000 |

---

## 배포 (monorepo)

팀 원본은 FE·BE **분리 repo** → 포트폴리오는 **단일 monorepo**로 재구성 후 배포합니다.

### Vercel (Frontend)

| 항목 | 값 |
|------|-----|
| Repository | `BootCamp-Codeit/favorite-photo` |
| **Root Directory** | `frontend` |
| Framework | Next.js |
| Build | `npm run build` |
| **Environment** | `NEXT_PUBLIC_API_BASE_URL=https://<render-url>` (끝 슬래시 없음) |

env 변경 후 **Redeploy** 필수. `next.config.mjs`의 `images.remotePatterns`에 Render 호스트 등록.

### Render (Backend)

| 항목 | 값 |
|------|-----|
| Repository | `BootCamp-Codeit/favorite-photo` |
| **Root Directory** | `backend` |
| Build | `npm install` |
| Start | `npm start` |
| **Environment** | `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `JWT_SECRET`, `CORS_ORIGIN`, `NODE_ENV=production` |

### Database (TiDB Cloud)

Render Free에는 MySQL이 없어 **[TiDB Cloud Starter](https://tidbcloud.com)** (MySQL 호환, Free) 사용.

- BE는 `DB_*` 개별 env (Prisma 아님)
- **IP Access** → `0.0.0.0/0`
- 스키마: `backend/schema.sql` → `npm run db:schema`
- 데모 데이터: `npm run db:seed` (**전체 삭제 후 재생성**)

---

## 포트폴리오 유지보수 (2026-05)

| 항목 | 내용 |
|------|------|
| **monorepo** | 팀 분리 repo → `BootCamp-Codeit/favorite-photo` (frontend/ + backend/) |
| **재배포** | Vercel + Render Starter + TiDB Cloud |
| **데모 시드** | 유저 20 · 포토카드 100 · 마켓 72+8건 |
| **마켓플레이스** | 장르 4종 통일, 매진/정렬 API 연동, 검색(Enter·돋보기) |
| **UI** | 등급별 색상 (`rarityColors.js`) — COMMON/RARE/SUPER RARE/LEGENDARY |
| **버그 수정** | TiDB SSL, CORS, 판매카드 infinite fetch, signup route 등 |

---

## Repository

| 구분 | Organization / Repo |
|------|---------------------|
| **포트폴리오 (본 repo)** | [BootCamp-Codeit/favorite-photo](https://github.com/BootCamp-Codeit/favorite-photo) |
| **팀 org (원본)** | [codeit-fs-10th-middle](https://github.com/codeit-fs-10th-middle) |
| **팀 FE (분리)** | [FE](https://github.com/codeit-fs-10th-middle/FE) |
| **팀 BE (분리)** | [BE](https://github.com/codeit-fs-10th-middle/BE) |

---

## 트러블슈팅 (배포)

| 증상 | 원인 | 조치 |
|------|------|------|
| FE 404 / API 타임아웃 | 예전 배포 URL·Render sleep | 새 URL 확인, 30~60초 대기 |
| CORS 에러 | `CORS_ORIGIN` ≠ Vercel URL | Render env 수정 + 재배포 |
| 로그인 안 됨 | cross-site 쿠키 | `NODE_ENV=production`, FE `withCredentials: true` |
| 이미지 깨짐 | `next.config` 예전 BE 호스트 | `remotePatterns.hostname` 교체 + Redeploy |
| DB 연결 실패 | TiDB IP·스키마 미생성 | IP `0.0.0.0/0`, `npm run db:schema` |
| 마켓 검색 안 됨 | FE 검색 미연동 | Enter/돋보기 → `searchQuery` 필터 (수정 완료) |
| 등급 색상 동일 | CSS `#efff04` 고정 | `getRarityColor()` 적용 (수정 완료) |

상세 → [backend/README.md](./backend/README.md) · [frontend/README.md](./frontend/README.md)
