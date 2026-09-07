"use client";

import { useMemo, useState, type ReactNode } from "react";
import type { DemoStudent, FeeReceipt, SessionPack } from "../../lib/types";
import { studentName } from "../../lib/edu";
import { StatusChip } from "./StatusChip";
import "./chrome.css";
import "./QuoteBoards.css";
import "./QuoteScopeBanner.css";

function PreviewShell({
  headingId,
  title,
  children,
}: {
  headingId: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="ops-soon" aria-labelledby={headingId}>
      <nav className="ops-crumb" aria-label="Breadcrumb">
        <ol>
          <li>Trang chủ</li>
          <li aria-current="page">{title}</li>
        </ol>
      </nav>
      <div className="ops-page__head">
        <h1 id={headingId} className="ops-page__title" tabIndex={-1}>
          {title}
        </h1>
      </div>
      {children}
    </section>
  );
}

export function WebsitePreview() {
  return (
    <PreviewShell headingId="ops-web-heading" title="Website công khai">
      <div className="ops-preview-site">
        <p className="ops-preview-site__nav">MA Dance · Lớp · Lịch · Liên hệ Zalo</p>
        <h2>Studio nhảy 3 chi nhánh</h2>
        <p>Quận 10 · Quận 3 · Phú Nhuận — Hip-hop, Heels, Ballet, Kids.</p>
        <ul className="ops-quote-list">
          <li>Hero + lịch khai giảng (admin ảnh/nội dung)</li>
          <li>Form / Zalo — không login học viên</li>
          <li>SEO nền — preview, chưa site production</li>
        </ul>
      </div>
    </PreviewShell>
  );
}

export function PortalPreview() {
  return (
    <PreviewShell headingId="ops-portal-heading" title="Portal học viên & giáo viên">
      <ul className="ops-quote-list">
        <li>Hương Trần — Hip-hop Open · Heels · còn 71/96 buổi</li>
        <li>Mai Trần (GV) — T2 Heels 17:00 MI2 · T2 Hip-hop 19:00 MI1</li>
        <li>Khuyến mãi: MA-TRY học thử · MA-SIB 10% gói dài</li>
        <li>Video / tài liệu trung tâm — chỉ xem, không thu tiền</li>
      </ul>
    </PreviewShell>
  );
}

export function StorePreview() {
  return (
    <PreviewShell headingId="ops-store-heading" title="Website bán hàng">
      <ul className="ops-quote-list">
        <li>Áo MA Dance — 350.000đ · giỏ demo</li>
        <li>Khăn / bình nước — catalog cơ bản</li>
        <li>Thanh toán store ≠ học phí A7 trên CRM</li>
      </ul>
    </PreviewShell>
  );
}

const CARE_THREADS = [
  { id: "c1", ch: "Zalo OA", who: "PH Chị Hoa", text: "Kids 5–8 còn chỗ CN sáng không?", status: "lead" },
  { id: "c2", ch: "Fanpage", who: "Lan", text: "Học thử Heels tuần này được không?", status: "trial" },
  { id: "c3", ch: "Website", who: "Khách mới", text: "Học phí gói 3 tháng Hip-hop?", status: "faq" },
];

export function CareAiPreview() {
  return (
    <PreviewShell headingId="ops-careai-heading" title="AI tuyển sinh 24/7">
      <ul className="ops-quote-list">
        {CARE_THREADS.map((row) => (
          <li key={row.id}>
            <strong>{row.ch}</strong> · {row.who} — {row.text}{" "}
            <StatusChip tone={row.status === "trial" ? "paid" : "track"}>
              {row.status === "lead" ? "Lấy SĐT" : row.status === "trial" ? "Hẹn học thử" : "FAQ"}
            </StatusChip>
          </li>
        ))}
      </ul>
      <p className="ops-board__note">Demo hội thoại — chưa nối Fanpage / Zalo OA.</p>
    </PreviewShell>
  );
}

