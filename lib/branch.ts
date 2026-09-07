import type { DemoRoom } from "./types";

export const ALL_BRANCH_ID = "all";
export const BRANCH_STORAGE_KEY = "edu-branch";

export type Branch = {
  id: string;
  name: string;
};

/** Demo FE only — MA Dance discovery: Q10 · Q3 · Phú Nhuận. Giữ id cũ (edu-branch). */
export const DEMO_BRANCHES: Branch[] = [
  { id: "br-q1", name: "Quận 10" },
  { id: "br-td", name: "Quận 3" },
  { id: "br-tdc", name: "Phú Nhuận" },
];

export function isBranchId(value: string): boolean {
  return value === ALL_BRANCH_ID || DEMO_BRANCHES.some((branch) => branch.id === value);
}

export function readStoredBranch(): string {
  try {
    const raw = window.localStorage.getItem(BRANCH_STORAGE_KEY);
    if (raw && isBranchId(raw)) return raw;
  } catch {
    /* private mode */
  }
  return ALL_BRANCH_ID;
}

export function writeStoredBranch(branchId: string) {
  try {
    window.localStorage.setItem(BRANCH_STORAGE_KEY, branchId);
  } catch {
    /* private mode */
  }
}

export function branchName(id: string): string {
  return DEMO_BRANCHES.find((branch) => branch.id === id)?.name ?? id;
}

export function roomsForBranch(rooms: DemoRoom[], branchId: string): DemoRoom[] {
  if (branchId === ALL_BRANCH_ID) return rooms;
  return rooms.filter((room) => room.branchId === branchId);
}
