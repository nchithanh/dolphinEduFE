import { formatViDate, localIsoDate } from "./edu";
import { STAFF_AVATARS } from "./people-demo";
import type { DemoStudioTask, StudioTaskPriority, StudioTaskStatus } from "./types";

export const TASK_ASSIGNEES = [
  { id: "ha", name: "Hà Nguyễn", role: "Điều phối", avatar: STAFF_AVATARS.ha },
  { id: "mai", name: "Mai Trần", role: "Giáo viên", avatar: STAFF_AVATARS.mai },
  { id: "khoa", name: "Khoa Võ", role: "Giáo viên", avatar: STAFF_AVATARS.khoa },
  { id: "linh", name: "Linh Phạm", role: "Giáo viên", avatar: STAFF_AVATARS.linh },
  { id: "an", name: "An Lê", role: "Lễ tân", avatar: STAFF_AVATARS.an },
] as const;

export type TaskAssigneeId = (typeof TASK_ASSIGNEES)[number]["id"];

export const TASK_STATUS_LABEL: Record<StudioTaskStatus, string> = {
  todo: "Chờ",
  doing: "Đang làm",
  done: "Xong",
  cancelled: "Hủy",
};

export const TASK_PRIORITY_LABEL: Record<StudioTaskPriority, string> = {
  high: "Cao",
  mid: "Trung bình",
  low: "Thấp",
};

export const TASK_PRIORITIES: StudioTaskPriority[] = ["high", "mid", "low"];

