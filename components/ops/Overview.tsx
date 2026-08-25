"use client";

import { useMemo } from "react";
import {
  DASH_ACTIVITY,
  DASH_AI,
  DASH_KPI,
  DASH_LOW_ATTEND,
  DASH_REVENUE_POINTS,
  DASH_TASKS,
  DASH_TUITION,
  DASH_TUITION_TOTAL,
} from "../../lib/dashboard-demo";
import { formatViDate, localIsoDate } from "../../lib/edu";
import type { DemoClass, DemoCourse, DemoRoom, DemoStudent, DemoTeacher, Stage } from "../../lib/types";
import "./chrome.css";
import "./EduTable.css";
import "./Overview.css";

type OverviewProps = {
  title: string;
  courses: DemoCourse[];
  classes: DemoClass[];
  students: DemoStudent[];
  teachers: DemoTeacher[];
  rooms: DemoRoom[];
  onOpen: (id: Stage) => void;
};

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

function RevenueChart() {
  const w = 560;
  const h = 140;
  const pad = { t: 8, r: 6, b: 8, l: 6 };
  const maxY = 1500;
  const yTicks = [0, 500, 1000, 1500] as const;
  const pts = DASH_REVENUE_POINTS;
  const innerW = w - pad.l - pad.r;
  const innerH = h - pad.t - pad.b;

  function xy(i: number, v: number) {
    const x = pad.l + (i / Math.max(1, pts.length - 1)) * innerW;
    const y = pad.t + (1 - v / maxY) * innerH;
    return { x, y };
  }

  const actual = pts.map((p, i) => xy(i, p.actual));
  const forecast = pts.map((p, i) => xy(i, p.forecast));
  const line = (points: { x: number; y: number }[]) =>
    points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const area =
    actual.length > 0
      ? `${line(actual)} L${actual[actual.length - 1].x.toFixed(1)},${(pad.t + innerH).toFixed(1)} L${actual[0].x.toFixed(1)},${(pad.t + innerH).toFixed(1)} Z`
      : "";

  const yLabel = (tick: number) => (tick === 0 ? "0" : `${tick / 1000}B`);
  const yTop = (tick: number) => `${((pad.t + (1 - tick / maxY) * innerH) / h) * 100}%`;

  return (
    <div className="ops-over__chart-frame" role="img" aria-label="Biểu đồ doanh thu demo">
      <div className="ops-over__chart-y" aria-hidden>
        {yTicks.map((tick) => (
          <span key={tick} className="ops-over__chart-y-lab" style={{ top: yTop(tick) }}>
            {yLabel(tick)}
          </span>
        ))}
      </div>
      <svg className="ops-over__chart" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id="ops-over-rev-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--kuct-accent)" stopOpacity="0.28" />
            <stop offset="100%" stopColor="var(--kuct-accent)" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {yTicks.map((tick) => {
          const y = pad.t + (1 - tick / maxY) * innerH;
          return <line key={tick} x1={pad.l} x2={w - pad.r} y1={y} y2={y} className="ops-over__chart-grid" />;
        })}
        {area ? <path d={area} fill="url(#ops-over-rev-fill)" stroke="none" /> : null}
        <path d={line(forecast)} className="ops-over__chart-forecast" fill="none" />
        <path d={line(actual)} className="ops-over__chart-actual" fill="none" />
        {actual.map((p, i) => (
          <circle key={pts[i].m} cx={p.x} cy={p.y} r={2.75} className="ops-over__chart-dot" />
        ))}
      </svg>
      <div className="ops-over__chart-x" aria-hidden>
        {pts.map((p) => (
          <span key={p.m}>{p.m}</span>
        ))}
      </div>
    </div>
  );
}

