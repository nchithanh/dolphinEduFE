"use client";

import { useMemo, useState, type ReactNode } from "react";
import { paginate } from "../../lib/page";
import "./chrome.css";
import "./EduTable.css";
import "./ComingSoon.css";

export type FeatureKpi = { k: string; v: string; hint: string };

export type FeatureColumn<T> = {
  key: string;
  label: string;
  render: (row: T) => ReactNode;
};

type FeatureBoardProps<T extends { id: string }> = {
  headingId: string;
  title: string;
  lede: string;
  kpis: FeatureKpi[];
  columns: FeatureColumn<T>[];
  rows: T[];
  searchPlaceholder: string;
  toolbar?: ReactNode;
  notice?: string | null;
  detail: (row: T | null) => ReactNode;
};

export function FeatureBoard<T extends { id: string }>({
  headingId,
  title,
  lede,
  kpis,
  columns,
  rows,
  searchPlaceholder,
  toolbar,
  notice,
  detail,
}: FeatureBoardProps<T>) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(rows[0]?.id ?? null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((row) => JSON.stringify(row).toLowerCase().includes(q));
  }, [rows, search]);

  const paged = paginate(filtered, page);
  const selected = filtered.find((row) => row.id === selectedId) ?? paged.slice[0] ?? null;

  return (
    <section className="ops-soon" aria-labelledby={headingId}>
      <nav className="ops-crumb" aria-label="Breadcrumb">
        <ol>
          <li>Trang chủ</li>
          <li aria-current="page">{title}</li>
        </ol>
      </nav>
      <div className="ops-page__head">
        <div>
          <h1 id={headingId} className="ops-page__title" tabIndex={-1}>
            {title}
          </h1>
          <p className="ops-page__lede">{lede}</p>
        </div>
      </div>
      {toolbar}
      {notice ? <p className="ops-board__note">{notice}</p> : null}
      <ul className="ops-kpi-row">
        {kpis.map((kpi) => (
          <li key={kpi.k}>
            <article className="ops-kpi-card">
              <p className="ops-kpi-card__k">{kpi.k}</p>
              <p className="ops-kpi-card__v">{kpi.v}</p>
              <p className="ops-kpi-card__hint">{kpi.hint}</p>
            </article>
          </li>
        ))}
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
                  placeholder={searchPlaceholder}
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
                      {columns.map((col) => (
                        <th key={col.key} scope="col">
                          {col.label}
                        </th>
                      ))}
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
                          {columns.map((col) => (
                            <td key={col.key}>{col.render(row)}</td>
                          ))}
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
                <button type="button" disabled={paged.page >= paged.pages} onClick={() => setPage((p) => p + 1)}>
                  ›
                </button>
              </div>
            </div>
          </div>
        </div>
        <aside className="ops-detail">{detail(selected)}</aside>
      </div>
    </section>
  );
}

export function DetailShell({
  heading,
  name,
  code,
  children,
}: {
  heading: string;
  name: string;
  code?: string;
  children: ReactNode;
}) {
  return (
    <>
      <div className="ops-detail__head">
        <h2>{heading}</h2>
      </div>
      <div className="ops-detail__hero">
        <span className="ops-thumb ops-thumb--lg" aria-hidden>
          {name.slice(0, 1)}
        </span>
        <div>
          <p className="ops-detail__name">{name}</p>
          {code ? (
            <p className="ops-board__note" style={{ margin: 0 }}>
              {code}
            </p>
          ) : null}
        </div>
      </div>
      {children}
    </>
  );
}
