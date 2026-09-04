import { groupLabel, type OpsLocale } from "./locale";
import type { NavGroup } from "./nav";
import { isStage, menuDisplayLabel } from "./nav";
import type { Stage } from "./types";

/** Hardcoded FE — no backend. */
export const DEMO_ORG = {
  id: "pulse-studio",
  name: "Pulse Studio",
  slug: "pulse-studio",
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
  user: { id: "user_ha", email: "ha@pulse.local", name: "Hà" },
  groups: [
    {
      id: "overview",
      label: "Tổng quan",
      sort_order: 0,
      icon: null,
      items: [
        item("overview", "overview", "Khóa đang tuyển, lớp hôm nay", 0, "live", "Tổng quan", "Dashboard"),
        item("schedule", "schedule", "Lịch tuần studio", 1, "stub", "Lịch", "Schedule"),
        item("activity", "activity", "Nhật ký vận hành", 2, "stub", "Hoạt động", "Activity"),
      ],
    },
    {
      id: "manage",
      label: "Quản lý",
      sort_order: 1,
      icon: null,
      items: [
        item("students", "student", "Hồ sơ và ghi danh khóa", 0, "live", "Học viên", "Students"),
        item("courses", "course", "Tạo khóa, tuyển sinh, sinh lớp", 1, "live", "Khóa học", "Courses"),
        item("classes", "class", "Buổi học theo khóa — start/end", 2, "live", "Lớp học", "Classes"),
        item("teachers", "teacher", "Giáo viên gán vào khóa", 3, "live", "Giáo viên", "Teachers"),
        item("classrooms", "classroom", "Studio, sàn tập", 4, "live", "Phòng", "Rooms"),
        item("inbox", "inbox", "Hội thoại + AI", 5, "disabled", "Inbox", "Inbox"),
        item("tasks", "task", "Giao việc, lọc trạng thái, người nhận", 6, "live", "Tác vụ", "Tasks"),
      ],
    },
    {
      id: "enroll",
      label: "Tuyển sinh",
      sort_order: 2,
      icon: null,
      items: [
        item("campaigns", "campaign", "Tin hàng loạt — cần duyệt", 0, "stub", "Chiến dịch", "Campaigns", "human"),
        item("leads", "lead", "Nguồn đăng ký khóa", 1, "stub", "Nguồn đăng ký", "Lead sources"),
        item("consult", "consult", "Tư vấn ghi danh", 2, "stub", "Tư vấn", "Consulting"),
      ],
    },
    {
      id: "finance",
      label: "Tài chính",
      sort_order: 3,
      icon: null,
      items: [
        item("invoices", "invoice", "Hóa đơn học phí", 0, "stub", "Hóa đơn", "Invoices"),
        item("payment", "payment", "Thu học phí — cần duyệt", 1, "stub", "Thanh toán", "Payments", "human"),
        item("reports", "report", "Doanh thu demo — TODO số liệu thật", 2, "stub", "Báo cáo doanh thu", "Revenue"),
      ],
    },
    {
      id: "sys",
      label: "Cài đặt",
      sort_order: 4,
      icon: null,
      items: [
        item("settings", "settings", "Studio, chi nhánh", 0, "stub", "Cài đặt chung", "General"),
        item("access", "access", "Ai được làm gì", 1, "stub", "Phân quyền", "Roles"),
        item("audit", "audit", "Ai đã duyệt, đã đổi", 2, "stub", "Nhật ký hệ thống", "System log"),
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
