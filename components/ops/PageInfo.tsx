"use client";

import "./chrome.css";

export type InfoRow = { label: string; value: string };

const EDU_ROWS: InfoRow[] = [
  { label: "Studio", value: "Pulse Studio" },
  { label: "Mô hình", value: "Khóa → ghi danh → lớp" },
  { label: "Dữ liệu", value: "Seed demo, chưa nối server" },
];

type PageInfoProps = {
  rows?: InfoRow[];
  promoTitle?: string;
  promoBody?: string;
  promoCta?: string;
  onPromo: () => void;
};

export function PageInfo({
  rows = EDU_ROWS,
  promoTitle = "Khóa học",
  promoBody = "Tạo khóa, thêm học viên, sinh lớp từ lịch mẫu. Chat không mở mục Sắp có.",
  promoCta = "Mở Khóa học",
  onPromo,
}: PageInfoProps) {
  return (
    <div className="ops-info">
      <section className="ops-info__card" aria-labelledby="ops-info-studio">
        <h2 id="ops-info-studio" className="ops-info__title">
          Studio
        </h2>
        <dl className="ops-info__dl">
          {rows.map((row) => (
            <div key={row.label}>
              <dt>{row.label}</dt>
              <dd>{row.value}</dd>
            </div>
          ))}
        </dl>
      </section>
      <section className="ops-info__card ops-info__card--promo" aria-labelledby="ops-info-promo">
        <h2 id="ops-info-promo" className="ops-info__title">
          {promoTitle}
        </h2>
        <p className="ops-info__body">{promoBody}</p>
        <button type="button" className="ops-page__cta" onClick={onPromo}>
          {promoCta}
        </button>
      </section>
    </div>
  );
}
