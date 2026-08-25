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

Chat demo: `data/chat-actions.json`. Router `lib/intent.ts`.

## Sensitive → pause for human

Hủy lớp, payment, refund, delete.

Nav live vs stub: `HARDCODED_MENU`. Chat không mở stub / inbox / tác vụ spa. Chat drawer overlay (Ask Dolphin).
