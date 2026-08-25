/** Dashboard demo numbers — hardcode FE only, chưa API. */

export const DASH_KPI = [
  {
    id: "students",
    label: "Học viên đang học",
    value: "1.248",
    trend: "+8,6%",
    up: true,
    go: "students" as const,
    ico: "◎",
    tone: "violet" as const,
  },
  {
    id: "today",
    label: "Lớp học hôm nay",
    value: "42",
    trend: "+5 lớp",
    up: true,
    go: "classes" as const,
    ico: "▣",
    tone: "blue" as const,
  },
  {
    id: "revenue",
    label: "Doanh thu tháng này",
    value: "1.285.000.000",
    trend: "+12,4%",
    up: true,
    go: "invoices" as const,
    ico: "₫",
    tone: "green" as const,
  },
  {
    id: "fill",
    label: "Tỉ lệ lấp đầy",
    value: "78,3%",
    trend: "+6,1%",
    up: true,
    go: "courses" as const,
    ico: "◐",
    tone: "orange" as const,
  },
  {
    id: "follow",
    label: "Học viên cần follow-up",
    value: "56",
    trend: "−8",
    up: false,
    go: "students" as const,
    ico: "☎",
    tone: "violet" as const,
  },
  {
    id: "risk",
    label: "Lớp có rủi ro",
    value: "7",
    trend: "−2",
    up: false,
    go: "classes" as const,
    ico: "!",
    tone: "red" as const,
  },
];

/** Chart điểm trong tháng — thực tế / dự kiến (triệu VND). */
export const DASH_REVENUE_POINTS = [
  { m: "01/05", actual: 180, forecast: 160 },
  { m: "06/05", actual: 320, forecast: 300 },
  { m: "11/05", actual: 480, forecast: 460 },
  { m: "16/05", actual: 620, forecast: 640 },
  { m: "21/05", actual: 860, forecast: 820 },
  { m: "26/05", actual: 1050, forecast: 980 },
  { m: "31/05", actual: 1285, forecast: 1180 },
];

export const DASH_TASKS = [
  {
    id: "t1",
    time: "09:00",
    title: "Follow-up 23 học viên chưa phản hồi",
    hint: "Học phí · Zalo",
    tone: "high" as const,
    go: "payment" as const,
  },
  {
    id: "t2",
    time: "10:30",
    title: "Xác nhận sĩ số Heels · Studio 2",
    hint: "Lớp học",
    tone: "high" as const,
    go: "classes" as const,
  },
  {
    id: "t3",
    time: "11:30",
    title: "Gọi phụ huynh Kids 5–8 (4 case)",
    hint: "Học viên",
    tone: "mid" as const,
    go: "students" as const,
  },
  {
    id: "t4",
    time: "14:00",
    title: "Duyệt chiến dịch Zalo khóa mới",
    hint: "Tuyển sinh",
    tone: "mid" as const,
    go: "campaigns" as const,
  },
  {
    id: "t5",
    time: "15:30",
    title: "Rà phòng trống chi nhánh Thảo Điền",
    hint: "Phòng",
    tone: "low" as const,
    go: "classrooms" as const,
  },
];

export const DASH_TUITION = [
  { id: "p1", name: "Hương Trần", amount: "4.500.000", due: "25/08" },
  { id: "p2", name: "Long Đỗ", amount: "3.200.000", due: "26/08" },
  { id: "p3", name: "My Đặng", amount: "4.500.000", due: "27/08" },
  { id: "p4", name: "Nam Cao", amount: "2.800.000", due: "28/08" },
  { id: "p5", name: "Bích Ngọc", amount: "3.900.000", due: "29/08" },
];

export const DASH_TUITION_TOTAL = "19.000.000";

export const DASH_LOW_ATTEND = [
  { id: "a1", name: "Ballet Beginner", pct: 61 },
  { id: "a2", name: "Kids 5–8", pct: 68 },
  { id: "a3", name: "Jazz Open", pct: 72 },
  { id: "a4", name: "Waacking", pct: 74 },
  { id: "a5", name: "Open Practice TD", pct: 70 },
];

export const DASH_ACTIVITY = [
  {
    id: "e1",
    who: "Lan Nguyễn",
    verb: "đã ghi danh",
    focus: "Hip-hop Open",
    tag: "Ghi danh",
    tone: "enroll" as const,
    time: "09:15",
  },
  {
    id: "e2",
    who: "Mai Trần",
    verb: "đã tạo lớp",
    focus: "Waacking – K8",
    tag: "Lớp học",
    tone: "class" as const,
    time: "09:42",
  },
  {
    id: "e3",
    who: "Hà Nguyễn",
    verb: "đã điểm danh",
    focus: "Heels · 6/6",
    tag: "Điểm danh",
    tone: "attend" as const,
    time: "10:05",
  },
  {
    id: "e4",
    who: "Hương Trần",
    verb: "đã thanh toán",
    focus: "4.500.000₫",
    tag: "Thanh toán",
    tone: "pay" as const,
    time: "10:28",
  },
  {
    id: "e5",
    who: "Linh Phạm",
    verb: "đã đánh giá",
    focus: "Kids 5–8",
    tag: "Đánh giá",
    tone: "rate" as const,
    time: "11:10",
  },
  {
    id: "e6",
    who: "Khoa Võ",
    verb: "đã mở",
    focus: "Open Practice TD",
    tag: "Lớp học",
    tone: "class" as const,
    time: "11:45",
  },
];

export const DASH_AI = [
  { id: "ai1", title: "Khóa nào sắp đầy?", hint: "Xem các khóa lấp đầy > 90%", go: "courses" as const },
  { id: "ai2", title: "Lớp nào cần theo dõi?", hint: "Chuyên cần thấp tuần này", go: "classes" as const },
  { id: "ai3", title: "Hôm nay có phòng trống nào?", hint: "Slot còn trống theo studio", go: "classrooms" as const },
];
