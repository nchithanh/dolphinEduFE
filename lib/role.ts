export type DemoRole = "owner" | "manager" | "front" | "teacher";

export const ROLE_STORAGE_KEY = "edu-role";

export type RoleProfile = {
  id: DemoRole;
  label: string;
  name: string;
  avatarId: string;
};

export const DEMO_ROLES: RoleProfile[] = [
  { id: "owner", label: "Chủ", name: "Uyên Phạm", avatarId: "an" },
  { id: "manager", label: "Quản lý", name: "Hà Nguyễn", avatarId: "ha" },
  { id: "front", label: "Lễ tân", name: "An Lê", avatarId: "an" },
  { id: "teacher", label: "Giáo viên", name: "Mai Trần", avatarId: "mai" },
];

export function isDemoRole(value: string): value is DemoRole {
  return DEMO_ROLES.some((role) => role.id === value);
}

export function readStoredRole(): DemoRole {
  try {
    const raw = window.localStorage.getItem(ROLE_STORAGE_KEY);
    if (raw && isDemoRole(raw)) return raw;
  } catch {
    /* private mode */
  }
  return "manager";
}

export function writeStoredRole(role: DemoRole) {
  try {
    window.localStorage.setItem(ROLE_STORAGE_KEY, role);
  } catch {
    /* private mode */
  }
}

export function roleProfile(role: DemoRole): RoleProfile {
  return DEMO_ROLES.find((row) => row.id === role) ?? DEMO_ROLES[1];
}

/** GV không xem SĐT học viên (A1). */
export function canSeeStudentPhone(role: DemoRole): boolean {
  return role !== "teacher";
}

/** GV không xem học phí / công nợ (A1). */
export function canSeeFees(role: DemoRole): boolean {
  return role !== "teacher";
}

export function canApproveHold(role: DemoRole): boolean {
  return role === "owner" || role === "manager";
}

export function displayPhone(phone: string | undefined, role: DemoRole): string {
  const raw = phone?.trim();
  if (!raw) return "—";
  if (canSeeStudentPhone(role)) return raw;
  return "•••• ••• •••";
}

export function displayFee(value: string, role: DemoRole): string {
  if (canSeeFees(role)) return value;
  return "Ẩn với GV";
}
