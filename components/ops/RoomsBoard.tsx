"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { CLASS_STATUS_LABEL, classStatus, formatViDate, localIsoDate } from "../../lib/edu";
import { ALL_BRANCH_ID, DEMO_BRANCHES, branchName } from "../../lib/branch";
import {
  ROOMS_KPI,
  ROOMS_USAGE,
  demoRoomCode,
  demoRoomStats,
  roomStatusLabel,
  roomStatusTone,
  type RoomUiStatus,
} from "../../lib/rooms-demo";
import type { DemoClass, DemoCourse, DemoRoom } from "../../lib/types";
import { MoreMenu, copyId } from "./MoreMenu";
import { StatusChip, classChip } from "./StatusChip";
import "./chrome.css";
import "./EduTable.css";
import "./RoomsBoard.css";

type RoomsBoardProps = {
  title: string;
  rooms: DemoRoom[];
  classes: DemoClass[];
  courses: DemoCourse[];
  branchId: string;
  onChange: (next: DemoRoom[]) => void;
  onPromo: () => void;
};

type Draft = {
  label: string;
  note: string;
  branchId: string;
};

type DetailTab = "overview" | "schedule" | "history" | "maint";
type StatusFilter = "all" | RoomUiStatus;

const EMPTY: Draft = { label: "", note: "", branchId: DEMO_BRANCHES[0]?.id ?? "br-q1" };
const PAGE_SIZE = 8;

function courseName(courses: DemoCourse[], id: string): string {
  return courses.find((c) => c.id === id)?.name ?? id;
}

function resolveRoomStatus(room: DemoRoom, todayRows: DemoClass[]): RoomUiStatus {
  const stats = demoRoomStats(room.id);
  if (stats.maintenance || !room.active) return "maint";
  if (todayRows.some((row) => classStatus(row) === "ongoing")) return "busy";
  if (todayRows.some((row) => classStatus(row) === "upcoming")) return "soon";
  return "free";
}

