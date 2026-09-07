"use client";

import { useState } from "react";
import { MID_ENROLL_RULES, REVENUE_BY_BRANCH } from "../../lib/quote-demo";
import {
  ACL_PERMISSIONS,
  ACL_STAFF,
  aclGrantLabel,
  aclRoleLabel,
  permissionsForRole,
  staffForPermission,
  type AclGrant,
  type AclPermission,
  type AclStaff,
} from "../../lib/acl-demo";
import { ALL_BRANCH_ID, branchName } from "../../lib/branch";
import { classStatus, CLASS_STATUS_LABEL, formatViDate, studentName, teacherName } from "../../lib/edu";
import { formatVnd } from "../../lib/money";
import { canApproveHold, canSeeFees, displayFee, type DemoRole } from "../../lib/role";
import type {
  AttendanceMap,
  CalendarLink,
  CareBlast,
  DemoClass,
  DemoCourse,
  DemoRoom,
  DemoStudent,
  DemoTeacher,
  FeeReceipt,
  HoldRequest,
  PromoCode,
  SessionPack,
  StudioRental,
} from "../../lib/types";
import { FeatureBoard, DetailShell } from "./FeatureBoard";
import { StatusChip } from "./StatusChip";
import "./QuoteBoards.css";

function GrantMark({ grant }: { grant: AclGrant }) {
  const cls = grant === "full" ? "ops-acl-g--full" : grant === "view" ? "ops-acl-g--view" : "ops-acl-g--none";
  return <span className={`ops-acl-g ${cls}`}>{aclGrantLabel(grant)}</span>;
}

function staffBranchLabel(branchId: string): string {
  return branchId === ALL_BRANCH_ID || branchId === "all" ? "Tất cả CN" : branchName(branchId);
}

function grantOf(permId: string, role: DemoRole): AclGrant {
  return ACL_PERMISSIONS.find((p) => p.id === permId)?.grants[role] ?? "none";
}

function AccessTabs({
  tab,
  onTab,
}: {
  tab: "perms" | "staff";
  onTab: (next: "perms" | "staff") => void;
}) {
  return (
    <div className="ops-acl-tabs" role="tablist" aria-label="Phân quyền">
      <button type="button" role="tab" aria-selected={tab === "perms"} className={tab === "perms" ? "ops-acl-tab ops-acl-tab--on" : "ops-acl-tab"} onClick={() => onTab("perms")}>
        Quyền ({ACL_PERMISSIONS.length})
      </button>
      <button type="button" role="tab" aria-selected={tab === "staff"} className={tab === "staff" ? "ops-acl-tab ops-acl-tab--on" : "ops-acl-tab"} onClick={() => onTab("staff")}>
        Tài khoản ({ACL_STAFF.length})
      </button>
    </div>
  );
}
const HOLD_LABEL = { pending: "Chờ duyệt", approved: "Đã duyệt", rejected: "Từ chối" } as const;
const PACK_LABEL = { active: "Đang dùng", hold: "Bảo lưu", expired: "Hết buổi" } as const;

function roomLabel(rooms: DemoRoom[], id: string): string {
  return rooms.find((r) => r.id === id)?.label ?? id;
}

const PAY_LABEL = { cash: "Tiền mặt", transfer: "Chuyển khoản", online: "Online CRM" } as const;

type People = {
  students: DemoStudent[];
  courses: DemoCourse[];
  classes: DemoClass[];
  rooms: DemoRoom[];
  teachers: DemoTeacher[];
  role: DemoRole;
  notice: string | null;
};

export function PackagesBoard({
  packages,
  students,
  notice,
}: {
  packages: SessionPack[];
  students: DemoStudent[];
  notice: string | null;
}) {
  return (
    <FeatureBoard
      headingId="ops-pack-heading"
      title="Gói buổi"
      lede="Thu theo gói 1 / 3 / 6 / 12 tháng. Điểm danh có mặt trừ 1 buổi — không học bù (A6)."
      notice={notice}
      searchPlaceholder="Tìm học viên, gói…"
      kpis={[
        { k: "Gói active", v: String(packages.filter((p) => p.status === "active").length), hint: "Đang trừ buổi" },
        { k: "Sắp hết", v: String(packages.filter((p) => p.status === "active" && p.remaining <= 4).length), hint: "≤ 4 buổi" },
        { k: "Bảo lưu", v: String(packages.filter((p) => p.status === "hold").length), hint: "Không trừ khi BL" },
        { k: "Cọc 6–12th", v: String(packages.filter((p) => p.deposit).length), hint: "Đã cọc" },
      ]}
      columns={[
        { key: "hv", label: "Học viên", render: (row) => <span className="ops-table__name">{studentName(students, row.studentId)}</span> },
        { key: "pack", label: "Gói", render: (row) => row.label },
        { key: "left", label: "Còn", render: (row) => `${row.remaining}/${row.total}` },
        { key: "br", label: "Chi nhánh", render: (row) => branchName(row.branchId) },
        {
          key: "st",
          label: "Trạng thái",
          render: (row) => (
            <StatusChip tone={row.status === "active" ? "paid" : row.status === "hold" ? "wait" : "delay"}>
              {PACK_LABEL[row.status]}
            </StatusChip>
          ),
        },
      ]}
      rows={packages}
      detail={(row) =>
        row ? (
          <DetailShell heading="Chi tiết gói" name={studentName(students, row.studentId)} code={row.id}>
            <dl className="ops-detail__meta">
              <div>
                <dt>Catalog</dt>
                <dd>{row.label}</dd>
              </div>
              <div>
                <dt>Buổi còn</dt>
                <dd>
                  {row.remaining} / {row.total}
                </dd>
              </div>
              <div>
                <dt>Cọc</dt>
                <dd>{row.deposit ? "Có (6 hoặc 12 tháng)" : "Không"}</dd>
              </div>
              <div>
                <dt>Nghỉ không BL</dt>
                <dd>Mất buổi, không hoàn — MA không học bù</dd>
              </div>
            </dl>
          </DetailShell>
        ) : (
          <p className="ops-table-empty">Chọn một gói.</p>
        )
      }
    />
  );
}

