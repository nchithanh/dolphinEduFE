/** Khóa học — số demo hardcode (FE only). */

export const COURSES_KPI = [
  { id: "recruit", label: "Đang tuyển", value: "18", trend: "+12%", up: true, ico: "▦" },
  { id: "total", label: "Tổng khóa", value: "56", trend: "+8%", up: true, ico: "▣" },
  { id: "students", label: "Tổng học", value: "1.248", trend: "+15%", up: true, ico: "◉" },
  { id: "fill", label: "Tỷ lệ lấp đầy", value: "82%", trend: "+6%", up: true, ico: "◐" },
];

export const COURSES_DATE_RANGE = { from: "2026-06-01", to: "2026-08-31", label: "01/06/2026 → 31/08/2026" };

/** Demo % chuyên cần + thanh toán theo student id. */
export function demoStudentPay(studentId: string): { attend: number; paid: boolean } {
  let hash = 0;
  for (let i = 0; i < studentId.length; i += 1) hash = (hash + studentId.charCodeAt(i) * (i + 3)) % 97;
  const attend = 72 + (hash % 28);
  const paid = hash % 3 !== 0;
  return { attend, paid };
}

export function demoCourseCode(courseId: string, name: string): string {
  const slug = name
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-zA-Z0-9]+/g, "")
    .slice(0, 4)
    .toUpperCase();
  const tail = courseId.replace(/^crs-/, "").slice(0, 4).toUpperCase();
  return `${slug || "CRS"}-2408-${tail || "01"}`;
}
