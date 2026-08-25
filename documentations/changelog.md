# Changelog — Dolphin Edu frontend

## 2026-08-25

- **Mobile gate:** `< 48rem` hiện trang thông báo (VI/EN) — CRM chỉ dùng tablet/desktop; ẩn shell.
- **Premium dark AI CRM:** tokens bg `#090A16` / canvas `#070711` / sidebar `#0B0C1C` / surface `#111225` / elevated `#17182F` · accent `#7C3AED`–`#A855F7` · text `#F8F7FF` / `#A7A6BA` · border violet 18% · `color-scheme: dark` · chrome/table/chat/nav đồng bộ · success/warn/error chỉ cho trạng thái · không đổi logic/seed.
- **Tổng quan KPI:** bỏ icon tròn `ops-over__kpi-ico`.
- **Type body:** `--ops-type-body` `0.9rem` → `0.8rem`.
- **Bar Ask Dolphin:** cao `1.85rem` + canh giữa icon/chữ — thẳng hàng với lang / bell / avatar.
- **Bar:** bỏ nút «+ Quick add» / «Thêm nhanh» (`CanvasBar` + prop `onQuickAdd`).
- **HV xu hướng:** chart SVG cao cố định `3.25rem` (không phình theo width) · siết title/note — bỏ khoảng trống trong card.
- **HV phân khúc:** `.ops-seg` `align-items: start` — card «Phân khúc» không bị kéo cao theo «Xu hướng».
- **Chi tiết Lớp:** roster học viên `flex: 1` (bỏ max-height 14rem) — list lấp khoảng trống tới khối thao tác.
- **KPI equal height:** `.ops-kpi-row > li` stretch · card `height: 100%` · trend neo đáy — Lớp/Phòng/GV/Tổng quan đồng bộ.
- **Tăng chữ:** `html` root `100%` · type body `0.9` / meta `0.78` / section `1.05` / metric `1.575` / title `1.85`.
- **Ẩn scrollbar:** toàn app `scrollbar-width: none` + ẩn webkit — vẫn cuộn chuột/trackpad, không hiện thanh.
- **Ask AI panel:** layout theo marketing mockup — nền caro violet · card gợi ý 1 cột · icon ký hiệu · composer chip Ask + send vuông bo góc · copy EN chrome (router demo vẫn gửi câu VI).
- **Deploy GitHub Pages:** workflow `deploy-pages.yml` · static export (`GITHUB_PAGES=true`) · custom domain Cloudflare (`basePath` rỗng) · `documentations/deploy.md`.
- **Design system Phase 1:** tokens premium (`#F8F8FC` / `#8B5CF6` / radius 12 / type 28·16·24·14·12 / control 40px) · shell/nav/bar nhẹ · card/KPI/table/drawer/CTA đồng bộ qua `globals` + `chrome` + `EduTable` + `nexaflow` — không đổi logic.
- Seed GV: **14 giáo viên** (+Nam/Vy/Quân/Nga/Phúc/Hân/Đức/Trâm/Sơn) · gán lớp hôm nay cho GV mới · timeline «Lịch dạy hôm nay» equal height (`min-height` + line-clamp).
- Seed Phòng: **12 phòng** (+Studio B/C, TD-2, Open Floor TD bảo trì, TĐC-2) · +17 lớp filler `2026-08-24` lấp lịch/ca kế trên board Phòng.
- **Phòng Phase mockup:** KPI 6 hardcode (`rooms-demo.ts`) · timeline sử dụng 06–22 + mốc 17:15 · bảng khu/sức chứa/TB/status/lịch/% lấp · panel tab Tổng quan / Lịch hôm nay / Lịch sử / Bảo trì · CTA nhanh · giữ form thêm/sửa.
- Dashboard chart: plot `preserveAspectRatio=none` full-bleed · nhãn trục Y/X HTML (không nén) · `vector-effect` stroke.
- Premium SaaS polish (token-first): bg `#f7f6fb` · radius `0.75rem` · soft shadow/border · type title/section/body/meta · section gap `~1.15rem` · bỏ caro nền · nav active inset accent · canvas pad rộng hơn · Overview hierarchy + chart thấp hơn · CTA/KPI/table card đồng bộ.
- Compact scale mockup: nav `13rem` · aside `20rem` · radius `0.65rem` · header `3rem` · canvas `font-size 0.8125rem` · KPI/table/nav/bar denser (pad/type nhỏ hơn) · gap board `0.65rem`.
- Học viên chart thấp hơn: phân khúc stem/label gọn · trend SVG `h=52` + `max-height: 4.25rem` · `.ops-seg` pad/gap nhỏ.
- Dashboard chart doanh thu thấp hơn: SVG `h=110` · `max-height: 7.5rem` · bỏ `min-height: 12rem` panel.
- Dashboard layout theo mockup: chart|tasks `2fr/1fr` stretch · SVG `h=140` + fill · `max-height: 15rem` · 5 cột + footer denser · title «Doanh thu (VND)».
- Dashboard pixel-pass mockup: KPI icon tròn màu · chart May + select · task giờ|ưu tiên · AI card xanh · nav label «Tổng quan» · bỏ note demo dưới chart.
- Dashboard 5 cột + footer: `max-height` ~14.5rem / 13.5rem · list/table/timeline/AI scroll dọc trong card.
- Footer mockup: timeline giờ|mô tả|tag màu · AI 3 card ngang · chart SVG `preserveAspectRatio=none` full width.
- Dashboard 5 cột mockup: list row (không thead) · title có count · pill phòng/slot · tổng học phí tím · sĩ số đỏ khi full.
- Tune viewport density theo mockup HV: nav `15rem` · aside `min(24rem,30svw)` · canvas pad clamp · caro `2rem` mờ trên nền `#f6f5fa` · KPI 6 cột từ `60rem` + value `1.35rem` · CTA bo `0.65rem` · title `clamp` · board gap `0.85rem` (Khóa/Lớp/HV/GV sync token).
- **Giáo viên Phase mockup:** KPI 6 ô hardcode (`teachers-demo.ts` 28/24/6/68/92%/4.8) · timeline lịch dạy hôm nay · bảng filter + mã GV/rating/ca rảnh · panel tab Tổng quan / Lịch dạy / Lịch sử / Hiệu suất · layout 2 cột stretch + aside 28rem.
- **Học viên Phase mockup:** KPI 6 ô + trend (`students-demo.ts`) · phân khúc bar + chart · layout 2 cột · bảng chuyên cần/TT · panel profile/stats/tab · auto chọn HV đầu.
- Panel **Khóa học** theo mockup: head tên+chip · tab ngang (+ Ghi chú) · Tổng quan 2 cột · roster + CTA · footer Gửi thông báo / Xem chi tiết.
- Layout Khóa / Lớp theo mockup: crumb + head trong **cột trái**; panel detail **full height từ đỉnh** (ngang tiêu đề); nền caro ở `.ops-shell__main`.
- **Lớp học Phase mockup:** KPI 6 ô hardcode + trend (`lib/classes-demo.ts`) · chip ngày · cột % điểm danh · panel tab Tổng quan / Lịch học / Điểm danh / Lịch sử · roster % + TT · CTA 2×2 · layout stretch + aside 28rem.
- Seed lấp Khóa học: +10 HV · +15 khóa filler (mix tuyển/nháp/đóng; `sessionCount` thấp) · Hip-hop full 16 (Long vẫn ngoài) · `PAGE_SIZE` bảng khóa 12.
- **Khóa học Phase 2 mockup:** KPI hardcode 18/56/1.248/82% + trend (`lib/courses-demo.ts`) · chip khoảng ngày · mã khóa demo · panel tab Tổng quan / Lớp / Lịch sử / Tài liệu · roster bảng % điểm danh + Đã/Chưa TT.
- UI mockup **Dashboard · Khóa · Lớp · Học viên**: widget lưới, timeline lớp hôm nay, panel tab (live + stub). Giữ `EduTable` / `StatusChip`.
- Dashboard đủ block mockup: KPI trend · chart doanh thu · tasks · 5 list (lớp / học phí / chuyên cần / GV / phòng) · timeline · gợi ý AI — số **demo hardcode** (`lib/dashboard-demo.ts`).
- Seed đầy: đồng hồ demo **`DEMO_AS_OF` 2026-08-24 17:15 VN**; +GV Khoa/Thu; +phòng TD; +HV; Waacking + Open Practice TD đã sinh lớp; 3 HV chưa ghi danh.
- Hydration: `localIsoDate` / `atLocal` / greeting chat theo `Asia/Ho_Chi_Minh` (tránh lệch UTC server vs browser). `inert` nav/chat chỉ gắn khi đóng.
- Chat tile: icon SVG theo suggestion (calendar / plus / user / check), lưới 2 cột, border token CRM.