export function PaymentsBoard({
  receipts,
  students,
  role,
  notice,
  onCollect,
}: {
  receipts: FeeReceipt[];
  students: DemoStudent[];
  role: DemoRole;
  notice: string | null;
  onCollect: (id: string) => void;
}) {
  const hide = !canSeeFees(role);
  return (
    <FeatureBoard
      headingId="ops-pay-heading"
      title="Thu học phí"
      lede="Đóng 1 lần hoặc từng đợt · tiền mặt / CK + ảnh bill · cổng online trên CRM · nợ vẫn vào lớp (A7)."
      notice={notice}
      searchPlaceholder="Tìm phiếu thu…"
      kpis={[
        { k: "Đã thu", v: hide ? "—" : formatVnd(receipts.filter((r) => !r.debt).reduce((s, r) => s + r.amount, 0)), hint: "Seed demo" },
        { k: "Còn nợ", v: String(receipts.filter((r) => r.debt).length), hint: "Vẫn vào lớp" },
        { k: "Có bill", v: String(receipts.filter((r) => r.hasBill).length), hint: "Ảnh CK" },
        { k: "Online", v: String(receipts.filter((r) => r.method === "online").length), hint: "B2 cổng CRM" },
      ]}
      columns={[
        { key: "hv", label: "Học viên", render: (row) => <span className="ops-table__name">{studentName(students, row.studentId)}</span> },
        { key: "amt", label: "Số tiền", render: (row) => displayFee(row.debt ? "Nợ" : formatVnd(row.amount), role) },
        { key: "m", label: "Hình thức", render: (row) => PAY_LABEL[row.method] },
        { key: "i", label: "Đợt", render: (row) => (row.installment ? "Từng đợt" : "1 lần") },
        { key: "d", label: "Ngày", render: (row) => formatViDate(row.date) },
        {
          key: "st",
          label: "TT",
          render: (row) => <StatusChip tone={row.debt ? "delay" : "paid"}>{row.debt ? "Công nợ" : "Đã thu"}</StatusChip>,
        },
      ]}
      rows={receipts}
      detail={(row) =>
        row ? (
          <DetailShell heading="Phiếu thu" name={studentName(students, row.studentId)} code={row.id}>
            <dl className="ops-detail__meta">
              <div>
                <dt>Số tiền</dt>
                <dd>{displayFee(formatVnd(row.amount), role)}</dd>
              </div>
              <div>
                <dt>Chi nhánh</dt>
                <dd>{branchName(row.branchId)}</dd>
              </div>
              <div>
                <dt>Ghi chú</dt>
                <dd>{row.note}</dd>
              </div>
              <div>
                <dt>Bill</dt>
                <dd>{row.hasBill ? "Đã đính ảnh CK" : "Không ảnh"}</dd>
              </div>
            </dl>
            {row.debt && canSeeFees(role) ? (
              <div className="ops-detail__actions">
                <button type="button" className="ops-page__cta" onClick={() => onCollect(row.id)}>
                  Thu nợ (demo)
                </button>
              </div>
            ) : null}
          </DetailShell>
        ) : (
          <p className="ops-table-empty">Chọn phiếu thu.</p>
        )
      }
    />
  );
}

