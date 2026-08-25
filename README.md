# Dolphin Edu — frontend

Standalone Next.js app (Agent CRM UI for booking học). Hardcoded seed — **không gọi API**.

## Setup

```bash
cd products/saas/dolphin_edu/frontend
npm install
npm run dev
```

- Dev: http://localhost:3011
- Production build: `npm run build` then `npm start` (port 3011)

Typecheck: `npx tsc --noEmit`.

## Folder map

| Path | Role |
| --- | --- |
| `app/` | Next.js App Router |
| `components/ops/` | Shell, canvas pages, chat (CSS prefix `ops-*` inherited from Ops clone) |
| `lib/` | seed, edu (generate/enroll/status), nav, hardcoded menu, locale, branch, intent |
| `data/chat-actions.json` | Chat phrase → demo action |
| `context/` | Product SoT |
| `documentations/` | How the FE demo works |

## Product slice (demo FE)

Hardcoded **Pulse Studio** canvas. Menu **hardcode** (`lib/api-menu.ts`), không fetch backend.

- Live: Tổng quan · Khóa học · Lớp học · Học viên · Giáo viên · Phòng tập
- Domain: khóa → ghi danh → sinh lớp (status start/end)
- Persist: `edu-locale`, `edu-branch` (không đụng key Ops)

Details: `documentations/overview.md`, `context/scope.md`.
