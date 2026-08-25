import type {
  ClassStatus,
  CourseStatus,
  DemoClass,
  DemoCourse,
  DemoStudent,
  DemoTeacher,
  Weekday,
} from "./types";

export const WEEKDAY_LABEL: Record<Weekday, string> = {
  1: "T2",
  2: "T3",
  3: "T4",
  4: "T5",
  5: "T6",
  6: "T7",
  0: "CN",
};

export const WEEKDAY_ORDER: Weekday[] = [1, 2, 3, 4, 5, 6, 0];

/** Pulse Studio — cố định, không DST. SSR (UTC) và browser (VN) cùng lịch. */
export const STUDIO_TZ = "Asia/Ho_Chi_Minh";
const STUDIO_UTC_OFFSET_HOURS = 7;

/**
 * Đồng hồ demo SoT — 24/08/2026 17:15 VN.
 * Heels 17:00–18:30 đang diễn ra; Hip-hop 19:00 chưa diễn ra.
 */
export const DEMO_AS_OF_ISO = "2026-08-24T17:15:00+07:00";

export function demoNow(): Date {
  return new Date(DEMO_AS_OF_ISO);
}

export function localIsoDate(date: Date = demoNow()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: STUDIO_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

/** Giờ tường studio 0–23 (cho greeting chat). */
export function studioHour(date: Date = demoNow()): number {
  const raw = new Intl.DateTimeFormat("en-GB", {
    timeZone: STUDIO_TZ,
    hour: "numeric",
    hourCycle: "h23",
  }).format(date);
  return Number.parseInt(raw, 10);
}

export function formatViDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

/** Wall clock studio (UTC+7) → instant. */
export function atLocal(dateIso: string, time: string): Date {
  const [y, mo, d] = dateIso.split("-").map(Number);
  const [h, min] = time.split(":").map(Number);
  return new Date(Date.UTC(y, mo - 1, d, (h || 0) - STUDIO_UTC_OFFSET_HOURS, min || 0, 0, 0));
}

export function addDaysIso(iso: string, days: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  const next = new Date(y, m - 1, d + days);
  return localIsoDate(next);
}

export function weekdayLabelList(days: Weekday[]): string {
  return days.map((day) => WEEKDAY_LABEL[day]).join(" · ");
}

export function courseStatus(course: DemoCourse, now: Date = demoNow()): CourseStatus {
  const start = atLocal(course.enrollStart, "00:00");
  const end = atLocal(course.enrollEnd, "23:59");
  if (now < start) return "draft";
  if (now > end) return "closed";
  return "recruiting";
}

export function classStatus(row: DemoClass, now: Date = demoNow()): ClassStatus {
  if (row.cancelled) return "cancelled";
  const start = atLocal(row.date, row.startTime);
  const end = atLocal(row.date, row.endTime);
  if (now < start) return "upcoming";
  if (now < end) return "ongoing";
  return "completed";
}

export const COURSE_STATUS_LABEL: Record<CourseStatus, string> = {
  draft: "Nháp",
  recruiting: "Đang tuyển",
  closed: "Đóng tuyển",
};

export const CLASS_STATUS_LABEL: Record<ClassStatus, string> = {
  upcoming: "Chưa diễn ra",
  ongoing: "Đang diễn ra",
  completed: "Hoàn thành",
  cancelled: "Hủy",
};

export function teacherName(teachers: DemoTeacher[], id: string): string {
  return teachers.find((t) => t.id === id)?.name ?? id;
}

export function teacherNames(teachers: DemoTeacher[], ids: string[]): string {
  return ids.map((id) => teacherName(teachers, id)).join(", ") || "Chưa gán";
}

export function studentName(students: DemoStudent[], id: string): string {
  return students.find((s) => s.id === id)?.name ?? id;
}

export function coursesForStudent(courses: DemoCourse[], studentId: string): DemoCourse[] {
  return courses.filter((c) => c.studentIds.includes(studentId));
}

export function classesForStudent(classes: DemoClass[], studentId: string): DemoClass[] {
  return classes.filter((c) => c.studentIds.includes(studentId));
}

export function generateClasses(course: DemoCourse, existing: DemoClass[]): DemoClass[] {
  const current = existing.filter((row) => row.courseId === course.id);
  if (current.length >= course.schedule.sessionCount) return existing;

  const others = existing.filter((row) => row.courseId !== course.id);
  const created = [...current];
  const seen = new Set(created.map((row) => row.date));
  const [y, m, d] = course.schedule.firstDate.split("-").map(Number);
  const cursor = new Date(y, m - 1, d);
  let guard = 0;

  while (created.length < course.schedule.sessionCount && guard < 420) {
    guard += 1;
    const iso = localIsoDate(cursor);
    const day = cursor.getDay() as Weekday;
    if (course.schedule.weekdays.includes(day) && !seen.has(iso)) {
      seen.add(iso);
      created.push({
        id: `cls-${course.id}-${created.length + 1}`,
        courseId: course.id,
        date: iso,
        startTime: course.schedule.startTime,
        endTime: course.schedule.endTime,
        teacherId: course.teacherIds[0] ?? "",
        roomId: course.roomId,
        capacity: course.capacity,
        studentIds: [...course.studentIds],
        cancelled: false,
      });
    }
    cursor.setDate(cursor.getDate() + 1);
  }

  return [...others, ...created];
}

export function enrollStudent(
  courses: DemoCourse[],
  classes: DemoClass[],
  courseId: string,
  studentId: string,
  now: Date = demoNow(),
): { courses: DemoCourse[]; classes: DemoClass[]; ok: boolean; reason?: string } {
  const course = courses.find((c) => c.id === courseId);
  if (!course) return { courses, classes, ok: false, reason: "Không tìm thấy khóa." };
  if (course.studentIds.includes(studentId)) {
    return { courses, classes, ok: false, reason: "Học viên đã trong khóa." };
  }
  if (course.studentIds.length >= course.capacity) {
    return { courses, classes, ok: false, reason: "Khóa đã đủ sĩ số." };
  }
  const status = courseStatus(course, now);
  if (status === "closed") {
    return { courses, classes, ok: false, reason: "Khóa đã đóng tuyển sinh." };
  }

  const nextCourses = courses.map((c) =>
    c.id === courseId ? { ...c, studentIds: [...c.studentIds, studentId] } : c,
  );
  const nextClasses = classes.map((row) => {
    if (row.courseId !== courseId) return row;
    const live = classStatus(row, now);
    if (live !== "upcoming" && live !== "ongoing") return row;
    if (row.studentIds.includes(studentId)) return row;
    if (row.studentIds.length >= row.capacity) return row;
    return { ...row, studentIds: [...row.studentIds, studentId] };
  });
  return { courses: nextCourses, classes: nextClasses, ok: true };
}

export function cancelClass(classes: DemoClass[], classId: string): DemoClass[] {
  return classes.map((row) => (row.id === classId ? { ...row, cancelled: true } : row));
}
