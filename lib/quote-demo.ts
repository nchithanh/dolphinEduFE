import type {
  AttendanceMap,
  CalendarLink,
  CareBlast,
  FeeReceipt,
  HoldRequest,
  MidEnrollRule,
  PromoCode,
  QuoteDemoState,
  SessionPack,
  StudioRental,
} from "./types";

function cloneAttendance(map: AttendanceMap): AttendanceMap {
  const next: AttendanceMap = {};
  for (const classId of Object.keys(map)) {
    next[classId] = { ...map[classId] };
  }
  return next;
}

/** Heels đang diễn ra 24/08 17:00 — seed điểm danh một phần. */
const SEED_ATTENDANCE: AttendanceMap = {
  "cls-crs-heels-1": {
    "st-2": "present",
    "st-7": "present",
    "st-13": "absent",
    "st-9": "present",
    "st-15": "present",
    "st-19": "absent",
    "st-22": "present",
    "st-24": "present",
    "st-26": "present",
    "st-28": "present",
  },
  "cls-fill-gb-kids": {
    "st-k1": "present",
    "st-k2": "present",
    "st-k3": "absent",
  },
};

const SEED_PACKAGES: SessionPack[] = [
  { id: "pk-1", studentId: "st-2", catalog: "12m", label: "Gói 12 tháng · 96 buổi", total: 96, remaining: 71, branchId: "br-q1", status: "active", deposit: true },
  { id: "pk-2", studentId: "st-1", catalog: "6m", label: "Gói 6 tháng · 48 buổi", total: 48, remaining: 22, branchId: "br-q1", status: "active", deposit: true },
  { id: "pk-3", studentId: "st-14", catalog: "3m", label: "Gói 3 tháng · 24 buổi", total: 24, remaining: 18, branchId: "br-q1", status: "active", deposit: false },
  { id: "pk-4", studentId: "st-k1", catalog: "6m", label: "Kids · 6 tháng", total: 48, remaining: 31, branchId: "br-td", status: "active", deposit: false },
  { id: "pk-5", studentId: "st-k3", catalog: "1m", label: "Kids · 1 tháng", total: 8, remaining: 2, branchId: "br-td", status: "active", deposit: false },
  { id: "pk-6", studentId: "st-13", catalog: "3m", label: "Gói 3 tháng · 24 buổi", total: 24, remaining: 4, branchId: "br-td", status: "active", deposit: false },
  { id: "pk-7", studentId: "st-6", catalog: "12m", label: "Gói 12 tháng · 96 buổi", total: 96, remaining: 40, branchId: "br-tdc", status: "hold", deposit: true },
  { id: "pk-8", studentId: "st-3", catalog: "1m", label: "Gói 1 tháng · 8 buổi", total: 8, remaining: 0, branchId: "br-q1", status: "expired", deposit: false },
  { id: "pk-9", studentId: "st-4", catalog: "6m", label: "Gói 6 tháng · 48 buổi", total: 48, remaining: 40, branchId: "br-q1", status: "active", deposit: true },
  { id: "pk-10", studentId: "st-8", catalog: "3m", label: "Gói 3 tháng · 24 buổi", total: 24, remaining: 11, branchId: "br-q1", status: "active", deposit: false },
  { id: "pk-11", studentId: "st-10", catalog: "12m", label: "Gói 12 tháng · 96 buổi", total: 96, remaining: 88, branchId: "br-td", status: "active", deposit: true },
  { id: "pk-12", studentId: "st-15", catalog: "1m", label: "Gói 1 tháng · 8 buổi", total: 8, remaining: 5, branchId: "br-td", status: "active", deposit: false },
  { id: "pk-13", studentId: "st-20", catalog: "6m", label: "Gói 6 tháng · 48 buổi", total: 48, remaining: 3, branchId: "br-tdc", status: "active", deposit: true },
  { id: "pk-14", studentId: "st-22", catalog: "3m", label: "Gói 3 tháng · 24 buổi", total: 24, remaining: 19, branchId: "br-tdc", status: "active", deposit: false },
  { id: "pk-15", studentId: "st-k4", catalog: "6m", label: "Kids · 6 tháng", total: 48, remaining: 44, branchId: "br-td", status: "active", deposit: false },
  { id: "pk-16", studentId: "st-k5", catalog: "3m", label: "Kids · 3 tháng", total: 24, remaining: 9, branchId: "br-td", status: "active", deposit: false },
  { id: "pk-17", studentId: "st-25", catalog: "12m", label: "Gói 12 tháng · 96 buổi", total: 96, remaining: 12, branchId: "br-q1", status: "hold", deposit: true },
  { id: "pk-18", studentId: "st-28", catalog: "1m", label: "Gói 1 tháng · 8 buổi", total: 8, remaining: 0, branchId: "br-tdc", status: "expired", deposit: false },
];

