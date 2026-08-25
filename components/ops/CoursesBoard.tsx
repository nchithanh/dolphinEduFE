"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  COURSE_STATUS_LABEL,
  courseStatus,
  formatViDate,
  teacherNames,
  weekdayLabelList,
  WEEKDAY_ORDER,
  WEEKDAY_LABEL,
} from "../../lib/edu";
import { blankCourse } from "../../lib/seed";
import { COURSES_DATE_RANGE, COURSES_KPI, demoCourseCode, demoStudentPay } from "../../lib/courses-demo";
import type { CourseStatus, DemoClass, DemoCourse, DemoRoom, DemoStudent, DemoTeacher, Weekday } from "../../lib/types";
import { MoreMenu, copyId } from "./MoreMenu";
import { StatusChip, courseChip } from "./StatusChip";
import "./chrome.css";
import "./EduTable.css";
import "./CoursesBoard.css";

type CoursesBoardProps = {
  title: string;
  courses: DemoCourse[];
  classes: DemoClass[];
  students: DemoStudent[];
  teachers: DemoTeacher[];
  rooms: DemoRoom[];
  selectedId: string | null;
  showForm: boolean;
  notice: string | null;
  onSelect: (id: string | null) => void;
  onShowForm: (open: boolean) => void;
  onSave: (course: DemoCourse) => void;
  onEnroll: (courseId: string, studentId: string) => void;
  onGenerate: (courseId: string) => void;
  onOpenClasses: (courseId: string) => void;
};

type SortKey = "newest" | "name" | "fill";

const PAGE_SIZE = 12;

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

function levelClass(level: string): string {
  const text = level.toLowerCase();
  if (text.includes("begin")) return "ops-lvl ops-lvl--begin";
  if (text.includes("inter") || text.includes("level")) return "ops-lvl ops-lvl--mid";
  return "ops-lvl ops-lvl--open";
}