export function HoldsBoard({
  holds,
  students,
  role,
  notice,
  onDecide,
}: {
  holds: HoldRequest[];
  students: DemoStudent[];
  role: DemoRole;
  notice: string | null;
  onDecide: (id: string, status: "approved" | "rejected") => void;
}) {
  const can = canApproveHold(role);
  return (
    <FeatureBoard
      headingId="ops-hold-heading"
      title="Bảo lưu"
      lede="Gói ≥3 tháng tặng BL · gói ngắn mua lẻ. QL duyệt trên CRM · giữ chỗ sĩ số (A8)."
      notice={notice}
      searchPlaceholder="Tìm bảo lưu…"
      kpis={[
        { k: "Chờ duyệt", v: String(holds.filter((h) => h.status === "pending").length), hint: "Cần QL" },
        { k: "Đã duyệt", v: String(holds.filter((h) => h.status === "approved").length), hint: "Giữ buổi" },
        { k: "Tặng BL", v: String(holds.filter((h) => h.gifted).length), hint: "Gói dài" },
        { k: "Từ chối", v: String(holds.filter((h) => h.status === "rejected").length), hint: "Demo" },
      ]}
      columns={[
        { key: "hv", label: "Học viên", render: (row) => <span className="ops-table__name">{studentName(students, row.studentId)}</span> },
        { key: "c", label: "Khóa", render: (row) => row.courseName },
        { key: "u", label: "Hạn", render: (row) => formatViDate(row.until) },
        { key: "s", label: "Buổi giữ", render: (row) => String(row.sessionsKept) },
        {
          key: "st",
          label: "Duyệt",
          render: (row) => (
            <StatusChip tone={row.status === "approved" ? "paid" : row.status === "pending" ? "wait" : "delay"}>
              {HOLD_LABEL[row.status]}
            </StatusChip>
          ),
        },
        {
          key: "g",
          label: "Loại",
          render: (row) => (row.gifted ? "Tặng" : "Mua lẻ"),
        },
      ]}
      rows={holds}
      detail={(row) =>
        row ? (
          <DetailShell heading="Phiếu bảo lưu" name={studentName(students, row.studentId)} code={row.id}>
            <dl className="ops-detail__meta">
              <div>
                <dt>Lý do</dt>
                <dd>{row.reason}</dd>
              </div>
              <div>
                <dt>Loại</dt>
                <dd>{row.gifted ? "Tặng (gói ≥ 3 tháng)" : "Mua lẻ"}</dd>
              </div>
              <div>
                <dt>Hạn gói</dt>
                <dd>{formatViDate(row.until)}</dd>
              </div>
              <div>
                <dt>Lễ / hủy lớp</dt>
                <dd>Không tính hạn BL</dd>
              </div>
            </dl>
            {row.status === "pending" ? (
              <div className="ops-detail__actions">
                <button type="button" className="ops-page__cta" disabled={!can} onClick={() => onDecide(row.id, "approved")}>
                  {can ? "Duyệt" : "Chỉ Chủ / QL duyệt"}
                </button>
                <button type="button" className="ops-page__ghost" disabled={!can} onClick={() => onDecide(row.id, "rejected")}>
                  Từ chối
                </button>
              </div>
            ) : null}
          </DetailShell>
        ) : (
          <p className="ops-table-empty">Chọn phiếu bảo lưu.</p>
        )
      }
    />
  );
}

export function AttendanceDesk({
  classes,
  courses,
  students,
  attendance,
  notice,
  onMark,
}: {
  classes: DemoClass[];
  courses: DemoCourse[];
  students: DemoStudent[];
  attendance: AttendanceMap;
  notice: string | null;
  onMark: (classId: string, studentId: string, mark: "present" | "absent") => void;
}) {
  const today = classes.filter((row) => row.date === "2026-08-24" && !row.cancelled);
  const rows = today.map((row) => ({
    id: row.id,
    session: row,
    course: courses.find((c) => c.id === row.courseId)?.name ?? row.courseId,
  }));
  return (
    <FeatureBoard
      headingId="ops-att-heading"
      title="Điểm danh tay"
      lede="Lễ tân / quản lý đánh có mặt hoặc vắng trên CRM. Có mặt → trừ 1 buổi gói (A9 + A6)."
      notice={notice}
      searchPlaceholder="Tìm buổi hôm nay…"
      kpis={[
        { k: "Buổi hôm nay", v: String(today.length), hint: "24/08/2026" },
        { k: "Đã điểm", v: String(today.filter((r) => Object.keys(attendance[r.id] ?? {}).length > 0).length), hint: "Có mark" },
        { k: "Đang diễn ra", v: String(today.filter((r) => classStatus(r) === "ongoing").length), hint: "Heels 17:15" },
        { k: "Quyền", v: "Lễ tân / QL", hint: "Không phải HV tự điểm" },
      ]}
      columns={[
        { key: "c", label: "Khóa", render: (row) => <span className="ops-table__name">{row.course}</span> },
        { key: "t", label: "Giờ", render: (row) => `${row.session.startTime}–${row.session.endTime}` },
        {
          key: "st",
          label: "Buổi",
          render: (row) => <StatusChip tone="track">{CLASS_STATUS_LABEL[classStatus(row.session)]}</StatusChip>,
        },
        { key: "n", label: "Sĩ số", render: (row) => String(row.session.studentIds.length) },
        { key: "m", label: "Đã mark", render: (row) => String(Object.keys(attendance[row.id] ?? {}).length) },
      ]}
      rows={rows}
      detail={(row) =>
        row ? (
          <DetailShell heading="Roster điểm danh" name={row.course} code={`${row.session.startTime} · ${row.id}`}>
            <ul className="ops-quote-roster">
              {row.session.studentIds.map((sid) => {
                const mark = attendance[row.id]?.[sid];
                const who = students.find((s) => s.id === sid);
                return (
                  <li key={sid}>
                    <span>
                      {studentName(students, sid)}
                      {who?.kind === "child" ? <span className="ops-board__note"> · điểm danh HV</span> : null}
                    </span>
                    <span className="ops-quote-roster__acts">
                      <button
                        type="button"
                        className={mark === "present" ? "ops-page__cta" : "ops-page__ghost"}
                        onClick={() => onMark(row.id, sid, "present")}
                      >
                        Có mặt
                      </button>
                      <button
                        type="button"
                        className={mark === "absent" ? "ops-page__cta" : "ops-page__ghost"}
                        onClick={() => onMark(row.id, sid, "absent")}
                      >
                        Vắng
                      </button>
                    </span>
                  </li>
                );
              })}
            </ul>
          </DetailShell>
        ) : (
          <p className="ops-table-empty">Chọn buổi.</p>
        )
      }
    />
  );
}