export function Overview({ title, courses, classes, students: _students, teachers, rooms, onOpen }: OverviewProps) {
  const today = localIsoDate();
  const todayClasses = useMemo(
    () =>
      [...classes]
        .filter((row) => row.date === today && !row.cancelled)
        .sort((a, b) => a.startTime.localeCompare(b.startTime)),
    [classes, today],
  );

  const freeRooms = rooms.filter((room) => !todayClasses.some((row) => row.roomId === room.id));

  const demoTodayRows = useMemo(() => {
    if (todayClasses.length >= 3) {
      return todayClasses.map((row) => {
        const fillN = row.studentIds.length;
        return {
          id: row.id,
          time: row.startTime,
          name: courses.find((c) => c.id === row.courseId)?.name ?? row.courseId,
          room: roomLabel(rooms, row.roomId),
          fill: `${fillN}/${row.capacity}`,
          full: fillN >= row.capacity,
        };
      });
    }
    return [
      { id: "d1", time: "08:30", name: "Kids Stretch", room: "P.Kids", fill: "8/10", full: false },
      { id: "d2", time: "10:00", name: "Ballet Beginner", room: "P.A", fill: "9/12", full: false },
      { id: "d3", time: "17:00", name: "Heels", room: "P.102", fill: "10/12", full: false },
      { id: "d4", time: "19:00", name: "Hip-hop Open", room: "P.101", fill: "16/16", full: true },
      { id: "d5", time: "20:30", name: "Open Practice TD", room: "P.Open", fill: "7/20", full: false },
    ];
  }, [todayClasses, courses, rooms]);

  const roomSlots = ["09:00–11:00", "11:30–13:00", "14:00–16:00", "16:30–18:00", "19:00–21:00"];

  return (
    <section className="ops-over" aria-labelledby="ops-over-heading">
      <nav className="ops-crumb" aria-label="Breadcrumb">
        <ol>
          <li>Trang chủ</li>
          <li aria-current="page">{title}</li>
        </ol>
      </nav>
      <div className="ops-page__head">
        <div>
          <h1 id="ops-over-heading" className="ops-page__title" tabIndex={-1}>
            {title}
          </h1>
          <p className="ops-page__lede">
            Tổng quan hoạt động vận hành trung tâm ngày{" "}
            <time dateTime={today}>{formatViDate(today)}</time>.
          </p>
        </div>
        <div className="ops-over__head-actions">
          <span className="ops-over__date-chip">
            <time dateTime={today}>{formatViDate(today)}</time>
          </span>
          <button className="ops-page__cta" type="button" onClick={() => onOpen("reports")}>
            Báo cáo nhanh
          </button>
        </div>
      </div>

      <ul className="ops-kpi-row ops-kpi-row--6">
        {DASH_KPI.map((kpi) => (
          <li key={kpi.id}>
            <button type="button" className={`ops-kpi-card ops-kpi-card--btn ops-over__kpi ops-over__kpi--${kpi.tone}`} onClick={() => onOpen(kpi.go)}>
              <span className="ops-over__kpi-body">
                <span className="ops-kpi-card__k">{kpi.label}</span>
                <p className="ops-kpi-card__v">{kpi.value}</p>
                <p className={kpi.up ? "ops-kpi-card__trend ops-kpi-card__trend--up" : "ops-kpi-card__trend ops-kpi-card__trend--down"}>
                  {kpi.trend} <span>so với tháng trước</span>
                </p>
              </span>
              <span className="ops-over__kpi-ico" aria-hidden>
                {kpi.ico}
              </span>
            </button>
          </li>
        ))}
      </ul>

      <div className="ops-over__mid ops-over__mid--chart">
        <section className="ops-table-card ops-over__panel" aria-labelledby="ops-over-rev">
          <div className="ops-over__table-head">
            <h2 id="ops-over-rev" className="ops-over__table-title">
              Doanh thu
            </h2>
            <div className="ops-over__chart-tools">
              <select aria-label="Loại biểu đồ" defaultValue="rev" className="ops-over__select">
                <option value="rev">Doanh thu</option>
                <option value="enroll">Ghi danh</option>
              </select>
              <select aria-label="Khoảng thời gian" defaultValue="month" className="ops-over__select">
                <option value="month">Tháng này</option>
                <option value="week">Tuần này</option>
              </select>
              <div className="ops-over__chart-legend">
                <span>
                  <i className="ops-over__leg ops-over__leg--actual" aria-hidden /> Doanh thu (VND)
                </span>
                <span>
                  <i className="ops-over__leg ops-over__leg--forecast" aria-hidden /> Doanh thu dự kiến
                </span>
              </div>
            </div>
          </div>
          <div className="ops-over__chart-wrap">
            <RevenueChart />
          </div>
        </section>

        <section className="ops-table-card ops-over__panel" aria-labelledby="ops-over-tasks">
          <div className="ops-over__table-head">
            <h2 id="ops-over-tasks" className="ops-over__table-title">
              Việc cần xử lý hôm nay
            </h2>
          </div>
          <ul className="ops-over__tasks">
            {DASH_TASKS.map((task) => (
              <li key={task.id}>
                <button type="button" className="ops-over__task" onClick={() => onOpen(task.go)}>
                  <span className="ops-over__task-time">{task.time}</span>
                  <span className="ops-over__task-copy">
                    <span className="ops-over__task-title">{task.title}</span>
                    <span className="ops-over__task-hint">{task.hint}</span>
                  </span>
                  <span className={`ops-over__prio ops-over__prio--${task.tone}`}>
                    {task.tone === "high" ? "Cao" : task.tone === "mid" ? "Trung bình" : "Thấp"}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="ops-over__five">
        <section className="ops-table-card" aria-labelledby="ops-over-today">
          <div className="ops-over__table-head">
            <h2 id="ops-over-today" className="ops-over__table-title">
              Lớp học hôm nay <span className="ops-over__count">({demoTodayRows.length || 42})</span>
            </h2>
            <button type="button" className="ops-table__detail" onClick={() => onOpen("classes")}>
              Xem tất cả
            </button>
          </div>
          <ul className="ops-over__list">
            {demoTodayRows.map((row) => (
              <li key={row.id}>
                <button type="button" className="ops-over__row ops-over__row--class" onClick={() => onOpen("classes")}>
                  <span className="ops-over__time">{row.time}</span>
                  <span className="ops-over__row-main">
                    <span className="ops-table__name">{row.name}</span>
                  </span>
                  <span className="ops-over__room-pill">{row.room}</span>
                  <span className={row.full ? "ops-over__fill ops-over__fill--full" : "ops-over__fill"}>{row.fill}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section className="ops-table-card" aria-labelledby="ops-over-pay">
          <div className="ops-over__table-head">
            <h2 id="ops-over-pay" className="ops-over__table-title">
              Học phí chờ thu <span className="ops-over__count">({DASH_TUITION.length})</span>
            </h2>
            <button type="button" className="ops-table__detail" onClick={() => onOpen("payment")}>
              Xem tất cả
            </button>
          </div>
          <ul className="ops-over__list">
            {DASH_TUITION.map((row) => (
              <li key={row.id}>
                <button type="button" className="ops-over__row ops-over__row--pay" onClick={() => onOpen("payment")}>
                  <span className="ops-table__name">{row.name}</span>
                  <span className="ops-over__money">{row.amount}</span>
                  <span className="ops-over__due">{row.due}</span>
                </button>
              </li>
            ))}
          </ul>
          <p className="ops-over__total">
            <span>Tổng cộng</span>
            <strong>{DASH_TUITION_TOTAL}</strong>
          </p>
        </section>

        <section className="ops-table-card" aria-labelledby="ops-over-att">
          <div className="ops-over__table-head">
            <h2 id="ops-over-att" className="ops-over__table-title">
              Lớp có tỉ lệ đi học thấp <span className="ops-over__count">({DASH_LOW_ATTEND.length})</span>
            </h2>
            <button type="button" className="ops-table__detail" onClick={() => onOpen("classes")}>
              Xem tất cả
            </button>
          </div>
          <ul className="ops-over__list">
            {DASH_LOW_ATTEND.map((row) => (
              <li key={row.id}>
                <button type="button" className="ops-over__row" onClick={() => onOpen("classes")}>
                  <span className="ops-table__name">{row.name}</span>
                  <span className="ops-over__pct">{row.pct}%</span>
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section className="ops-table-card" aria-labelledby="ops-over-teachers">
          <div className="ops-over__table-head">
            <h2 id="ops-over-teachers" className="ops-over__table-title">
              Giáo viên hôm nay
            </h2>
            <button type="button" className="ops-table__detail" onClick={() => onOpen("teachers")}>
              Xem tất cả
            </button>
          </div>
          <ul className="ops-over__list">
            {teachers.map((teacher) => {
              const n = todayClasses.filter((row) => row.teacherId === teacher.id).length;
              const busy = n > 0 || teacher.id === "mai" || teacher.id === "ha";
              const sessions = n || (busy ? (teacher.id === "mai" ? 4 : 2) : 0);
              return (
                <li key={teacher.id}>
                  <button type="button" className="ops-over__row ops-over__row--teacher" onClick={() => onOpen("teachers")}>
                    <span className="ops-mini-av" aria-hidden>
                      {initials(teacher.name)}
                    </span>
                    <span className="ops-over__row-main">
                      <span className="ops-table__name">{teacher.name}</span>
                      <span className="ops-table__id">{sessions} lớp</span>
                    </span>
                    <span className={busy ? "ops-over__dot ops-over__dot--busy" : "ops-over__dot ops-over__dot--free"}>
                      <i aria-hidden />
                      {busy ? "Bận" : "Rảnh"}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="ops-table-card" aria-labelledby="ops-over-rooms">
          <div className="ops-over__table-head">
            <h2 id="ops-over-rooms" className="ops-over__table-title">
              Phòng học trống
            </h2>
            <button type="button" className="ops-table__detail" onClick={() => onOpen("classrooms")}>
              Xem tất cả
            </button>
          </div>
          <ul className="ops-over__list">
            {(freeRooms.length ? freeRooms : rooms).slice(0, 5).map((room, i) => (
              <li key={room.id}>
                <button type="button" className="ops-over__row ops-over__row--room" onClick={() => onOpen("classrooms")}>
                  <span className="ops-table__name">{room.label}</span>
                  <span className="ops-over__slot-pill">{roomSlots[i % roomSlots.length]}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="ops-over__mid ops-over__mid--foot">        <section className="ops-table-card ops-over__panel" aria-labelledby="ops-over-act">
          <div className="ops-over__table-head">
            <h2 id="ops-over-act" className="ops-over__table-title">
              Hoạt động gần đây
            </h2>
            <button type="button" className="ops-table__detail" onClick={() => onOpen("overview")}>
              Xem tất cả
            </button>
          </div>
          <ol className="ops-over__timeline">
            {DASH_ACTIVITY.map((ev) => (
              <li key={ev.id}>
                <span className="ops-over__tl-dot" aria-hidden />
                <time className="ops-over__tl-clock" dateTime={ev.time}>
                  {ev.time}
                </time>
                <p className="ops-over__tl-text">
                  <strong>{ev.who}</strong> {ev.verb} <strong>{ev.focus}</strong>
                </p>
                <span className={`ops-over__tag ops-over__tag--${ev.tone}`}>{ev.tag}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="ops-table-card ops-over__panel" aria-labelledby="ops-over-ai">
          <div className="ops-over__table-head">
            <h2 id="ops-over-ai" className="ops-over__table-title">
              <span className="ops-over__ai-ico" aria-hidden>
                ✦
              </span>
              Gợi ý từ AI
            </h2>
          </div>
          <ul className="ops-over__ai ops-over__ai--row">
            {DASH_AI.map((item) => (
              <li key={item.id}>
                <button type="button" className="ops-over__ai-tile ops-over__ai-tile--card" onClick={() => onOpen(item.go)}>
                  <span className="ops-over__ai-title">{item.title}</span>
                  <span className="ops-over__ai-hint">{item.hint}</span>
                  <span className="ops-over__ai-chev" aria-hidden>
                    ›
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </section>
  );
}