export const DEMO_STUDIO_TASKS: DemoStudioTask[] = [
  {
    id: "tv-12",
    code: "TV-0012",
    title: "Xác nhận sĩ số Heels tối nay",
    detail:
      "Studio 2 · ca 17:00–18:30. Đếm sĩ số trên roster, nhắn HV chưa xác nhận, báo Hà trước khi mở cửa nếu dưới 8 người. Heels hay đầy phút chót — ưu tiên giữ chỗ HV cũ.",
    note: "Heels hay đầy phút chót. Ưu tiên giữ chỗ HV cũ.",
    assigneeId: "mai",
    reporterId: "ha",
    status: "doing",
    priority: "high",
    due: "2026-08-24",
    dueTime: "16:30",
    created: "2026-08-24",
    courseName: "Heels Open",
    branchId: "br-q1",
    roomLabel: "Studio 2",
    checklist: [
      { id: "c12-1", text: "Đếm roster trên bảng", done: true },
      { id: "c12-2", text: "Nhắn HV chưa xác nhận", done: false },
      { id: "c12-3", text: "Báo Hà nếu dưới 8 người", done: false },
    ],
    history: [
      { at: "08:10", text: "Hà Nguyễn giao cho Mai Trần." },
      { at: "10:30", text: "Mai nhận việc — đang đối chiếu roster." },
      { at: "15:00", text: "Mai: đã đếm 9/12, còn 2 HV chưa trả lời Zalo." },
    ],
    comments: [
      { id: "cm-12a", authorId: "ha", at: "08:12", text: "Mai ơi ca 17:00 dễ thiếu — nhắn sớm giúp Hà." },
      { id: "cm-12b", authorId: "mai", at: "15:02", text: "9/12 rồi. Còn Lan với My chưa rep Zalo, em nhắn thêm 1 lần." },
    ],
  },
  {
    id: "tv-13",
    code: "TV-0013",
    title: "Gọi phụ huynh Kids vắng 2 buổi",
    detail:
      "4 case phụ huynh trên roster Kids 5–8 (chi nhánh Thảo Điền) vắng 2 buổi liên tiếp. Gọi trong giờ hành chính, ghi chú hồ sơ sau mỗi cuộc. Không nhắc học phí trên cuộc gọi này.",
    note: "Không nhắc học phí trên cuộc gọi này — chỉ chuyên cần.",
    assigneeId: "an",
    reporterId: "ha",
    status: "todo",
    priority: "high",
    due: "2026-08-24",
    dueTime: "17:00",
    created: "2026-08-23",
    courseName: "Kids 5–8",
    studentName: "4 phụ huynh Kids 5–8",
    branchId: "br-td",
    roomLabel: "Kids Room",
    checklist: [
      { id: "c13-1", text: "Gọi PH bé Minh", done: false },
      { id: "c13-2", text: "Gọi PH bé Hà", done: false },
      { id: "c13-3", text: "Gọi PH bé My", done: false },
      { id: "c13-4", text: "Ghi chú hồ sơ sau gọi", done: false },
    ],
    history: [
      { at: "23/08", text: "Hà Nguyễn tạo việc từ roster chuyên cần." },
      { at: "09:15", text: "An Lê xem danh sách — chưa gọi." },
    ],
    comments: [
      { id: "cm-13a", authorId: "ha", at: "09:20", text: "Gọi trước 17:00 giúp. Không nhắc học phí trên máy." },
      { id: "cm-13b", authorId: "an", at: "11:05", text: "PH bé Minh máy bận. Em gọi lại sau giờ trưa." },
    ],
  },
  {
    id: "tv-14",
    code: "TV-0014",
    title: "Đổi loa Studio 1 trước ca 19:00",
    detail:
      "Loa Studio 1 rè từ ca chiều. Mang loa dự phòng (kho lễ tân) lên phòng, test bass + micro trước 18:30 — Mai vào Hip-hop 19:00. Nếu hết loa kho thì mượn Studio B.",
    note: "Loa dự phòng ở kho lễ tân. Nếu hết thì mượn Studio B.",
    assigneeId: "ha",
    reporterId: "mai",
    status: "doing",
    priority: "high",
    due: "2026-08-24",
    dueTime: "18:30",
    created: "2026-08-24",
    courseName: "Hip-hop Open",
    branchId: "br-q1",
    roomLabel: "Studio 1",
    checklist: [
      { id: "c14-1", text: "Mang loa dự phòng lên Studio 1", done: true },
      { id: "c14-2", text: "Test bass + micro", done: false },
      { id: "c14-3", text: "Báo Mai khi xong", done: false },
    ],
    history: [
      { at: "14:20", text: "Mai Trần báo loa rè ca chiều." },
      { at: "14:35", text: "Hà nhận — lấy loa kho." },
      { at: "16:40", text: "Hà: loa đã lên phòng, chưa test." },
    ],
    comments: [
      { id: "cm-14a", authorId: "mai", at: "14:22", text: "Loa rè từ ca 16:00. HV kêu bass rè." },
      { id: "cm-14b", authorId: "ha", at: "16:42", text: "Loa dự phòng đã lên Studio 1. Test trước 18:30." },
    ],
  },
  {
    id: "tv-15",
    code: "TV-0015",
    title: "Nhắc Long đóng học phí Hip-hop",
    detail: "Chưa ghi nhận đợt 2. Chỉ nhắc — không thu trên cổng HV.",
    note: "Long hay trả qua chuyển khoản. Gửi STK studio, không nhận tiền mặt ca tối.",
    assigneeId: "an",
    reporterId: "ha",
    status: "todo",
    priority: "mid",
    due: "2026-08-25",
    dueTime: "12:00",
    created: "2026-08-23",
    courseName: "Hip-hop Open",
    studentName: "Long Đỗ",
    branchId: "br-q1",
    roomLabel: "Studio 1",
    checklist: [
      { id: "c15-1", text: "Nhắn Zalo Long", done: false },
      { id: "c15-2", text: "Ghi hạn đóng vào hồ sơ", done: false },
    ],
    history: [
      { at: "23/08", text: "Hà Nguyễn giao An — học phí đợt 2 chưa vào." },
    ],
    comments: [
      { id: "cm-15a", authorId: "ha", at: "23/08", text: "Chỉ nhắc. Không thu tiền mặt ca tối." },
      { id: "cm-15b", authorId: "an", at: "10:40", text: "Long hay CK. Em gửi STK studio trên Zalo." },
    ],
  },
  {
    id: "tv-16",
    code: "TV-0016",
    title: "Tìm GV thay Khoa thứ Năm",
    detail:
      "Khoa báo nghỉ ca House thứ Năm tuần này (Studio B, khoảng 19:00). Không đổi lịch khóa — chỉ tìm GV dạy buổi đó. Ưu tiên Nam Lê; nếu Nam bận thì hỏi Sơn Đỗ. Hà xác nhận với HV trước 09:00 ngày 25/08.",
    note: "Không đổi lịch khóa. Chỉ tìm người dạy buổi đó.",
    assigneeId: "ha",
    reporterId: "khoa",
    status: "todo",
    priority: "high",
    due: "2026-08-25",
    dueTime: "09:00",
    created: "2026-08-24",
    courseName: "House Open",
    branchId: "br-q1",
    roomLabel: "Studio B",
    checklist: [
      { id: "c16-1", text: "Hỏi Nam Lê", done: false },
      { id: "c16-2", text: "Hỏi Sơn Đỗ nếu Nam bận", done: false },
      { id: "c16-3", text: "Cập nhật lịch tuần khi có người", done: false },
    ],
    history: [
      { at: "11:05", text: "Khoa Võ báo nghỉ ca House T5." },
      { at: "11:20", text: "Hà nhận việc." },
    ],
    comments: [
      { id: "cm-16a", authorId: "khoa", at: "11:08", text: "Xin nghỉ T5 House — đau gối. Nam rảnh thì ổn." },
      { id: "cm-16b", authorId: "ha", at: "11:25", text: "Ok. Mình hỏi Nam trước, Sơn dự phòng. Không đổi lịch khóa." },
      { id: "cm-16c", authorId: "mai", at: "14:10", text: "Nam dạy K-pop T5 18:00 Q1 — check ca House có chồng không." },
    ],
  },
  {
    id: "tv-17",
    code: "TV-0017",
    title: "In roster Waacking tuần này",
    detail: "Đã in và dán phòng. Demo FE.",
    note: "Bản in để cửa Studio 2. File gốc trên máy lễ tân.",
    assigneeId: "mai",
    reporterId: "ha",
    status: "done",
    priority: "low",
    due: "2026-08-23",
    dueTime: "09:00",
    created: "2026-08-22",
    courseName: "Waacking",
    branchId: "br-q1",
    roomLabel: "Studio 2",
    checklist: [
      { id: "c17-1", text: "In roster A4", done: true },
      { id: "c17-2", text: "Dán cửa phòng", done: true },
    ],
    history: [
      { at: "22/08", text: "Hà Nguyễn giao Mai." },
      { at: "23/08", text: "Mai in và dán xong." },
    ],
    comments: [{ id: "cm-17a", authorId: "mai", at: "23/08", text: "Đã dán cửa Studio 2. File gốc máy lễ tân." }],
  },
  {
    id: "tv-18",
    code: "TV-0018",
    title: "Cập nhật lịch tuần Contemporary",
    detail: "Hủy — trùng workshop CN. Không đổi lịch khóa.",
    note: "Workshop CN giữ nguyên. HV Contemporary được báo qua Zalo nhóm.",
    assigneeId: "ha",
    reporterId: "ha",
    status: "cancelled",
    priority: "mid",
    due: "2026-08-22",
    dueTime: "18:00",
    created: "2026-08-21",
    courseName: "Contemporary",
    branchId: "br-td",
    roomLabel: "Studio 3",
    checklist: [
      { id: "c18-1", text: "Đối chiếu lịch workshop CN", done: true },
      { id: "c18-2", text: "Sửa lịch khóa Contemporary", done: false },
    ],
    history: [
      { at: "21/08", text: "Hà tự giao — nghi trùng workshop." },
      { at: "22/08", text: "Hủy việc: giữ workshop, không đổi lịch khóa." },
    ],
    comments: [
      { id: "cm-18a", authorId: "ha", at: "22/08", text: "Giữ workshop CN. HV Contemporary đã báo Zalo nhóm." },
    ],
  },
  {
    id: "tv-19",
    code: "TV-0019",
    title: "Follow-up HV hết khóa Jazz",
    detail: "Danh sách 6 HV sắp hết buổi. Nhắn Zalo gia hạn.",
    note: "Ưu tiên HV đi đều. Không đẩy bán khóa mới nếu HV xin nghỉ.",
    assigneeId: "ha",
    reporterId: "an",
    status: "todo",
    priority: "mid",
    due: "2026-08-26",
    dueTime: "18:00",
    created: "2026-08-24",
    courseName: "Jazz Open",
    studentName: "6 HV Jazz Open",
    branchId: "br-q1",
    roomLabel: "Studio C",
    checklist: [
      { id: "c19-1", text: "Lọc HV còn ≤ 2 buổi", done: true },
      { id: "c19-2", text: "Soạn tin Zalo mẫu", done: false },
      { id: "c19-3", text: "Gửi từng HV", done: false },
    ],
    history: [
      { at: "09:40", text: "An Lê gửi danh sách 6 HV cho Hà." },
      { at: "10:05", text: "Hà nhận follow-up." },
    ],
    comments: [
      { id: "cm-19a", authorId: "an", at: "09:42", text: "6 HV còn ≤ 2 buổi. List gửi Zalo Hà." },
      { id: "cm-19b", authorId: "ha", at: "10:08", text: "Ưu tiên HV đi đều. Đừng đẩy bán nếu xin nghỉ." },
    ],
  },
  {
    id: "tv-20",
    code: "TV-0020",
    title: "Kiểm tra gương Studio TD",
    detail: "Chi nhánh Thảo Điền — khe hở cạnh tường.",
    note: "Chưa mở ticket bảo trì. Nếu nguy hiểm thì đóng ca Open Practice.",
    assigneeId: "an",
    reporterId: "ha",
    status: "doing",
    priority: "mid",
    due: "2026-08-24",
    dueTime: "16:00",
    created: "2026-08-24",
    branchId: "br-td",
    roomLabel: "Open Floor TD",
    checklist: [
      { id: "c20-1", text: "Xem khe hở tại chỗ", done: true },
      { id: "c20-2", text: "Chụp ảnh gửi Hà", done: false },
      { id: "c20-3", text: "Quyết đóng / mở ca tối", done: false },
    ],
    history: [
      { at: "08:50", text: "Hà Nguyễn giao An — GV báo gương lệch." },
      { at: "13:20", text: "An đã qua phòng, khe ~1 cm." },
    ],
    comments: [
      { id: "cm-20a", authorId: "an", at: "13:22", text: "Khe ~1 cm cạnh tường. Chưa lung lay. Chụp ảnh gửi sau." },
      { id: "cm-20b", authorId: "ha", at: "13:40", text: "Nếu ca tối Open Practice đông thì đứng xa gương đó." },
    ],
  },
  {
    id: "tv-21",
    code: "TV-0021",
    title: "Soạn tin khai giảng khóa mới",
    detail: "Nháp Zalo OA. Duyệt với Hà trước khi gửi.",
    note: "Khóa khai giảng tuần sau. Không gửi chiến dịch hàng loạt — chỉ OA.",
    assigneeId: "ha",
    reporterId: "ha",
    status: "todo",
    priority: "low",
    due: "2026-08-27",
    dueTime: "10:00",
    created: "2026-08-24",
    branchId: "br-q1",
    checklist: [
      { id: "c21-1", text: "Nháp tin OA", done: false },
      { id: "c21-2", text: "Duyệt nội dung", done: false },
    ],
    history: [
      { at: "16:10", text: "Hà tự tạo việc — lịch khai giảng tuần sau." },
    ],
    comments: [{ id: "cm-21a", authorId: "ha", at: "16:12", text: "Nháp OA, không gửi chiến dịch hàng loạt." }],
  },
  {
    id: "tv-22",
    code: "TV-0022",
    title: "Gửi clip nhận xét Kids 5–8",
    detail: "Đã gửi phụ huynh 3 clip. Demo FE.",
    note: "Clip nằm folder Drive lễ tân. Không đăng public.",
    assigneeId: "linh",
    reporterId: "ha",
    status: "done",
    priority: "mid",
    due: "2026-08-23",
    dueTime: "20:00",
    created: "2026-08-22",
    courseName: "Kids 5–8",
    studentName: "3 bé Kids 5–8",
    branchId: "br-td",
    roomLabel: "Kids Room",
    checklist: [
      { id: "c22-1", text: "Cắt 3 clip nhận xét", done: true },
      { id: "c22-2", text: "Gửi PH qua Zalo", done: true },
    ],
    history: [
      { at: "22/08", text: "Hà Nguyễn giao Linh Phạm." },
      { at: "23/08", text: "Linh gửi xong 3 clip." },
    ],
    comments: [{ id: "cm-22a", authorId: "linh", at: "23/08", text: "3 clip đã gửi PH. Không up public." }],
  },
  {
    id: "tv-23",
    code: "TV-0023",
    title: "Book phòng thêm workshop CN",
    detail: "Cần Floor A nếu Studio 1 kín. Chỉ ghi việc — chưa module book phòng.",
    note: "Module book phòng chưa live. Việc này chỉ theo dõi tay.",
    assigneeId: "khoa",
    reporterId: "ha",
    status: "todo",
    priority: "mid",
    due: "2026-08-28",
    dueTime: "12:00",
    created: "2026-08-24",
    branchId: "br-q1",
    roomLabel: "Floor A",
    checklist: [
      { id: "c23-1", text: "Xem Studio 1 CN còn trống không", done: false },
      { id: "c23-2", text: "Giữ Floor A dự phòng", done: false },
    ],
    history: [
      { at: "16:45", text: "Hà Nguyễn giao Khoa — workshop CN thiếu phòng." },
    ],
    comments: [
      { id: "cm-23a", authorId: "ha", at: "16:48", text: "Studio 1 CN có thể kín. Giữ Floor A dự phòng — chưa có module book phòng." },
    ],
  },
];