export function QrBoard({
  classes,
  courses,
  students,
  attendance,
  notice,
  onMark,
}: {
  classes: DemoClass[];
  courses: DemoCourse[];
  students: DemoStudent[];
  attendance: AttendanceMap;
  notice: string | null;
  onMark: (classId: string, studentId: string, mark: "present") => void;
}) {
  const live = classes.filter((row) => classStatus(row) === "ongoing");
  const rows = (live.length ? live : classes.filter((r) => r.date === "2026-08-24" && !r.cancelled).slice(0, 8)).map((row) => ({
    id: row.id,
    session: row,
    course: courses.find((c) => c.id === row.courseId)?.name ?? row.courseId,
  }));
  return (
    <FeatureBoard
      headingId="ops-qr-heading"
      title="Điểm danh QR"
      lede="Mã QR buổi học — quét demo (không camera thật). Có mặt → trừ buổi gói (A10)."
      notice={notice}
      searchPlaceholder="Tìm buổi QR…"
      kpis={[
        { k: "Buổi QR", v: String(rows.length), hint: "Đang / hôm nay" },
        { k: "Mock", v: "SVG", hint: "Chưa camera" },
        { k: "Trừ buổi", v: "Có", hint: "Giống điểm danh tay" },
        { k: "HV tự quét", v: "Demo", hint: "Lễ tân cũng quét hộ" },
      ]}
      columns={[
        { key: "c", label: "Khóa", render: (row) => <span className="ops-table__name">{row.course}</span> },
        { key: "t", label: "Giờ", render: (row) => `${row.session.startTime}–${row.session.endTime}` },
        { key: "n", label: "HV", render: (row) => String(row.session.studentIds.length) },
      ]}
      rows={rows}
      detail={(row) =>
        row ? (
          <DetailShell heading="Mã QR buổi" name={row.course} code={row.id}>
            <div className="ops-qr" aria-hidden>
              {Array.from({ length: 64 }, (_, i) => (
                <span key={i} className={(i * 7 + row.id.length) % 3 === 0 ? "ops-qr__cell ops-qr__cell--on" : "ops-qr__cell"} />
              ))}
            </div>
            <p className="ops-board__note">Mã demo · {row.id}@ma-dance</p>
            <ul className="ops-quote-roster">
              {row.session.studentIds.slice(0, 6).map((sid) => (
                <li key={sid}>
                  <span>{studentName(students, sid)}</span>
                  <button type="button" className="ops-page__cta" onClick={() => onMark(row.id, sid, "present")}>
                    {attendance[row.id]?.[sid] === "present" ? "Đã quét" : "Quét hộ"}
                  </button>
                </li>
              ))}
            </ul>
          </DetailShell>
        ) : (
          <p className="ops-table-empty">Chọn buổi để hiện QR.</p>
        )
      }
    />
  );
}

export function CalendarBoard({
  links,
  classes,
  courses,
  teachers,
  rooms,
  notice,
  onToggle,
}: {
  links: CalendarLink[];
  classes: DemoClass[];
  courses: DemoCourse[];
  teachers: DemoTeacher[];
  rooms: DemoRoom[];
  notice: string | null;
  onToggle: (id: string) => void;
}) {
  const week = classes.filter((row) => row.date >= "2026-08-24" && row.date <= "2026-08-30" && !row.cancelled).slice(0, 12);
  return (
    <FeatureBoard
      headingId="ops-cal-heading"
      title="Lịch / Google Calendar"
      lede="1 lịch Google của trung tâm — chủ / GV / NV xem. HV/PH không nhận GCal cá nhân (A11). Mock FE, chưa OAuth."
      notice={notice}
      searchPlaceholder="Tìm lịch…"
      kpis={[
        { k: "Đã sync", v: String(links.filter((l) => l.synced).length), hint: "Tài khoản" },
        { k: "Chưa sync", v: String(links.filter((l) => !l.synced).length), hint: "Cần bật" },
        { k: "Buổi tuần", v: String(week.length), hint: "24–30/08" },
        { k: "OAuth", v: "TODO", hint: "Demo local" },
      ]}
      columns={[
        { key: "p", label: "Người", render: (row) => <span className="ops-table__name">{row.person}</span> },
        { key: "k", label: "Loại", render: (row) => (row.kind === "center" ? "Trung tâm" : "Nội bộ") },
        { key: "c", label: "Calendar", render: (row) => row.calendar },
        {
          key: "s",
          label: "Sync",
          render: (row) => <StatusChip tone={row.synced ? "paid" : "wait"}>{row.synced ? "Đã đồng bộ" : "Tắt"}</StatusChip>,
        },
      ]}
      rows={links}
      detail={(row) =>
        row ? (
          <DetailShell heading="Kết nối Calendar" name={row.person} code={row.calendar}>
            <p className="ops-board__note">Sự kiện tuần demo (MA Dance):</p>
            <ul className="ops-quote-list">
              {week.slice(0, 5).map((cls) => (
                <li key={cls.id}>
                  {formatViDate(cls.date)} · {cls.startTime} · {courses.find((c) => c.id === cls.courseId)?.name} ·{" "}
                  {teacherName(teachers, cls.teacherId)} · {roomLabel(rooms, cls.roomId)}
                </li>
              ))}
            </ul>
            <div className="ops-detail__actions">
              <button type="button" className="ops-page__cta" onClick={() => onToggle(row.id)}>
                {row.synced ? "Ngắt sync (demo)" : "Bật sync (demo)"}
              </button>
            </div>
          </DetailShell>
        ) : (
          <p className="ops-table-empty">Chọn tài khoản.</p>
        )
      }
    />
  );
}

