# Overview — Dolphin Edu frontend

Hardcoded Agent CRM for a dance studio. **Temporary:** source lives in marketing repo `nchithanh/eco` at `products/saas/dolphin_edu/frontend/` (no separate `dolphinEduFE` repo yet). Host plan: GitHub Pages + custom domain (Cloudflare) — see `documentations/deploy.md`.

Next.js App Router. Local `:3011`. Production: static export `out/` — xem `documentations/deploy.md`.

Agent SoT: `context/` + `documentations/` in this folder.

## Demo chrome

Shell: **nav | canvas**. Chat **kéo ra từ phải** (Ask Dolphin / Escape / overlay). Design system: **MA Dance Light | Dark** (CanvasBar, persist `edu-theme`, mặc định Light). Light: canvas/bg `#F6F6F4` · sidebar/surface `#FFFFFF` · accent `#171717` (nút đen chữ trắng). Dark: canvas `#0A0A0A` · sidebar `#111111` · accent ivory `#F3EEE6` (nút chữ đen). Radius `10px`/`12px` · type title/section/metric/body/meta · control `40px`. CSS prefix `ops-*`. Nav `min(14.5rem,15.5svw)` · aside `min(26.5rem,34svw)` · section gap `~1.35rem`. **Mobile** (`< 48rem`): hamburger drawer · bar logo + Ask icon · chat full màn; không gate.

- Trái: logo **MA Dance** (`public/brand/ma-dance-logo.jpeg`) · org **MA Dance** · dòng phụ **Dolphin Edu**. Select chi nhánh (`edu-branch`: Q10 / Q3 / Phú Nhuận). Vai trò demo (`edu-role`). Menu `lib/api-menu.ts` — **không fetch API**. `live` = canvas; `stub` = Sắp có; `disabled` = ẩn.
- Giữa: CanvasBar — search · Ask Dolphin · **Light|Dark** · VI|EN · user theo vai trò. Canvas + chat + seed **VI**.
- Domain: **Khóa → ghi danh học viên → sinh lớp**. Không matching spa 1:1.
- **Hub hạng mục** trên Tổng quan (`lib/quote-scope.ts`): A1–A14 + B. Mỗi canvas khác overview có banner as-is → to-be.

Nav nhóm: **Tổng quan** (Dashboard + hub) · **Quản lý** · **Tuyển sinh** · **Tài chính** · **Vận hành** · **Mặt ngoài** (B1 preview) · **Cài đặt**.

| Nav | Canvas |
| --- | --- |
| Dashboard | Hub A1–A14 + KPI demo · chart · tasks · 5 khối list · timeline · gợi ý AI |
| Khóa / Lớp / HV / GV / Phòng | Board live như trước + banner nghiệp vụ |
| Gói buổi · Điểm danh · QR · Lịch · Promotion · Chăm sóc · Thu HP · Bảo lưu · Doanh thu · Ghi danh giữa khóa | `QuoteBoards` — rule MA Dance |
| Phân quyền | `AccessBoard` — 24 quyền · 12 TK · 4 vai A1 (`lib/acl-demo.ts`); tab Quyền / Tài khoản |
| Tác vụ · Thuê phòng | B2 vận hành |
| AI vận hành · Intelligent | B2 demo hardcode (`PreviewBoards`) |
| Website / Portal / Store / AI tuyển sinh | B1 **preview** — mô tả hạng mục, không site production |
| Stub | Cài đặt chung — badge **Sắp có** |

Ẩn: Inbox (`disabled`). Spa leftover: `components/ops/_quarantine_spa/` (không import `TaskList` spa).

Seed: **7 phòng MA** · **14 GV** · ~24 khóa · ~39 HV · **18 tác vụ**. Quote seed: 18 gói · 16 phiếu thu · 12 BL · 10 voucher · 10 chăm sóc · 8 thuê phòng · 10 calendar. Đồng hồ demo **24/08/2026 17:15 VN**. Lịch Google = **1 calendar trung tâm**, nội bộ (không GCal cá nhân HV). Phân quyền: **24 quyền / 12 tài khoản / 4 vai A1** (`lib/acl-demo.ts`).

## Chat

Mặc định đóng. Mở = drawer overlay, canvas không co.

`data/chat-actions.json` → `lib/intent.ts` `resolveChat`. Không NLU, không mở stub.

Thứ tự: ghi danh → sinh lớp → Tác vụ → form khóa → 360 học viên → list học viên → lớp đang diễn ra → khóa học → tổng quan → list lớp.

Tile: Lớp hôm nay · Ghi danh Long · Hồ sơ Hương · Sinh lớp Waacking.
