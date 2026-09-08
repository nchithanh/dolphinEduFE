# Architecture

FE-only. No backend in this product yet.

```
dolphin_edu/
  frontend/   Next.js App Router — hardcoded Agent CRM UI
  context/    Product SoT
```

Local: frontend `:3011`. Menu is `HARDCODED_MENU` in `lib/api-menu.ts` — **does not** call Dolphin Ops `:8081`.

Canvas seed: `lib/seed.ts`. Domain helpers: `lib/edu.ts` (course/class status, generate classes, enroll).

Shell: 2 cột **nav | canvas**. Chat là drawer phải (`translateX`), overlay, không đẩy layout bảng. Phone (`< 48rem`): **gate** thông báo tablet/desktop, ẩn shell. Tablet+: nav overlay không dùng trên phone. Mọi board: bảng | panel xếp dọc từ `64rem` (gồm Khóa học, Tác vụ).

Boot splash: overlay **trắng** **2s hardcode** (`BOOT_SPLASH_MS`) rồi fade vào shell — không fetch, không auth. Logo không khung / không shadow.

Click dòng trên bảng list+aside: panel chi tiết `AiReveal` **1,5s** (`DETAIL_REVEAL_MS` trong `lib/detail-reveal.ts`) — không che canvas.

Auth **TODO**. No JWT. No fake admin login.

Host: **TODO**.
