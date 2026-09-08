/** Học viên — số demo hardcode (FE only). */

export const STUDENTS_KPI = [
  { id: "total", label: "Tổng học viên", value: "1.248", trend: "+12%", up: true, ico: "◉" },
  { id: "new", label: "Học viên mới", value: "156", trend: "+18%", up: true, ico: "+" },
  { id: "active", label: "Đang học", value: "982", trend: "+8%", up: true, ico: "◎" },
  { id: "follow", label: "Cần follow-up", value: "78", trend: "+5%", up: true, ico: "☎" },
  { id: "unpaid", label: "Học phí chưa TT", value: "152", trend: "+9%", up: false, ico: "₫" },
  { id: "conv", label: "Tỷ lệ chuyển đổi", value: "92%", trend: "+4%", up: true, ico: "%" },
];

export function demoStudentCode(studentId: string): string {
  const n = studentId.replace(/\D/g, "").slice(-4).padStart(4, "0");
  return `HS-2026-${n || "0001"}`;
}

/** Demo chuyên cần + thanh toán + buổi học theo student. */
export function demoStudentStats(studentId: string): {
  attend: number;
  paid: boolean;
  done: number;
  total: number;
  age: number;
  gender: "Nam" | "Nữ";
  tags: string[];
} {
  let hash = 0;
  for (let i = 0; i < studentId.length; i += 1) hash = (hash + studentId.charCodeAt(i) * (i + 3)) % 97;
  const attend = 72 + (hash % 28);
  const paid = hash % 3 !== 0;
  const total = 24 + (hash % 8);
  const done = Math.min(total, Math.round((attend / 100) * total));
  const age = 7 + (hash % 18);
  const gender = hash % 2 === 0 ? "Nữ" : "Nam";
  const tags =
    hash % 3 === 0 ? ["Chăm chỉ", "Tiến bộ tốt"] : hash % 3 === 1 ? ["Cần nhắc học phí"] : ["Ổn định"];
  return { attend, paid, done, total, age, gender, tags };
}

export function demoParentPhone(studentId: string): string {
  let hash = 0;
  for (let i = 0; i < studentId.length; i += 1) hash = (hash + studentId.charCodeAt(i) * 7) % 90;
  return `090${String(1000000 + hash * 1111).slice(0, 7)}`;
}
