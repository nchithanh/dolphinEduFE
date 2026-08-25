"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CLASS_STATUS_LABEL,
  COURSE_STATUS_LABEL,
  classStatus,
  courseStatus,
  formatViDate,
  localIsoDate,
  weekdayLabelList,
} from "../../lib/edu";
import { DEMO_ROOMS } from "../../lib/seed";
import { TEACHERS_KPI, demoTeacherCode, demoTeacherStats } from "../../lib/teachers-demo";
import type { DemoClass, DemoCourse, DemoRoom, DemoTeacher } from "../../lib/types";
import { MoreMenu, copyId } from "./MoreMenu";
import { StatusChip, classChip, courseChip } from "./StatusChip";
import "./chrome.css";
import "./EduTable.css";
import "./StaffBoard.css";

type StaffBoardProps = {
  title: string;
  teachers: DemoTeacher[];
  courses: DemoCourse[];
  classes: DemoClass[];
  rooms?: DemoRoom[];
  onPromo: () => void;
};

type DetailTab = "overview" | "schedule" | "history" | "perf";

const PAGE_SIZE = 12;

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  return parts
    .slice(-2)
    .map((part) => part[0] ?? "")
    .join("")
    .toUpperCase();
}

function roomLabel(rooms: DemoRoom[], id: string): string {
  return rooms.find((r) => r.id === id)?.label ?? id;
}

