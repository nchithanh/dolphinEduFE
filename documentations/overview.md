# Overview — Dolphin Edu frontend

Hardcoded Agent CRM for a dance studio. Host: GitHub Pages + custom domain (Cloudflare). Repo `nchithanh/dolphinEduFE`.

Next.js App Router. Local `:3011`. Production: static export `out/` — xem `documentations/deploy.md`.

Agent SoT: `context/` + `documentations/` in this folder.

## Demo chrome

Shell: **nav | canvas**. Chat **kéo ra từ phải** (Ask Dolphin / Escape / overlay). Design system: **premium dark** — canvas `#070711` · sidebar `#0B0C1C` · surface `#111225` · accent `#7C3AED` / `#A855F7` · text `#F8F7FF` · radius `12px` · type title/section/metric/body/meta · control `40px`. CSS prefix `ops-*`. Nav `min(14.5rem,15.5svw)` · aside `min(26.5rem,34svw)` · section gap `~1.35rem`. **Mobile** (`< 48rem`): trang gate — chỉ tablet/desktop.

- Trái: wordmark **Dolphin Edu** · org **Pulse Studio**. Select chi nhánh (`edu-branch`). Menu `lib/api-menu.ts` — **không fetch API**. `live` = canvas; `stub` = Sắp có; `disabled` = ẩn.
- Giữa: CanvasBar — search · Ask Dolphin · VI|EN · user. Canvas + chat + seed **VI**.
- Domain: **Khóa → ghi danh học viên → sinh lớp**. Không matching spa 1:1.

Nav nhóm: **Tổng quan** (Dashboard live; Lịch / Hoạt động stub) · **Quản lý** (Học viên, Khóa học, Lớp học, Giáo viên, Phòng) · **Tuyển sinh** / **Tài chính** / **Cài đặt** stub.

| Nav | Canvas |
| --- | --- |
| Dashboard | KPI demo · chart doanh thu · tasks · 5 khối list · timeline · gợi ý AI (`lib/dashboard-demo.ts`) |
| Khóa học | KPI demo (`courses-demo.ts`) · bảng filter + mã demo · panel tab Tổng quan / Lớp / Lịch sử / Tài liệu · roster % điểm danh + TT |
| Lớp học | KPI demo (`classes-demo.ts`) · timeline hôm nay · bảng + % điểm danh · panel tab Tổng quan / Lịch / Điểm danh / Lịch sử · roster TT |
| Học viên | KPI demo (`students-demo.ts`) · phân khúc + chart · bảng chuyên cần/TT · panel profile + tab · auto chọn HV đầu |
| Giáo viên | KPI demo (`teachers-demo.ts`) · timeline hôm nay · bảng + rating/ca rảnh · panel tab Tổng quan / Lịch dạy / Lịch sử / Hiệu suất · khóa gán + CTA |
| Phòng | KPI demo (`rooms-demo.ts`) · timeline sử dụng hôm nay · bảng filter + % lấp · panel tab Tổng quan / Lịch hôm nay / Lịch sử / Bảo trì · form thêm/sửa |
| Stub | CRM bảng + panel · badge **Sắp có** · KPI `—` (không số liệu giả) |

Ẩn: Inbox, Tác vụ spa (`disabled`). Spa leftover: `components/ops/_quarantine_spa/`.

KPI / roster Khóa học: số **demo hardcode** (`lib/courses-demo.ts`) — trend %, mã khóa, % điểm danh, Đã/Chưa TT trên roster.

Seed: **12 phòng** · **14 GV** · ~24 khóa (9 core + filler) · ~39 HV (3 chưa ghi danh). Đồng hồ demo **24/08/2026 17:15 VN** (`DEMO_AS_OF_ISO`). Hero chat: Lan, Hương, Minh, An, Long (Long chưa trong Hip-hop). Lớp hôm nay có filler để board Phòng / Giáo viên đầy lịch.

## Chat

Mặc định đóng. Mở = drawer overlay, canvas không co.

`data/chat-actions.json` → `lib/intent.ts` `resolveChat`. Không NLU, không mở stub.

Thứ tự: ghi danh → sinh lớp → form khóa → 360 học viên → list học viên → lớp đang diễn ra → khóa học → tổng quan → list lớp.

Tile: Lớp hôm nay · Ghi danh Long · Hồ sơ Hương · Sinh lớp Waacking.
