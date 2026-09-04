import type { ReactNode } from "react";
import type {
  BookingStatus,
  ClassStatus,
  CourseStatus,
  InboxAiStatus,
  StudioTaskPriority,
  StudioTaskStatus,
  VisitStatus,
} from "../../lib/types";
import "./chrome.css";

export type ChipTone = "done" | "track" | "delay" | "pending" | "paid" | "wait";

type StatusChipProps = {
  tone: ChipTone;
  children: ReactNode;
};

export function StatusChip({ tone, children }: StatusChipProps) {
  return <span className={`ops-chip ops-chip--${tone}`}>{children}</span>;
}

export function courseChip(status: CourseStatus): { tone: ChipTone; label: string } {
  if (status === "recruiting") return { tone: "track", label: "Đang tuyển" };
  if (status === "closed") return { tone: "pending", label: "Đóng tuyển" };
  return { tone: "wait", label: "Nháp" };
}

export function classChip(status: ClassStatus): { tone: ChipTone; label: string } {
  if (status === "ongoing") return { tone: "paid", label: "Đang diễn ra" };
  if (status === "completed") return { tone: "done", label: "Hoàn thành" };
  if (status === "cancelled") return { tone: "delay", label: "Hủy" };
  return { tone: "wait", label: "Chưa diễn ra" };
}

export function bookingChip(status: BookingStatus): { tone: ChipTone; label: string } {
  if (status === "confirmed") return { tone: "done", label: "Đã xác nhận" };
  if (status === "incomplete") return { tone: "delay", label: "Thiếu yếu tố" };
  return { tone: "wait", label: "Chờ xác nhận" };
}

export function inboxChip(status: InboxAiStatus): { tone: ChipTone; label: string } {
  if (status === "done") return { tone: "done", label: "Đã xử lý" };
  if (status === "draft") return { tone: "track", label: "AI đã soạn" };
  return { tone: "wait", label: "Chờ bạn" };
}

export function visitChip(status: VisitStatus): { tone: ChipTone; label: string } {
  if (status === "done") return { tone: "paid", label: "Đã hoàn thành" };
  return { tone: "delay", label: "Đã hủy" };
}

export function workTaskChip(status: StudioTaskStatus): { tone: ChipTone; label: string } {
  if (status === "doing") return { tone: "paid", label: "Đang làm" };
  if (status === "done") return { tone: "done", label: "Xong" };
  if (status === "cancelled") return { tone: "delay", label: "Hủy" };
  return { tone: "wait", label: "Chờ" };
}

export function workPriorityChip(priority: StudioTaskPriority): { tone: ChipTone; label: string } {
  if (priority === "high") return { tone: "delay", label: "Cao" };
  if (priority === "mid") return { tone: "pending", label: "Trung bình" };
  return { tone: "wait", label: "Thấp" };
}