const SEED_RECEIPTS: FeeReceipt[] = [
  { id: "rc-1", studentId: "st-2", amount: 14400000, method: "transfer", hasBill: true, date: "2026-08-02", branchId: "br-q1", note: "Gói 12 tháng · CK + ảnh bill", debt: false, installment: false },
  { id: "rc-2", studentId: "st-1", amount: 3600000, method: "cash", hasBill: false, date: "2026-08-05", branchId: "br-q1", note: "Đợt 1 / 2 gói 6 tháng", debt: false, installment: true },
  { id: "rc-3", studentId: "st-14", amount: 2400000, method: "online", hasBill: false, date: "2026-08-18", branchId: "br-q1", note: "Cổng online CRM (B2)", debt: false, installment: false },
  { id: "rc-4", studentId: "st-k1", amount: 4800000, method: "transfer", hasBill: true, date: "2026-07-28", branchId: "br-td", note: "PH Chị Hoa thanh toán", debt: false, installment: false },
  { id: "rc-5", studentId: "st-13", amount: 0, method: "cash", hasBill: false, date: "2026-08-20", branchId: "br-td", note: "Nợ — vẫn vào lớp, thu sau", debt: true, installment: true },
  { id: "rc-6", studentId: "st-7", amount: 1200000, method: "cash", hasBill: false, date: "2026-08-10", branchId: "br-q1", note: "Gói 1 tháng", debt: false, installment: false },
  { id: "rc-7", studentId: "st-6", amount: 7200000, method: "transfer", hasBill: true, date: "2026-06-15", branchId: "br-tdc", note: "Cọc gói 12 tháng", debt: false, installment: false },
  { id: "rc-8", studentId: "st-k3", amount: 800000, method: "cash", hasBill: false, date: "2026-08-01", branchId: "br-td", note: "Kids 1 tháng · PH", debt: false, installment: false },
  { id: "rc-9", studentId: "st-4", amount: 7200000, method: "transfer", hasBill: true, date: "2026-08-08", branchId: "br-q1", note: "Gói 6 tháng · CK", debt: false, installment: false },
  { id: "rc-10", studentId: "st-8", amount: 1200000, method: "online", hasBill: false, date: "2026-08-12", branchId: "br-q1", note: "Đợt 1 gói 3 tháng", debt: false, installment: true },
  { id: "rc-11", studentId: "st-10", amount: 14400000, method: "transfer", hasBill: true, date: "2026-07-20", branchId: "br-td", note: "Gói 12 tháng Q3", debt: false, installment: false },
  { id: "rc-12", studentId: "st-15", amount: 0, method: "cash", hasBill: false, date: "2026-08-19", branchId: "br-td", note: "Nợ gói 1 tháng", debt: true, installment: false },
  { id: "rc-13", studentId: "st-20", amount: 3600000, method: "transfer", hasBill: true, date: "2026-08-03", branchId: "br-tdc", note: "Đợt 1 / 2 gói 6 tháng PN", debt: false, installment: true },
  { id: "rc-14", studentId: "st-22", amount: 2400000, method: "cash", hasBill: false, date: "2026-08-14", branchId: "br-tdc", note: "Gói 3 tháng TM", debt: false, installment: false },
  { id: "rc-15", studentId: "st-k4", amount: 4800000, method: "online", hasBill: false, date: "2026-08-06", branchId: "br-td", note: "Kids 6 tháng · PH Chị My", debt: false, installment: false },
  { id: "rc-16", studentId: "st-16", amount: 0, method: "transfer", hasBill: false, date: "2026-08-21", branchId: "br-q1", note: "Nợ đợt 2 — vẫn vào Heels", debt: true, installment: true },
];

