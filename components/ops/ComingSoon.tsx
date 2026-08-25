"use client";

import { useMemo, useState } from "react";
import { paginate } from "../../lib/page";
import type { NavItem } from "../../lib/nav";
import "./chrome.css";
import "./EduTable.css";
import "./ComingSoon.css";

type ComingSoonProps = {
  item: NavItem;
  onHome: () => void;
  onPromo: () => void;
};

const STUB_COUNT = 12;

type StubRow = {
  id: string;
  title: string;
  code: string;
  note: string;
};

function stubMeta(id: string): { entity: string; note: string } {
  switch (id) {
    case "schedule":
      return { entity: "Tuần", note: "Lịch tuần studio — chưa mở" };
    case "activity":
      return { entity: "Nhật ký", note: "Nhật ký vận hành — chưa mở" };
    case "campaigns":
      return { entity: "Chiến dịch", note: "Tin hàng loạt — cần duyệt" };
    case "leads":
      return { entity: "Nguồn", note: "Nguồn đăng ký khóa — chưa mở" };
    case "consult":
      return { entity: "Tư vấn", note: "Tư vấn ghi danh — chưa mở" };
    case "invoices":
      return { entity: "Hóa đơn", note: "Hóa đơn học phí — chưa mở (không số liệu giả)" };
    case "payment":
      return { entity: "Thanh toán", note: "Thu học phí — cần duyệt, chưa mở" };
    case "reports":
      return { entity: "Báo cáo", note: "Doanh thu demo — TODO số liệu thật" };
    case "settings":
      return { entity: "Cài đặt", note: "Studio, chi nhánh — chưa mở" };
    case "access":
      return { entity: "Vai trò", note: "Phân quyền — chưa mở" };
    case "audit":
      return { entity: "Log", note: "Nhật ký hệ thống — chưa mở" };
    default:
      return { entity: "Bản ghi", note: "Seed demo — chưa mở chức năng" };
  }
}

function stubTitle(id: string, i: number): string {
  const n = i + 1;
  const { entity } = stubMeta(id);
  if (id === "schedule") return `Tuần ${n} — lịch demo`;
  if (id === "activity") return `Sự kiện vận hành #${n}`;
  if (id === "campaigns") return `Chiến dịch khóa mới #${n}`;
  if (id === "leads") return `Nguồn Zalo / form #${n}`;
  if (id === "consult") return `Phiếu tư vấn #${n}`;
  if (id === "invoices") return `Hóa đơn demo #${n}`;
  if (id === "payment") return `Phiếu thu demo #${n}`;
  if (id === "reports") return `Báo cáo tuần ${n}`;
  if (id === "settings") return `Chi nhánh demo #${n}`;
  if (id === "access") return `Vai trò demo #${n}`;
  if (id === "audit") return `Log duyệt #${n}`;
  return `${entity} demo #${n}`;
}

