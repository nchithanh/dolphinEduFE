/** Lớp học — số demo hardcode (FE only). */

export const CLASSES_KPI = [
  { id: "ongoing", label: "Đang diễn ra", value: "18", trend: "+12%", up: true, ico: "◎" },
  { id: "soon", label: "Sắp bắt đầu", value: "1", trend: "-50%", up: false, ico: "◷" },
  { id: "avg", label: "Sĩ số trung bình", value: "17.6", sub: "/ 20", trend: "+5%", up: true, ico: "◫" },
  { id: "attend", label: "Tỷ lệ điểm danh", value: "91%", trend: "+3%", up: true, ico: "✓" },
  { id: "rooms", label: "Phòng trống hôm nay", value: "3", trend: "-25%", up: false, ico: "⌂" },
  { id: "warn", label: "Lớp cảnh báo", value: "4", trend: "+100%", up: false, ico: "!" },
];

export const CLASSES_DATE_RANGE = { from: "2026-08-01", to: "2026-08-31", label: "01/08/2026 → 31/08/2026" };

/** % điểm danh cả buổi (cột bảng). */
export function demoClassAttend(classId: string): number {
  let hash = 0;
  for (let i = 0; i < classId.length; i += 1) hash = (hash + classId.charCodeAt(i) * (i + 5)) % 89;
  return 78 + (hash % 21);
}

/** Nhãn buổi: "Hip-hop Open 2". */
export function classSessionLabel(courseName: string, classId: string): string {
  const m = classId.match(/-(\d+)$/);
  return `${courseName} ${m?.[1] ?? "1"}`;
}

/** Demo % chuyên cần + thanh toán theo class + student. */
export function demoClassStudentPay(
  classId: string,
  studentId: string,
): { attend: number; paid: boolean } {
  let hash = 0;
  const key = `${classId}:${studentId}`;
  for (let i = 0; i < key.length; i += 1) hash = (hash + key.charCodeAt(i) * (i + 3)) % 97;
  const attend = 70 + (hash % 30);
  const paid = hash % 4 !== 0;
  return { attend, paid };
}
