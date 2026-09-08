import { groupLabel, type OpsLocale } from "./locale";
import type { NavGroup } from "./nav";
import { isStage, menuDisplayLabel } from "./nav";
import type { Stage } from "./types";

/** Hardcoded FE — no backend. */
export const DEMO_ORG = {
  id: "ma-dance",
  name: "MA Dance",
  slug: "ma-dance",
  status: "active",
} as const;

export type MenuActionDto = {
  id: string;
  code: string;
  label: string;
  confirm: "none" | "human";
};

export type MenuItemDto = {
  id: string;
  code: string;
  hint: string;
  sort_order: number;
  status: "live" | "stub" | "disabled";
  default_action_id: string;
  label_display_vi: string;
  label_display_en: string;
  actions: MenuActionDto[];
};

export type MenuGroupDto = {
  id: string;
  label: string;
  sort_order: number;
  icon: string | null;
  items: MenuItemDto[];
};

export type MenuResponse = {
  ok: boolean;
  organization: { id: string; name: string; slug: string; status: string };
  user: { id: string; email: string; name: string };
  groups: MenuGroupDto[];
};

function item(
  id: string,
  code: string,
  hint: string,
  sort_order: number,
  status: MenuItemDto["status"],
  vi: string,
  en: string,
  confirm: MenuActionDto["confirm"] = "none",
): MenuItemDto {
  const actionId = `${code}.open`;
  return {
    id,
    code,
    hint,
    sort_order,
    status,
    default_action_id: actionId,
    label_display_vi: vi,
    label_display_en: en,
    actions: [{ id: actionId, code: actionId, label: `Mở ${vi}`, confirm }],
  };
}

/** Seed menu — canvas hardcode, không gọi API. */
export const HARDCODED_MENU: MenuResponse = {
  ok: true,
  organization: { ...DEMO_ORG },
  user: { id: "user_ha", email: "ha@ma-dance.local", name: "Hà" },
  groups: [
    {
      id: "overview",
      label: "Tổng quan",
      sort_order: 0,
      icon: null,
      items: [
        item("overview", "overview", "Khóa đang tuyển, lớp hôm nay", 0, "live", "Tổng quan", "Dashboard"),
        item("guide", "guide", "Playbook nghiệp vụ MA Dance", 1, "live", "Hướng dẫn sử dụng", "How to use"),
        item("schedule", "schedule", "1 lịch Google trung tâm — nội bộ (A11)", 2, "live", "Lịch", "Schedule"),
      ],
    },
    {
      id: "manage",
      label: "Quản lý",
      sort_order: 1,
      icon: null,
      items: [
        item("students", "student", "Hồ sơ HV / phụ huynh (A4)", 0, "live", "Học viên", "Students"),
        item("courses", "course", "Tạo khóa, tuyển sinh, sinh lớp (A2)", 1, "live", "Khóa học", "Courses"),
        item("classes", "class", "Buổi học — đổi giờ/phòng/GV (A2)", 2, "live", "Lớp học", "Classes"),
        item("teachers", "teacher", "Giáo viên + dự phòng (A5)", 3, "live", "Giáo viên", "Teachers"),
        item("classrooms", "classroom", "7 phòng · Q10 / Q3 / PN (A1)", 4, "live", "Phòng", "Rooms"),
        item("packages", "package", "Gói buổi · trừ khi điểm danh (A6)", 5, "live", "Gói buổi", "Session packs"),
        item("inbox", "inbox", "Hội thoại + AI", 6, "disabled", "Inbox", "Inbox"),
      ],
    },
    {
      id: "enroll",
      label: "Tuyển sinh",
      sort_order: 2,
      icon: null,
      items: [
        item("leads", "lead", "Giữa khóa theo level · sĩ số 10–15 (A3)", 0, "live", "Ghi danh giữa khóa", "Mid-course enroll"),
        item("promotions", "promo", "Mã giảm / voucher (A12)", 1, "live", "Promotion", "Promotions"),
        item("campaigns", "campaign", "Sinh nhật · Zalo / email hàng loạt (A13)", 2, "live", "Chăm sóc", "Care"),
      ],
    },
    {
      id: "finance",
      label: "Tài chính",
      sort_order: 3,
      icon: null,
      items: [
        item("payment", "payment", "Thu học phí · công nợ · CK+bill (A7)", 0, "live", "Thu học phí", "Fee collection", "human"),
        item("holds", "hold", "Bảo lưu — QL duyệt (A8)", 1, "live", "Bảo lưu", "Holds"),
        item("reports", "report", "Doanh thu theo chi nhánh (A14)", 2, "live", "Doanh thu", "Revenue"),
      ],
    },
    {
      id: "ops",
      label: "Vận hành",
      sort_order: 4,
      icon: null,
      items: [
        item("attendance", "attendance", "Có mặt / vắng trên CRM (A9)", 0, "live", "Điểm danh tay", "Manual attendance"),
        item("qr", "qr", "Điểm danh bằng mã QR (A10)", 1, "live", "Điểm danh QR", "QR attendance"),
        item("tasks", "task", "Giao việc, hạn, trạng thái (B2)", 2, "live", "Tác vụ", "Tasks"),
        item("rentals", "rental", "Thuê studio — khác gán phòng lớp (B2)", 3, "live", "Đặt phòng thuê", "Studio rental"),
        item("ai-ops", "ai-ops", "Câu lệnh → form; cảnh báo hết buổi / nợ (B2)", 4, "live", "AI vận hành", "AI ops"),
        item("intelligent", "intelligent", "Cảnh báo cuối ngày + duyệt giải pháp (B2)", 5, "live", "Intelligent", "Intelligent"),
      ],
    },
    {
      id: "sys",
      label: "Cài đặt",
      sort_order: 5,
      icon: null,
      items: [
        item("access", "access", "Chủ / QL / lễ tân / GV (A1)", 0, "live", "Phân quyền", "Roles"),
        item("settings", "settings", "Studio, chi nhánh", 1, "stub", "Cài đặt chung", "General"),
      ],
    },
  ],
};

export function mapMenuGroups(payload: MenuResponse, locale: OpsLocale = "vi"): NavGroup[] {
  return [...payload.groups]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((group) => ({
      id: group.id,
      label: groupLabel(group.id, group.label, locale),
      items: [...group.items]
        .sort((a, b) => a.sort_order - b.sort_order)
        .filter((row): row is MenuItemDto & { id: Stage } => row.status !== "disabled" && isStage(row.id))
        .map((row) => ({
          id: row.id,
          label: menuDisplayLabel(locale === "en" ? row.label_display_en : row.label_display_vi),
          hint: row.hint,
          ready: row.status === "live",
        })),
    }))
    .filter((group) => group.items.length > 0);
}

export function fetchMenu(): Promise<MenuResponse> {
  return Promise.resolve(HARDCODED_MENU);
}
