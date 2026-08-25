/** Giáo viên — số demo hardcode (FE only). */

export const TEACHERS_KPI = [
  { id: "total", label: "Tổng giáo viên", value: "28", trend: "+12%", up: true, ico: "◉" },
  { id: "active", label: "Đang dạy", value: "24", trend: "+8%", up: true, ico: "◎" },
  { id: "free", label: "Ca rảnh hôm nay", value: "6", trend: "0%", up: true, ico: "◷" },
  { id: "classes", label: "Lớp phụ trách", value: "68", trend: "+15%", up: true, ico: "▣" },
  { id: "attend", label: "Tỉ lệ điểm danh", value: "92%", trend: "+3%", up: true, ico: "✓" },
  { id: "rating", label: "Đánh giá TB", value: "4.8", sub: "/ 5", trend: "+0,2", up: true, ico: "★" },
];

export function demoTeacherCode(teacherId: string): string {
  const map: Record<string, string> = {
    mai: "0012",
    ha: "0018",
    linh: "0021",
    khoa: "0027",
    thu: "0031",
    nam: "0034",
    vy: "0038",
    quan: "0042",
    nga: "0045",
    phuc: "0049",
    han: "0052",
    duc: "0056",
    tram: "0060",
    son: "0063",
  };
  return `GV-${map[teacherId] ?? teacherId.slice(0, 4).toUpperCase().padStart(4, "0")}`;
}

export function demoTeacherStats(teacherId: string): {
  rating: number;
  freeSlots: number;
  phone: string;
  email: string;
  active: boolean;
  tags: string[];
  joinDate: string;
} {
  let hash = 0;
  for (let i = 0; i < teacherId.length; i += 1) hash = (hash + teacherId.charCodeAt(i) * (i + 5)) % 89;
  const rating = Math.round((4.5 + (hash % 5) * 0.1) * 10) / 10;
  const freeSlots = hash % 4;
  const active = hash % 7 !== 0;
  const tags =
    hash % 3 === 0
      ? ["Chuyên môn mạnh", "Thân thiện", "Đúng giờ"]
      : hash % 3 === 1
        ? ["Năng động", "Đúng giờ"]
        : ["Thân thiện", "Ổn định"];
  return {
    rating,
    freeSlots,
    phone: `090${String(2000000 + hash * 137).slice(0, 7)}`,
    email: `${teacherId}@pulse.studio`,
    active,
    tags,
    joinDate: "2024-03-01",
  };
}
