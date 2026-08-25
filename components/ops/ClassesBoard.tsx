"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CLASS_STATUS_LABEL,
  classStatus,
  formatViDate,
  localIsoDate,
  teacherName,
  weekdayLabelList,
} from "../../lib/edu";
import {
  CLASSES_DATE_RANGE,
  CLASSES_KPI,
  classSessionLabel,
  demoClassAttend,
  demoClassStudentPay,
} from "../../lib/classes-demo";
import type { ClassFilter, DemoClass, DemoCourse, DemoRoom, DemoStudent, DemoTeacher } from "../../lib/types";
import { MoreMenu, copyId } from "./MoreMenu";
import { StatusChip, classChip } from "./StatusChip";
import "./chrome.css";
import "./EduTable.css";
import "./ClassesBoard.css";

type ClassesBoardProps = {
  title: string;
  classes: DemoClass[];
  courses: DemoCourse[];
  students: DemoStudent[];
  teachers: DemoTeacher[];
  rooms: DemoRoom[];
  filter: ClassFilter;
  onFilter: (next: ClassFilter) => void;
  onCancel: (classId: string) => void;
  onOpenCourse: (courseId: string) => void;
};

const PAGE_SIZE = 12;

const FILTERS: { id: ClassFilter; label: string }[] = [
  { id: "all", label: "Tất cả" },
  { id: "upcoming", label: "Chưa diễn ra" },
  { id: "ongoing", label: "Đang diễn ra" },
  { id: "completed", label: "Hoàn thành" },
  { id: "cancelled", label: "Hủy" },
];

type DetailTab = "overview" | "schedule" | "attendance" | "history";

function courseName(courses: DemoCourse[], id: string): string {
  return courses.find((c) => c.id === id)?.name ?? id;
}

function roomLabel(rooms: DemoRoom[], id: string): string {
  return rooms.find((r) => r.id === id)?.label ?? id;
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  return parts
    .slice(-2)
    .map((part) => part[0] ?? "")
    .join("")
    .toUpperCase();
}

