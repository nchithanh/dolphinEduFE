import catalog from "../data/chat-actions.json";

export const DOCK_PLACEHOLDER = "Type a message or ask Dolphin…";

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
  { icon: "calendar", title: "Today's classes", hint: "Open class list", text: "Danh sách lớp hôm nay" },
  { icon: "plus", title: "Enroll student", hint: "Add Long to Hip-hop", text: "Thêm Long vào Hip-hop" },
  { icon: "user", title: "Student profile", hint: "Open student record", text: "Hồ sơ học viên Hương" },
  { icon: "check", title: "Generate class", hint: "Create class from course", text: "Sinh lớp Waacking" },
];
