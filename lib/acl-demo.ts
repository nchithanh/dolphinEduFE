import type { DemoRole } from "./role";
import { DEMO_ROLES } from "./role";

export type AclGrant = "full" | "view" | "none";

export type AclPermission = {
  id: string;
  group: string;
  label: string;
  hint: string;
  grants: Record<DemoRole, AclGrant>;
};

const F: AclGrant = "full";
const V: AclGrant = "view";
const N: AclGrant = "none";

/** 4 vai A1. Chủ ≈ quản lý; lễ tân vận hành; GV bị hạn chế học phí/SĐT. */
export const ACL_PERMISSIONS: AclPermission[] = [
  { id: "student.view", group: "Học viên", label: "Xem hồ sơ HV", hint: "Danh sách + 360", grants: { owner: F, manager: F, front: F, teacher: V } },
  { id: "student.edit", group: "Học viên", label: "Sửa hồ sơ HV", hint: "Tên, email, ngày sinh", grants: { owner: F, manager: F, front: F, teacher: N } },
  { id: "student.phone", group: "Học viên", label: "Xem SĐT HV", hint: "A1 — ẩn với GV", grants: { owner: F, manager: F, front: F, teacher: N } },
  { id: "student.guardian", group: "Học viên", label: "Liên hệ phụ huynh", hint: "Trẻ em: SĐT / email PH", grants: { owner: F, manager: F, front: F, teacher: V } },
  { id: "student.enroll", group: "Học viên", label: "Ghi danh khóa", hint: "Thêm HV vào khóa / giữa khóa", grants: { owner: F, manager: F, front: F, teacher: N } },
  { id: "course.view", group: "Khóa & lớp", label: "Xem khóa / buổi", hint: "Catalog + lịch", grants: { owner: F, manager: F, front: F, teacher: V } },
  { id: "course.edit", group: "Khóa & lớp", label: "Tạo / sửa khóa", hint: "Khung, GV, sĩ số, CN", grants: { owner: F, manager: F, front: N, teacher: N } },
  { id: "class.cancel", group: "Khóa & lớp", label: "Hủy buổi", hint: "Không mất buổi HV", grants: { owner: F, manager: F, front: N, teacher: N } },
  { id: "class.reschedule", group: "Khóa & lớp", label: "Đổi giờ / phòng / GV", hint: "Trong cùng chi nhánh", grants: { owner: F, manager: F, front: V, teacher: N } },
  { id: "room.assign", group: "Khóa & lớp", label: "Gán phòng", hint: "Phòng linh hoạt trong CN", grants: { owner: F, manager: F, front: V, teacher: N } },
  { id: "fee.view", group: "Tài chính", label: "Xem học phí / nợ", hint: "A1 — ẩn với GV", grants: { owner: F, manager: F, front: F, teacher: N } },
  { id: "fee.collect", group: "Tài chính", label: "Thu học phí", hint: "Phiếu TM / CK / online", grants: { owner: F, manager: F, front: F, teacher: N } },
  { id: "fee.debt", group: "Tài chính", label: "Ghi nhận công nợ", hint: "Nợ vẫn vào lớp", grants: { owner: F, manager: F, front: F, teacher: N } },
  { id: "report.revenue", group: "Tài chính", label: "Báo cáo doanh thu", hint: "Theo CN / gói / kỳ", grants: { owner: F, manager: F, front: N, teacher: N } },
  { id: "hold.view", group: "Bảo lưu", label: "Xem phiếu BL", hint: "Hạn + buổi giữ", grants: { owner: F, manager: F, front: V, teacher: N } },
  { id: "hold.approve", group: "Bảo lưu", label: "Duyệt bảo lưu", hint: "Chỉ Chủ / QL", grants: { owner: F, manager: F, front: N, teacher: N } },
  { id: "attend.mark", group: "Điểm danh", label: "Điểm danh tay", hint: "Có mặt / vắng trên CRM", grants: { owner: F, manager: F, front: F, teacher: F } },
  { id: "attend.qr", group: "Điểm danh", label: "Điểm danh QR", hint: "Quét hộ buổi", grants: { owner: F, manager: F, front: F, teacher: V } },
  { id: "care.blast", group: "Chăm sóc", label: "Gửi Zalo / email hàng loạt", hint: "HV hoặc PH", grants: { owner: F, manager: F, front: F, teacher: N } },
  { id: "promo.manage", group: "Chăm sóc", label: "Quản lý voucher", hint: "Bật / tắt mã KM", grants: { owner: F, manager: F, front: V, teacher: N } },
  { id: "rental.manage", group: "Vận hành", label: "Đặt phòng thuê", hint: "Phiếu thuê + cọc", grants: { owner: F, manager: F, front: F, teacher: N } },
  { id: "task.manage", group: "Vận hành", label: "Giao / sửa tác vụ", hint: "Không sprint/epic", grants: { owner: F, manager: F, front: F, teacher: V } },
  { id: "calendar.sync", group: "Hệ thống", label: "Sync Google Calendar", hint: "Lịch trung tâm", grants: { owner: F, manager: F, front: V, teacher: V } },
  { id: "access.manage", group: "Hệ thống", label: "Sửa phân quyền", hint: "Chỉ Chủ (demo)", grants: { owner: F, manager: V, front: N, teacher: N } },
];