export function StaffBoard({
  title,
  teachers,
  courses,
  classes,
  rooms = DEMO_ROOMS,
  onPromo,
}: StaffBoardProps) {
  const today = localIsoDate();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [panelDismissed, setPanelDismissed] = useState(false);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "leave">("all");
  const [page, setPage] = useState(0);
  const [detailTab, setDetailTab] = useState<DetailTab>("overview");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return teachers.filter((t) => {
      const stats = demoTeacherStats(t.id);
      if (statusFilter === "active" && !stats.active) return false;
      if (statusFilter === "leave" && stats.active) return false;
      if (!q) return true;
      return `${t.name} ${t.id} ${t.specialty}`.toLowerCase().includes(q);
    });
  }, [teachers, query, statusFilter]);

  useEffect(() => {
    if (panelDismissed) return;
    if (selectedId && filtered.some((t) => t.id === selectedId)) return;
    setSelectedId(filtered[0]?.id ?? null);
  }, [filtered, selectedId, panelDismissed]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageSafe = Math.min(page, pageCount - 1);
  const paged = filtered.slice(pageSafe * PAGE_SIZE, pageSafe * PAGE_SIZE + PAGE_SIZE);

  const selected = teachers.find((t) => t.id === selectedId) ?? null;
  const selectedStats = selected ? demoTeacherStats(selected.id) : null;
  const assigned = selected ? courses.filter((c) => c.teacherIds.includes(selected.id)) : [];

  const studioToday = useMemo(
    () =>
      [...classes]
        .filter((row) => row.date === today && !row.cancelled)
        .sort((a, b) => a.startTime.localeCompare(b.startTime)),
    [classes, today],
  );

  const selectedToday = useMemo(() => {
    if (!selected) return [];
    return classes
      .filter((row) => row.teacherId === selected.id && row.date === today && !row.cancelled)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [classes, selected, today]);

  function pickTeacher(id: string) {
    setPanelDismissed(false);
    setSelectedId(id);
    setDetailTab("overview");
  }

  function closePanel() {
    setPanelDismissed(true);
    setSelectedId(null);
  }

  function resetPage() {
    setPage(0);
    setPanelDismissed(false);
  }

  return (
    <section className="ops-staff" aria-labelledby="ops-staff-heading">
      <div className="ops-board__layout ops-staff__layout">
        <div className="ops-board__main ops-staff__main">
          <nav className="ops-crumb" aria-label="Breadcrumb">
            <ol>
              <li>Trang chủ</li>
              <li aria-current="page">{title}</li>
            </ol>
          </nav>
          <div className="ops-page__head">
            <div>
              <h1 id="ops-staff-heading" className="ops-page__title" tabIndex={-1}>
                {title}
              </h1>
              <p className="ops-page__lede">Quản lý hồ sơ, lịch dạy và hiệu suất giảng dạy</p>
            </div>
            <button className="ops-page__cta" type="button" onClick={onPromo}>
              + Thêm giáo viên
            </button>
          </div>

          <ul className="ops-kpi-row ops-kpi-row--6">
            {TEACHERS_KPI.map((kpi) => (
              <li key={kpi.id}>
                <article className="ops-kpi-card">
                  <span className="ops-kpi-card__top">
                    <span className="ops-kpi-card__ico" aria-hidden>
                      {kpi.ico}
                    </span>
                    <span className="ops-kpi-card__k">{kpi.label}</span>
                  </span>
                  <p className="ops-kpi-card__v">
                    {kpi.value}
                    {"sub" in kpi && kpi.sub ? <span className="ops-kpi-card__sub">{kpi.sub}</span> : null}
                  </p>
                  <p className={kpi.up ? "ops-kpi-card__trend ops-kpi-card__trend--up" : "ops-kpi-card__trend ops-kpi-card__trend--down"}>
                    {kpi.trend} <span>so với tháng trước</span>
                  </p>
                </article>
              </li>
            ))}
          </ul>

          {studioToday.length ? (
            <div className="ops-staff__today">
              <h2 className="ops-staff__today-title">
                Lịch dạy hôm nay — <time dateTime={today}>{formatViDate(today)}</time>
              </h2>
              <ul className="ops-timeline" aria-label="Lịch dạy hôm nay">
                {studioToday.slice(0, 8).map((row) => {
                  const teacher = teachers.find((t) => t.id === row.teacherId);
                  const course = courses.find((c) => c.id === row.courseId);
                  const on = row.teacherId === selectedId;
                  return (
                    <li key={row.id}>
                      <button
                        type="button"
                        className={on ? "ops-timeline__item ops-timeline__item--on" : "ops-timeline__item"}
                        onClick={() => pickTeacher(row.teacherId)}
                      >
                        <span className="ops-timeline__time">
                          {row.startTime}–{row.endTime}
                        </span>
                        <span className="ops-timeline__name">
                          {teacher?.name ?? "GV"} · {course?.name ?? row.courseId}
                        </span>
                        <span className="ops-timeline__meta">{roomLabel(rooms, row.roomId)}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}

          <div className="ops-table-card">
            <div className="ops-table-tools">
              <label className="ops-table-search">
                <span className="ops-sr">Tìm giáo viên</span>
                <input
                  type="search"
                  value={query}
                  placeholder="Tìm tên hoặc chuyên môn…"
                  onChange={(e) => {
                    setQuery(e.target.value);
                    resetPage();
                  }}
                />
              </label>
              <select
                aria-label="Trạng thái"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value as "all" | "active" | "leave");
                  resetPage();
                }}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Đang dạy</option>
                <option value="leave">Nghỉ phép</option>
              </select>
              <span className="ops-staff__sort">Sắp xếp: Tên A–Z</span>
            </div>

            <div className="ops-table-wrap">
              <table className="ops-table">
                <caption className="ops-sr">Danh sách giáo viên</caption>
                <thead>
                  <tr>
                    <th scope="col">Giáo viên</th>
                    <th scope="col">Chuyên môn</th>
                    <th scope="col">Lớp / HV</th>
                    <th scope="col">Ca rảnh</th>
                    <th scope="col">Rating</th>
                    <th scope="col">Liên hệ</th>
                    <th scope="col">Trạng thái</th>
                    <th scope="col">
                      <span className="ops-sr">Thao tác</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paged.map((item) => {
                    const stats = demoTeacherStats(item.id);
                    const courseList = courses.filter((c) => c.teacherIds.includes(item.id));
                    const studentCount = new Set(courseList.flatMap((c) => c.studentIds)).size;
                    const todayCount = classes.filter(
                      (row) => row.teacherId === item.id && row.date === today && !row.cancelled,
                    ).length;
                    const current = item.id === selectedId;
                    return (
                      <tr
                        key={item.id}
                        className={current ? "ops-table__row ops-table__row--on" : "ops-table__row"}
                        onClick={() => pickTeacher(item.id)}
                      >
                        <th scope="row">
                          <div className="ops-table__course">
                            <span className="ops-mini-av ops-staff__av" aria-hidden>
                              {initials(item.name)}
                            </span>
                            <span>
                              <span className="ops-table__name">{item.name}</span>
                              <span className="ops-table__id">{demoTeacherCode(item.id)}</span>
                            </span>
                          </div>
                        </th>
                        <td>{item.specialty}</td>
                        <td className="ops-table__fill">
                          {courseList.length} lớp · {studentCount} HV
                          {todayCount ? <span className="ops-staff__today-n"> · {todayCount} hôm nay</span> : null}
                        </td>
                        <td className="ops-table__fill">{stats.freeSlots}</td>
                        <td className="ops-table__fill">{stats.rating.toFixed(1)}</td>
                        <td>{stats.phone}</td>
                        <td>
                          <StatusChip tone={stats.active ? "paid" : "wait"}>
                            {stats.active ? "Đang dạy" : "Nghỉ phép"}
                          </StatusChip>
                        </td>
                        <td onClick={(event) => event.stopPropagation()}>
                          <div className="ops-table__acts">
                            <button type="button" className="ops-table__detail" onClick={() => pickTeacher(item.id)}>
                              Chi tiết
                            </button>
                            <MoreMenu
                              items={[
                                { label: "Mở khóa học", onClick: onPromo },
                                { label: "Copy mã", onClick: () => copyId(demoTeacherCode(item.id)) },
                              ]}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {filtered.length === 0 ? <p className="ops-table-empty">Không có giáo viên khớp.</p> : null}
            </div>

            <div className="ops-table-foot">
              <p>
                {filtered.length === 0
                  ? "0 giáo viên"
                  : `${pageSafe * PAGE_SIZE + 1}–${Math.min(filtered.length, pageSafe * PAGE_SIZE + PAGE_SIZE)} / ${filtered.length}`}
              </p>
              <div className="ops-pager">
                <button type="button" disabled={pageSafe <= 0} onClick={() => setPage((p) => Math.max(0, p - 1))}>
                  Trước
                </button>
                {Array.from({ length: pageCount }, (_, i) => (
                  <button
                    key={i}
                    type="button"
                    className={i === pageSafe ? "ops-pager__on" : undefined}
                    aria-current={i === pageSafe ? "page" : undefined}
                    onClick={() => setPage(i)}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  type="button"
                  disabled={pageSafe >= pageCount - 1}
                  onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
                >
                  Sau
                </button>
              </div>
            </div>
          </div>
        </div>

        <aside className="ops-staff__aside">
          {selected && selectedStats ? (
            <section className="ops-detail ops-staff__detail" aria-labelledby="edu-teacher-detail">
              <div className="ops-detail__head">
                <div className="ops-detail__head-title">
                  <h2 id="edu-teacher-detail">{selected.name}</h2>
                  <StatusChip tone={selectedStats.active ? "paid" : "wait"}>
                    {selectedStats.active ? "Đang dạy" : "Nghỉ phép"}
                  </StatusChip>
                </div>
                <button type="button" className="ops-detail__close" aria-label="Đóng chi tiết" onClick={closePanel}>
                  ×
                </button>
              </div>

              <div className="ops-staff__profile">
                <span className="ops-thumb ops-thumb--lg" aria-hidden>
                  {initials(selected.name)}
                </span>
                <div>
                  <p className="ops-detail__name">{selected.specialty}</p>
                  <p className="ops-staff__meta-line">
                    {demoTeacherCode(selected.id)} · ★ {selectedStats.rating.toFixed(1)} · Pulse Studio
                  </p>
                </div>
              </div>

              <div className="ops-detail__split">
                <div className="ops-detail__tabs" role="tablist" aria-label="Chi tiết giáo viên">
                  {(
                    [
                      ["overview", "Tổng quan"],
                      ["schedule", "Lịch dạy"],
                      ["history", "Lịch sử"],
                      ["perf", "Hiệu suất"],
                    ] as const
                  ).map(([id, label]) => (
                    <button
                      key={id}
                      type="button"
                      role="tab"
                      className={detailTab === id ? "ops-detail__tab ops-detail__tab--on" : "ops-detail__tab"}
                      aria-selected={detailTab === id}
                      onClick={() => setDetailTab(id)}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                <div className="ops-detail__pane">
                  {detailTab === "schedule" ? (
                    selectedToday.length ? (
                      <ul className="ops-staff__stub-list">
                        {selectedToday.map((row) => {
                          const course = courses.find((c) => c.id === row.courseId);
                          return (
                            <li key={row.id}>
                              {row.startTime}–{row.endTime} · {course?.name} · {roomLabel(rooms, row.roomId)}
                            </li>
                          );
                        })}
                      </ul>
                    ) : (
                      <p className="ops-board__note">Không có lớp hôm nay.</p>
                    )
                  ) : null}

                  {detailTab === "history" ? (
                    <ul className="ops-staff__stub-list">
                      <li>Gia nhập studio — {formatViDate(selectedStats.joinDate)}</li>
                      <li>Đã phụ trách {assigned.length} khóa (seed)</li>
                      <li>Lịch sử chi tiết — Sắp có</li>
                    </ul>
                  ) : null}

                  {detailTab === "perf" ? (
                    <ul className="ops-staff__stub-list">
                      <li>Rating demo — {selectedStats.rating.toFixed(1)} / 5</li>
                      <li>Điểm danh lớp — 92% (demo studio)</li>
                      <li>Ca rảnh tuần này — {selectedStats.freeSlots}</li>
                    </ul>
                  ) : null}

                  {detailTab === "overview" ? (
                    <>
                      <h3 className="ops-staff__section-title">Thông tin cơ bản</h3>
                      <dl className="ops-detail__meta ops-detail__meta--2col">
                        <div>
                          <dt>Mã GV</dt>
                          <dd>{demoTeacherCode(selected.id)}</dd>
                        </div>
                        <div>
                          <dt>Trạng thái</dt>
                          <dd>{selectedStats.active ? "Đang dạy" : "Nghỉ phép"}</dd>
                        </div>
                        <div>
                          <dt>Chuyên môn</dt>
                          <dd>{selected.specialty}</dd>
                        </div>
                        <div>
                          <dt>Ngày vào</dt>
                          <dd>{formatViDate(selectedStats.joinDate)}</dd>
                        </div>
                        <div>
                          <dt>Studio</dt>
                          <dd>Pulse Studio · Q1</dd>
                        </div>
                        <div>
                          <dt>Rating</dt>
                          <dd>★ {selectedStats.rating.toFixed(1)}</dd>
                        </div>
                      </dl>

                      <h3 className="ops-staff__section-title">Liên hệ</h3>
                      <dl className="ops-detail__meta ops-detail__meta--2col">
                        <div>
                          <dt>SĐT</dt>
                          <dd>
                            <a href={`tel:${selectedStats.phone}`}>{selectedStats.phone}</a>
                          </dd>
                        </div>
                        <div>
                          <dt>Email</dt>
                          <dd>{selectedStats.email}</dd>
                        </div>
                      </dl>

                      <h3 className="ops-staff__section-title">Lớp đang phụ trách ({assigned.length})</h3>
                      {assigned.length ? (
                        <ul className="ops-staff__class-list">
                          {assigned.map((course) => {
                            const status = courseStatus(course);
                            return (
                              <li key={course.id}>
                                <div>
                                  <span className="ops-roster__name">{course.name}</span>
                                  <span className="ops-roster__phone">
                                    {roomLabel(rooms, course.roomId)} ·{" "}
                                    {weekdayLabelList(course.schedule.weekdays)} · {course.schedule.startTime}–
                                    {course.schedule.endTime}
                                  </span>
                                  <span className="ops-roster__phone">
                                    {course.studentIds.length}/{course.capacity} HV ·{" "}
                                    <StatusChip tone={courseChip(status).tone}>{COURSE_STATUS_LABEL[status]}</StatusChip>
                                  </span>
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      ) : (
                        <p className="ops-board__note">Chưa gán khóa.</p>
                      )}

                      <h3 className="ops-staff__section-title">Ghi chú &amp; tag</h3>
                      <ul className="ops-staff__tags">
                        {selectedStats.tags.map((tag) => (
                          <li key={tag}>{tag}</li>
                        ))}
                      </ul>
                      <p className="ops-board__note">Giáo viên seed · đánh giá demo hardcode.</p>

                      <h3 className="ops-staff__section-title">Thao tác nhanh</h3>
                      <div className="ops-staff__quick">
                        <button className="ops-page__cta" type="button" onClick={onPromo}>
                          Gán khóa
                        </button>
                        <button className="ops-page__ghost" type="button" disabled title="Demo">
                          Gửi thông báo
                        </button>
                        <button className="ops-page__ghost" type="button" onClick={() => setDetailTab("schedule")}>
                          Xem lịch
                        </button>
                        <button className="ops-page__ghost" type="button" onClick={() => setDetailTab("perf")}>
                          Hiệu suất
                        </button>
                      </div>

                      {selectedToday.length ? (
                        <>
                          <h3 className="ops-staff__section-title">Lớp hôm nay ({selectedToday.length})</h3>
                          <ul className="ops-staff__class-list">
                            {selectedToday.map((row) => {
                              const status = classStatus(row);
                              const course = courses.find((c) => c.id === row.courseId);
                              return (
                                <li key={row.id}>
                                  <div>
                                    <span className="ops-roster__name">
                                      {row.startTime}–{row.endTime} · {course?.name}
                                    </span>
                                    <span className="ops-roster__phone">
                                      {roomLabel(rooms, row.roomId)} ·{" "}
                                      <StatusChip tone={classChip(status).tone}>{CLASS_STATUS_LABEL[status]}</StatusChip>
                                    </span>
                                  </div>
                                </li>
                              );
                            })}
                          </ul>
                        </>
                      ) : null}
                    </>
                  ) : null}
                </div>
              </div>
            </section>
          ) : (
            <p className="ops-aside-hint">Chọn một giáo viên để xem lịch dạy và lớp phụ trách.</p>
          )}
        </aside>
      </div>
    </section>
  );
}