export function CoursesBoard({
  title,
  courses,
  classes,
  students,
  teachers,
  rooms,
  selectedId,
  showForm,
  notice,
  onSelect,
  onShowForm,
  onSave,
  onEnroll,
  onGenerate,
  onOpenClasses,
}: CoursesBoardProps) {
  const selected = courses.find((c) => c.id === selectedId) ?? null;
  const [draft, setDraft] = useState<DemoCourse>(() => blankCourse());
  const [enrollId, setEnrollId] = useState("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<CourseStatus | "all">("all");
  const [levelFilter, setLevelFilter] = useState("all");
  const [teacherFilter, setTeacherFilter] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("newest");
  const [page, setPage] = useState(0);
  const [detailTab, setDetailTab] = useState<"overview" | "classes" | "history" | "docs" | "notes">("overview");

  const levels = useMemo(() => [...new Set(courses.map((c) => c.level))], [courses]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const rows = courses.filter((course) => {
      const status = courseStatus(course);
      if (statusFilter !== "all" && status !== statusFilter) return false;
      if (levelFilter !== "all" && course.level !== levelFilter) return false;
      if (teacherFilter !== "all" && !course.teacherIds.includes(teacherFilter)) return false;
      if (q && !`${course.name} ${course.id} ${course.level}`.toLowerCase().includes(q)) return false;
      return true;
    });
    rows.sort((a, b) => {
      if (sortKey === "name") return a.name.localeCompare(b.name, "vi");
      if (sortKey === "fill") {
        const fa = a.studentIds.length / Math.max(1, a.capacity);
        const fb = b.studentIds.length / Math.max(1, b.capacity);
        return fb - fa;
      }
      return b.enrollStart.localeCompare(a.enrollStart) || a.name.localeCompare(b.name, "vi");
    });
    return rows;
  }, [courses, query, statusFilter, levelFilter, teacherFilter, sortKey]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageSafe = Math.min(page, pageCount - 1);
  const paged = filtered.slice(pageSafe * PAGE_SIZE, pageSafe * PAGE_SIZE + PAGE_SIZE);

  function startCreate() {
    setDraft(blankCourse());
    onShowForm(true);
    onSelect(null);
  }

  function startEdit(course: DemoCourse) {
    setDraft({
      ...course,
      teacherIds: [...course.teacherIds],
      studentIds: [...course.studentIds],
      schedule: { ...course.schedule, weekdays: [...course.schedule.weekdays] },
    });
    onShowForm(true);
  }

  function toggleWeekday(day: Weekday) {
    setDraft((current) => {
      const has = current.schedule.weekdays.includes(day);
      const weekdays = has
        ? current.schedule.weekdays.filter((d) => d !== day)
        : [...current.schedule.weekdays, day];
      return { ...current, schedule: { ...current.schedule, weekdays } };
    });
  }

  function toggleTeacher(id: string) {
    setDraft((current) => {
      const has = current.teacherIds.includes(id);
      return {
        ...current,
        teacherIds: has ? current.teacherIds.filter((t) => t !== id) : [...current.teacherIds, id],
      };
    });
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!draft.name.trim()) return;
    if (!draft.schedule.weekdays.length) return;
    onSave({
      ...draft,
      name: draft.name.trim(),
      level: draft.level.trim() || "Open",
      capacity: Math.max(1, Number(draft.capacity) || 12),
      schedule: {
        ...draft.schedule,
        sessionCount: Math.max(1, Number(draft.schedule.sessionCount) || 8),
      },
    });
  }

  const roster = useMemo(() => {
    if (!selected) return [];
    return selected.studentIds.map((id) => students.find((s) => s.id === id)).filter(Boolean) as DemoStudent[];
  }, [selected, students]);

  const candidates = useMemo(() => {
    if (!selected) return [];
    return students.filter((s) => !selected.studentIds.includes(s.id));
  }, [selected, students]);

  const classCount = selected ? classes.filter((row) => row.courseId === selected.id).length : 0;
  const fillPct = selected
    ? Math.round((selected.studentIds.length / Math.max(1, selected.capacity)) * 100)
    : 0;
  const leadTeacher = selected
    ? teachers.find((t) => t.id === selected.teacherIds[0])
    : undefined;

  return (
    <section className="ops-courses" aria-labelledby="ops-courses-heading">
      <div className="ops-courses__layout">
        <div className="ops-courses__main">
          <nav className="ops-crumb" aria-label="Breadcrumb">
            <ol>
              <li>Trang chủ</li>
              <li aria-current="page">{title}</li>
            </ol>
          </nav>
          <div className="ops-page__head">
            <div>
              <h1 id="ops-courses-heading" className="ops-page__title" tabIndex={-1}>
                {title}
              </h1>
              <p className="ops-page__lede">Quản lý chương trình, tuyển sinh và lớp học</p>
            </div>
            <button className="ops-page__cta" type="button" onClick={startCreate}>
              + Tạo khóa học
            </button>
          </div>

          {notice ? <p className="ops-courses__notice">{notice}</p> : null}

          <ul className="ops-kpi-row">
            {COURSES_KPI.map((kpi) => (
              <li key={kpi.id}>
                <article className="ops-kpi-card">
                  <span className="ops-kpi-card__top">
                    <span className="ops-kpi-card__ico" aria-hidden>
                      {kpi.ico}
                    </span>
                    <span className="ops-kpi-card__k">{kpi.label}</span>
                  </span>
                  <p className="ops-kpi-card__v">{kpi.value}</p>
                  <p className={kpi.up ? "ops-kpi-card__trend ops-kpi-card__trend--up" : "ops-kpi-card__trend ops-kpi-card__trend--down"}>
                    {kpi.trend} <span>so với tháng trước</span>
                  </p>
                </article>
              </li>
            ))}
          </ul>

          {showForm ? (
            <form className="ops-courses__form" onSubmit={submit}>
              <h2 className="ops-courses__form-title">{draft.id ? "Sửa khóa" : "Tạo khóa học"}</h2>
              <div className="ops-courses__form-grid">
                <p className="ops-book__field">
                  <label htmlFor="edu-course-name">Tên khóa</label>
                  <input
                    id="edu-course-name"
                    value={draft.name}
                    onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                    placeholder="VD. Hip-hop Open"
                    autoComplete="off"
                    required
                  />
                </p>
                <p className="ops-book__field">
                  <label htmlFor="edu-course-level">Trình độ</label>
                  <input
                    id="edu-course-level"
                    value={draft.level}
                    onChange={(e) => setDraft((d) => ({ ...d, level: e.target.value }))}
                    placeholder="Open"
                    autoComplete="off"
                  />
                </p>
                <p className="ops-book__field">
                  <label htmlFor="edu-course-cap">Sĩ số</label>
                  <input
                    id="edu-course-cap"
                    type="number"
                    min={1}
                    value={draft.capacity}
                    onChange={(e) => setDraft((d) => ({ ...d, capacity: Number(e.target.value) }))}
                  />
                </p>
                <p className="ops-book__field">
                  <label htmlFor="edu-enroll-start">Tuyển sinh từ</label>
                  <input
                    id="edu-enroll-start"
                    type="date"
                    value={draft.enrollStart}
                    onChange={(e) => setDraft((d) => ({ ...d, enrollStart: e.target.value }))}
                  />
                </p>
                <p className="ops-book__field">
                  <label htmlFor="edu-enroll-end">Tuyển sinh đến</label>
                  <input
                    id="edu-enroll-end"
                    type="date"
                    value={draft.enrollEnd}
                    onChange={(e) => setDraft((d) => ({ ...d, enrollEnd: e.target.value }))}
                  />
                </p>
                <p className="ops-book__field">
                  <label htmlFor="edu-room">Phòng tập</label>
                  <select
                    id="edu-room"
                    value={draft.roomId}
                    onChange={(e) => setDraft((d) => ({ ...d, roomId: e.target.value }))}
                  >
                    {rooms.filter((r) => r.active).map((room) => (
                      <option key={room.id} value={room.id}>
                        {room.label}
                      </option>
                    ))}
                  </select>
                </p>
                <p className="ops-book__field">
                  <label htmlFor="edu-start">Giờ bắt đầu</label>
                  <input
                    id="edu-start"
                    type="time"
                    value={draft.schedule.startTime}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, schedule: { ...d.schedule, startTime: e.target.value } }))
                    }
                  />
                </p>
                <p className="ops-book__field">
                  <label htmlFor="edu-end">Giờ kết thúc</label>
                  <input
                    id="edu-end"
                    type="time"
                    value={draft.schedule.endTime}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, schedule: { ...d.schedule, endTime: e.target.value } }))
                    }
                  />
                </p>
                <p className="ops-book__field">
                  <label htmlFor="edu-sessions">Số buổi</label>
                  <input
                    id="edu-sessions"
                    type="number"
                    min={1}
                    value={draft.schedule.sessionCount}
                    onChange={(e) =>
                      setDraft((d) => ({
                        ...d,
                        schedule: { ...d.schedule, sessionCount: Number(e.target.value) },
                      }))
                    }
                  />
                </p>
                <p className="ops-book__field">
                  <label htmlFor="edu-first">Buổi đầu</label>
                  <input
                    id="edu-first"
                    type="date"
                    value={draft.schedule.firstDate}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, schedule: { ...d.schedule, firstDate: e.target.value } }))
                    }
                  />
                </p>
                <p className="ops-book__field ops-courses__span">
                  <label htmlFor="edu-note">Ghi chú</label>
                  <input
                    id="edu-note"
                    value={draft.note ?? ""}
                    onChange={(e) => setDraft((d) => ({ ...d, note: e.target.value }))}
                    autoComplete="off"
                  />
                </p>
              </div>

              <fieldset className="ops-courses__set">
                <legend>Giáo viên</legend>
                {teachers.map((teacher) => (
                  <label key={teacher.id}>
                    <input
                      type="checkbox"
                      checked={draft.teacherIds.includes(teacher.id)}
                      onChange={() => toggleTeacher(teacher.id)}
                    />
                    {teacher.name}
                  </label>
                ))}
              </fieldset>

              <fieldset className="ops-courses__set">
                <legend>Lịch trong tuần</legend>
                {WEEKDAY_ORDER.map((day) => (
                  <label key={day}>
                    <input
                      type="checkbox"
                      checked={draft.schedule.weekdays.includes(day)}
                      onChange={() => toggleWeekday(day)}
                    />
                    {WEEKDAY_LABEL[day]}
                  </label>
                ))}
              </fieldset>

              <div className="ops-courses__form-actions">
                <button
                  type="button"
                  className="ops-page__ghost"
                  onClick={() => {
                    onShowForm(false);
                    setDraft(blankCourse());
                  }}
                >
                  Đóng
                </button>
                <button className="ops-page__cta" type="submit">
                  {draft.id ? "Lưu khóa" : "Tạo khóa"}
                </button>
              </div>
            </form>
          ) : null}

          <div className="ops-table-card">
            <div className="ops-table-tools">
              <label className="ops-table-search">
                <span className="ops-sr">Tìm khóa</span>
                <input
                  type="search"
                  value={query}
                  placeholder="Tìm tên hoặc mã khóa…"
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setPage(0);
                  }}
                />
              </label>
              <select
                aria-label="Trạng thái"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value as CourseStatus | "all");
                  setPage(0);
                }}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="recruiting">Đang tuyển</option>
                <option value="draft">Nháp</option>
                <option value="closed">Đóng tuyển</option>
              </select>
              <select
                aria-label="Trình độ"
                value={levelFilter}
                onChange={(e) => {
                  setLevelFilter(e.target.value);
                  setPage(0);
                }}
              >
                <option value="all">Tất cả trình độ</option>
                {levels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
              <select
                aria-label="Giáo viên"
                value={teacherFilter}
                onChange={(e) => {
                  setTeacherFilter(e.target.value);
                  setPage(0);
                }}
              >
                <option value="all">Tất cả giáo viên</option>
                {teachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.name}
                  </option>
                ))}
              </select>
              <select
                aria-label="Sắp xếp"
                value={sortKey}
                onChange={(e) => setSortKey(e.target.value as SortKey)}
              >
                <option value="newest">Sắp xếp: Mới nhất</option>
                <option value="name">Sắp xếp: Tên A–Z</option>
                <option value="fill">Sắp xếp: Lấp đầy</option>
              </select>
              <span className="ops-courses__range" title="Khoảng demo">
                {COURSES_DATE_RANGE.label}
              </span>
            </div>

            <div className="ops-table-wrap">
              <table className="ops-table">
                <caption className="ops-sr">Danh sách khóa học</caption>
                <thead>
                  <tr>
                    <th scope="col">Khóa học</th>
                    <th scope="col">Cấp độ</th>
                    <th scope="col">Giáo viên</th>
                    <th scope="col">Lịch học</th>
                    <th scope="col">Học viên</th>
                    <th scope="col">Tuyển sinh</th>
                    <th scope="col">Trạng thái</th>
                    <th scope="col">
                      <span className="ops-sr">Thao tác</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paged.map((course) => {
                    const status = courseStatus(course);
                    const chip = courseChip(status);
                    const pct = Math.round((course.studentIds.length / Math.max(1, course.capacity)) * 100);
                    const current = course.id === selectedId;
                    const lead = teachers.find((t) => t.id === course.teacherIds[0]);
                    return (
                      <tr
                        key={course.id}
                        className={current ? "ops-table__row ops-table__row--on" : "ops-table__row"}
                        onClick={() => onSelect(course.id)}
                      >
                        <th scope="row">
                          <div className="ops-table__course">
                            <span className="ops-thumb" aria-hidden>
                              {course.name.slice(0, 1)}
                            </span>
                            <span>
                              <span className="ops-table__name">{course.name}</span>
                              <span className="ops-table__id">{demoCourseCode(course.id, course.name)}</span>
                            </span>
                          </div>
                        </th>
                        <td>
                          <span className={levelClass(course.level)}>{course.level}</span>
                        </td>
                        <td>
                          <span className="ops-table__who">
                            <span className="ops-mini-av" aria-hidden>
                              {initials(lead?.name ?? "?")}
                            </span>
                            {teacherNames(teachers, course.teacherIds)}
                          </span>
                        </td>
                        <td>
                          {weekdayLabelList(course.schedule.weekdays)}
                          <span className="ops-table__id">
                            {course.schedule.startTime}–{course.schedule.endTime}
                          </span>
                        </td>
                        <td>
                          <span className="ops-table__fill">
                            {course.studentIds.length}/{course.capacity}
                          </span>
                          <span className="ops-meter ops-meter--inline" aria-hidden>
                            <span style={{ width: `${Math.min(100, pct)}%` }} />
                          </span>
                        </td>
                        <td>
                          <time dateTime={course.enrollStart}>{formatViDate(course.enrollStart)}</time>
                          <span className="ops-table__id">
                            → <time dateTime={course.enrollEnd}>{formatViDate(course.enrollEnd)}</time>
                          </span>
                        </td>
                        <td>
                          <StatusChip tone={chip.tone}>{COURSE_STATUS_LABEL[status]}</StatusChip>
                        </td>
                        <td onClick={(event) => event.stopPropagation()}>
                          <div className="ops-table__acts">
                            <button type="button" className="ops-table__detail" onClick={() => onSelect(course.id)}>
                              Chi tiết
                            </button>
                            <MoreMenu
                              items={[
                                { label: "Sửa", onClick: () => startEdit(course) },
                                { label: "Sinh lớp", onClick: () => onGenerate(course.id) },
                                { label: "Xem lớp", onClick: () => onOpenClasses(course.id) },
                                { label: "Copy mã", onClick: () => copyId(course.id) },
                              ]}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {filtered.length === 0 ? <p className="ops-courses__empty">Không có khóa khớp bộ lọc.</p> : null}
            </div>

            <div className="ops-table-foot">
              <p>
                {filtered.length === 0
                  ? "0 khóa"
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

        <aside className="ops-courses__aside">
          {selected ? (
            <section className="ops-detail ops-courses__detail" aria-labelledby="edu-course-detail">
              <div className="ops-detail__head">
                <div className="ops-detail__head-title">
                  <h2 id="edu-course-detail">{selected.name}</h2>
                  <StatusChip tone={courseChip(courseStatus(selected)).tone}>
                    {COURSE_STATUS_LABEL[courseStatus(selected)]}
                  </StatusChip>
                </div>
                <button type="button" className="ops-detail__close" aria-label="Đóng chi tiết" onClick={() => onSelect(null)}>
                  ×
                </button>
              </div>

              <div className="ops-detail__split">
                <div className="ops-detail__tabs" role="tablist" aria-label="Chi tiết khóa">
                  {(
                    [
                      ["overview", "Tổng quan"],
                      ["classes", `Lớp học (${classCount})`],
                      ["history", "Lịch sử"],
                      ["docs", "Tài liệu"],
                      ["notes", "Ghi chú"],
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
                  {detailTab === "classes" ? (
                    <>
                      <p className="ops-board__note">
                        {classCount}/{selected.schedule.sessionCount} buổi đã sinh từ lịch khóa (seed).
                      </p>
                      <div className="ops-detail__actions">
                        <button className="ops-page__cta" type="button" onClick={() => onOpenClasses(selected.id)}>
                          Mở danh sách lớp
                        </button>
                        <button className="ops-page__ghost" type="button" onClick={() => onGenerate(selected.id)}>
                          Sinh lớp
                        </button>
                      </div>
                    </>
                  ) : null}

                  {detailTab === "history" ? (
                    <ul className="ops-courses__stub-list">
                      <li>24/08 — Sinh lớp từ lịch mẫu</li>
                      <li>20/08 — Cập nhật cửa sổ tuyển sinh</li>
                      <li>01/08 — Tạo khóa · seed demo</li>
                    </ul>
                  ) : null}

                  {detailTab === "docs" ? (
                    <ul className="ops-courses__stub-list">
                      <li>Syllabus_{selected.name.replace(/\s+/g, "_")}.pdf — demo</li>
                      <li>Playlist_Spotify.link — demo</li>
                      <li>Quy_tac_studio.pdf — demo</li>
                    </ul>
                  ) : null}

                  {detailTab === "notes" ? (
                    <ul className="ops-courses__stub-list">
                      <li>{selected.note || "Chưa có ghi chú — demo"}</li>
                      <li>Ghi chú nội bộ studio — Sắp có</li>
                    </ul>
                  ) : null}

                  {detailTab === "overview" ? (
                    <div className="ops-courses__overview">
                      <div className="ops-courses__overview-body">
                        <h3 className="ops-courses__section-title">Tổng quan khóa</h3>
                        <dl className="ops-detail__meta ops-detail__meta--2col">
                          <div>
                            <dt>Tên khóa học</dt>
                            <dd>{selected.name}</dd>
                          </div>
                          <div>
                            <dt>Cấp độ</dt>
                            <dd>
                              <span className={levelClass(selected.level)}>{selected.level}</span>
                            </dd>
                          </div>
                          <div>
                            <dt>Giáo viên</dt>
                            <dd>
                              <span className="ops-table__who">
                                <span className="ops-mini-av" aria-hidden>
                                  {initials(leadTeacher?.name ?? "GV")}
                                </span>
                                {teacherNames(teachers, selected.teacherIds)}
                              </span>
                            </dd>
                          </div>
                          <div>
                            <dt>Thời gian</dt>
                            <dd>
                              {formatViDate(selected.enrollStart)} → {formatViDate(selected.enrollEnd)}
                            </dd>
                          </div>
                          <div>
                            <dt>Lịch học</dt>
                            <dd>
                              {weekdayLabelList(selected.schedule.weekdays)} · {selected.schedule.startTime}–
                              {selected.schedule.endTime}
                            </dd>
                          </div>
                          <div>
                            <dt>Học viên</dt>
                            <dd>
                              {selected.studentIds.length} / {selected.capacity}
                            </dd>
                          </div>
                          <div>
                            <dt>Studio</dt>
                            <dd>{roomLabel(rooms, selected.roomId)}</dd>
                          </div>
                          <div>
                            <dt>Tỷ lệ lấp đầy</dt>
                            <dd>
                              <span className="ops-courses__fill">
                                <span>{fillPct}%</span>
                                <span className="ops-meter" aria-hidden>
                                  <span style={{ width: `${Math.min(100, fillPct)}%` }} />
                                </span>
                              </span>
                            </dd>
                          </div>
                        </dl>

                        <div className="ops-courses__roster-head">
                          <h3 className="ops-courses__section-title">Học viên ({roster.length})</h3>
                          <div className="ops-courses__roster-acts">
                            <button
                              className="ops-page__cta"
                              type="button"
                              onClick={() => document.getElementById("edu-enroll-student")?.focus()}
                            >
                              + Thêm học viên
                            </button>
                            <button className="ops-page__ghost" type="button" onClick={() => onGenerate(selected.id)}>
                              Mở lớp
                            </button>
                            <MoreMenu
                              items={[
                                { label: "Sửa khóa", onClick: () => startEdit(selected) },
                                { label: "Xem lớp", onClick: () => onOpenClasses(selected.id) },
                                { label: "Copy mã", onClick: () => copyId(demoCourseCode(selected.id, selected.name)) },
                              ]}
                            />
                          </div>
                        </div>

                        <div className="ops-courses__roster-table-wrap">
                          <table className="ops-table ops-courses__roster-table">
                            <thead>
                              <tr>
                                <th scope="col">Học viên</th>
                                <th scope="col">SĐT</th>
                                <th scope="col">Điểm danh</th>
                                <th scope="col">Thanh toán</th>
                              </tr>
                            </thead>
                            <tbody>
                              {roster.map((student) => {
                                const demo = demoStudentPay(student.id);
                                return (
                                  <tr key={student.id}>
                                    <th scope="row">
                                      <span className="ops-table__who">
                                        <span className="ops-mini-av" aria-hidden>
                                          {initials(student.name)}
                                        </span>
                                        {student.name}
                                      </span>
                                    </th>
                                    <td>{student.phone || "—"}</td>
                                    <td className="ops-table__fill">{demo.attend}%</td>
                                    <td>
                                      <StatusChip tone={demo.paid ? "paid" : "wait"}>
                                        {demo.paid ? "Đã thanh toán" : "Chưa thanh toán"}
                                      </StatusChip>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                          {roster.length === 0 ? <p className="ops-board__note">Chưa có học viên trên khóa.</p> : null}
                        </div>

                        {candidates.length ? (
                          <form
                            className="ops-courses__enroll"
                            onSubmit={(event) => {
                              event.preventDefault();
                              if (!enrollId) return;
                              onEnroll(selected.id, enrollId);
                              setEnrollId("");
                            }}
                          >
                            <label htmlFor="edu-enroll-student">Thêm học viên vào khóa</label>
                            <select id="edu-enroll-student" value={enrollId} onChange={(e) => setEnrollId(e.target.value)}>
                              <option value="">Chọn học viên…</option>
                              {candidates.map((student) => (
                                <option key={student.id} value={student.id}>
                                  {student.name}
                                </option>
                              ))}
                            </select>
                            <button className="ops-page__cta" type="submit" disabled={!enrollId}>
                              Ghi danh
                            </button>
                          </form>
                        ) : (
                          <p className="ops-wid__note">Không còn học viên trống để thêm.</p>
                        )}
                      </div>

                      <div className="ops-courses__detail-foot">
                        <button className="ops-page__ghost" type="button" disabled title="Demo">
                          Gửi thông báo
                        </button>
                        <button className="ops-page__cta" type="button" onClick={() => startEdit(selected)}>
                          Xem chi tiết
                        </button>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </section>
          ) : (
            <p className="ops-courses__aside-hint">Chọn một khóa trên bảng để xem roster, ghi danh và sinh lớp.</p>
          )}
        </aside>
      </div>
    </section>
  );
}