## 2026-08-24

- Phase 4: Stub **Sắp có** (Tuyển sinh / Tài chính / Cài đặt / Lịch…) — breadcrumb + KPI `—` + bảng + panel (cùng `EduTable`). KPI seed UI chỉ đếm dòng minh họa; không invent học phí.
- Phase 4: Spa leftover → `components/ops/_quarantine_spa/` (`BookingForm`, `TodayList`, `Inbox`, `TaskList`, `ApprovalPanel`, `PageToolbar`).
- Phase 3: **Dashboard · Giáo viên · Phòng** — KPI + bảng + panel (cùng `EduTable.css`).
- Phase 2: **Lớp học** + **Học viên** — KPI, bảng filter/pagination, panel chi tiết (cùng chrome bảng Khóa học). Shared `EduTable.css`.
- Phase 1 chrome theo mockup CRM: nav **Tổng quan / Quản lý / Tuyển sinh / Tài chính / Cài đặt**. Chat **kéo ra từ phải** (mặc định đóng). Bỏ lưới chấm canvas.
- Khóa học: KPI seed, bảng + filter, panel chi tiết, **+ Thêm nhanh** / Ask Dolphin trên top bar.
- Redesign domain **Course → ghi danh → sinh Lớp**. Bỏ loop matching spa (1 khách : 1 slot).
- Khóa: cửa sổ tuyển sinh, GV, sĩ số, lịch tuần, roster, Sinh lớp.
- Lớp: start/end, sĩ số, status chưa diễn ra / đang diễn ra / hoàn thành / hủy.
- Live nav: Dashboard · Khóa học · Lớp học · Học viên · Giáo viên · Phòng. Inbox + Tác vụ ẩn.
- Chat: ghi danh, sinh lớp, tạo khóa, lớp đang diễn ra.
- Persist `edu-locale` / `edu-branch` (tách key Ops).
- `next.config.ts`: `turbopack.root` = folder FE (tránh lock chung với Ops).
- Greeting chat set sau mount (tránh hydration lệch timezone).
- Seed: Hip-hop / Contemporary / Ballet / Jazz / K-pop / Heels / Kids / Waacking.