export function PromosBoard({
  promos,
  notice,
  onToggle,
}: {
  promos: PromoCode[];
  notice: string | null;
  onToggle: (id: string) => void;
}) {
  return (
    <FeatureBoard
      headingId="ops-promo-heading"
      title="Promotion / voucher"
      lede="Chương trình khuyến mãi và mã giảm giá — seed demo (A12)."
      notice={notice}
      searchPlaceholder="Tìm mã…"
      kpis={[
        { k: "Đang chạy", v: String(promos.filter((p) => p.active).length), hint: "Active" },
        { k: "Tổng mã", v: String(promos.length), hint: "Catalog" },
        { k: "Lượt dùng", v: String(promos.reduce((s, p) => s + p.used, 0)), hint: "Demo" },
        { k: "Hết hạn", v: String(promos.filter((p) => !p.active).length), hint: "Tắt" },
      ]}
      columns={[
        { key: "c", label: "Mã", render: (row) => <span className="ops-table__id">{row.code}</span> },
        { key: "t", label: "Chương trình", render: (row) => <span className="ops-table__name">{row.title}</span> },
        { key: "d", label: "Ưu đãi", render: (row) => row.discount },
        { key: "u", label: "Dùng", render: (row) => String(row.used) },
        {
          key: "a",
          label: "TT",
          render: (row) => <StatusChip tone={row.active ? "paid" : "wait"}>{row.active ? "Bật" : "Tắt"}</StatusChip>,
        },
      ]}
      rows={promos}
      detail={(row) =>
        row ? (
          <DetailShell heading="Voucher" name={row.title} code={row.code}>
            <dl className="ops-detail__meta">
              <div>
                <dt>Hạn</dt>
                <dd>{formatViDate(row.until)}</dd>
              </div>
              <div>
                <dt>Ưu đãi</dt>
                <dd>{row.discount}</dd>
              </div>
            </dl>
            <div className="ops-detail__actions">
              <button type="button" className="ops-page__cta" onClick={() => onToggle(row.id)}>
                {row.active ? "Tắt mã" : "Bật mã"}
              </button>
            </div>
          </DetailShell>
        ) : (
          <p className="ops-table-empty">Chọn mã.</p>
        )
      }
    />
  );
}

export function CareBoard({
  blasts,
  notice,
  onSend,
}: {
  blasts: CareBlast[];
  notice: string | null;
  onSend: (id: string) => void;
}) {
  const kindLabel = { birthday: "Sinh nhật", zalo: "Zalo", email: "Email" };
  return (
    <FeatureBoard
      headingId="ops-care-heading"
      title="Chăm sóc & thông báo"
      lede="Chúc mừng sinh nhật · gửi Zalo / email hàng loạt cho HV hoặc phụ huynh (A13). Demo local, chưa OA."
      notice={notice}
      searchPlaceholder="Tìm chiến dịch…"
      kpis={[
        { k: "Sinh nhật", v: String(blasts.filter((b) => b.kind === "birthday").length), hint: "Tuần này" },
        { k: "Zalo", v: String(blasts.filter((b) => b.kind === "zalo").length), hint: "Hàng loạt" },
        { k: "Email", v: String(blasts.filter((b) => b.kind === "email").length), hint: "Lịch tuần" },
        { k: "Nháp", v: String(blasts.filter((b) => b.status === "draft").length), hint: "Chưa gửi" },
      ]}
      columns={[
        { key: "t", label: "Chiến dịch", render: (row) => <span className="ops-table__name">{row.title}</span> },
        { key: "k", label: "Kênh", render: (row) => kindLabel[row.kind] },
        { key: "a", label: "Đối tượng", render: (row) => row.audience },
        {
          key: "s",
          label: "TT",
          render: (row) => (
            <StatusChip tone={row.status === "sent" ? "paid" : row.status === "scheduled" ? "track" : "wait"}>
              {row.status === "sent" ? "Đã gửi" : row.status === "scheduled" ? "Lịch" : "Nháp"}
            </StatusChip>
          ),
        },
      ]}
      rows={blasts}
      detail={(row) =>
        row ? (
          <DetailShell heading="Gửi hàng loạt" name={row.title} code={row.when}>
            <dl className="ops-detail__meta">
              <div>
                <dt>Đối tượng</dt>
                <dd>{row.audience}</dd>
              </div>
              <div>
                <dt>Kênh</dt>
                <dd>{kindLabel[row.kind]}</dd>
              </div>
            </dl>
            {row.status !== "sent" ? (
              <div className="ops-detail__actions">
                <button type="button" className="ops-page__cta" onClick={() => onSend(row.id)}>
                  Gửi demo
                </button>
              </div>
            ) : null}
          </DetailShell>
        ) : (
          <p className="ops-table-empty">Chọn chiến dịch.</p>
        )
      }
    />
  );
}