export type AclStaff = {
  id: string;
  name: string;
  role: DemoRole;
  branchId: string;
  email: string;
  status: "active" | "leave";
};

export const ACL_STAFF: AclStaff[] = [
  { id: "ac-uyen", name: "Uyên Phạm", role: "owner", branchId: "all", email: "uyen@ma-dance.local", status: "active" },
  { id: "ac-ha", name: "Hà Nguyễn", role: "manager", branchId: "br-q1", email: "ha@ma-dance.local", status: "active" },
  { id: "ac-chau", name: "Minh Châu", role: "manager", branchId: "br-td", email: "chau@ma-dance.local", status: "active" },
  { id: "ac-truc", name: "Trúc Mai", role: "manager", branchId: "br-tdc", email: "truc@ma-dance.local", status: "leave" },
  { id: "ac-an", name: "An Lê", role: "front", branchId: "br-q1", email: "an@ma-dance.local", status: "active" },
  { id: "ac-ngoc", name: "Bảo Ngọc", role: "front", branchId: "br-q1", email: "ngoc.lt@ma-dance.local", status: "active" },
  { id: "ac-kim", name: "Kim Anh", role: "front", branchId: "br-td", email: "kimanh@ma-dance.local", status: "active" },
  { id: "ac-vy", name: "Phương Vy", role: "front", branchId: "br-tdc", email: "vy.lt@ma-dance.local", status: "active" },
  { id: "ac-mai", name: "Mai Trần", role: "teacher", branchId: "br-q1", email: "mai@ma-dance.local", status: "active" },
  { id: "ac-linh", name: "Linh Phạm", role: "teacher", branchId: "br-td", email: "linh@ma-dance.local", status: "active" },
  { id: "ac-khoa", name: "Khoa Võ", role: "teacher", branchId: "br-tdc", email: "khoa@ma-dance.local", status: "active" },
  { id: "ac-thu", name: "Thu Anh", role: "teacher", branchId: "br-q1", email: "thuanh@ma-dance.local", status: "active" },
];

export function aclRoleLabel(role: DemoRole): string {
  return DEMO_ROLES.find((row) => row.id === role)?.label ?? role;
}

export function aclGrantLabel(grant: AclGrant): string {
  if (grant === "full") return "Có";
  if (grant === "view") return "Xem";
  return "Không";
}

export function staffForPermission(perm: AclPermission): AclStaff[] {
  return ACL_STAFF.filter((row) => perm.grants[row.role] !== "none" && row.status === "active");
}

export function permissionsForRole(role: DemoRole): AclPermission[] {
  return ACL_PERMISSIONS.filter((perm) => perm.grants[role] !== "none");
}