const SEED_HOLDS: HoldRequest[] = [
  { id: "hd-1", studentId: "st-6", courseName: "Open Practice PN", reason: "Nghỉ dài đã đóng HP · gói 12 tháng tặng BL", status: "pending", sessionsKept: 40, until: "2026-11-30", gifted: true },
  { id: "hd-2", studentId: "st-19", courseName: "Contemporary", reason: "Du lịch 3 tuần · mua BL lẻ", status: "approved", sessionsKept: 6, until: "2026-09-20", gifted: false },
  { id: "hd-3", studentId: "st-k2", courseName: "Kids 5–8", reason: "Ốm · PH xin giữ chỗ sĩ số", status: "approved", sessionsKept: 4, until: "2026-09-05", gifted: false },
  { id: "hd-4", studentId: "st-11", courseName: "Hip-hop Open", reason: "Đổi lớp cuối tháng", status: "rejected", sessionsKept: 0, until: "2026-08-31", gifted: false },
  { id: "hd-5", studentId: "st-25", courseName: "Heels Open", reason: "Công tác 1 tháng · gói 12 tháng tặng BL", status: "pending", sessionsKept: 12, until: "2026-09-30", gifted: true },
  { id: "hd-6", studentId: "st-1", courseName: "Ballet Beginner", reason: "Thi cuối kỳ · mua BL 2 tuần", status: "approved", sessionsKept: 4, until: "2026-09-10", gifted: false },
  { id: "hd-7", studentId: "st-k6", courseName: "Kids 5–8", reason: "Về quê · PH giữ chỗ", status: "pending", sessionsKept: 6, until: "2026-09-15", gifted: false },
  { id: "hd-8", studentId: "st-7", courseName: "Heels Open", reason: "Chấn thương nhẹ · BL lẻ", status: "approved", sessionsKept: 3, until: "2026-09-08", gifted: false },
  { id: "hd-9", studentId: "st-14", courseName: "Hip-hop Open", reason: "Trùng lịch công việc", status: "rejected", sessionsKept: 0, until: "2026-08-28", gifted: false },
  { id: "hd-10", studentId: "st-22", courseName: "Jazz Open", reason: "Gói 3 tháng tặng BL", status: "approved", sessionsKept: 8, until: "2026-10-01", gifted: true },
  { id: "hd-11", studentId: "st-9", courseName: "Contemporary", reason: "Xin nghỉ 1 tuần lễ", status: "pending", sessionsKept: 2, until: "2026-09-02", gifted: false },
  { id: "hd-12", studentId: "st-k4", courseName: "Kids 5–8", reason: "Ốm · PH Chị My", status: "approved", sessionsKept: 3, until: "2026-09-04", gifted: false },
];

const SEED_PROMOS: PromoCode[] = [
  { id: "pr-1", code: "MA-TRY", title: "Học thử 1 buổi", discount: "Miễn phí học thử", active: true, until: "2026-09-30", used: 18 },
  { id: "pr-2", code: "MA-SIB", title: "Anh chị em", discount: "10% gói 6–12 tháng", active: true, until: "2026-12-31", used: 6 },
  { id: "pr-3", code: "MA-AUG", title: "Tháng 8 mở lớp mới", discount: "500.000đ", active: false, until: "2026-08-31", used: 22 },
  { id: "pr-4", code: "MA-KIDS", title: "Kids Q3", discount: "1 buổi tặng khi đóng 3 tháng", active: true, until: "2026-09-30", used: 9 },
  { id: "pr-5", code: "MA-Q10", title: "Resident Quận 10", discount: "8% gói 12 tháng", active: true, until: "2026-10-31", used: 11 },
  { id: "pr-6", code: "MA-PN", title: "Khai trương PN", discount: "1 tháng tặng 2 buổi", active: true, until: "2026-09-15", used: 14 },
  { id: "pr-7", code: "MA-REF", title: "Giới thiệu bạn", discount: "500.000đ / friend", active: true, until: "2026-12-31", used: 7 },
  { id: "pr-8", code: "MA-EARLY", title: "Đóng sớm 12 tháng", discount: "1.000.000đ", active: false, until: "2026-07-31", used: 5 },
  { id: "pr-9", code: "MA-GROUP", title: "Nhóm 3 HV", discount: "15% gói 6 tháng", active: true, until: "2026-11-30", used: 3 },
  { id: "pr-10", code: "MA-BDAY", title: "Sinh nhật HV", discount: "1 buổi tặng trong tháng SN", active: true, until: "2026-12-31", used: 12 },
];

