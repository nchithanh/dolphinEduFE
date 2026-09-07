# Scope — first slice

Hardcoded FE only. No Go API.

## In

- One industry: **studio nhảy** — demo org **MA Dance** (discovery `/demos/ma-dance-discovery/` + báo giá `context/quotes/ma-dance.md`)
- Universe: **3 chi nhánh** (Quận 10 · Quận 3 · Phú Nhuận) · **7 phòng** (MI1, MI2, MON3, MON4, Room A, MI3, MI4)
- Hub Tổng quan: lưới hạng mục **A1–A14** + B preview — mỗi canvas có banner as-is → to-be
- Live canvas CRM: Dashboard · Khóa · Lớp · HV · GV · Phòng · Gói buổi · Điểm danh tay/QR · Lịch GCal trung tâm · Ghi danh giữa khóa · Promotion · Chăm sóc · Thu HP · Bảo lưu · Doanh thu · Phân quyền · Tác vụ · Thuê phòng · AI ops · Intelligent
- Preview B1 (không làm site thật): Website công khai · Portal HV/GV · Bán hàng · AI tuyển sinh 24/7
- Hidden (`disabled`): Inbox
- Nav nhóm: **Tổng quan · Quản lý · Tuyển sinh · Tài chính · Vận hành · Mặt ngoài · Cài đặt** — `lib/api-menu.ts`
- Chrome locale **VI | EN** (persist `edu-locale`). Theme **Light | Dark** (persist `edu-theme`, mặc định Light). Canvas + chat + seed vẫn VI.
- Select chi nhánh (`edu-branch`; id nội bộ `br-q1` / `br-td` / `br-tdc` = Q10 / Q3 / PN). Vai trò demo (`edu-role`).
- Seed `lib/seed.ts` + `quote-demo.ts`: ~24 khóa · ~39 HV · 18 tác vụ · ACL `lib/acl-demo.ts` (24 quyền · 12 TK · 4 vai). Đồng hồ `DEMO_AS_OF_ISO` (24/08/2026 17:15 VN)
- Actions: thêm HV vào khóa · sinh lớp · hủy lớp (không mất buổi) · điểm danh trừ buổi · duyệt bảo lưu · thu nợ demo
- Class status: upcoming / ongoing / completed / cancelled
- Chat keywords: `data/chat-actions.json`
- Visual: **nav | canvas**; chat overlay phải. Phone: drawer hamburger. Copy edu, không slogan spa.
- Spa leftover: `components/ops/_quarantine_spa/` (không import)

## Out

- Backend / menu API / OAuth Google / Zalo OA / cổng thanh toán thật
- Public student portal production (chỉ preview)
- Học bù (MA không học bù)
- Matching 1 khách : 1 slot (spa)
- Full ACL / JWT
- Public pricing / SLA (**TODO**)
- Deploy subdomain until requested
