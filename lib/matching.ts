import type { BookingDraft, BookingMissing, BookingStatus } from "./types";

export type BookingOption = { id: string; label: string };

export type StaffMember = {
  id: string;
  name: string;
  role: string;
};

export type RoomResource = {
  id: string;
  label: string;
  kind: "room" | "bed";
  branchId: string;
  /** false = ẩn khỏi matching, vẫn hiện trong quản lý */
  active: boolean;
  note?: string;
};

/** Blocked (staff|room) × date × start time — demo FE only. */
export type SlotBlock = {
  id: string;
  date: string;
  time: string;
  staffId: string;
  roomId?: string;
  bookingId?: string;
  provisional?: boolean;
};

export const MATCH_STAFF: StaffMember[] = [
  { id: "mai", name: "Mai", role: "Hip-hop" },
  { id: "ha", name: "Hà", role: "Contemporary" },
  { id: "linh", name: "Linh", role: "Kids / Ballet" },
];

export const MATCH_ROOMS: RoomResource[] = [
  { id: "p1", label: "Studio 1", kind: "room", branchId: "br-q1", active: true },
  { id: "p2", label: "Studio 2", kind: "room", branchId: "br-q1", active: true },
  { id: "ga", label: "Floor A", kind: "bed", branchId: "br-q1", active: true, note: "Sàn gỗ" },
  { id: "p3", label: "Studio 3", kind: "room", branchId: "br-td", active: true, note: "Ưu tiên Contemporary" },
  { id: "gb", label: "Kids Room", kind: "bed", branchId: "br-td", active: true },
  { id: "p4", label: "Studio 1", kind: "room", branchId: "br-tdc", active: true },
];

export function cloneSeedRooms(): RoomResource[] {
  return MATCH_ROOMS.map((r) => ({ ...r }));
}

export function activeRooms(rooms: RoomResource[]): RoomResource[] {
  return rooms.filter((r) => r.active);
}

/** Working day slots (30 phút). */
export const TIME_SLOTS = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
] as const;

