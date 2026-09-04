export type OpsLocale = "vi" | "en";

export const LOCALE_STORAGE_KEY = "edu-locale";

export function isOpsLocale(value: string): value is OpsLocale {
  return value === "vi" || value === "en";
}

export function readStoredLocale(): OpsLocale {
  try {
    const raw = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    if (raw && isOpsLocale(raw)) return raw;
  } catch {
    /* private mode */
  }
  return "vi";
}

export function writeStoredLocale(locale: OpsLocale) {
  try {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch {
    /* private mode */
  }
}

const GROUP_LABEL_EN: Record<string, string> = {
  overview: "Overview",
  manage: "Management",
  enroll: "Admissions",
  finance: "Finance",
  sys: "Settings",
  ops: "Operations",
  care: "Care",
  biz: "Training",
  shop: "Studio",
};

export function groupLabel(id: string, apiLabel: string, locale: OpsLocale): string {
  if (locale === "en") return GROUP_LABEL_EN[id] ?? apiLabel;
  return apiLabel;
}

export const CHROME = {
  vi: {
    searchNav: "Tìm nhanh…",
    searchNavSr: "Tìm tool",
    searchBar: "Tìm khóa, lớp, học viên, tác vụ…",
    searchBarSr: "Tìm trên canvas",
    toolsNav: "Công cụ",
    collapseNav: "Thu gọn menu",
    expandNav: "Mở menu",
    closeChat: "Đóng chat",
    openChat: "Ask Dolphin",
    askDolphin: "Ask Dolphin",
    notify: "Thông báo (demo)",
    team: "Giáo viên demo",
    role: "Điều phối",
    soon: "Sắp có",
    menuLoading: "Đang tải menu…",
    menuError: "Không tải được menu.",
    retry: "Thử lại",
    noMatch: "Không có mục khớp",
    langGroup: "Ngôn ngữ",
    branchSelect: "Chi nhánh",
    allBranches: "Tất cả chi nhánh",
    mobileGateTitle: "Dolphin Edu dành cho tablet & desktop",
    mobileGateBody:
      "Giao diện vận hành chưa hỗ trợ điện thoại. Vui lòng mở lại trên máy tính bảng hoặc máy tính để bàn.",
    opening: (label: string) => `Đang mở ${label}…`,
    reveal: {
      overview: "Đang mở tổng quan…",
      inbox: "Đang mở inbox…",
      classes: "Đang mở lớp học…",
      "course-form": "Đang mở form khóa…",
      "course-detail": "Đang mở khóa học…",
      students: "Đang mở học viên…",
      "student-360": "Đang mở hồ sơ…",
      tasks: "Đang mở tác vụ…",
      approve: "Đang mở duyệt…",
      teachers: "Đang mở giáo viên…",
      classrooms: "Đang mở phòng tập…",
      courses: "Đang mở khóa học…",
    } as Record<string, string>,
  },
  en: {
    searchNav: "Quick search…",
    searchNavSr: "Search tools",
    searchBar: "Search courses, classes, students, tasks…",
    searchBarSr: "Search on canvas",
    toolsNav: "Tools",
    collapseNav: "Collapse menu",
    expandNav: "Open menu",
    closeChat: "Close chat",
    openChat: "Ask Dolphin",
    askDolphin: "Ask Dolphin",
    notify: "Notifications (demo)",
    team: "Demo teachers",
    role: "Coordinator",
    soon: "Soon",
    menuLoading: "Loading menu…",
    menuError: "Could not load menu.",
    retry: "Retry",
    noMatch: "No matching items",
    langGroup: "Language",
    branchSelect: "Branch",
    allBranches: "All branches",
    mobileGateTitle: "Dolphin Edu is for tablet & desktop",
    mobileGateBody:
      "The ops workspace isn’t available on phones yet. Please open it again on a tablet or desktop.",
    opening: (label: string) => `Opening ${label}…`,
    reveal: {
      overview: "Opening overview…",
      inbox: "Opening inbox…",
      classes: "Opening classes…",
      "course-form": "Opening course form…",
      "course-detail": "Opening course…",
      students: "Opening students…",
      "student-360": "Opening profile…",
      tasks: "Opening tasks…",
      approve: "Opening approval…",
      teachers: "Opening teachers…",
      classrooms: "Opening studios…",
      courses: "Opening courses…",
    } as Record<string, string>,
  },
} as const;
