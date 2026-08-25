import catalog from "../data/chat-actions.json";

export const DOCK_PLACEHOLDER = "Nhập tin nhắn hoặc hỏi Dolphin…";

export const CHIP = {
  overview: "Đã mở Tổng quan",
  classes: "Đã mở Lớp học",
  students: "Đã mở Học viên",
  courses: "Đã mở Khóa học",
  "course-form": "Đã mở form Khóa học",
  enroll: "Đã ghi danh vào khóa",
  generate: "Đã sinh lớp từ khóa",
  none: catalog.none.chip,
} as const;

export type SuggestionIcon = "calendar" | "plus" | "user" | "check";

export const SUGGESTIONS: {
  icon: SuggestionIcon;
  title: string;
  hint: string;
  text: string;
}[] = [
  { icon: "calendar", title: "Lớp hôm nay", hint: "Mở danh sách lớp", text: "Danh sách lớp hôm nay" },
  { icon: "plus", title: "Ghi danh Long", hint: "Thêm Long vào Hip-hop", text: "Thêm Long vào Hip-hop" },
  { icon: "user", title: "Hồ sơ Hương", hint: "Mở hồ sơ học viên", text: "Hồ sơ học viên Hương" },
  { icon: "check", title: "Sinh lớp", hint: "Sinh lớp từ khóa Waacking", text: "Sinh lớp Waacking" },
];