export function RevenueBoard({ role }: { role: DemoRole }) {
  const hide = !canSeeFees(role);
  const totalC = REVENUE_BY_BRANCH.reduce((s, r) => s + r.collected, 0);
  const totalD = REVENUE_BY_BRANCH.reduce((s, r) => s + r.debt, 0);
  const rows = REVENUE_BY_BRANCH.map((r) => ({ ...r, id: r.branchId }));
  return (
    <FeatureBoard
      headingId="ops-rev-heading"
      title="Theo dõi doanh thu"
      lede="Đã thu / còn nợ / theo gói — theo chi nhánh · kỳ tháng 08/2026 (A14). Seed dashboard."
      searchPlaceholder="Tìm chi nhánh…"
      kpis={[
        { k: "Đã thu", v: hide ? "—" : formatVnd(totalC), hint: "Tháng 08" },
        { k: "Còn nợ", v: hide ? "—" : formatVnd(totalD), hint: "Thu sau" },
        { k: "CK + online", v: hide ? "—" : formatVnd(REVENUE_BY_BRANCH.reduce((s, r) => s + r.transfer + r.online, 0)), hint: "Không TM" },
        { k: "Gói 12 tháng", v: String(REVENUE_BY_BRANCH.reduce((s, r) => s + r.pack12, 0)), hint: "Đang bán" },
      ]}
      columns={[
        { key: "n", label: "Chi nhánh", render: (row) => <span className="ops-table__name">{row.name}</span> },
        { key: "c", label: "Đã thu", render: (row) => displayFee(formatVnd(row.collected), role) },
        { key: "d", label: "Nợ", render: (row) => displayFee(formatVnd(row.debt), role) },
        { key: "tm", label: "TM", render: (row) => displayFee(formatVnd(row.cash), role) },
        { key: "ck", label: "CK", render: (row) => displayFee(formatVnd(row.transfer), role) },
        { key: "on", label: "Online", render: (row) => displayFee(formatVnd(row.online), role) },
        { key: "p", label: "Gói", render: (row) => String(row.packs) },
      ]}
      rows={rows}
      detail={(row) =>
        row ? (
          <DetailShell heading="Doanh thu chi nhánh" name={row.name}>
            <dl className="ops-detail__meta">
              <div>
                <dt>Đã thu</dt>
                <dd>{displayFee(formatVnd(row.collected), role)}</dd>
              </div>
              <div>
                <dt>Còn nợ</dt>
                <dd>{displayFee(formatVnd(row.debt), role)}</dd>
              </div>
              <div>
                <dt>Gói đang bán</dt>
                <dd>{row.packs} (1/3/6/12 tháng) · {row.pack12} gói 12 tháng</dd>
              </div>
              <div>
                <dt>Kênh thu</dt>
                <dd>
                  TM {displayFee(formatVnd(row.cash), role)} · CK {displayFee(formatVnd(row.transfer), role)} · Online{" "}
                  {displayFee(formatVnd(row.online), role)}
                </dd>
              </div>
            </dl>
            <div className="ops-rev-bar" aria-hidden>
              <span style={{ width: `${Math.round((row.collected / totalC) * 100)}%` }} />
            </div>
          </DetailShell>
        ) : (
          <p className="ops-table-empty">Chọn chi nhánh.</p>
        )
      }
    />
  );
}

