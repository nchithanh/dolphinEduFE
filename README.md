# Dolphin Edu — frontend

Standalone Next.js app (Agent CRM UI for booking học). Hardcoded seed — **không gọi API**.

## Setup

```bash
cd products/saas/dolphin_edu/frontend
npm install
npm run dev
```

- Dev: http://localhost:3011
- Production (Node): `npm run build` then `npm start` (port 3011)
- GitHub Pages artifact: `npm run build:pages` → `out/`

Deploy: push `main` → GitHub Actions. Custom domain qua Cloudflare — **`documentations/deploy.md`**.

Repo: https://github.com/nchithanh/dolphinEduFE

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

Hardcoded **MA Dance** canvas (3 CN · 7 phòng). Menu **hardcode** (`lib/api-menu.ts`), không fetch backend.

- Live: hạng mục báo giá A1–A14 + B2; B1 là preview
- Domain: khóa → ghi danh → sinh lớp (status start/end)
- Persist: `edu-locale`, `edu-theme`, `edu-branch`, `edu-role` (không đụng key Ops)

Details: `documentations/overview.md`, `context/scope.md`.
