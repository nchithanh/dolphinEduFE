"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { COURSE_STATUS_LABEL, courseStatus, coursesForStudent, teacherName } from "../../lib/edu";
import {
  STUDENTS_KPI,
  STUDENTS_SEGMENTS,
  STUDENTS_TREND,
  demoParentPhone,
  demoStudentCode,
  demoStudentStats,
} from "../../lib/students-demo";
import type { DemoCourse, DemoStudent, DemoTeacher } from "../../lib/types";
import { DEMO_TEACHERS } from "../../lib/seed";
import { MoreMenu, copyId } from "./MoreMenu";
import { StatusChip, courseChip } from "./StatusChip";
import "./chrome.css";
import "./EduTable.css";
import "./CustomerList.css";

type CustomerListProps = {
  title: string;
  students: DemoStudent[];
  courses: DemoCourse[];
  teachers?: DemoTeacher[];
  onOpen: (name: string) => void;
  onPromo: () => void;
};

const PAGE_SIZE = 12;

type DetailTab = "overview" | "history" | "attendance" | "payment" | "notes";

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  return parts
    .slice(-2)
    .map((part) => part[0] ?? "")
    .join("")
    .toUpperCase();
}

function TrendChart() {
  const max = Math.max(...STUDENTS_TREND.map((p) => p.v), 1);
  const w = 280;
  const h = 52;
  const pad = 6;
  const pts = STUDENTS_TREND.map((p, i) => {
    const x = pad + (i * (w - pad * 2)) / Math.max(1, STUDENTS_TREND.length - 1);
    const y = h - pad - (p.v / max) * (h - pad * 2);
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg className="ops-clist__trend" viewBox={`0 0 ${w} ${h}`} role="img" aria-label="Xu hướng tuyển sinh 6 tháng">
      <polyline fill="none" stroke="var(--kuct-accent)" strokeWidth="2" points={pts} />
      {STUDENTS_TREND.map((p, i) => {
        const x = pad + (i * (w - pad * 2)) / Math.max(1, STUDENTS_TREND.length - 1);
        const y = h - pad - (p.v / max) * (h - pad * 2);
        return <circle key={p.m} cx={x} cy={y} r="2.25" fill="var(--kuct-accent)" />;
      })}
    </svg>
  );
}

export function CustomerList({
  title,
  students,
  courses,
  teachers = DEMO_TEACHERS,
  onOpen,
  onPromo,
}: CustomerListProps) {
  const [search, setSearch] = useState("");
  const [enrollFilter, setEnrollFilter] = useState<"all" | "enrolled" | "none">("all");
  const [payFilter, setPayFilter] = useState<"all" | "paid" | "unpaid">("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [panelDismissed, setPanelDismissed] = useState(false);
  const [page, setPage] = useState(0);
  const [detailTab, setDetailTab] = useState<DetailTab>("overview");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return students.filter((s) => {
      const enrolled = coursesForStudent(courses, s.id);
      const stats = demoStudentStats(s.id);
      if (enrollFilter === "enrolled" && enrolled.length === 0) return false;
      if (enrollFilter === "none" && enrolled.length > 0) return false;
      if (payFilter === "paid" && !stats.paid) return false;
      if (payFilter === "unpaid" && stats.paid) return false;
      if (!q) return true;
      return `${s.name} ${s.id} ${s.phone} ${enrolled.map((c) => c.name).join(" ")}`.toLowerCase().includes(q);
    });
  }, [students, courses, search, enrollFilter, payFilter]);

  useEffect(() => {
    if (panelDismissed) return;
    if (selectedId && filtered.some((s) => s.id === selectedId)) return;
    setSelectedId(filtered[0]?.id ?? null);
  }, [filtered, selectedId, panelDismissed]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageSafe = Math.min(page, pageCount - 1);
  const paged = filtered.slice(pageSafe * PAGE_SIZE, pageSafe * PAGE_SIZE + PAGE_SIZE);
  const selected = students.find((s) => s.id === selectedId) ?? null;
  const selectedCourses = selected ? coursesForStudent(courses, selected.id) : [];
  const selectedStats = selected ? demoStudentStats(selected.id) : null;
  const primaryCourse = selectedCourses[0] ?? null;
  const primaryTeacher = primaryCourse
    ? teacherName(teachers, primaryCourse.teacherIds[0] ?? "")
    : "—";

  function pickStudent(id: string) {
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
    <section className="ops-clist" aria-labelledby="ops-clist-heading">
      <div className="ops-board__layout ops-clist__layout">
        <div className="ops-board__main ops-clist__main">
          <nav className="ops-crumb" aria-label="Breadcrumb">
            <ol>
              <li>Trang chủ</li>
              <li aria-current="page">{title}</li>
            </ol>
          </nav>
          <div className="ops-page__head">
            <div>
              <h1 id="ops-clist-heading" className="ops-page__title" tabIndex={-1}>
                {title}
              </h1>
              <p className="ops-page__lede">Quản lý hồ sơ, lớp học, điểm danh và học phí</p>
            </div>
            <div className="ops-clist__head-acts">
              <button className="ops-page__cta" type="button" onClick={onPromo}>
                + Thêm học viên
              </button>
              <MoreMenu
                items={[
                  { label: "Ghi danh khóa", onClick: onPromo },
                  { label: "Xuất danh sách", onClick: () => undefined },
                ]}
              />
            </div>
          </div>

          <ul className="ops-kpi-row ops-kpi-row--6">
            {STUDENTS_KPI.map((kpi) => (
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

          <div className="ops-seg">
            <article className="ops-seg__card ops-clist__seg">
              <h2 className="ops-seg__title">Phân khúc học viên</h2>
              <ul className="ops-clist__seg-grid">
                {STUDENTS_SEGMENTS.map((seg) => (
                  <li key={seg.id}>
                    <span className="ops-clist__seg-mark" style={{ "--seg": seg.color } as CSSProperties} aria-hidden />
                    <span className="ops-clist__seg-label">{seg.label}</span>
                    <strong className="ops-clist__seg-count">{seg.count}</strong>
                    <span className="ops-clist__seg-pct">{seg.pct}</span>
                  </li>
                ))}
              </ul>
            </article>
            <article className="ops-seg__card">
              <h2 className="ops-seg__title">Xu hướng tuyển sinh</h2>
              <TrendChart />
              <p className="ops-wid__note">6 tháng gần nhất · demo hardcode</p>
            </article>
          </div>

          <div className="ops-table-card">
            <div className="ops-table-tools">
              <label className="ops-table-search">
                <span className="ops-sr">Tìm học viên</span>
                <input
                  type="search"
                  value={search}
                  placeholder="Tìm kiếm học viên…"
                  onChange={(e) => {
                    setSearch(e.target.value);
                    resetPage();
                  }}
                />
              </label>
              <select
                aria-label="Trạng thái"
                value={enrollFilter}
                onChange={(e) => {
                  setEnrollFilter(e.target.value as "all" | "enrolled" | "none");
                  resetPage();
                }}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="enrolled">Đang học</option>
                <option value="none">Chưa ghi danh</option>
              </select>
              <select
                aria-label="Thanh toán"
                value={payFilter}
                onChange={(e) => {
                  setPayFilter(e.target.value as "all" | "paid" | "unpaid");
                  resetPage();
                }}
              >
                <option value="all">Tất cả thanh toán</option>
                <option value="paid">Đã thanh toán</option>
                <option value="unpaid">Còn nợ</option>
              </select>
              <span className="ops-clist__sort">Sắp xếp: Mới nhất</span>
            </div>

            <div className="ops-table-wrap">
              <table className="ops-table">
                <caption className="ops-sr">Danh sách học viên</caption>
                <thead>
                  <tr>
                    <th scope="col">Học viên</th>
                    <th scope="col">Khóa học</th>
                    <th scope="col">Giáo viên</th>
                    <th scope="col">Chuyên cần</th>
                    <th scope="col">Thanh toán</th>
                    <th scope="col">Liên hệ</th>
                    <th scope="col">Trạng thái</th>
                    <th scope="col">
                      <span className="ops-sr">Thao tác</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paged.map((student) => {
                    const enrolled = coursesForStudent(courses, student.id);
                    const stats = demoStudentStats(student.id);
                    const course = enrolled[0];
                    const teacher = course ? teacherName(teachers, course.teacherIds[0] ?? "") : "—";
                    const current = student.id === selectedId;
                    return (
                      <tr
                        key={student.id}
                        className={current ? "ops-table__row ops-table__row--on" : "ops-table__row"}
                        onClick={() => pickStudent(student.id)}
                      >
                        <th scope="row">
                          <div className="ops-table__course">
                            <span className="ops-mini-av ops-clist__av" aria-hidden>
                              {initials(student.name)}
                            </span>
                            <span>
                              <span className="ops-table__name">{student.name}</span>
                              <span className="ops-table__id">{demoStudentCode(student.id)}</span>
                            </span>
                          </div>
                        </th>
                        <td>
                          {enrolled.length ? (
                            <span className="ops-clist__courses">{enrolled.map((c) => c.name).join(", ")}</span>
                          ) : (
                            <span className="ops-table__id">—</span>
                          )}
                        </td>
                        <td>
                          {course ? (
                            <span className="ops-table__who">
                              <span className="ops-mini-av" aria-hidden>
                                {initials(teacher)}
                              </span>
                              {teacher}
                            </span>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td className="ops-table__fill">{stats.attend}%</td>
                        <td>
                          <StatusChip tone={stats.paid ? "paid" : "wait"}>
                            {stats.paid ? "Đã thanh toán" : "Còn nợ"}
                          </StatusChip>
                        </td>
                        <td>{student.phone || "—"}</td>
                        <td>
                          <StatusChip tone={enrolled.length ? "track" : "wait"}>
                            {enrolled.length ? "Đang học" : "Chưa ghi danh"}
                          </StatusChip>
                        </td>
                        <td onClick={(event) => event.stopPropagation()}>
                          <div className="ops-table__acts">
                            <button type="button" className="ops-table__detail" onClick={() => onOpen(student.name)}>
                              Hồ sơ
                            </button>
                            <MoreMenu
                              items={[
                                { label: "Xem hồ sơ", onClick: () => onOpen(student.name) },
                                { label: "Ghi danh khóa", onClick: onPromo },
                                { label: "Copy mã", onClick: () => copyId(demoStudentCode(student.id)) },
                              ]}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {filtered.length === 0 ? <p className="ops-table-empty">Không có học viên khớp bộ lọc.</p> : null}
            </div>

            <div className="ops-table-foot">
              <p>
                {filtered.length === 0
                  ? "0 học viên"
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

        <aside className="ops-clist__aside">
          {selected && selectedStats ? (
            <section className="ops-detail ops-clist__detail" aria-labelledby="edu-student-detail">
              <div className="ops-detail__head">
                <div className="ops-detail__head-title">
                  <h2 id="edu-student-detail">Chi tiết học viên</h2>
                </div>
                <button type="button" className="ops-detail__close" aria-label="Đóng chi tiết" onClick={closePanel}>
                  ×
                </button>
              </div>

              <div className="ops-clist__profile">
                <span className="ops-thumb ops-thumb--lg" aria-hidden>
                  {initials(selected.name)}
                </span>
                <div>
                  <p className="ops-detail__name">{selected.name}</p>
                  <StatusChip tone={selectedCourses.length ? "track" : "wait"}>
                    {selectedCourses.length ? "Đang học" : "Chưa ghi danh"}
                  </StatusChip>
                  <p className="ops-clist__meta-line">
                    {demoStudentCode(selected.id)} · {selectedStats.age} tuổi · {selectedStats.gender}
                  </p>
                </div>
              </div>

              <ul className="ops-clist__stat-grid">
                <li>
                  <span>Khóa hiện tại</span>
                  <strong>{primaryCourse?.name ?? "—"}</strong>
                </li>
                <li>
                  <span>Cấp độ</span>
                  <strong>{primaryCourse?.level ?? "—"}</strong>
                </li>
                <li>
                  <span>Giáo viên</span>
                  <strong>{primaryTeacher}</strong>
                </li>
                <li>
                  <span>Chuyên cần</span>
                  <strong>{selectedStats.attend}%</strong>
                </li>
                <li>
                  <span>Buổi đã học</span>
                  <strong>
                    {selectedStats.done}/{selectedStats.total}
                  </strong>
                </li>
                <li>
                  <span>Thanh toán</span>
                  <strong>{selectedStats.paid ? "Đã TT" : "Còn nợ"}</strong>
                </li>
              </ul>

              <div className="ops-detail__split">
                <div className="ops-detail__tabs" role="tablist" aria-label="Chi tiết học viên">
                  {(
                    [
                      ["overview", "Tổng quan"],
                      ["history", "Lịch sử lớp"],
                      ["attendance", "Điểm danh"],
                      ["payment", "Thanh toán"],
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
                  {detailTab === "history" ? (
                    <ul className="ops-clist__stub-list">
                      {selectedCourses.length ? (
                        selectedCourses.map((c) => (
                          <li key={c.id}>
                            {c.name} · {COURSE_STATUS_LABEL[courseStatus(c)]}
                          </li>
                        ))
                      ) : (
                        <li>Chưa có lịch sử lớp</li>
                      )}
                    </ul>
                  ) : null}

                  {detailTab === "attendance" ? (
                    <ul className="ops-clist__stub-list">
                      <li>Chuyên cần demo — {selectedStats.attend}%</li>
                      <li>
                        Buổi có mặt — {selectedStats.done}/{selectedStats.total}
                      </li>
                      <li>Chi tiết điểm danh — Sắp có</li>
                    </ul>
                  ) : null}

                  {detailTab === "payment" ? (
                    <ul className="ops-clist__stub-list">
                      <li>Trạng thái — {selectedStats.paid ? "Đã thanh toán" : "Còn nợ"}</li>
                      <li>Học phí kỳ này — demo</li>
                      <li>Lịch sử giao dịch — Sắp có</li>
                    </ul>
                  ) : null}

                  {detailTab === "notes" ? (
                    <ul className="ops-clist__stub-list">
                      <li>Ghi chú nội bộ — demo seed</li>
                      <li>Tag: {selectedStats.tags.join(", ")}</li>
                    </ul>
                  ) : null}

                  {detailTab === "overview" ? (
                    <>
                      <h3 className="ops-clist__section-title">Thông tin liên hệ</h3>
                      <dl className="ops-detail__meta ops-detail__meta--2col">
                        <div>
                          <dt>SĐT</dt>
                          <dd>
                            {selected.phone ? (
                              <a href={`tel:${selected.phone.replace(/\s/g, "")}`}>{selected.phone}</a>
                            ) : (
                              "—"
                            )}
                          </dd>
                        </div>
                        <div>
                          <dt>Email</dt>
                          <dd>demo@{selected.id.replace(/[^a-z0-9]/gi, "")}.vn</dd>
                        </div>
                        <div>
                          <dt>Phụ huynh</dt>
                          <dd>{demoParentPhone(selected.id)}</dd>
                        </div>
                        <div>
                          <dt>Địa chỉ</dt>
                          <dd>Quận 1 · TP.HCM (demo)</dd>
                        </div>
                      </dl>

                      <h3 className="ops-clist__section-title">Ghi chú &amp; tag</h3>
                      <p className="ops-board__note">Học viên seed · cập nhật qua Ask Dolphin khi ghi danh.</p>
                      <ul className="ops-clist__tags">
                        {selectedStats.tags.map((tag) => (
                          <li key={tag}>{tag}</li>
                        ))}
                      </ul>

                      <h3 className="ops-clist__section-title">Thao tác nhanh</h3>
                      <div className="ops-clist__quick">
                        <button className="ops-page__cta" type="button" onClick={onPromo}>
                          Thêm vào lớp
                        </button>
                        <button className="ops-page__ghost" type="button" disabled title="Demo">
                          Gửi thông báo
                        </button>
                        <button className="ops-page__ghost" type="button" onClick={() => setDetailTab("notes")}>
                          Ghi chú
                        </button>
                        <button className="ops-page__ghost" type="button" onClick={() => onOpen(selected.name)}>
                          Hồ sơ 360
                        </button>
                      </div>

                      <h3 className="ops-clist__section-title">Các lớp đang học ({selectedCourses.length})</h3>
                      {selectedCourses.length ? (
                        <ul className="ops-clist__class-list">
                          {selectedCourses.map((course) => {
                            const status = courseStatus(course);
                            const fill = Math.round((course.studentIds.length / Math.max(1, course.capacity)) * 100);
                            return (
                              <li key={course.id}>
                                <div>
                                  <span className="ops-roster__name">{course.name}</span>
                                  <span className="ops-roster__phone">
                                    {teacherName(teachers, course.teacherIds[0] ?? "")} ·{" "}
                                    <StatusChip tone={courseChip(status).tone}>{COURSE_STATUS_LABEL[status]}</StatusChip>
                                  </span>
                                </div>
                                <span className="ops-clist__class-fill">
                                  {fill}%
                                  <span className="ops-meter" aria-hidden>
                                    <span style={{ width: `${Math.min(100, fill)}%` }} />
                                  </span>
                                </span>
                              </li>
                            );
                          })}
                        </ul>
                      ) : (
                        <p className="ops-board__note">Chưa ghi danh khóa nào.</p>
                      )}
                    </>
                  ) : null}
                </div>
              </div>
            </section>
          ) : (
            <p className="ops-aside-hint">Chọn một học viên để xem hồ sơ, chuyên cần và học phí demo.</p>
          )}
        </aside>
      </div>
    </section>
  );
}