export function ClassesBoard({
  title,
  classes,
  courses,
  students,
  teachers,
  rooms,
  filter,
  onFilter,
  onCancel,
  onOpenCourse,
}: ClassesBoardProps) {
  const today = localIsoDate();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [panelDismissed, setPanelDismissed] = useState(false);
  const [courseId, setCourseId] = useState("all");
  const [teacherId, setTeacherId] = useState("all");
  const [roomId, setRoomId] = useState("all");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const [detailTab, setDetailTab] = useState<DetailTab>("overview");

  const counts = useMemo(() => {
    const base = { all: classes.length, upcoming: 0, ongoing: 0, completed: 0, cancelled: 0 };
    for (const row of classes) {
      const status = classStatus(row);
      base[status] += 1;
    }
    return base;
  }, [classes]);

  const todayRows = useMemo(
    () =>
      [...classes]
        .filter((row) => row.date === today && !row.cancelled)
        .sort((a, b) => a.startTime.localeCompare(b.startTime)),
    [classes, today],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return [...classes]
      .filter((row) => (courseId === "all" ? true : row.courseId === courseId))
      .filter((row) => (teacherId === "all" ? true : row.teacherId === teacherId))
      .filter((row) => (roomId === "all" ? true : row.roomId === roomId))
      .filter((row) => (filter === "all" ? true : classStatus(row) === filter))
      .filter((row) => {
        if (!q) return true;
        const name = courseName(courses, row.courseId);
        const teacher = teacherName(teachers, row.teacherId);
        const room = roomLabel(rooms, row.roomId);
        return `${name} ${row.id} ${teacher} ${room} ${row.date}`.toLowerCase().includes(q);
      })
      .sort((a, b) => `${a.date}${a.startTime}`.localeCompare(`${b.date}${b.startTime}`));
  }, [classes, courseId, teacherId, roomId, filter, query, courses, teachers, rooms]);

  useEffect(() => {
    if (panelDismissed) return;
    if (selectedId && filtered.some((row) => row.id === selectedId)) return;
    const preferToday = todayRows.find((row) => filtered.some((f) => f.id === row.id));
    const first = preferToday?.id ?? filtered[0]?.id ?? null;
    setSelectedId(first);
  }, [filtered, todayRows, selectedId, panelDismissed]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageSafe = Math.min(page, pageCount - 1);
  const paged = filtered.slice(pageSafe * PAGE_SIZE, pageSafe * PAGE_SIZE + PAGE_SIZE);
  const selected = classes.find((row) => row.id === selectedId) ?? null;
  const selectedCourse = selected ? courses.find((c) => c.id === selected.courseId) ?? null : null;
  const selectedStatus = selected ? classStatus(selected) : null;
  const canCancel = selectedStatus === "upcoming" || selectedStatus === "ongoing";
  const selectedAttend = selected ? demoClassAttend(selected.id) : 0;

  const roster = useMemo(() => {
    if (!selected) return [];
    return selected.studentIds
      .map((id) => students.find((s) => s.id === id))
      .filter((s): s is DemoStudent => Boolean(s));
  }, [selected, students]);

  function pickClass(id: string) {
    setPanelDismissed(false);
    setSelectedId(id);
    setDetailTab("overview");
  }

  function closePanel() {
    setPanelDismissed(true);
    setSelectedId(null);
  }

  function resetPageAndPanel() {
    setPage(0);
    setPanelDismissed(false);
  }

  return (
    <section className="ops-classes" aria-labelledby="ops-classes-heading">
      <div className="ops-board__layout ops-classes__layout">
        <div className="ops-board__main ops-classes__main">
          <nav className="ops-crumb" aria-label="Breadcrumb">
            <ol>
              <li>Trang chủ</li>
              <li aria-current="page">{title}</li>
            </ol>
          </nav>
          <div className="ops-page__head">
            <div>
              <h1 id="ops-classes-heading" className="ops-page__title" tabIndex={-1}>
                {title}
              </h1>
              <p className="ops-page__lede">
                Quản lý lịch học và vận hành buổi · hôm nay{" "}
                <time dateTime={today}>{formatViDate(today)}</time>
              </p>
            </div>
            <button className="ops-page__cta" type="button" onClick={() => onOpenCourse(courses[0]?.id ?? "")}>
              + Mở khóa để sinh lớp
            </button>
          </div>

          <ul className="ops-kpi-row ops-kpi-row--6">
            {CLASSES_KPI.map((kpi) => (
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
                    {kpi.trend} <span>so với tuần trước</span>
                  </p>
                </article>
              </li>
            ))}
          </ul>

          {todayRows.length ? (
            <div className="ops-classes__today">
              <h2 className="ops-classes__today-title">
                Hôm nay — <time dateTime={today}>{formatViDate(today)}</time>
              </h2>
              <ul className="ops-timeline" aria-label="Lớp hôm nay">
                {todayRows.map((row) => {
                  const on = row.id === selectedId;
                  const name = courseName(courses, row.courseId);
                  return (
                    <li key={row.id}>
                      <button
                        type="button"
                        className={on ? "ops-timeline__item ops-timeline__item--on" : "ops-timeline__item"}
                        onClick={() => pickClass(row.id)}
                      >
                        <span className="ops-timeline__time">
                          {row.startTime}–{row.endTime}
                        </span>
                        <span className="ops-timeline__name">{classSessionLabel(name, row.id)}</span>
                        <span className="ops-timeline__meta">
                          {roomLabel(rooms, row.roomId)} · {row.studentIds.length}/{row.capacity} · {demoClassAttend(row.id)}%
                        </span>
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
                <span className="ops-sr">Tìm lớp</span>
                <input
                  type="search"
                  value={query}
                  placeholder="Tìm khóa, GV, phòng…"
                  onChange={(e) => {
                    setQuery(e.target.value);
                    resetPageAndPanel();
                  }}
                />
              </label>
              <select
                aria-label="Trạng thái"
                value={filter}
                onChange={(e) => {
                  onFilter(e.target.value as ClassFilter);
                  resetPageAndPanel();
                }}
              >
                {FILTERS.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label} ({counts[item.id]})
                  </option>
                ))}
              </select>
              <select
                aria-label="Khóa"
                value={courseId}
                onChange={(e) => {
                  setCourseId(e.target.value);
                  resetPageAndPanel();
                }}
              >
                <option value="all">Tất cả khóa</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                ))}
              </select>
              <select
                aria-label="Giáo viên"
                value={teacherId}
                onChange={(e) => {
                  setTeacherId(e.target.value);
                  resetPageAndPanel();
                }}
              >
                <option value="all">Tất cả GV</option>
                {teachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.name}
                  </option>
                ))}
              </select>
              <select
                aria-label="Phòng"
                value={roomId}
                onChange={(e) => {
                  setRoomId(e.target.value);
                  resetPageAndPanel();
                }}
              >
                <option value="all">Tất cả phòng</option>
                {rooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.label}
                  </option>
                ))}
              </select>
              <span className="ops-classes__range" title="Khoảng demo">
                {CLASSES_DATE_RANGE.label}
              </span>
            </div>

            <div className="ops-table-wrap">
              <table className="ops-table">
                <caption className="ops-sr">Danh sách lớp học</caption>
                <thead>
                  <tr>
                    <th scope="col">Lớp / buổi</th>
                    <th scope="col">Ngày</th>
                    <th scope="col">Giờ</th>
                    <th scope="col">Giáo viên</th>
                    <th scope="col">Phòng</th>
                    <th scope="col">Sĩ số</th>
                    <th scope="col">Điểm danh</th>
                    <th scope="col">Trạng thái</th>
                    <th scope="col">
                      <span className="ops-sr">Thao tác</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paged.map((row) => {
                    const status = classStatus(row);
                    const chip = classChip(status);
                    const pct = Math.round((row.studentIds.length / Math.max(1, row.capacity)) * 100);
                    const name = courseName(courses, row.courseId);
                    const teacher = teacherName(teachers, row.teacherId);
                    const current = row.id === selectedId;
                    const attend = demoClassAttend(row.id);
                    return (
                      <tr
                        key={row.id}
                        className={current ? "ops-table__row ops-table__row--on" : "ops-table__row"}
                        onClick={() => pickClass(row.id)}
                      >
                        <th scope="row">
                          <div className="ops-table__course">
                            <span className="ops-thumb" aria-hidden>
                              {name.slice(0, 1)}
                            </span>
                            <span>
                              <span className="ops-table__name">{classSessionLabel(name, row.id)}</span>
                              <span className="ops-table__id">{row.id}</span>
                            </span>
                          </div>
                        </th>
                        <td>
                          <time dateTime={row.date}>{formatViDate(row.date)}</time>
                        </td>
                        <td className="ops-table__fill">
                          {row.startTime}–{row.endTime}
                        </td>
                        <td>
                          <span className="ops-table__who">
                            <span className="ops-mini-av" aria-hidden>
                              {initials(teacher)}
                            </span>
                            {teacher}
                          </span>
                        </td>
                        <td>{roomLabel(rooms, row.roomId)}</td>
                        <td>
                          <span className="ops-table__fill">
                            {row.studentIds.length}/{row.capacity}
                          </span>
                          <span className="ops-meter ops-meter--inline" aria-hidden>
                            <span style={{ width: `${Math.min(100, pct)}%` }} />
                          </span>
                        </td>
                        <td className="ops-table__fill">{attend}%</td>
                        <td>
                          <StatusChip tone={chip.tone}>{CLASS_STATUS_LABEL[status]}</StatusChip>
                        </td>
                        <td onClick={(event) => event.stopPropagation()}>
                          <div className="ops-table__acts">
                            <button type="button" className="ops-table__detail" onClick={() => pickClass(row.id)}>
                              Chi tiết
                            </button>
                            <MoreMenu
                              items={[
                                { label: "Mở khóa", onClick: () => onOpenCourse(row.courseId) },
                                ...(status === "upcoming" || status === "ongoing"
                                  ? [{ label: "Hủy lớp", onClick: () => onCancel(row.id) }]
                                  : []),
                                { label: "Copy mã", onClick: () => copyId(row.id) },
                              ]}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {filtered.length === 0 ? <p className="ops-table-empty">Không có lớp khớp bộ lọc.</p> : null}
            </div>

            <div className="ops-table-foot">
              <p>
                {filtered.length === 0
                  ? "0 lớp"
                  : `${pageSafe * PAGE_SIZE + 1}–${Math.min(filtered.length, pageSafe * PAGE_SIZE + PAGE_SIZE)} / ${filtered.length}`}
              </p>
              <div className="ops-pager">
                <button type="button" disabled={pageSafe <= 0} onClick={() => setPage((p) => Math.max(0, p - 1))}>
                  Trước
                </button>
                {Array.from({ length: Math.min(pageCount, 8) }, (_, i) => {
                  const pageIndex = pageCount <= 8 ? i : Math.min(Math.max(0, pageSafe - 3), pageCount - 8) + i;
                  return (
                    <button
                      key={pageIndex}
                      type="button"
                      className={pageIndex === pageSafe ? "ops-pager__on" : undefined}
                      aria-current={pageIndex === pageSafe ? "page" : undefined}
                      onClick={() => setPage(pageIndex)}
                    >
                      {pageIndex + 1}
                    </button>
                  );
                })}
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

        <aside className="ops-board__aside ops-classes__aside">
          {selected ? (
            <section className="ops-detail" aria-labelledby="edu-class-detail">
              <div className="ops-detail__head">
                <h2 id="edu-class-detail">{classSessionLabel(courseName(courses, selected.courseId), selected.id)}</h2>
                <button
                  type="button"
                  className="ops-detail__close"
                  aria-label="Đóng chi tiết"
                  onClick={closePanel}
                >
                  ×
                </button>
              </div>
              <div className="ops-detail__hero">
                <span className="ops-thumb ops-thumb--lg" aria-hidden>
                  {courseName(courses, selected.courseId).slice(0, 1)}
                </span>
                <div>
                  <p className="ops-detail__name">{courseName(courses, selected.courseId)}</p>
                  <StatusChip tone={classChip(classStatus(selected)).tone}>
                    {CLASS_STATUS_LABEL[classStatus(selected)]}
                  </StatusChip>
                </div>
              </div>
              <div className="ops-detail__split">
              <div className="ops-detail__tabs" role="tablist" aria-label="Chi tiết lớp">
                {(
                  [
                    ["overview", "Tổng quan"],
                    ["schedule", "Lịch học"],
                    ["attendance", "Điểm danh"],
                    ["history", "Lịch sử"],
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
                <ul className="ops-classes__stub-list">
                  <li>
                    Buổi này — {formatViDate(selected.date)} · {selected.startTime}–{selected.endTime}
                  </li>
                  {selectedCourse ? (
                    <li>
                      Lịch khóa — {weekdayLabelList(selectedCourse.schedule.weekdays)} ·{" "}
                      {selectedCourse.schedule.startTime}–{selectedCourse.schedule.endTime}
                    </li>
                  ) : null}
                  <li>Buổi kế (demo) — theo lịch khóa</li>
                </ul>
              ) : null}

              {detailTab === "attendance" ? (
                <ul className="ops-classes__stub-list">
                  <li>Có mặt demo — {Math.round((selectedAttend / 100) * selected.studentIds.length)} HV</li>
                  <li>Vắng / muộn — seed minh họa</li>
                  <li>Xuất điểm danh — Sắp có</li>
                </ul>
              ) : null}

              {detailTab === "history" ? (
                <ul className="ops-classes__stub-list">
                  <li>{formatViDate(selected.date)} — Mở buổi · seed</li>
                  <li>Trước đó — Sinh từ khóa {courseName(courses, selected.courseId)}</li>
                  <li>Ghi chú vận hành — demo</li>
                </ul>
              ) : null}

              {detailTab === "overview" ? (
                <>
                  <h3 className="ops-classes__block-title">Thông tin lớp học</h3>
                  <dl className="ops-detail__meta">
                    <div>
                      <dt>Khóa học</dt>
                      <dd>{courseName(courses, selected.courseId)}</dd>
                    </div>
                    <div>
                      <dt>Giáo viên</dt>
                      <dd>
                        <span className="ops-table__who">
                          <span className="ops-mini-av" aria-hidden>
                            {initials(teacherName(teachers, selected.teacherId))}
                          </span>
                          {teacherName(teachers, selected.teacherId)}
                        </span>
                      </dd>
                    </div>
                    <div>
                      <dt>Lịch học</dt>
                      <dd>
                        {selectedCourse
                          ? `${weekdayLabelList(selectedCourse.schedule.weekdays)} · ${selectedCourse.schedule.startTime}–${selectedCourse.schedule.endTime}`
                          : `${selected.startTime}–${selected.endTime}`}
                      </dd>
                    </div>
                    <div>
                      <dt>Phòng / Studio</dt>
                      <dd>{roomLabel(rooms, selected.roomId)}</dd>
                    </div>
                    <div>
                      <dt>Sĩ số</dt>
                      <dd>
                        {selected.studentIds.length} / {selected.capacity} học viên
                      </dd>
                    </div>
                    <div>
                      <dt>Tỷ lệ điểm danh</dt>
                      <dd>
                        <span className="ops-classes__fill">
                          <span>{selectedAttend}%</span>
                          <span className="ops-meter" aria-hidden>
                            <span style={{ width: `${Math.min(100, selectedAttend)}%` }} />
                          </span>
                        </span>
                      </dd>
                    </div>
                    <div>
                      <dt>Buổi này</dt>
                      <dd>
                        <time dateTime={selected.date}>{formatViDate(selected.date)}</time> · {selected.startTime}
                      </dd>
                    </div>
                    {selectedCourse ? (
                      <div>
                        <dt>Cửa sổ khóa</dt>
                        <dd>
                          {formatViDate(selectedCourse.enrollStart)} → {formatViDate(selectedCourse.enrollEnd)}
                        </dd>
                      </div>
                    ) : null}
                  </dl>

                  <div className="ops-classes__roster-head">
                    <h3 className="ops-classes__block-title">Học viên ({roster.length})</h3>
                    <button type="button" className="ops-classes__link" onClick={() => setDetailTab("attendance")}>
                      Xem tất cả
                    </button>
                  </div>
                  <div className="ops-classes__roster-wrap">
                    <table className="ops-table ops-classes__roster-table">
                      <thead>
                        <tr>
                          <th scope="col">Học viên</th>
                          <th scope="col">Điểm danh</th>
                          <th scope="col">Thanh toán</th>
                        </tr>
                      </thead>
                      <tbody>
                        {roster.slice(0, 8).map((student) => {
                          const demo = demoClassStudentPay(selected.id, student.id);
                          return (
                            <tr key={student.id}>
                              <th scope="row">
                                <span className="ops-table__who">
                                  <span className="ops-mini-av" aria-hidden>
                                    {initials(student.name)}
                                  </span>
                                  <span>
                                    <span className="ops-roster__name">{student.name}</span>
                                    <span className="ops-roster__phone">{student.phone || "—"}</span>
                                  </span>
                                </span>
                              </th>
                              <td className="ops-table__fill">{demo.attend}%</td>
                              <td>
                                <StatusChip tone={demo.paid ? "paid" : "wait"}>
                                  {demo.paid ? "Đã thanh toán" : "Còn nợ"}
                                </StatusChip>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    {roster.length === 0 ? <p className="ops-board__note">Chưa có học viên trên buổi này.</p> : null}
                  </div>

                  <h3 className="ops-classes__block-title">Thao tác vận hành</h3>
                  <div className="ops-classes__actions">
                    <button className="ops-page__cta" type="button" onClick={() => setDetailTab("attendance")}>
                      Điểm danh
                    </button>
                    <button className="ops-page__ghost" type="button" disabled title="Demo">
                      Gửi thông báo
                    </button>
                    <button className="ops-page__ghost" type="button" onClick={() => onOpenCourse(selected.courseId)}>
                      Mở khóa
                    </button>
                    <button
                      className="ops-page__ghost"
                      type="button"
                      disabled={!canCancel}
                      title={canCancel ? undefined : "Chỉ hủy buổi chưa / đang diễn ra"}
                      onClick={() => canCancel && onCancel(selected.id)}
                    >
                      Hủy lớp
                    </button>
                  </div>
                </>
              ) : null}
              </div>
              </div>
            </section>
          ) : (
            <p className="ops-aside-hint">Chọn một lớp trên bảng hoặc timeline để xem sĩ số và vận hành buổi.</p>
          )}
        </aside>
      </div>
    </section>
  );
}