export function AiOpsBoard({
  packages,
  receipts,
  students,
  onOpenPayment,
}: {
  packages: SessionPack[];
  receipts: FeeReceipt[];
  students: DemoStudent[];
  onOpenPayment: () => void;
}) {
  const [cmd, setCmd] = useState("Thu tiền Hương 1.200.000 tiền mặt");
  const [log, setLog] = useState<string | null>(null);
  const low = packages.filter((p) => p.status === "active" && p.remaining <= 4);
  const debt = receipts.filter((r) => r.debt);

  function run() {
    setLog(`Đã mở form thu (demo): «${cmd}». Chưa ghi server — chuyển Thu học phí để xem phiếu.`);
    onOpenPayment();
  }

  return (
    <PreviewShell headingId="ops-aiops-heading" title="AI trợ lý vận hành">
      <label className="ops-table-search">
        <span className="ops-sr">Câu lệnh</span>
        <input value={cmd} onChange={(e) => setCmd(e.target.value)} placeholder="Nói / gõ câu lệnh…" />
      </label>
      <div className="ops-detail__actions" style={{ margin: "0.75rem 0" }}>
        <button type="button" className="ops-page__cta" onClick={run}>
          Chạy câu lệnh (demo)
        </button>
      </div>
      {log ? <p className="ops-board__note">{log}</p> : null}
      <h2 className="ops-hub__sub">Cảnh báo hết buổi / nợ</h2>
      <ul className="ops-quote-list">
        {low.map((row) => (
          <li key={row.id}>
            {studentName(students, row.studentId)} · còn {row.remaining}/{row.total} buổi
          </li>
        ))}
        {debt.map((row) => (
          <li key={row.id}>{studentName(students, row.studentId)} · còn nợ — vẫn vào lớp</li>
        ))}
      </ul>
    </PreviewShell>
  );
}

type IntelIssue = {
  id: string;
  title: string;
  detail: string;
  fix: string;
  done: boolean;
};

const INTEL_SEED: IntelIssue[] = [
  {
    id: "i1",
    title: "Buổi Jazz T7 thiếu điểm danh",
    detail: "Khóa Jazz Open đã hoàn thành 10:00–11:30 mà roster chưa mark.",
    fix: "Gán vắng mặc định + ghi chú lễ tân bổ sung sau.",
    done: false,
  },
  {
    id: "i2",
    title: "Sĩ số Hip-hop Open = 15/15",
    detail: "Còn HV chờ ghi danh (Uyên Nhi). Rule A3: gợi khung giờ khác.",
    fix: "Gợi K-pop T7 14:00 (còn chỗ) trên phiếu ghi danh.",
    done: false,
  },
  {
    id: "i3",
    title: "Yến Mai còn nợ vẫn học Contemporary",
    detail: "A7 cho vào lớp, thu sau — chưa có phiếu follow-up tuần này.",
    fix: "Tạo nhắc Zalo PH/HV trên Chăm sóc.",
    done: false,
  },
];

export function IntelligentBoard() {
  const [rows, setRows] = useState(INTEL_SEED);
  const open = useMemo(() => rows.filter((r) => !r.done).length, [rows]);

  return (
    <PreviewShell headingId="ops-intel-heading" title="Dolphin Intelligent">
      <p className="ops-board__note">Cuối ngày 24/08/2026 · {open} vấn đề chưa xử lý.</p>
      <ul className="ops-quote-list">
        {rows.map((row) => (
          <li key={row.id}>
            <strong>{row.title}</strong>
            <div>{row.detail}</div>
            <div>Đề xuất: {row.fix}</div>
            {row.done ? (
              <StatusChip tone="paid">Đã áp dụng</StatusChip>
            ) : (
              <button
                type="button"
                className="ops-page__cta"
                style={{ marginTop: "0.35rem" }}
                onClick={() => setRows((cur) => cur.map((r) => (r.id === row.id ? { ...r, done: true } : r)))}
              >
                Áp dụng giải pháp
              </button>
            )}
          </li>
        ))}
      </ul>
    </PreviewShell>
  );
}