export function AccessBoard({ role }: { role: DemoRole }) {
  const [tab, setTab] = useState<"perms" | "staff">("perms");
  const tabs = <AccessTabs tab={tab} onTab={setTab} />;
  const using = aclRoleLabel(role);

  if (tab === "staff") {
    return (
      <FeatureBoard<AclStaff>
        key="acl-staff"
        headingId="ops-acl-heading"
        title="Phân quyền"
        lede="4 vai A1 (Chủ / QL / lễ tân / GV). GV không xem học phí & SĐT. Đổi vai đang dùng trên thanh trên."
        toolbar={tabs}
        searchPlaceholder="Tìm tài khoản, vai, chi nhánh…"
        kpis={[
          { k: "Vai đang dùng", v: using, hint: "Chrome" },
          { k: "Tài khoản", v: String(ACL_STAFF.length), hint: "3 CN" },
          { k: "Đang làm", v: String(ACL_STAFF.filter((s) => s.status === "active").length), hint: "Active" },
          { k: "Nghỉ", v: String(ACL_STAFF.filter((s) => s.status === "leave").length), hint: "Tạm" },
        ]}
        columns={[
          { key: "n", label: "Nhân sự", render: (row) => <span className="ops-table__name">{row.name}</span> },
          { key: "r", label: "Vai trò", render: (row) => aclRoleLabel(row.role) },
          { key: "b", label: "Chi nhánh", render: (row) => staffBranchLabel(row.branchId) },
          {
            key: "st",
            label: "TT",
            render: (row) => <StatusChip tone={row.status === "active" ? "paid" : "wait"}>{row.status === "active" ? "Đang làm" : "Nghỉ"}</StatusChip>,
          },
          { key: "fee", label: "Học phí", render: (row) => <GrantMark grant={grantOf("fee.view", row.role)} /> },
          { key: "ph", label: "SĐT HV", render: (row) => <GrantMark grant={grantOf("student.phone", row.role)} /> },
          { key: "h", label: "Duyệt BL", render: (row) => <GrantMark grant={grantOf("hold.approve", row.role)} /> },
        ]}
        rows={ACL_STAFF}
        detail={(row) =>
          row ? (
            <DetailShell heading="Tài khoản" name={row.name} code={aclRoleLabel(row.role)}>
              <dl className="ops-detail__meta">
                <div>
                  <dt>Email</dt>
                  <dd>{row.email}</dd>
                </div>
                <div>
                  <dt>Chi nhánh</dt>
                  <dd>{staffBranchLabel(row.branchId)}</dd>
                </div>
                <div>
                  <dt>Trạng thái</dt>
                  <dd>{row.status === "active" ? "Đang làm" : "Nghỉ phép"}</dd>
                </div>
              </dl>
              <p className="ops-board__note">Quyền của vai {aclRoleLabel(row.role)} (không phải JWT):</p>
              <ul className="ops-quote-list">
                {permissionsForRole(row.role).map((perm) => (
                  <li key={perm.id}>
                    {perm.group} · {perm.label} — {aclGrantLabel(perm.grants[row.role])}
                  </li>
                ))}
              </ul>
            </DetailShell>
          ) : (
            <p className="ops-table-empty">Chọn tài khoản.</p>
          )
        }
      />
    );
  }

  return (
    <FeatureBoard<AclPermission>
      key="acl-perms"
      headingId="ops-acl-heading"
      title="Phân quyền"
      lede="4 vai A1. Catalog quyền theo module — GV không xem học phí & SĐT. Đổi vai đang dùng trên thanh trên."
      toolbar={tabs}
      searchPlaceholder="Tìm quyền, nhóm…"
      kpis={[
        { k: "Vai đang dùng", v: using, hint: "Chrome" },
        { k: "Quyền", v: String(ACL_PERMISSIONS.length), hint: "7 nhóm" },
        { k: "Tài khoản", v: String(ACL_STAFF.length), hint: "Gắn 4 vai" },
        { k: "ACL", v: "Demo", hint: "Chưa JWT" },
      ]}
      columns={[
        { key: "g", label: "Nhóm", render: (row) => row.group },
        { key: "l", label: "Quyền", render: (row) => <span className="ops-table__name">{row.label}</span> },
        { key: "o", label: "Chủ", render: (row) => <GrantMark grant={row.grants.owner} /> },
        { key: "m", label: "QL", render: (row) => <GrantMark grant={row.grants.manager} /> },
        { key: "f", label: "Lễ tân", render: (row) => <GrantMark grant={row.grants.front} /> },
        { key: "t", label: "GV", render: (row) => <GrantMark grant={row.grants.teacher} /> },
      ]}
      rows={ACL_PERMISSIONS}
      detail={(row) =>
        row ? (
          <DetailShell heading={row.group} name={row.label} code={row.id}>
            <p className="ops-board__note">{row.hint}</p>
            <dl className="ops-detail__meta">
              <div>
                <dt>Chủ</dt>
                <dd>{aclGrantLabel(row.grants.owner)}</dd>
              </div>
              <div>
                <dt>Quản lý</dt>
                <dd>{aclGrantLabel(row.grants.manager)}</dd>
              </div>
              <div>
                <dt>Lễ tân</dt>
                <dd>{aclGrantLabel(row.grants.front)}</dd>
              </div>
              <div>
                <dt>Giáo viên</dt>
                <dd>{aclGrantLabel(row.grants.teacher)}</dd>
              </div>
            </dl>
            <p className="ops-board__note">Nhân sự đang làm có quyền này:</p>
            <ul className="ops-quote-list">
              {staffForPermission(row).map((who) => (
                <li key={who.id}>
                  {who.name} · {aclRoleLabel(who.role)} · {staffBranchLabel(who.branchId)}
                </li>
              ))}
            </ul>
          </DetailShell>
        ) : (
          <p className="ops-table-empty">Chọn quyền.</p>
        )
      }
    />
  );
}

export function RentalsBoard({
  rentals,
  rooms,
  notice,
  onConfirm,
}: {
  rentals: StudioRental[];
  rooms: DemoRoom[];
  notice: string | null;
  onConfirm: (id: string) => void;
}) {
  return (
    <FeatureBoard
      headingId="ops-rent-heading"
      title="Đặt phòng thuê"
      lede="Thuê studio ngoài gán phòng lớp CRM (B2). Không phải booking spa 1:1."
      notice={notice}
      searchPlaceholder="Tìm đặt phòng…"
      kpis={[
        { k: "Lịch thuê", v: String(rentals.length), hint: "Ngoài lớp" },
        { k: "Chờ cọc", v: String(rentals.filter((r) => r.status === "pending").length), hint: "Pending" },
        { k: "Đã chốt", v: String(rentals.filter((r) => r.status === "confirmed").length), hint: "Confirmed" },
        { k: "Khác lớp", v: "Có", hint: "Không trừ buổi HV" },
      ]}
      columns={[
        { key: "c", label: "Khách thuê", render: (row) => <span className="ops-table__name">{row.customer}</span> },
        { key: "r", label: "Phòng", render: (row) => roomLabel(rooms, row.roomId) },
        { key: "b", label: "CN", render: (row) => branchName(rooms.find((r) => r.id === row.roomId)?.branchId ?? "") },
        { key: "d", label: "Ngày", render: (row) => `${formatViDate(row.date)} · ${row.startTime}` },
        {
          key: "s",
          label: "TT",
          render: (row) => <StatusChip tone={row.status === "confirmed" ? "paid" : "wait"}>{row.status === "confirmed" ? "Đã chốt" : "Chờ"}</StatusChip>,
        },
      ]}
      rows={rentals}
      detail={(row) =>
        row ? (
          <DetailShell heading="Phiếu thuê" name={row.customer} code={row.id}>
            <dl className="ops-detail__meta">
              <div>
                <dt>Phòng</dt>
                <dd>{roomLabel(rooms, row.roomId)}</dd>
              </div>
              <div>
                <dt>Khung</dt>
                <dd>
                  {formatViDate(row.date)} · {row.startTime}–{row.endTime}
                </dd>
              </div>
              <div>
                <dt>Ghi chú</dt>
                <dd>{row.note}</dd>
              </div>
            </dl>
            {row.status === "pending" ? (
              <div className="ops-detail__actions">
                <button type="button" className="ops-page__cta" onClick={() => onConfirm(row.id)}>
                  Xác nhận cọc
                </button>
              </div>
            ) : null}
          </DetailShell>
        ) : (
          <p className="ops-table-empty">Chọn phiếu thuê.</p>
        )
      }
    />
  );
}

