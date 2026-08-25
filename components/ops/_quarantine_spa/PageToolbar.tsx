"use client";

import "./chrome.css";

export type FilterOption = { id: string; label: string };

type PageToolbarProps = {
  search: string;
  onSearch: (value: string) => void;
  placeholder: string;
  filterValue?: string;
  filterOptions?: FilterOption[];
  onFilter?: (value: string) => void;
  onRefresh: () => void;
};

export function PageToolbar({
  search,
  onSearch,
  placeholder,
  filterValue,
  filterOptions,
  onFilter,
  onRefresh,
}: PageToolbarProps) {
  return (
    <div className="ops-tool">
      <label className="ops-tool__search">
        <span className="ops-tool__sr">Tìm</span>
        <span className="ops-tool__mag" aria-hidden>
          <svg viewBox="0 0 24 24" width="1rem" height="1rem" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="11" cy="11" r="6" />
            <path d="M16 16.5 20 20.5" strokeLinecap="round" />
          </svg>
        </span>
        <input
          type="search"
          value={search}
          placeholder={placeholder}
          onChange={(e) => onSearch(e.target.value)}
        />
      </label>
      {filterOptions && onFilter ? (
        <select
          className="ops-tool__select"
          value={filterValue}
          aria-label="Lọc"
          onChange={(e) => onFilter(e.target.value)}
        >
          {filterOptions.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : null}
      <button type="button" className="ops-tool__icon" aria-label="Làm mới bộ lọc" onClick={onRefresh}>
        <svg viewBox="0 0 24 24" width="1rem" height="1rem" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M20 12a8 8 0 1 1-2.2-5.5" strokeLinecap="round" />
          <path d="M20 5v5h-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}

type PagePagerProps = {
  from: number;
  to: number;
  total: number;
  page: number;
  pages: number;
  onPage: (page: number) => void;
};

export function PagePager({ from, to, total, page, pages, onPage }: PagePagerProps) {
  return (
    <div className="ops-pager">
      <p className="ops-pager__label">
        Hiển thị {from}–{to} / {total}
      </p>
      <div className="ops-pager__btns">
        <button type="button" disabled={page <= 1} onClick={() => onPage(page - 1)} aria-label="Trang trước">
          ‹
        </button>
        <span>{page}</span>
        <button type="button" disabled={page >= pages} onClick={() => onPage(page + 1)} aria-label="Trang sau">
          ›
        </button>
      </div>
    </div>
  );
}