export function cloneSeedStudioTasks(): DemoStudioTask[] {
  return DEMO_STUDIO_TASKS.map((row) => ({
    ...row,
    checklist: row.checklist.map((item) => ({ ...item })),
    history: row.history.map((item) => ({ ...item })),
    comments: row.comments.map((item) => ({ ...item })),
  }));
}

export function assigneeById(id: string) {
  return TASK_ASSIGNEES.find((row) => row.id === id) ?? TASK_ASSIGNEES[0];
}

export function isTaskOpen(status: StudioTaskStatus): boolean {
  return status === "todo" || status === "doing";
}

export function taskDueBucket(due: string, today = localIsoDate()): "overdue" | "today" | "later" {
  if (due < today) return "overdue";
  if (due === today) return "today";
  return "later";
}

export function formatDueLine(due: string, dueTime?: string): string {
  const date = formatViDate(due);
  return dueTime ? `${date} · ${dueTime}` : date;
}

export function studioTaskKpis(tasks: DemoStudioTask[], today = localIsoDate()) {
  const open = tasks.filter((t) => isTaskOpen(t.status));
  const overdue = open.filter((t) => t.due < today).length;
  const dueToday = open.filter((t) => t.due === today).length;
  return [
    { id: "total", label: "Tổng việc", value: String(tasks.length), trend: "+4", up: true, ico: "▣" },
    { id: "todo", label: "Chờ", value: String(tasks.filter((t) => t.status === "todo").length), trend: "+2", up: true, ico: "○" },
    { id: "doing", label: "Đang làm", value: String(tasks.filter((t) => t.status === "doing").length), trend: "0", up: true, ico: "◐" },
    { id: "today", label: "Hạn hôm nay", value: String(dueToday), trend: "+1", up: true, ico: "◷" },
    { id: "overdue", label: "Quá hạn", value: String(overdue), trend: "−1", up: false, ico: "!" },
    { id: "done", label: "Xong", value: String(tasks.filter((t) => t.status === "done").length), trend: "+3", up: true, ico: "✓" },
  ];
}