const SEED_BLASTS: CareBlast[] = [
  { id: "bl-1", kind: "birthday", title: "Sinh nhật HV tuần 24–30/08", audience: "4 HV (Lan, My, An Nhi, Đức Anh)", status: "scheduled", when: "2026-08-24 09:00" },
  { id: "bl-2", kind: "zalo", title: "Nhắc đóng đợt 2 Hip-hop", audience: "PH + HV còn nợ chi nhánh Q10", status: "draft", when: "—" },
  { id: "bl-3", kind: "email", title: "Lịch tuần 25/08 — Heels / Ballet", audience: "HV khóa đang học Q10 + Q3", status: "sent", when: "2026-08-23 18:00" },
  { id: "bl-4", kind: "zalo", title: "Kids vắng 2 buổi", audience: "4 phụ huynh Kids 5–8 Q3", status: "sent", when: "2026-08-22 10:30" },
  { id: "bl-5", kind: "birthday", title: "Sinh nhật PH tuần 31/08–06/09", audience: "3 PH Kids Q3", status: "draft", when: "—" },
  { id: "bl-6", kind: "email", title: "Mở lớp Jazz Open PN", audience: "HV hết gói 1 tháng PN", status: "scheduled", when: "2026-08-26 10:00" },
  { id: "bl-7", kind: "zalo", title: "Nhắc BL hết hạn 05/09", audience: "4 HV phiếu BL approved", status: "draft", when: "—" },
  { id: "bl-8", kind: "zalo", title: "Heels đầy — danh sách chờ", audience: "8 HV waitlist Heels Q10", status: "sent", when: "2026-08-23 12:00" },
  { id: "bl-9", kind: "email", title: "Voucher MA-SIB anh chị em", audience: "HV gói 6–12 tháng", status: "scheduled", when: "2026-08-28 09:00" },
  { id: "bl-10", kind: "birthday", title: "Sinh nhật Mai Chi", audience: "1 HV Contemporary", status: "sent", when: "2026-08-19 08:00" },
];

const SEED_RENTALS: StudioRental[] = [
  { id: "rt-1", roomId: "p1", customer: "Crew Night Owl", date: "2026-08-25", startTime: "21:30", endTime: "23:00", status: "confirmed", note: "Thuê studio ngoài giờ lớp" },
  { id: "rt-2", roomId: "p5", customer: "Nhóm K-pop amateur", date: "2026-08-26", startTime: "12:00", endTime: "14:00", status: "pending", note: "Chờ cọc" },
  { id: "rt-3", roomId: "ga", customer: "Workshop barre (guest)", date: "2026-08-30", startTime: "09:00", endTime: "12:00", status: "confirmed", note: "Không gán khóa CRM" },
  { id: "rt-4", roomId: "gb", customer: "Team battle Q3", date: "2026-08-27", startTime: "20:00", endTime: "22:00", status: "pending", note: "Room A · chờ cọc 50%" },
  { id: "rt-5", roomId: "p2", customer: "Quay MV indie", date: "2026-08-28", startTime: "10:00", endTime: "13:00", status: "confirmed", note: "MI2 · đã cọc" },
  { id: "rt-6", roomId: "p4", customer: "Lớp thử Heels guest", date: "2026-08-29", startTime: "18:00", endTime: "19:30", status: "pending", note: "PN · chưa gán khóa" },
  { id: "rt-7", roomId: "p3", customer: "Stretch club", date: "2026-08-31", startTime: "07:00", endTime: "08:30", status: "confirmed", note: "MON4 sáng sớm" },
  { id: "rt-8", roomId: "p1", customer: "Birthday dance Q10", date: "2026-09-02", startTime: "19:00", endTime: "21:00", status: "pending", note: "Sinh nhật HV · giữ MI1" },
];