export function MidEnrollBoard({
  courses,
  students,
  notice,
  onEnroll,
}: {
  courses: DemoCourse[];
  students: DemoStudent[];
  notice: string | null;
  onEnroll: (courseId: string, studentId: string) => void;
}) {
  const open = courses.filter((c) => c.studentIds.length > 0);
  const wait = students.find((s) => s.id === "st-new1");
  return (
    <FeatureBoard
      headingId="ops-mid-heading"
      title="Ghi danh giữa khóa"
      lede="Cửa sổ theo level (Begin dừng từ buổi 4–5 · Inter buổi lẻ · Advance buổi 1 & 5). Sĩ số 10–15 · đầy → khung giờ khác (A3)."
      notice={notice}
      searchPlaceholder="Tìm khóa…"
      kpis={[
        { k: "Rule Begin", v: "Đến buổi 4–5", hint: "Rồi dừng nhận" },
        { k: "Sĩ số", v: "10–15", hint: "Theo level" },
        { k: "Chờ ghi danh", v: wait ? wait.name : "—", hint: "Chưa vào khóa" },
        { k: "Đổi lớp", v: "Cuối tháng", hint: "Hoặc bảo lưu" },
      ]}
      columns={[
        { key: "n", label: "Khóa", render: (row) => <span className="ops-table__name">{row.name}</span> },
        { key: "lv", label: "Level", render: (row) => row.level },
        {
          key: "win",
          label: "Cửa sổ",
          render: (row) =>
            MID_ENROLL_RULES.find((r) => row.level.toLowerCase().includes(r.level.toLowerCase().slice(0, 5)))?.window ?? "Buổi 1 & 5",
        },
        { key: "cap", label: "Sĩ số", render: (row) => `${row.studentIds.length}/${row.capacity}` },
        {
          key: "full",
          label: "Chỗ",
          render: (row) => (
            <StatusChip tone={row.studentIds.length >= row.capacity ? "delay" : "paid"}>
              {row.studentIds.length >= row.capacity ? "Đầy" : "Còn chỗ"}
            </StatusChip>
          ),
        },
      ]}
      rows={open}
      detail={(row) => {
        if (!row) return <p className="ops-table-empty">Chọn khóa.</p>;
        const rule = MID_ENROLL_RULES.find((r) => row.level.toLowerCase().includes(r.level.toLowerCase().slice(0, 5))) ?? MID_ENROLL_RULES[2];
        const alts = courses.filter((c) => c.id !== row.id && c.studentIds.length < c.capacity).slice(0, 3);
        return (
          <DetailShell heading="Cửa sổ ghi danh" name={row.name} code={row.level}>
            <p className="ops-board__note">{rule.note}</p>
            <dl className="ops-detail__meta">
              <div>
                <dt>Sĩ số</dt>
                <dd>
                  {row.studentIds.length} / {row.capacity}
                </dd>
              </div>
              <div>
                <dt>Cửa sổ khóa</dt>
                <dd>
                  {formatViDate(row.enrollStart)} → {formatViDate(row.enrollEnd)}
                </dd>
              </div>
            </dl>
            {row.studentIds.length >= row.capacity ? (
              <p className="ops-board__note">Lớp đầy — gợi ý khung giờ khác:</p>
            ) : (
              <p className="ops-board__note">Còn chỗ. Demo: thêm {wait?.name ?? "HV mới"}.</p>
            )}
            {row.studentIds.length >= row.capacity ? (
              <ul className="ops-quote-list">
                {alts.map((c) => (
                  <li key={c.id}>
                    {c.name} · {c.schedule.startTime} · {c.studentIds.length}/{c.capacity}
                  </li>
                ))}
              </ul>
            ) : wait ? (
              <div className="ops-detail__actions">
                <button type="button" className="ops-page__cta" onClick={() => onEnroll(row.id, wait.id)}>
                  Ghi danh {wait.name}
                </button>
              </div>
            ) : null}
          </DetailShell>
        );
      }}
    />
  );
}

export type { People };