export function ComingSoon({ item, onHome, onPromo }: ComingSoonProps) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(`${item.id}-1`);
  const meta = stubMeta(item.id);

  const rows = useMemo<StubRow[]>(
    () =>
      Array.from({ length: STUB_COUNT }, (_, i) => ({
        id: `${item.id}-${i + 1}`,
        title: stubTitle(item.id, i),
        code: `${item.id}-${String(i + 1).padStart(2, "0")}`,
        note: meta.note,
      })),
    [item.id, meta.note],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((row) => `${row.title} ${row.code} ${row.note}`.toLowerCase().includes(q));
  }, [rows, search]);

  const paged = paginate(filtered, page);
  const selected = filtered.find((row) => row.id === selectedId) ?? paged.slice[0] ?? null;

  return (
    <section className="ops-soon" aria-labelledby="ops-soon-heading">
      <nav className="ops-crumb" aria-label="Breadcrumb">
        <ol>
          <li>Trang chủ</li>
          <li aria-current="page">{item.label}</li>
        </ol>
      </nav>

      <div className="ops-page__head">
        <div>
          <h1 id="ops-soon-heading" className="ops-page__title" tabIndex={-1}>
            {item.label}{" "}
            <span className="ops-soon__badge">Sắp có</span>
          </h1>
          <p className="ops-page__lede">
            {item.hint} · seed demo, chưa chạy chức năng. Chat không điều hướng vào mục này.
          </p>
        </div>
        <div className="ops-soon__ctas">
          <button type="button" className="ops-page__ghost" onClick={onHome}>
            Về tổng quan
          </button>
          <button type="button" className="ops-page__cta" onClick={onPromo}>
            Mở khóa học
          </button>
        </div>
      </div>

      <ul className="ops-kpi-row">
        <li>
          <article className="ops-kpi-card">
            <p className="ops-kpi-card__k">Tổng</p>
            <p className="ops-kpi-card__v">—</p>
            <p className="ops-kpi-card__hint">Chưa mở</p>
          </article>
        </li>
        <li>
          <article className="ops-kpi-card">
            <p className="ops-kpi-card__k">Đang xử lý</p>
            <p className="ops-kpi-card__v">—</p>
            <p className="ops-kpi-card__hint">Chưa mở</p>
          </article>
        </li>
        <li>
          <article className="ops-kpi-card">
            <p className="ops-kpi-card__k">Hoàn tất</p>
            <p className="ops-kpi-card__v">—</p>
            <p className="ops-kpi-card__hint">Chưa mở</p>
          </article>
        </li>
        <li>
          <article className="ops-kpi-card">
            <p className="ops-kpi-card__k">Seed UI</p>
            <p className="ops-kpi-card__v">{STUB_COUNT}</p>
            <p className="ops-kpi-card__hint">Chỉ minh họa bảng</p>
          </article>
        </li>
      </ul>

      <div className="ops-board__layout">
        <div className="ops-board__main">
          <div className="ops-table-card">
            <div className="ops-table-tools">
              <label className="ops-table-search">
                <span className="ops-sr">Tìm</span>
                <input
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder={`Tìm trong ${item.label}`}
                />
              </label>
            </div>

            {paged.slice.length === 0 ? (
              <p className="ops-table-empty">Không có bản ghi khớp.</p>
            ) : (
              <div className="ops-table-wrap">
                <table className="ops-table">
                  <thead>
                    <tr>
                      <th scope="col">{meta.entity}</th>
                      <th scope="col">Mã</th>
                      <th scope="col">Ghi chú</th>
                      <th scope="col">Trạng thái</th>
                      <th scope="col">
                        <span className="ops-sr">Thao tác</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paged.slice.map((row) => {
                      const on = selected?.id === row.id;
                      return (
                        <tr
                          key={row.id}
                          className={on ? "ops-table__row ops-table__row--on" : "ops-table__row"}
                          onClick={() => setSelectedId(row.id)}
                        >
                          <td>
                            <span className="ops-table__name">{row.title}</span>
                          </td>
                          <td>
                            <span className="ops-table__id">{row.code}</span>
                          </td>
                          <td>{row.note}</td>
                          <td>
                            <span className="ops-soon__chip">Sắp có</span>
                          </td>
                          <td>
                            <div className="ops-table__acts">
                              <button
                                type="button"
                                className="ops-table__detail"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedId(row.id);
                                }}
                              >
                                Chi tiết
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            <div className="ops-table-foot">
              <span>
                {paged.from}–{paged.to} / {paged.total}
              </span>
              <div className="ops-pager">
                <button type="button" disabled={paged.page <= 1} onClick={() => setPage((p) => p - 1)}>
                  ‹
                </button>
                <button type="button" className="ops-pager__on" disabled>
                  {paged.page}
                </button>
                <button
                  type="button"
                  disabled={paged.page >= paged.pages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  ›
                </button>
              </div>
            </div>
          </div>
        </div>

        <aside className="ops-detail" aria-labelledby="edu-stub-detail">
          {selected ? (
            <>
              <div className="ops-detail__head">
                <h2 id="edu-stub-detail">Chi tiết · Sắp có</h2>
              </div>
              <div className="ops-detail__hero">
                <span className="ops-thumb ops-thumb--lg" aria-hidden>
                  {selected.title.slice(0, 1)}
                </span>
                <div>
                  <p className="ops-detail__name">{selected.title}</p>
                  <p className="ops-board__note" style={{ margin: 0 }}>
                    {selected.code}
                  </p>
                </div>
              </div>
              <dl className="ops-detail__meta">
                <div>
                  <dt>Mã</dt>
                  <dd>{selected.code}</dd>
                </div>
                <div>
                  <dt>Module</dt>
                  <dd>{item.label}</dd>
                </div>
                <div>
                  <dt>Ghi chú</dt>
                  <dd>{selected.note}</dd>
                </div>
                <div>
                  <dt>Số liệu</dt>
                  <dd>—</dd>
                </div>
              </dl>
              <p className="ops-soon__panel-note">
                Đây chỉ là khung UI. Không có thao tác thật và không invent số liệu tài chính.
              </p>
              <div className="ops-detail__actions">
                <button type="button" className="ops-page__cta" onClick={onPromo}>
                  Mở khóa học
                </button>
                <button type="button" className="ops-page__ghost" onClick={onHome}>
                  Về tổng quan
                </button>
              </div>
            </>
          ) : (
            <p className="ops-table-empty">Chọn một dòng để xem chi tiết.</p>
          )}
        </aside>
      </div>
    </section>
  );
}
