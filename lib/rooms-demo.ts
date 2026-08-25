/** Phòng tập — số demo hardcode (FE only). */

export const ROOMS_KPI = [
  { id: "total", label: "Tổng phòng", value: "12", trend: "+2", up: true, ico: "▣" },
  { id: "free", label: "Phòng đang trống", value: "4", trend: "+33%", up: true, ico: "◯" },
  { id: "busy", label: "Phòng đang sử dụng", value: "6", trend: "50%", up: true, ico: "◉" },
  { id: "soon", label: "Phòng sắp có lịch", value: "1", trend: "8%", up: true, ico: "◷" },
  { id: "fill", label: "Tỉ lệ lấp đầy (hôm nay)", value: "72%", trend: "+5%", up: true, ico: "◎" },
  { id: "maint", label: "Phòng bảo trì", value: "1", trend: "8%", up: false, ico: "⚒" },
];

/** Timeline sử dụng 06:00–22:00 (tỉ lệ % trên thanh). */
export const ROOMS_USAGE = {
  startHour: 6,
  endHour: 22,
  /** Khớp DEMO_AS_OF 17:15 */
  nowHour: 17.25,
  segments: [
    { id: "s1", from: 6, to: 9, tone: "idle" as const, label: "Sáng sớm" },
    { id: "s2", from: 9, to: 12, tone: "busy" as const, label: "Ca sáng" },
    { id: "s3", from: 12, to: 14, tone: "mid" as const, label: "Trưa" },
    { id: "s4", from: 14, to: 18, tone: "busy" as const, label: "Ca chiều" },
    { id: "s5", from: 18, to: 21, tone: "peak" as const, label: "Cao điểm" },
    { id: "s6", from: 21, to: 22, tone: "idle" as const, label: "Đóng cửa" },
  ],
};

export type RoomUiStatus = "busy" | "free" | "maint" | "soon";

export function demoRoomCode(roomId: string): string {
  const map: Record<string, string> = {
    p1: "A01",
    p2: "A02",
    ga: "A03",
    p6: "A04",
    p7: "A05",
    p3: "B01",
    gb: "B02",
    p8: "B03",
    p9: "B04",
    p4: "C01",
    p5: "C02",
    p10: "C03",
  };
  return `P-${map[roomId] ?? roomId.slice(0, 3).toUpperCase()}`;
}

export function demoRoomStats(roomId: string): {
  capacity: number;
  area: string;
  type: string;
  amenities: string[];
  fillPct: number;
  maintenance: boolean;
  tags: string[];
  history: { when: string; text: string }[];
} {
  let hash = 0;
  for (let i = 0; i < roomId.length; i += 1) hash = (hash + roomId.charCodeAt(i) * (i + 3)) % 97;
  const capacity = 12 + (hash % 5) * 2;
  const areas = ["Tầng 1", "Tầng 2", "Tầng 3", "Khu Kids", "Open hall"];
  const types = ["Studio lớn", "Studio vừa", "Sàn gỗ", "Kids", "Open practice"];
  const amenitySets = [
    ["Gương", "Loa", "Điều hòa"],
    ["Gương full", "Loa", "LED"],
    ["Sàn gỗ", "Thanh barre", "Gương"],
    ["Mats", "Loa nhẹ", "Điều hòa"],
    ["Gương", "Loa", "Quạt"],
  ];
  const fillPct = 55 + (hash % 40);
  const maintenance = roomId === "p9";
  const tags =
    hash % 3 === 0
      ? ["Cách âm tốt", "Ưu tiên nhóm"]
      : hash % 3 === 1
        ? ["Gần lễ tân", "Ánh sáng tốt"]
        : ["Sàn ổn định"];
  return {
    capacity,
    area: areas[hash % areas.length],
    type: types[hash % types.length],
    amenities: amenitySets[hash % amenitySets.length],
    fillPct,
    maintenance,
    tags,
    history: [
      { when: "22/08", text: "Vệ sinh sâu · kiểm tra loa" },
      { when: "15/08", text: "Đổi bóng LED" },
      { when: "01/08", text: "Bảo trì định kỳ" },
    ],
  };
}

export function roomStatusLabel(status: RoomUiStatus): string {
  if (status === "busy") return "Đang sử dụng";
  if (status === "maint") return "Bảo trì";
  if (status === "soon") return "Sắp có lịch";
  return "Trống";
}

export function roomStatusTone(status: RoomUiStatus): "paid" | "wait" | "delay" | "track" | "done" {
  if (status === "busy") return "track";
  if (status === "maint") return "delay";
  if (status === "soon") return "wait";
  return "done";
}
