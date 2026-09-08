# Overview — Dolphin Edu frontend

Hardcoded Agent CRM for a dance studio. **Temporary:** source lives in marketing repo `nchithanh/eco` at `products/saas/dolphin_edu/frontend/` (no separate `dolphinEduFE` repo yet). Host plan: GitHub Pages + custom domain (Cloudflare) — see `documentations/deploy.md`.

Next.js App Router. Local `:3011`. Production: static export `out/` — xem `documentations/deploy.md`.

Agent SoT: `context/` + `documentations/` in this folder.

## Demo chrome

Shell: **nav | canvas**. Chat **kéo ra từ phải** (Ask Dolphin / Escape / overlay). Design system: **MA Dance Light | Dark** (CanvasBar, persist `edu-theme`, mặc định Light). Light: canvas/bg `#FFFFFF` (không caro) · sidebar/surface `#FFFFFF` · accent `#171717` (nút đen chữ trắng). Dark: canvas `#0A0A0A` + caro · sidebar `#111111` · accent ivory `#F3EEE6` (nút chữ đen). Radius `10px`/`12px` · type title/section/metric/body/meta · control `40px`. CSS prefix `ops-*`. Nav `min(14.5rem,15.5svw)` · aside `min(26.5rem,34svw)` · section gap `~1.35rem`. **Mobile** (`< 48rem`): **gate** `MobileGate` — trang thông báo tablet/desktop, ẩn shell (VI/EN). Tablet+ : hamburger không dùng; canvas xếp 1 cột từ `64rem`.

- **Boot splash** (mỗi lần vào app): overlay **trắng**, logo MA (không khung, không shadow) + wordmark DANCE STUDIO + beat 5-6-7-8. Hardcode **2s** rồi fade ~480ms vào CRM (desktop/tablet) hoặc **MobileGate** (phone). Không fetch / không skip. `BootSplash`.
- Đổi tab canvas: `AiReveal` nền trắng, logo **MA Dance** (không ring / không shadow) + nhãn “Đang mở…”. Chat Ask Dolphin vẫn mascot Dolphin.
- Click dòng trên bảng (HV · Lớp · GV · Phòng · Khóa · Tác vụ): panel chi tiết chạy `AiReveal` **1,5s** rồi hiện data (bảng không bị che). Click lại cùng dòng đang mở thì không chờ.
- Trái: logo **MA Dance** (`public/brand/ma-dance-logo.jpeg`) · org **MA Dance** · dòng phụ **Dolphin Edu**. Select chi nhánh (`edu-branch`: Q10 / Q3 / Phú Nhuận). Vai trò demo (`edu-role`). Menu `lib/api-menu.ts` — **không fetch API**. `live` = canvas; `stub` = Sắp có; `disabled` = ẩn.
- Giữa: CanvasBar — search · Ask Dolphin · **Light|Dark** · VI|EN · user theo vai trò. Canvas + chat + seed **VI**.
- Domain: **Khóa → ghi danh học viên → sinh lớp**. Không matching spa 1:1.
- **Hướng dẫn sử dụng** (`GuideBoard`): playbook MA — luồng lõi, 4 vai trò, A1–A14 + B (bước dùng, as-is/to-be, rule), ngoài phạm vi. Canvas vận hành **không** banner xanh. Tổng quan **không** lưới hạng mục A/B.

Nav nhóm: **Tổng quan** (Dashboard · Hướng dẫn · Lịch) · **Quản lý** · **Tuyển sinh** · **Tài chính** · **Vận hành** · **Cài đặt**. B1 preview (Website / Portal / Store / AI tuyển sinh) **không** trên sidebar — mở từ Hướng dẫn.

| Nav | Canvas |
| --- | --- |
| Dashboard | KPI demo · chart · tasks · 5 khối list · timeline · gợi ý AI |
| Hướng dẫn sử dụng | Playbook nghiệp vụ MA (`GuideBoard`) |
| Khóa / Lớp / HV / GV / Phòng | Board live — không banner mô tả |
| Gói buổi · Điểm danh · QR · Lịch · Promotion · Chăm sóc · Thu HP · Bảo lưu · Doanh thu · Ghi danh giữa khóa | `QuoteBoards` — rule MA Dance |
| Phân quyền | `AccessBoard` — 24 quyền · 12 TK · 4 vai A1 (`lib/acl-demo.ts`); tab Quyền / Tài khoản |
| Tác vụ · Thuê phòng | B2 vận hành |
| AI vận hành · Intelligent | B2 demo hardcode (`PreviewBoards`) |
| Website / Portal / Store / AI tuyển sinh | B1 **preview** — không trên nav; mở từ Hướng dẫn |
| Stub | Cài đặt chung — badge **Sắp có** |

Ẩn: Inbox (`disabled`). Spa leftover: `components/ops/_quarantine_spa/` (không import `TaskList` spa).

Seed: **7 phòng MA** · **14 GV** · ~24 khóa · ~39 HV · **18 tác vụ**. Quote seed: 18 gói · 16 phiếu thu · 12 BL · 10 voucher · 10 chăm sóc · 8 thuê phòng · 10 calendar. Đồng hồ demo **24/08/2026 17:15 VN**. Lịch Google = **1 calendar trung tâm**, nội bộ (không GCal cá nhân HV). Phân quyền: **24 quyền / 12 tài khoản / 4 vai A1** (`lib/acl-demo.ts`).

## Chat

Mặc định đóng. Mở = drawer overlay, canvas không co.

`data/chat-actions.json` → `lib/intent.ts` `resolveChat`. Không NLU, không mở stub.

Thứ tự: ghi danh → sinh lớp → Tác vụ → form khóa → 360 học viên → list học viên → lớp đang diễn ra → khóa học → tổng quan → list lớp.

Tile: Lớp hôm nay · Ghi danh Long · Hồ sơ Hương · Sinh lớp Waacking.
