import type { LiveStage, Stage, StubStage } from "./types";

/** Visible when menu item / locale label is missing. */
export const MISSING_MENU_LABEL = "NULL";

export type NavItem = {
  id: Stage;
  label: string;
  hint: string;
  ready: boolean;
};

export type NavGroup = {
  id: string;
  label: string;
  items: NavItem[];
};

export const LIVE_STAGES: LiveStage[] = [
  "overview",
  "inbox",
  "classes",
  "students",
  "tasks",
  "teachers",
  "classrooms",
  "courses",
];

const STUB_STAGES: StubStage[] = [
  "notifications",
  "campaigns",
  "followup",
  "packages",
  "reports",
  "shifts",
  "attendance",
  "inventory",
  "suppliers",
  "payment",
  "refunds",
  "settings",
  "access",
  "integrations",
  "audit",
  "schedule",
  "activity",
  "leads",
  "consult",
  "invoices",
];

const STAGE_IDS = new Set<string>([...LIVE_STAGES, ...STUB_STAGES]);

export function isStage(id: string): id is Stage {
  return STAGE_IDS.has(id);
}

export function isLiveStage(id: Stage): id is LiveStage {
  return (LIVE_STAGES as string[]).includes(id);
}

export function menuDisplayLabel(raw: string | null | undefined): string {
  const text = raw?.trim() ?? "";
  return text || MISSING_MENU_LABEL;
}

export function navItemFromGroups(groups: NavGroup[], id: Stage): NavItem {
  for (const group of groups) {
    const found = group.items.find((item) => item.id === id);
    if (found) return found;
  }
  return { id, label: MISSING_MENU_LABEL, hint: "", ready: false };
}

export function groupIdForStage(groups: NavGroup[], id: Stage): string {
  return groups.find((group) => group.items.some((item) => item.id === id))?.id ?? groups[0]?.id ?? "overview";
}
