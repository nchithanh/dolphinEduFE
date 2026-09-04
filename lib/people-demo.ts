/** Shared staff avatars for hardcoded CRM chrome. */

export const STAFF_AVATARS: Record<string, string> = {
  ha: "/avatars/ha.webp",
  mai: "/avatars/mai.webp",
  khoa: "/avatars/khoa.webp",
  linh: "/avatars/linh.webp",
  an: "/avatars/an.webp",
};

const STAFF_NAME_ID: Record<string, string> = {
  "Hà Nguyễn": "ha",
  "Mai Trần": "mai",
  "Khoa Võ": "khoa",
  "Linh Phạm": "linh",
  "An Lê": "an",
};

export function staffAvatarSrc(id: string | undefined): string | undefined {
  if (!id) return undefined;
  return STAFF_AVATARS[id];
}

export function staffIdFromName(name: string): string | undefined {
  return STAFF_NAME_ID[name];
}

/** Last two word initials — same rule as board `ops-mini-av`. */
export function nameInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  return parts
    .slice(-2)
    .map((part) => part[0] ?? "")
    .join("")
    .toUpperCase();
}
