"use client";

import { useEffect, useMemo, useState } from "react";
import { paginate } from "../../lib/page";
import { missingLabel, roomLabel, staffLabel, type RoomResource } from "../../lib/matching";
import { localIsoDate } from "../../lib/seed";
import type { DemoBooking } from "../../lib/types";
import { MoreMenu, copyId } from "./MoreMenu";
import { PageInfo } from "./PageInfo";
import { PagePager, PageToolbar } from "./PageToolbar";
import { StatusChip, bookingChip } from "./StatusChip";
import "./chrome.css";
import "./TodayList.css";

type TodayListProps = {
  title: string;
  bookings: DemoBooking[];
  rooms: RoomResource[];
  onConfirm: (id: string) => void;
  onViewCustomer: (name: string) => void;
  onNew: () => void;
  onPromo: () => void;
};

const FILTERS = [
  { id: "all", label: "Tất cả" },
  { id: "incomplete", label: "Thiếu yếu tố" },
  { id: "pending", label: "Chờ xác nhận" },
  { id: "confirmed", label: "Đã xác nhận" },
];

export function TodayList({ title, bookings, rooms, onConfirm, onViewCustomer, onNew, onPromo }: TodayListProps) {
  const dateIso = localIsoDate();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return bookings.filter((b) => {
      if (filter === "pending" && b.status !== "pending") return false;
      if (filter === "confirmed" && b.status !== "confirmed") return false;
      if (filter === "incomplete" && b.status !== "incomplete") return false;
      if (!q) return true;
      return `${b.customer} ${b.service} ${b.time} ${b.id}`.toLowerCase().includes(q);
    });
  }, [bookings, search, filter]);

  useEffect(() => setPage(1), [search, filter]);
  const paged = paginate(filtered, page);

  return (
    <section className="ops-today" id="today" aria-labelledby="ops-today-heading">
      <div className="ops-page__head">
        <h1 id="ops-today-heading" className="ops-page__title" tabIndex={-1}>
          {title}
        </h1>
        <button className="ops-page__cta" type="button" onClick={onNew}>
          Lớp mới
        </button>
      </div>
      <p className="ops-page__lede">Hôm nay · seed demo, chưa nối server.</p>
      <div className="ops-dash">
        <div className="ops-dash__main">
      <PageToolbar
        search={search}
        onSearch={setSearch}
        placeholder="Tìm học viên, khóa hoặc mã"
        filterValue={filter}
        filterOptions={FILTERS}
        onFilter={setFilter}
        onRefresh={() => {
          setSearch("");
          setFilter("all");
        }}
      />
      <ul className="ops-res-list ops-stagger">
        {paged.slice.map((booking) => {
          const pending = booking.status === "pending";
          const chip = bookingChip(booking.status);
          return (
            <li key={booking.id}>
              <article className="ops-res">
                <div className="ops-res__head">
                  <span className="ops-res__icon" aria-hidden>
                    <CalIcon />
                  </span>
                  <div className="ops-res__copy">
                    <h2>
                      <button type="button" className="ops-res__title" onClick={() => onViewCustomer(booking.customer)}>
                        {booking.customer}
                      </button>
                    </h2>
                    <p className="ops-res__sub">
                      {booking.id} · {booking.service}
                      {booking.staff ? ` · ${staffLabel(booking.staff)}` : ""}
                      {booking.room ? ` · ${roomLabel(booking.room, rooms)}` : ""}
                      {booking.capacity ? ` · ${booking.enrolled ?? 0}/${booking.capacity}` : ""}
                      {booking.missing?.length ? ` · ${missingLabel(booking.missing)}` : ""}
                    </p>
                  </div>
                  <time className="ops-res__meta" dateTime={`${dateIso}T${booking.time}:00`}>
                    {booking.time}
                  </time>
                  <MoreMenu
                    items={[
                      { label: "Xem học viên", onClick: () => onViewCustomer(booking.customer) },
                      { label: "Sao chép mã", onClick: () => copyId(booking.id) },
                    ]}
                  />
                </div>
                <div className="ops-res__foot">
                  <button type="button" className="ops-res__link" onClick={() => onViewCustomer(booking.customer)}>
                    Xem chi tiết
                  </button>
                  <div className="ops-res__stats">
                    {pending || booking.status === "incomplete" ? (
                      <button type="button" className="ops-res__ghost" onClick={() => onConfirm(booking.id)}>
                        {booking.status === "incomplete" ? "Đánh dấu đủ" : "Xác nhận"}
                      </button>
                    ) : null}
                    <StatusChip tone={chip.tone}>{chip.label}</StatusChip>
                  </div>
                </div>
              </article>
            </li>
          );
        })}
      </ul>
      <PagePager
        from={paged.from}
        to={paged.to}
        total={paged.total}
        page={paged.page}
        pages={paged.pages}
        onPage={setPage}
      />
        </div>
        <aside className="ops-dash__aside">
          <ul className="ops-stat-grid">
            <li>
              <div className="ops-wid ops-wid--stat">
                <span className="ops-wid__k">Thiếu yếu tố</span>
                <span className="ops-wid__v">{bookings.filter((b) => b.status === "incomplete").length}</span>
              </div>
            </li>
            <li>
              <div className="ops-wid ops-wid--stat">
                <span className="ops-wid__k">Chờ xác nhận</span>
                <span className="ops-wid__v">{bookings.filter((b) => b.status === "pending").length}</span>
              </div>
            </li>
            <li>
              <div className="ops-wid ops-wid--stat">
                <span className="ops-wid__k">Đã xác nhận</span>
                <span className="ops-wid__v">{bookings.filter((b) => b.status === "confirmed").length}</span>
              </div>
            </li>
          </ul>
          <PageInfo onPromo={onPromo} />
        </aside>
      </div>
    </section>
  );
}

function CalIcon() {
  return (
    <svg viewBox="0 0 24 24" width="1rem" height="1rem" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="4" y="6" width="16" height="14" rx="2" />
      <path d="M8 4v4M16 4v4M4 10h16" strokeLinecap="round" />
    </svg>
  );
}