export function RoomsBoard({ title, rooms, classes, courses, branchId, onChange, onPromo }: RoomsBoardProps) {
  const dateIso = localIsoDate();
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [editId, setEditId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [panelDismissed, setPanelDismissed] = useState(false);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [page, setPage] = useState(0);
  const [detailTab, setDetailTab] = useState<DetailTab>("overview");

  const scoped = useMemo(
    () => rooms.filter((r) => (branchId === ALL_BRANCH_ID ? true : r.branchId === branchId)),
    [rooms, branchId],
  );

  function todayIn(roomId: string): DemoClass[] {
    return classes
      .filter((row) => row.roomId === roomId && row.date === dateIso && !row.cancelled)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return scoped.filter((room) => {
      const today = todayIn(room.id);
      const status = resolveRoomStatus(room, today);
      const stats = demoRoomStats(room.id);
      if (statusFilter !== "all" && status !== statusFilter) return false;
      if (typeFilter !== "all" && stats.type !== typeFilter) return false;
      if (!q) return true;
      return `${room.label} ${room.id} ${room.note ?? ""} ${branchName(room.branchId)} ${stats.area} ${stats.type}`
        .toLowerCase()
        .includes(q);
    });
  }, [scoped, query, statusFilter, typeFilter, classes, dateIso]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageSafe = Math.min(page, pageCount - 1);
  const paged = filtered.slice(pageSafe * PAGE_SIZE, pageSafe * PAGE_SIZE + PAGE_SIZE);

  useEffect(() => {
    if (panelDismissed) return;
    if (selectedId && filtered.some((r) => r.id === selectedId)) return;
    if (filtered[0]) setSelectedId(filtered[0].id);
  }, [filtered, selectedId, panelDismissed]);

  const selected = rooms.find((r) => r.id === selectedId) ?? null;
  const selectedToday = selected ? todayIn(selected.id) : [];
  const selectedStats = selected ? demoRoomStats(selected.id) : null;
  const selectedStatus = selected ? resolveRoomStatus(selected, selectedToday) : null;

  const typeOptions = useMemo(() => {
    const set = new Set(scoped.map((r) => demoRoomStats(r.id).type));
    return [...set];
  }, [scoped]);

  const spanHours = ROOMS_USAGE.endHour - ROOMS_USAGE.startHour;
  const nowPct = Math.min(
    100,
    Math.max(0, ((ROOMS_USAGE.nowHour - ROOMS_USAGE.startHour) / spanHours) * 100),
  );

  function resetPage() {
    setPage(0);
  }

  function pickRoom(id: string) {
    setSelectedId(id);
    setPanelDismissed(false);
    setDetailTab("overview");
  }

  function closePanel() {
    setSelectedId(null);
    setPanelDismissed(true);
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    const label = draft.label.trim();
    if (!label) return;

    if (editId) {
      onChange(rooms.map((r) => (r.id === editId ? { ...r, label, note: draft.note.trim() || undefined } : r)));
    } else {
      const attached = branchId === ALL_BRANCH_ID ? draft.branchId || DEMO_BRANCHES[0]?.id || "br-q1" : branchId;
      const next = {
        id: `p-${Date.now().toString(36).slice(-5)}`,
        label,
        branchId: attached,
        active: true,
        note: draft.note.trim() || undefined,
      };
      onChange([...rooms, next]);
      pickRoom(next.id);
    }
    setDraft(EMPTY);
    setEditId(null);
    setShowForm(false);
  }

  function startEdit(room: DemoRoom) {
    setEditId(room.id);
    pickRoom(room.id);
    setDraft({ label: room.label, note: room.note ?? "", branchId: room.branchId });
    setShowForm(true);
  }

  function startCreate() {
    setEditId(null);
    setDraft(EMPTY);
    setShowForm(true);
  }

  function currentClass(rows: DemoClass[]): DemoClass | undefined {
    return rows.find((row) => classStatus(row) === "ongoing") ?? rows.find((row) => classStatus(row) === "upcoming");
  }

  function nextClass(rows: DemoClass[]): DemoClass | undefined {
    const upcoming = rows.filter((row) => classStatus(row) === "upcoming");
    if (rows.some((row) => classStatus(row) === "ongoing")) return upcoming[0];
    return upcoming[1];
  }

  return (
    <section className="ops-rooms" aria-labelledby="ops-rooms-heading">
      <div className="ops-board__layout ops-rooms__layout">
        <div className="ops-board__main ops-rooms__main">
          <nav className="ops-crumb" aria-label="Breadcrumb">
            <ol>
              <li>Trang chủ</li>
              <li aria-current="page">{title}</li>
            </ol>
          </nav>
          <div className="ops-page__head">
            <div>
              <h1 id="ops-rooms-heading" className="ops-page__title" tabIndex={-1}>
                {title}
              </h1>
              <p className="ops-page__lede">
                Quản lý phòng tập, lịch sử dụng và bảo trì ·{" "}
                <time dateTime={dateIso}>{formatViDate(dateIso)}</time>
              </p>
            </div>
            <button className="ops-page__cta" type="button" onClick={startCreate}>
              + Thêm phòng
            </button>
          </div>

          <ul className="ops-kpi-row ops-kpi-row--6">
            {ROOMS_KPI.map((kpi) => (
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

          <section className="ops-rooms__usage" aria-labelledby="ops-rooms-usage-title">
            <h2 id="ops-rooms-usage-title" className="ops-rooms__usage-title">
              Tổng quan sử dụng hôm nay
            </h2>
            <div className="ops-rooms__usage-bar" role="img" aria-label="Mật độ sử dụng phòng từ 06:00 đến 22:00">
              {ROOMS_USAGE.segments.map((seg) => {
                const width = ((seg.to - seg.from) / spanHours) * 100;
                return (
                  <span
                    key={seg.id}
                    className={`ops-rooms__usage-seg ops-rooms__usage-seg--${seg.tone}`}
                    style={{ width: `${width}%` }}
                    title={`${seg.label}: ${String(seg.from).padStart(2, "0")}:00–${String(seg.to).padStart(2, "0")}:00`}
                  />
                );
              })}
              <span className="ops-rooms__usage-now" style={{ left: `${nowPct}%` }} title="17:15">
                <i />
                <em>17:15</em>
              </span>
            </div>
            <div className="ops-rooms__usage-scale" aria-hidden>
              <span>06:00</span>
              <span>10:00</span>
              <span>14:00</span>
              <span>18:00</span>
              <span>22:00</span>
            </div>
          </section>

          {showForm ? (
            <form className="ops-rooms__form" onSubmit={submit}>
              <h2 className="ops-rooms__form-title">{editId ? "Sửa phòng" : "Thêm phòng tập"}</h2>
              <div className="ops-rooms__form-grid">
                <p className="ops-book__field">
                  <label htmlFor="ops-room-label">Tên</label>
                  <input
                    id="ops-room-label"
                    value={draft.label}
                    onChange={(e) => setDraft((d) => ({ ...d, label: e.target.value }))}
                    placeholder="VD. Studio 4"
                    autoComplete="off"
                    required
                  />
                </p>
                <p className="ops-book__field">
                  <label htmlFor="ops-room-note">Ghi chú</label>
                  <input
                    id="ops-room-note"
                    value={draft.note}
                    onChange={(e) => setDraft((d) => ({ ...d, note: e.target.value }))}
                    autoComplete="off"
                  />
                </p>
                {branchId === ALL_BRANCH_ID && !editId ? (
                  <p className="ops-book__field">
                    <label htmlFor="ops-room-branch">Chi nhánh</label>
                    <select
                      id="ops-room-branch"
                      value={draft.branchId}
                      onChange={(e) => setDraft((d) => ({ ...d, branchId: e.target.value }))}
                    >
                      {DEMO_BRANCHES.map((branch) => (
                        <option key={branch.id} value={branch.id}>
                          {branch.name}
                        </option>
                      ))}
                    </select>
                  </p>
                ) : null}
              </div>
              <div className="ops-rooms__form-actions">
                <button
                  type="button"
                  className="ops-page__ghost"
                  onClick={() => {
                    setShowForm(false);
                    setEditId(null);
                    setDraft(EMPTY);
                  }}
                >
                  Đóng
                </button>
                <button className="ops-page__cta" type="submit">
                  {editId ? "Lưu" : "Thêm"}
                </button>
              </div>
            </form>
          ) : null}

          <div className="ops-table-card">
            <div className="ops-table-tools">
              <label className="ops-table-search">
                <span className="ops-sr">Tìm phòng</span>
                <input
                  type="search"
                  value={query}
                  placeholder="Tìm tên hoặc mã phòng…"
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
                  setStatusFilter(e.target.value as StatusFilter);
                  resetPage();
                }}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="busy">Đang sử dụng</option>
                <option value="free">Trống</option>
                <option value="soon">Sắp có lịch</option>
                <option value="maint">Bảo trì</option>
              </select>
              <select
                aria-label="Loại phòng"
                value={typeFilter}
                onChange={(e) => {
                  setTypeFilter(e.target.value);
                  resetPage();
                }}
              >
                <option value="all">Tất cả loại</option>
                {typeOptions.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <span className="ops-rooms__sort">Sắp xếp: Tên A–Z</span>
            </div>

            <div className="ops-table-wrap">
              <table className="ops-table">
                <caption className="ops-sr">Danh sách phòng tập</caption>
                <thead>
                  <tr>
                    <th scope="col">Phòng</th>
                    <th scope="col">Khu</th>
                    <th scope="col">Sức chứa</th>
                    <th scope="col">Thiết bị</th>
                    <th scope="col">Trạng thái</th>
                    <th scope="col">Lịch hiện tại</th>
                    <th scope="col">Ca kế</th>
                    <th scope="col">Lấp đầy</th>
                    <th scope="col">
                      <span className="ops-sr">Thao tác</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paged.map((room) => {
                    const rows = todayIn(room.id);
                    const stats = demoRoomStats(room.id);
                    const status = resolveRoomStatus(room, rows);
                    const cur = currentClass(rows);
                    const nxt = nextClass(rows);
                    const current = room.id === selectedId;
                    return (
                      <tr
                        key={room.id}
                        className={
                          current
                            ? "ops-table__row ops-table__row--on"
                            : status === "maint"
                              ? "ops-table__row ops-rooms__dim-row"
                              : "ops-table__row"
                        }
                        onClick={() => pickRoom(room.id)}
                      >
                        <th scope="row">
                          <div className="ops-table__course">
                            <span className="ops-thumb" aria-hidden>
                              {room.label.slice(0, 1)}
                            </span>
                            <span>
                              <span className="ops-table__name">{room.label}</span>
                              <span className="ops-table__id">
                                {demoRoomCode(room.id)} · {stats.type}
                              </span>
                            </span>
                          </div>
                        </th>
                        <td>
                          {stats.area}
                          <span className="ops-rooms__branch"> · {branchName(room.branchId)}</span>
                        </td>
                        <td className="ops-table__fill">{stats.capacity}</td>
                        <td>{stats.amenities.slice(0, 2).join(", ")}</td>
                        <td>
                          <StatusChip tone={roomStatusTone(status)}>{roomStatusLabel(status)}</StatusChip>
                        </td>
                        <td>{cur ? courseName(courses, cur.courseId) : "—"}</td>
                        <td>
                          {nxt ? (
                            <>
                              {nxt.startTime} · {courseName(courses, nxt.courseId)}
                            </>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td>
                          <div className="ops-rooms__fill">
                            <span className="ops-rooms__fill-bar" aria-hidden>
                              <i style={{ width: `${stats.fillPct}%` }} />
                            </span>
                            <span>{stats.fillPct}%</span>
                          </div>
                        </td>
                        <td onClick={(event) => event.stopPropagation()}>
                          <div className="ops-table__acts">
                            <button type="button" className="ops-table__detail" onClick={() => pickRoom(room.id)}>
                              Chi tiết
                            </button>
                            <MoreMenu
                              items={[
                                { label: "Sửa", onClick: () => startEdit(room) },
                                { label: "Mở khóa học", onClick: onPromo },
                                { label: "Copy mã", onClick: () => copyId(demoRoomCode(room.id)) },
                              ]}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {filtered.length === 0 ? <p className="ops-table-empty">Không có phòng khớp bộ lọc.</p> : null}
            </div>

            <div className="ops-table-foot">
              <p>
                {filtered.length === 0
                  ? "0 phòng"
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

        <aside className="ops-board__aside ops-rooms__aside">
          {selected && selectedStats && selectedStatus ? (
            <section className="ops-detail ops-rooms__detail" aria-labelledby="edu-room-detail">
              <div className="ops-detail__head">
                <div className="ops-detail__head-title">
                  <h2 id="edu-room-detail">{selected.label}</h2>
                  <StatusChip tone={roomStatusTone(selectedStatus)}>{roomStatusLabel(selectedStatus)}</StatusChip>
                </div>
                <button type="button" className="ops-detail__close" aria-label="Đóng chi tiết" onClick={closePanel}>
                  ×
                </button>
              </div>

              <div className="ops-detail__hero">
                <span className="ops-thumb ops-thumb--lg" aria-hidden>
                  {selected.label.slice(0, 1)}
                </span>
                <div>
                  <p className="ops-detail__name">{selectedStats.type}</p>
                  <p className="ops-rooms__meta-line">
                    {demoRoomCode(selected.id)} · {selectedStats.area} · {branchName(selected.branchId)}
                  </p>
                </div>
              </div>

              <div className="ops-detail__split">
                <div className="ops-detail__tabs" role="tablist" aria-label="Chi tiết phòng">
                  {(
                    [
                      ["overview", "Tổng quan"],
                      ["schedule", "Lịch hôm nay"],
                      ["history", "Lịch sử"],
                      ["maint", "Bảo trì"],
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
                  {detailTab === "overview" ? (
                    <>
                      <dl className="ops-detail__meta">
                        <div>
                          <dt>Tên phòng</dt>
                          <dd>{selected.label}</dd>
                        </div>
                        <div>
                          <dt>Khu / chi nhánh</dt>
                          <dd>
                            {selectedStats.area} · {branchName(selected.branchId)}
                          </dd>
                        </div>
                        <div>
                          <dt>Loại</dt>
                          <dd>{selectedStats.type}</dd>
                        </div>
                        <div>
                          <dt>Sức chứa</dt>
                          <dd>{selectedStats.capacity} người</dd>
                        </div>
                        <div>
                          <dt>Thiết bị</dt>
                          <dd>{selectedStats.amenities.join(", ")}</dd>
                        </div>
                        <div>
                          <dt>Lấp đầy hôm nay</dt>
                          <dd>
                            <div className="ops-rooms__fill">
                              <span className="ops-rooms__fill-bar" aria-hidden>
                                <i style={{ width: `${selectedStats.fillPct}%` }} />
                              </span>
                              <span>{selectedStats.fillPct}%</span>
                            </div>
                          </dd>
                        </div>
                        <div>
                          <dt>Bảo trì</dt>
                          <dd>{selectedStats.maintenance ? "Cần xử lý" : "Ổn định"}</dd>
                        </div>
                      </dl>
                      <h3 className="ops-roster-title">Ghi chú & thẻ</h3>
                      <p className="ops-board__note">{selected.note || "Chưa có ghi chú vận hành."}</p>
                      <ul className="ops-rooms__tags">
                        {selectedStats.tags.map((tag) => (
                          <li key={tag}>{tag}</li>
                        ))}
                      </ul>
                    </>
                  ) : null}

                  {detailTab === "schedule" ? (
                    <>
                      <h3 className="ops-roster-title">Lịch hôm nay ({selectedToday.length})</h3>
                      {selectedToday.length ? (
                        <ol className="ops-rooms__tl">
                          {selectedToday.map((row) => {
                            const status = classStatus(row);
                            return (
                              <li key={row.id}>
                                <time dateTime={`${row.date}T${row.startTime}`}>
                                  {row.startTime}–{row.endTime}
                                </time>
                                <span>
                                  <strong>{courseName(courses, row.courseId)}</strong>
                                  <StatusChip tone={classChip(status).tone}>{CLASS_STATUS_LABEL[status]}</StatusChip>
                                </span>
                              </li>
                            );
                          })}
                        </ol>
                      ) : (
                        <p className="ops-board__note">Không có lớp hôm nay trong phòng này.</p>
                      )}
                    </>
                  ) : null}

                  {detailTab === "history" ? (
                    <ul className="ops-rooms__hist">
                      {selectedStats.history.map((item) => (
                        <li key={`${item.when}-${item.text}`}>
                          <time>{item.when}</time>
                          <span>{item.text}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  {detailTab === "maint" ? (
                    <div className="ops-rooms__maint">
                      <p className={selectedStats.maintenance ? "ops-rooms__maint-bad" : "ops-rooms__maint-ok"}>
                        {selectedStats.maintenance
                          ? "Phòng đang đánh dấu bảo trì — hạn chế xếp lớp mới."
                          : "Không có ticket bảo trì mở."}
                      </p>
                      <p className="ops-board__note">Checklist demo: sàn · loa · điều hòa · đèn.</p>
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="ops-detail__actions ops-rooms__cta">
                <button className="ops-page__cta" type="button" onClick={onPromo}>
                  Đặt lịch
                </button>
                <button className="ops-page__ghost" type="button" onClick={() => startEdit(selected)}>
                  Sửa phòng
                </button>
                <button className="ops-page__ghost" type="button" onClick={() => setDetailTab("maint")}>
                  Bảo trì
                </button>
                <button className="ops-page__ghost" type="button" onClick={() => setDetailTab("history")}>
                  Xem lịch sử
                </button>
              </div>
            </section>
          ) : (
            <p className="ops-aside-hint">Chọn một phòng trên bảng để xem chi tiết, lịch và bảo trì.</p>
          )}
        </aside>
      </div>
    </section>
  );
}