const SEED_CALENDARS: CalendarLink[] = [
  { id: "cal-1", person: "MA Dance · lịch trung tâm", kind: "center", calendar: "studio@ma-dance.local", synced: true },
  { id: "cal-2", person: "Hà Nguyễn (Quản lý · Q10)", kind: "staff", calendar: "ha@ma-dance.local", synced: true },
  { id: "cal-3", person: "Mai Trần (Giáo viên · Q10)", kind: "staff", calendar: "mai@ma-dance.local", synced: true },
  { id: "cal-4", person: "An Lê (Lễ tân · Q10)", kind: "staff", calendar: "an@ma-dance.local", synced: false },
  { id: "cal-5", person: "Minh Châu (Quản lý · Q3)", kind: "staff", calendar: "chau@ma-dance.local", synced: true },
  { id: "cal-6", person: "Linh Phạm (Giáo viên · Q3)", kind: "staff", calendar: "linh@ma-dance.local", synced: true },
  { id: "cal-7", person: "Kim Anh (Lễ tân · Q3)", kind: "staff", calendar: "kimanh@ma-dance.local", synced: false },
  { id: "cal-8", person: "Khoa Võ (Giáo viên · PN)", kind: "staff", calendar: "khoa@ma-dance.local", synced: true },
  { id: "cal-9", person: "Phương Vy (Lễ tân · PN)", kind: "staff", calendar: "vy.lt@ma-dance.local", synced: false },
  { id: "cal-10", person: "Uyên Phạm (Chủ)", kind: "staff", calendar: "uyen@ma-dance.local", synced: true },
];

export const MID_ENROLL_RULES: MidEnrollRule[] = [
  { id: "lv-beg", level: "Beginner", window: "Dừng từ buổi 4–5", note: "Begin: nhận giữa khóa đến buổi 4–5, sau đó dừng" },
  { id: "lv-int", level: "Intermediate", window: "Buổi lẻ", note: "Inter nhận ở các buổi lẻ của khóa" },
  { id: "lv-adv", level: "Advance / Open", window: "Buổi 1 & 5", note: "Advance / Open: nhận buổi 1 và buổi 5" },
];

/** Doanh thu demo — chi nhánh + tách kênh thu (tháng 08/2026). */
export const REVENUE_BY_BRANCH = [
  { branchId: "br-q1", name: "Quận 10", collected: 612000000, debt: 48000000, packs: 86, cash: 98000000, transfer: 412000000, online: 102000000, pack12: 41 },
  { branchId: "br-td", name: "Quận 3", collected: 428000000, debt: 31000000, packs: 54, cash: 72000000, transfer: 281000000, online: 75000000, pack12: 22 },
  { branchId: "br-tdc", name: "Phú Nhuận", collected: 245000000, debt: 19000000, packs: 31, cash: 41000000, transfer: 158000000, online: 46000000, pack12: 11 },
];

export function cloneQuoteSeed(): QuoteDemoState {
  return {
    attendance: cloneAttendance(SEED_ATTENDANCE),
    packages: SEED_PACKAGES.map((row) => ({ ...row })),
    receipts: SEED_RECEIPTS.map((row) => ({ ...row })),
    holds: SEED_HOLDS.map((row) => ({ ...row })),
    promos: SEED_PROMOS.map((row) => ({ ...row })),
    blasts: SEED_BLASTS.map((row) => ({ ...row })),
    rentals: SEED_RENTALS.map((row) => ({ ...row })),
    calendars: SEED_CALENDARS.map((row) => ({ ...row })),
  };
}

export function markAttendance(
  map: AttendanceMap,
  classId: string,
  studentId: string,
  mark: "present" | "absent",
): AttendanceMap {
  return {
    ...map,
    [classId]: { ...(map[classId] ?? {}), [studentId]: mark },
  };
}

/** Điểm danh có mặt → trừ 1 buổi gói active đầu tiên. Không học bù. */
export function deductSession(packages: SessionPack[], studentId: string): SessionPack[] {
  const idx = packages.findIndex((row) => row.studentId === studentId && row.status === "active" && row.remaining > 0);
  if (idx < 0) return packages;
  return packages.map((row, i) => {
    if (i !== idx) return row;
    const remaining = row.remaining - 1;
    return { ...row, remaining, status: remaining <= 0 ? "expired" : row.status };
  });
}

export function restoreSession(packages: SessionPack[], studentId: string): SessionPack[] {
  const idx = packages.findIndex((row) => row.studentId === studentId && (row.status === "active" || row.status === "expired"));
  if (idx < 0) return packages;
  return packages.map((row, i) => {
    if (i !== idx) return row;
    const remaining = Math.min(row.total, row.remaining + 1);
    return { ...row, remaining, status: remaining > 0 ? "active" : row.status };
  });
}
