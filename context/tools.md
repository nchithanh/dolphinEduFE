# Tools

Each tool: capability → UI. Chat routes to canvas, not text-only.

## First slice

| id | UI | Example intent |
| --- | --- | --- |
| `course` | Form / chi tiết khóa + roster | “Tạo khóa”, “Khóa học” |
| `enroll` | Thêm học viên vào khóa | “Thêm Long vào Hip-hop” |
| `generate` | Sinh lớp từ lịch mẫu | “Sinh lớp Waacking” |
| `class` | Board lớp + filter status | “Lớp đang diễn ra”, “Lớp hôm nay” |
| `student` | Student 360 | “Hồ sơ học viên Hương” |
| `task` | Bảng việc + lọc kiểu Jira + avatar · panel tab Tổng quan / Comment (preview 1 comment mới nhất) · form thêm | “Tác vụ”, “quản lý tác vụ” |
| `quote-scope` | Hub A1–A14 + banner as-is/to-be trên canvas (`lib/quote-scope.ts`) | Mở từ Tổng quan |
| `ai-ops` | Câu lệnh demo → form thu; cảnh báo hết buổi / nợ | Preview B2 |
| `intelligent` | Cảnh báo EOD + áp dụng giải pháp local | Preview B2 |

Chat demo: `data/chat-actions.json`. Router `lib/intent.ts`.

## Sensitive → pause for human

Hủy lớp, payment, refund, delete.

Nav live vs stub: `HARDCODED_MENU`. Chat không mở stub / inbox. Chat drawer overlay (Ask Dolphin).
