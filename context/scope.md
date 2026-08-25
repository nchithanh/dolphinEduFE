# Scope — first slice

Hardcoded FE only. No Go API.

## In

- One industry: **studio nhảy** (demo org Pulse Studio)
- Live canvas: **Dashboard · Khóa học · Lớp học · Học viên · Giáo viên · Phòng**
- Hidden (`disabled`, không *Sắp có*): Inbox, Tác vụ spa
- Nav nhóm: **Tổng quan · Quản lý · Tuyển sinh · Tài chính · Cài đặt** — `lib/api-menu.ts`. Stub *Sắp có*. Chat không mở stub.
- Chrome locale **VI | EN** (persist `edu-locale`). Canvas + chat + seed vẫn VI.
- Select chi nhánh (persist `edu-branch`). Phòng lọc theo branch.
- Seed `lib/seed.ts`: ~24 khóa dance · ~39 HV · lớp sinh từ lịch; đồng hồ demo `DEMO_AS_OF_ISO` (24/08/2026 17:15 VN)
- Course: cửa sổ tuyển sinh, GV, sĩ số, lịch tuần, roster
- Actions: **thêm học viên vào khóa**, **sinh lớp** (idempotent), **hủy lớp**
- Class status: upcoming / ongoing / completed / cancelled
- Tools: Course / Class / Student / Teacher / Room **tables** + detail panels, Dashboard tables, Student 360
- Stub canvas: cùng language bảng CRM; KPI placeholder `—`; không action / không số tài chính giả
- Chat keywords: `data/chat-actions.json`
- Visual: **nav | canvas**; chat **kéo ra từ phải** (overlay, mặc định đóng). Copy edu, không slogan spa.
- Spa leftover: `components/ops/_quarantine_spa/` (không import)

## Out

- Backend / menu API
- Payment, Inventory, điểm danh thật (cột học phí trên roster không hiện số bịa)
- Matching 1 khách : 1 slot (spa)
- Full ACL
- Public pricing / SLA (**TODO**)
- Deploy subdomain until requested