function localIsoDate(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function staffOptions(): BookingOption[] {
  return [
    { id: "", label: "Chưa gán GV" },
    ...MATCH_STAFF.map((s) => ({ id: s.id, label: s.name })),
  ];
}

export function roomOptions(rooms: RoomResource[] = MATCH_ROOMS): BookingOption[] {
  return [
    { id: "", label: "Chưa chọn phòng" },
    ...activeRooms(rooms).map((r) => ({ id: r.id, label: r.label })),
  ];
}

export function staffLabel(id: string): string {
  return MATCH_STAFF.find((s) => s.id === id)?.name ?? (id ? id : "—");
}

export function roomLabel(id: string, rooms: RoomResource[] = MATCH_ROOMS): string {
  return rooms.find((r) => r.id === id)?.label ?? (id ? id : "—");
}

function toMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function spans(start: string, durationMin: number): string[] {
  const startMin = toMinutes(start);
  const endMin = startMin + durationMin;
  return TIME_SLOTS.filter((slot) => {
    const t = toMinutes(slot);
    return t >= startMin && t < endMin;
  });
}

export function durationMinutes(durationId: string): number {
  const n = Number(durationId);
  return Number.isFinite(n) && n > 0 ? n : 60;
}

function staffBusy(
  blocks: SlotBlock[],
  date: string,
  staffId: string,
  slot: string,
  ignoreId?: string,
): boolean {
  return blocks.some(
    (b) =>
      b.id !== ignoreId &&
      b.date === date &&
      b.staffId === staffId &&
      spans(b.time, 60).includes(slot),
  );
}

function roomBusy(
  blocks: SlotBlock[],
  date: string,
  roomId: string,
  slot: string,
  ignoreId?: string,
): boolean {
  return blocks.some(
    (b) =>
      b.id !== ignoreId &&
      Boolean(b.roomId) &&
      b.date === date &&
      b.roomId === roomId &&
      spans(b.time, 60).includes(slot),
  );
}

/** Staff free for entire duration starting at `time`. */
export function isStaffFreeFor(
  blocks: SlotBlock[],
  date: string,
  staffId: string,
  time: string,
  durationId: string,
  ignoreId?: string,
): boolean {
  if (!staffId || !time || !date) return false;
  const need = spans(time, durationMinutes(durationId));
  if (need.length === 0) return false;
  return need.every((slot) => !staffBusy(blocks, date, staffId, slot, ignoreId));
}

export function isRoomFreeFor(
  blocks: SlotBlock[],
  date: string,
  roomId: string,
  time: string,
  durationId: string,
  ignoreId?: string,
): boolean {
  if (!roomId || !time || !date) return false;
  const need = spans(time, durationMinutes(durationId));
  if (need.length === 0) return false;
  return need.every((slot) => !roomBusy(blocks, date, roomId, slot, ignoreId));
}

export type MatchCell = {
  staffId: string;
  staffName: string;
  time: string;
  free: boolean;
};

/** Grid: each TIME_SLOT × staff — free if full duration fits. */
export function buildMatchGrid(
  blocks: SlotBlock[],
  date: string,
  durationId: string,
  ignoreId?: string,
): MatchCell[] {
  const cells: MatchCell[] = [];
  for (const time of TIME_SLOTS) {
    for (const staff of MATCH_STAFF) {
      cells.push({
        staffId: staff.id,
        staffName: staff.name,
        time,
        free: isStaffFreeFor(blocks, date, staff.id, time, durationId, ignoreId),
      });
    }
  }
  return cells;
}

export function freeRoomsAt(
  blocks: SlotBlock[],
  date: string,
  time: string,
  durationId: string,
  rooms: RoomResource[] = MATCH_ROOMS,
  ignoreId?: string,
): RoomResource[] {
  return activeRooms(rooms).filter((r) =>
    isRoomFreeFor(blocks, date, r.id, time, durationId, ignoreId),
  );
}

export function roomBusySlots(
  blocks: SlotBlock[],
  date: string,
  roomId: string,
): { time: string; bookingId?: string }[] {
  return blocks
    .filter((b) => b.date === date && b.roomId === roomId && !b.provisional)
    .map((b) => ({ time: b.time, bookingId: b.bookingId }))
    .sort((a, b) => a.time.localeCompare(b.time));
}

export function staffDaySlots(
  blocks: SlotBlock[],
  date: string,
  staffId: string,
  durationId = "60",
): { time: string; free: boolean }[] {
  return TIME_SLOTS.map((time) => ({
    time,
    free: isStaffFreeFor(blocks, date, staffId, time, durationId),
  }));
}

export function missingFactors(draft: BookingDraft): BookingMissing[] {
  const missing: BookingMissing[] = [];
  if (!draft.time.trim()) missing.push("time");
  if (!draft.staff.trim()) missing.push("staff");
  if (!draft.room.trim()) missing.push("room");
  return missing;
}

export function resolveBookingStatus(draft: BookingDraft): BookingStatus {
  return missingFactors(draft).length === 0 ? "confirmed" : "incomplete";
}

export function missingLabel(missing: BookingMissing[]): string {
  if (missing.length === 0) return "";
  const map: Record<BookingMissing, string> = {
    time: "giờ",
    staff: "GV",
    room: "phòng",
  };
  return `Thiếu ${missing.map((m) => map[m]).join(" · ")}`;
}

/** Seed blocks for today — some occupied so matching looks real. */
export function buildSeedBlocks(today = localIsoDate()): SlotBlock[] {
  return [
    { id: "blk-1", date: today, time: "09:00", staffId: "mai", roomId: "p1", bookingId: "b-1" },
    { id: "blk-2", date: today, time: "10:30", staffId: "ha", roomId: "ga", bookingId: "b-2" },
    { id: "blk-3", date: today, time: "14:00", staffId: "linh", roomId: "p2", bookingId: "b-3" },
    { id: "blk-4", date: today, time: "11:00", staffId: "mai", roomId: "p3", bookingId: "b-seed-a" },
    { id: "blk-5", date: today, time: "15:00", staffId: "ha", roomId: "gb", bookingId: "b-seed-b" },
    { id: "blk-6", date: today, time: "16:00", staffId: "linh", roomId: "p1", bookingId: "b-seed-c" },
  ];
}
