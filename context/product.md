# Product

**Dolphin Edu** is an **Agent CRM** (SaaS) for owners and staff of a dance studio. Internal operations — not a public student portal. First demo org: **MA Dance** (logo + black/ivory chrome in the FE demo).

Hardcoded FE demo. Domain is **course enrollment + class sessions**, not spa 1:1 booking.

B1 website / portal / store / AI Care on the quote are **preview canvases** in this app — not production public sites.

## Model

User intent → AI Agent → Business Tool → appropriate UI → user interaction → action.

Chat is **one** entry layer, not the whole product.

Signature: **AI does not replace the UI. It chooses the right UI.**

## Domain

| Entity | Role |
| --- | --- |
| Course | Admin creates: enroll window, teachers, capacity, weekly schedule, roster |
| Class | Session generated from course: start/end, sĩ số, status |
| Student | Enrollee on a **course** (not a single slot) |
| Teacher | Assigned to a course; appears on generated classes |
| Classroom | Studio / floor assigned to course and class |

Class status: **chưa diễn ra · đang diễn ra · hoàn thành · hủy**.

Staff demo (A1): **Chủ / Quản lý / Lễ tân / Giáo viên** — 24 quyền + 12 tài khoản (`lib/acl-demo.ts`). GV không xem học phí & SĐT học viên.

## Contrast with Ops

Dolphin Ops = spa/clinic/salon (1 khách : 1 slot). Edu = 1 khóa : N học viên : N buổi. Matching engine spa is not the product loop.
