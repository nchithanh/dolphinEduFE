# Architecture

FE-only. No backend in this product yet.

```
dolphin_edu/
  frontend/   Next.js App Router — hardcoded Agent CRM UI
  context/    Product SoT
```

Local: frontend `:3011`. Menu is `HARDCODED_MENU` in `lib/api-menu.ts` — **does not** call Dolphin Ops `:8081`.

Canvas seed: `lib/seed.ts`. Domain helpers: `lib/edu.ts` (course/class status, generate classes, enroll).

Shell: 2 cột **nav | canvas**. Chat là drawer phải (`translateX`), overlay, không đẩy layout bảng.

Auth **TODO**. No JWT. No fake admin login.

Host: **TODO**.
