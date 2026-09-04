"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { formatViDate, localIsoDate } from "../../lib/edu";
import { branchName } from "../../lib/branch";
import {
  TASK_ASSIGNEES,
  TASK_PRIORITIES,
  TASK_PRIORITY_LABEL,
  TASK_STATUS_LABEL,
  assigneeById,
  formatDueLine,
  isTaskOpen,
  studioTaskKpis,
  taskDueBucket,
} from "../../lib/tasks-demo";
import type { DemoStudioTask, DemoStudioTaskComment, StudioTaskPriority, StudioTaskStatus } from "../../lib/types";
import { MoreMenu, copyId } from "./MoreMenu";
import { StatusChip, workPriorityChip, workTaskChip } from "./StatusChip";
import { UserAvatar, UserChip } from "./UserAvatar";
import "./chrome.css";
import "./EduTable.css";
import "./TasksBoard.css";

type TasksBoardProps = {
  title: string;
  tasks: DemoStudioTask[];
  onChange: (next: DemoStudioTask[]) => void;
};

type StatusFilter = "all" | "open" | StudioTaskStatus;
type DueFilter = "all" | "overdue" | "today" | "later";
type PriorityFilter = "all" | StudioTaskPriority;
type DetailTab = "overview" | "comment";

const PAGE_SIZE = 12;
const ME = "ha";
const STATUSES: StudioTaskStatus[] = ["todo", "doing", "done", "cancelled"];
const DUE_OPTIONS: { id: DueFilter; label: string }[] = [
  { id: "all", label: "Mọi hạn" },
  { id: "overdue", label: "Quá hạn" },
  { id: "today", label: "Hôm nay" },
  { id: "later", label: "Sau hôm nay" },
];

type FilterOption = { id: string; label: string; avatarId?: string };

const STATUS_FILTER_OPTIONS: FilterOption[] = [
  { id: "all", label: "Tất cả" },
  { id: "open", label: "Đang mở" },
  ...STATUSES.map((id) => ({ id, label: TASK_STATUS_LABEL[id] })),
];
const ASSIGNEE_FILTER_OPTIONS: FilterOption[] = [
  { id: "all", label: "Tất cả" },
  ...TASK_ASSIGNEES.map((row) => ({ id: row.id, label: row.name, avatarId: row.id })),
];
const PRIORITY_FILTER_OPTIONS: FilterOption[] = [
  { id: "all", label: "Tất cả" },
  ...TASK_PRIORITIES.map((id) => ({ id, label: TASK_PRIORITY_LABEL[id] })),
];

function TaskComment({ item }: { item: DemoStudioTaskComment }) {
  const who = assigneeById(item.authorId);
  return (
    <li className="ops-work__comment">
      <UserAvatar id={who.id} name={who.name} decorative={false} />
      <div className="ops-work__comment-body">
        <p className="ops-work__comment-meta">
          <span className="ops-work__comment-who">{who.name}</span>
          <span className="ops-work__comment-at">{item.at}</span>
        </p>
        <p className="ops-work__comment-text">{item.text}</p>
      </div>
    </li>
  );
}

function FilterPill({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: FilterOption[];
  onChange: (id: string) => void;
}) {
  const root = useRef<HTMLDetailsElement>(null);
  const current = options.find((row) => row.id === value);
  const on = value !== "all";

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!root.current?.open) return;
      if (!root.current.contains(e.target as Node)) root.current.open = false;
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  function pick(id: string) {
    onChange(id);
    if (root.current) root.current.open = false;
  }

  return (
    <details ref={root} className={on ? "ops-jql ops-jql--on" : "ops-jql"} name="ops-work-jql">
      <summary>
        {on && current?.avatarId ? <UserAvatar id={current.avatarId} size="xs" /> : null}
        {on && current ? `${label}: ${current.label}` : label}
        <span className="ops-jql__chev" aria-hidden>
          ▾
        </span>
      </summary>
      <div className="ops-jql__menu" role="listbox" aria-label={label}>
        {options.map((row) => (
          <button
            key={row.id}
            type="button"
            role="option"
            aria-selected={row.id === value}
            className={row.id === value ? "ops-jql__opt ops-jql__opt--on" : "ops-jql__opt"}
            onClick={() => pick(row.id)}
          >
            {row.avatarId ? <UserAvatar id={row.avatarId} size="xs" /> : null}
            {row.label}
          </button>
        ))}
      </div>
    </details>
  );
}

function nextCode(tasks: DemoStudioTask[]): string {
  const nums = tasks.map((t) => Number(t.code.replace(/\D/g, ""))).filter((n) => Number.isFinite(n));
  const max = nums.length ? Math.max(...nums) : 23;
  return `TV-${String(max + 1).padStart(4, "0")}`;
}

export function TasksBoard({ title, tasks, onChange }: TasksBoardProps) {
  const today = localIsoDate();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [panelDismissed, setPanelDismissed] = useState(false);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [assigneeFilter, setAssigneeFilter] = useState("all");
  const [dueFilter, setDueFilter] = useState<DueFilter>("all");
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("all");
  const [page, setPage] = useState(0);
  const [adding, setAdding] = useState(false);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftDetail, setDraftDetail] = useState("");
  const [draftAssignee, setDraftAssignee] = useState<string>(TASK_ASSIGNEES[0].id);
  const [draftDue, setDraftDue] = useState(today);
  const [draftPriority, setDraftPriority] = useState<StudioTaskPriority>("mid");
  const [commentDraft, setCommentDraft] = useState("");
  const [detailTab, setDetailTab] = useState<DetailTab>("overview");

  const kpis = useMemo(() => studioTaskKpis(tasks, today), [tasks, today]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return [...tasks]
      .filter((row) => {
        if (statusFilter === "open") {
          if (!isTaskOpen(row.status)) return false;
        } else if (statusFilter !== "all" && row.status !== statusFilter) return false;
        if (assigneeFilter !== "all" && row.assigneeId !== assigneeFilter) return false;
        if (priorityFilter !== "all" && row.priority !== priorityFilter) return false;
        if (dueFilter !== "all" && taskDueBucket(row.due, today) !== dueFilter) return false;
        if (!q) return true;
        const who = assigneeById(row.assigneeId).name;
        return `${row.title} ${row.code} ${row.detail} ${row.note ?? ""} ${who} ${row.courseName ?? ""} ${row.studentName ?? ""} ${row.roomLabel ?? ""}`.toLowerCase().includes(q);
      })
      .sort((a, b) => {
        const openA = a.status === "todo" || a.status === "doing" ? 0 : 1;
        const openB = b.status === "todo" || b.status === "doing" ? 0 : 1;
        if (openA !== openB) return openA - openB;
        return a.due.localeCompare(b.due) || a.code.localeCompare(b.code);
      });
  }, [tasks, query, statusFilter, assigneeFilter, dueFilter, priorityFilter, today]);

  useEffect(() => {
    if (adding || panelDismissed) return;
    if (selectedId && filtered.some((t) => t.id === selectedId)) return;
    setSelectedId(filtered[0]?.id ?? null);
    setDetailTab("overview");
    setCommentDraft("");
  }, [filtered, selectedId, panelDismissed, adding]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageSafe = Math.min(page, pageCount - 1);
  const paged = filtered.slice(pageSafe * PAGE_SIZE, pageSafe * PAGE_SIZE + PAGE_SIZE);
  const selected = tasks.find((t) => t.id === selectedId) ?? null;

  function pickTask(id: string) {
    setAdding(false);
    setPanelDismissed(false);
    setSelectedId(id);
    setCommentDraft("");
    setDetailTab("overview");
  }

  function closePanel() {
    setAdding(false);
    setPanelDismissed(true);
    setSelectedId(null);
  }

  function resetPage() {
    setPage(0);
    setPanelDismissed(false);
  }

  function setStatus(next: StatusFilter) {
    setStatusFilter(next);
    resetPage();
  }

  function setAssignee(next: string) {
    setAssigneeFilter(next);
    resetPage();
  }

  function setDue(next: DueFilter) {
    setDueFilter(next);
    resetPage();
  }

  function setPriority(next: PriorityFilter) {
    setPriorityFilter(next);
    resetPage();
  }

  function clearFilters() {
    setQuery("");
    setStatusFilter("all");
    setAssigneeFilter("all");
    setDueFilter("all");
    setPriorityFilter("all");
    resetPage();
  }

  const statusLabel =
    statusFilter === "all" ? null : statusFilter === "open" ? "Đang mở" : TASK_STATUS_LABEL[statusFilter];
  const dueLabel = dueFilter === "all" ? null : DUE_OPTIONS.find((row) => row.id === dueFilter)?.label;
  const hasFilters =
    Boolean(query.trim()) ||
    statusFilter !== "all" ||
    assigneeFilter !== "all" ||
    dueFilter !== "all" ||
    priorityFilter !== "all";

  function patch(id: string, next: Partial<DemoStudioTask>) {
    onChange(tasks.map((row) => (row.id === id ? { ...row, ...next } : row)));
  }

  function addTask() {
    const title = draftTitle.trim();
    if (!title) return;
    const id = `tv-${Date.now().toString(36).slice(-5)}`;
    const created: DemoStudioTask = {
      id,
      code: nextCode(tasks),
      title,
      detail: draftDetail.trim() || "Demo FE, chưa server.",
      assigneeId: draftAssignee,
      reporterId: "ha",
      status: "todo",
      priority: draftPriority,
      due: draftDue || today,
      dueTime: "",
      created: today,
      checklist: [],
      history: [{ at: "17:15", text: "Hà Nguyễn tạo việc (demo FE)." }],
      comments: [],
    };
    onChange([created, ...tasks]);
    setDraftTitle("");
    setDraftDetail("");
    setDraftPriority("mid");
    setAdding(false);
    pickTask(id);
  }

  function toggleCheck(task: DemoStudioTask, itemId: string) {
    patch(task.id, {
      checklist: task.checklist.map((item) => (item.id === itemId ? { ...item, done: !item.done } : item)),
    });
  }

  function postComment(task: DemoStudioTask) {
    const text = commentDraft.trim();
    if (!text) return;
    patch(task.id, {
      comments: [
        ...task.comments,
        { id: `cm-${Date.now().toString(36).slice(-5)}`, authorId: "ha", at: "17:15", text },
      ],
    });
    setCommentDraft("");
  }

  return (
    <section className="ops-work" aria-labelledby="ops-tasks-heading">
      <div className="ops-board__layout ops-work__layout">
        <div className="ops-board__main ops-work__main">
          <nav className="ops-crumb" aria-label="Breadcrumb">
            <ol>
              <li>Trang chủ</li>
              <li aria-current="page">{title}</li>
            </ol>
          </nav>
          <div className="ops-page__head">
            <div>
              <h1 id="ops-tasks-heading" className="ops-page__title" tabIndex={-1}>
                {title}
              </h1>
              <p className="ops-page__lede">Giao việc nội bộ — thay chia task trên Zalo. Không phải Jira.</p>
            </div>
            <button
              className="ops-page__cta"
              type="button"
              onClick={() => {
                setAdding(true);
                setPanelDismissed(false);
                setSelectedId(null);
              }}
            >
              + Thêm việc
            </button>
          </div>

          <ul className="ops-kpi-row ops-kpi-row--6">
            {kpis.map((kpi) => (
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
                    {kpi.trend} <span>so với tuần trước</span>
                  </p>
                </article>
              </li>
            ))}
          </ul>

          <div className="ops-table-card">
            <div className="ops-work__jql">
              <div className="ops-work__jql-row">
                <label className="ops-table-search ops-work__jql-search">
                  <span className="ops-sr">Tìm việc</span>
                  <input
                    type="search"
                    value={query}
                    placeholder="Tìm tiêu đề, mã, người nhận…"
                    onChange={(e) => {
                      setQuery(e.target.value);
                      resetPage();
                    }}
                  />
                </label>
                <div className="ops-work__jql-quick" role="group" aria-label="Lọc nhanh">
                  <button
                    type="button"
                    className={assigneeFilter === ME ? "ops-jql-chip ops-jql-chip--on" : "ops-jql-chip"}
                    aria-pressed={assigneeFilter === ME}
                    onClick={() => setAssignee(assigneeFilter === ME ? "all" : ME)}
                  >
                    <UserAvatar id={ME} size="xs" />
                    Việc của tôi
                  </button>
                  <button
                    type="button"
                    className={statusFilter === "open" ? "ops-jql-chip ops-jql-chip--on" : "ops-jql-chip"}
                    aria-pressed={statusFilter === "open"}
                    onClick={() => setStatus(statusFilter === "open" ? "all" : "open")}
                  >
                    Đang mở
                  </button>
                  <button
                    type="button"
                    className={dueFilter === "today" ? "ops-jql-chip ops-jql-chip--on" : "ops-jql-chip"}
                    aria-pressed={dueFilter === "today"}
                    onClick={() => setDue(dueFilter === "today" ? "all" : "today")}
                  >
                    Hôm nay
                  </button>
                  <button
                    type="button"
                    className={dueFilter === "overdue" ? "ops-jql-chip ops-jql-chip--on" : "ops-jql-chip"}
                    aria-pressed={dueFilter === "overdue"}
                    onClick={() => setDue(dueFilter === "overdue" ? "all" : "overdue")}
                  >
                    Quá hạn
                  </button>
                </div>
              </div>
              <div className="ops-work__jql-row" role="toolbar" aria-label="Lọc tác vụ">
                <FilterPill
                  label="Trạng thái"
                  value={statusFilter}
                  options={STATUS_FILTER_OPTIONS}
                  onChange={(id) => setStatus(id as StatusFilter)}
                />
                <FilterPill
                  label="Người nhận"
                  value={assigneeFilter}
                  options={ASSIGNEE_FILTER_OPTIONS}
                  onChange={setAssignee}
                />
                <FilterPill
                  label="Ưu tiên"
                  value={priorityFilter}
                  options={PRIORITY_FILTER_OPTIONS}
                  onChange={(id) => setPriority(id as PriorityFilter)}
                />
                <FilterPill
                  label="Hạn"
                  value={dueFilter}
                  options={DUE_OPTIONS}
                  onChange={(id) => setDue(id as DueFilter)}
                />
                {hasFilters ? (
                  <button type="button" className="ops-jql-clear" onClick={clearFilters}>
                    Xóa lọc
                  </button>
                ) : null}
              </div>
              {hasFilters ? (
                <ul className="ops-work__jql-active" aria-label="Đang lọc">
                  {query.trim() ? (
                    <li className="ops-jql-tag">
                      Tìm: {query.trim()}
                      <button
                        type="button"
                        aria-label="Xóa tìm kiếm"
                        onClick={() => {
                          setQuery("");
                          resetPage();
                        }}
                      >
                        ×
                      </button>
                    </li>
                  ) : null}
                  {statusLabel ? (
                    <li className="ops-jql-tag">
                      Trạng thái: {statusLabel}
                      <button type="button" aria-label="Xóa lọc trạng thái" onClick={() => setStatus("all")}>
                        ×
                      </button>
                    </li>
                  ) : null}
                  {assigneeFilter !== "all" ? (
                    <li className="ops-jql-tag">
                      <UserAvatar id={assigneeFilter} size="xs" />
                      Người nhận: {assigneeById(assigneeFilter).name}
                      <button type="button" aria-label="Xóa lọc người nhận" onClick={() => setAssignee("all")}>
                        ×
                      </button>
                    </li>
                  ) : null}
                  {priorityFilter !== "all" ? (
                    <li className="ops-jql-tag">
                      Ưu tiên: {TASK_PRIORITY_LABEL[priorityFilter]}
                      <button type="button" aria-label="Xóa lọc ưu tiên" onClick={() => setPriority("all")}>
                        ×
                      </button>
                    </li>
                  ) : null}
                  {dueLabel ? (
                    <li className="ops-jql-tag">
                      Hạn: {dueLabel}
                      <button type="button" aria-label="Xóa lọc hạn" onClick={() => setDue("all")}>
                        ×
                      </button>
                    </li>
                  ) : null}
                </ul>
              ) : null}
            </div>

            <div className="ops-table-wrap">
              <table className="ops-table">
                <caption className="ops-sr">Danh sách tác vụ</caption>
                <thead>
                  <tr>
                    <th scope="col">Việc</th>
                    <th scope="col">Người nhận</th>
                    <th scope="col">Hạn</th>
                    <th scope="col">Khóa / lớp</th>
                    <th scope="col">Trạng thái</th>
                    <th scope="col">
                      <span className="ops-sr">Thao tác</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paged.map((item) => {
                    const who = assigneeById(item.assigneeId);
                    const chip = workTaskChip(item.status);
                    const bucket = taskDueBucket(item.due, today);
                    const current = item.id === selectedId && !adding;
                    return (
                      <tr
                        key={item.id}
                        className={current ? "ops-table__row ops-table__row--on" : "ops-table__row"}
                        onClick={() => pickTask(item.id)}
                      >
                        <th scope="row">
                          <span className="ops-table__name">{item.title}</span>
                          <span className="ops-table__id">{item.code}</span>
                        </th>
                        <td>
                          <UserChip id={who.id} withRole />
                        </td>
                        <td className={bucket === "overdue" && (item.status === "todo" || item.status === "doing") ? "ops-work__due ops-work__due--late" : undefined}>
                          <time dateTime={item.due}>{formatViDate(item.due)}</time>
                          {bucket === "today" ? <span className="ops-table__id">Hôm nay</span> : null}
                        </td>
                        <td>{item.courseName ?? "—"}</td>
                        <td>
                          <StatusChip tone={chip.tone}>{chip.label}</StatusChip>
                        </td>
                        <td onClick={(event) => event.stopPropagation()}>
                          <div className="ops-table__acts">
                            <button type="button" className="ops-table__detail" onClick={() => pickTask(item.id)}>
                              Chi tiết
                            </button>
                            <MoreMenu
                              items={[
                                { label: "Copy mã", onClick: () => copyId(item.code) },
                                {
                                  label: "Đánh dấu xong",
                                  onClick: () => patch(item.id, { status: "done" }),
                                },
                              ]}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {filtered.length === 0 ? <p className="ops-table-empty">Không có việc khớp bộ lọc.</p> : null}
            </div>

            <div className="ops-table-foot">
              <p>
                {filtered.length === 0
                  ? "0 việc"
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

        <aside className="ops-work__aside">
          {adding ? (
            <section className="ops-detail ops-work__detail" aria-labelledby="edu-task-add">
              <div className="ops-detail__head">
                <div className="ops-detail__head-title">
                  <h2 id="edu-task-add">Việc mới</h2>
                </div>
                <button type="button" className="ops-detail__close" aria-label="Đóng" onClick={closePanel}>
                  ×
                </button>
              </div>
              <div className="ops-work__scroll">
              <form
                className="ops-work__form"
                onSubmit={(event) => {
                  event.preventDefault();
                  addTask();
                }}
              >
                <label>
                  Tiêu đề
                  <input value={draftTitle} onChange={(e) => setDraftTitle(e.target.value)} required />
                </label>
                <label>
                  Người nhận
                  <span className="ops-who-field">
                    <UserAvatar id={draftAssignee} />
                    <select value={draftAssignee} onChange={(e) => setDraftAssignee(e.target.value)}>
                      {TASK_ASSIGNEES.map((row) => (
                        <option key={row.id} value={row.id}>
                          {row.name} · {row.role}
                        </option>
                      ))}
                    </select>
                  </span>
                </label>
                <label>
                  Hạn
                  <input type="date" value={draftDue} onChange={(e) => setDraftDue(e.target.value)} required />
                </label>
                <label>
                  Ưu tiên
                  <select value={draftPriority} onChange={(e) => setDraftPriority(e.target.value as StudioTaskPriority)}>
                    {TASK_PRIORITIES.map((id) => (
                      <option key={id} value={id}>
                        {TASK_PRIORITY_LABEL[id]}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Mô tả
                  <textarea rows={4} value={draftDetail} onChange={(e) => setDraftDetail(e.target.value)} />
                </label>
                <button className="ops-page__cta" type="submit">
                  Tạo việc
                </button>
              </form>
              </div>
            </section>
          ) : selected ? (
            <section className="ops-detail ops-work__detail" aria-labelledby="edu-task-detail">
              <div className="ops-detail__head">
                <div className="ops-detail__head-title">
                  <h2 id="edu-task-detail">{selected.title}</h2>
                  <StatusChip tone={workTaskChip(selected.status).tone}>{workTaskChip(selected.status).label}</StatusChip>
                </div>
                <button type="button" className="ops-detail__close" aria-label="Đóng chi tiết" onClick={closePanel}>
                  ×
                </button>
              </div>
              <p className="ops-staff__meta-line">
                {selected.code} · Giao bởi{" "}
                <span className="ops-who">
                  <UserAvatar id={selected.reporterId} size="xs" />
                  {assigneeById(selected.reporterId).name}
                </span>{" "}
                · Tạo {formatViDate(selected.created)}
              </p>
              <div className="ops-detail__split">
                <div className="ops-detail__tabs" role="tablist" aria-label="Chi tiết tác vụ">
                  {(
                    [
                      ["overview", "Tổng quan"],
                      ["comment", selected.comments.length ? `Comment (${selected.comments.length})` : "Comment"],
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

                {detailTab === "overview" ? (
                  <div className="ops-detail__pane" role="tabpanel">
                    <div className="ops-work__scroll">
                      <section className="ops-work__block" aria-labelledby="edu-task-desc">
                        <h3 id="edu-task-desc" className="ops-work__block-title">
                          Mô tả
                        </h3>
                        <p className="ops-work__desc">{selected.detail}</p>
                        {selected.note ? <p className="ops-work__note">{selected.note}</p> : null}
                      </section>

                      <section className="ops-work__block" aria-labelledby="edu-task-info">
                        <h3 id="edu-task-info" className="ops-work__block-title">
                          Thông tin
                        </h3>
                        <dl className="ops-info__dl">
                          <div>
                            <dt>Hạn</dt>
                            <dd>
                              <time dateTime={selected.due}>{formatDueLine(selected.due, selected.dueTime)}</time>
                            </dd>
                          </div>
                          <div>
                            <dt>Ưu tiên</dt>
                            <dd>
                              <StatusChip tone={workPriorityChip(selected.priority).tone}>
                                {workPriorityChip(selected.priority).label}
                              </StatusChip>
                            </dd>
                          </div>
                          <div>
                            <dt>Người nhận</dt>
                            <dd>
                              <UserChip id={selected.assigneeId} withRole />
                            </dd>
                          </div>
                          <div>
                            <dt>Người giao</dt>
                            <dd>
                              <UserChip id={selected.reporterId} withRole />
                            </dd>
                          </div>
                          <div>
                            <dt>Khóa / lớp</dt>
                            <dd>{selected.courseName ?? "—"}</dd>
                          </div>
                          <div>
                            <dt>Học viên liên quan</dt>
                            <dd>{selected.studentName ?? "—"}</dd>
                          </div>
                          <div>
                            <dt>Chi nhánh</dt>
                            <dd>{selected.branchId ? branchName(selected.branchId) : "—"}</dd>
                          </div>
                          <div>
                            <dt>Phòng</dt>
                            <dd>{selected.roomLabel ?? "—"}</dd>
                          </div>
                        </dl>
                      </section>

                      {selected.checklist.length ? (
                        <section className="ops-work__block" aria-labelledby="edu-task-check">
                          <h3 id="edu-task-check" className="ops-work__block-title">
                            Checklist
                          </h3>
                          <ul className="ops-work__check">
                            {selected.checklist.map((item) => (
                              <li key={item.id}>
                                <label
                                  className={item.done ? "ops-work__check-item ops-work__check-item--done" : "ops-work__check-item"}
                                >
                                  <input type="checkbox" checked={item.done} onChange={() => toggleCheck(selected, item.id)} />
                                  {item.text}
                                </label>
                              </li>
                            ))}
                          </ul>
                        </section>
                      ) : null}

                      <section className="ops-work__block" aria-labelledby="edu-task-edit">
                        <h3 id="edu-task-edit" className="ops-work__block-title">
                          Cập nhật
                        </h3>
                        <div className="ops-work__form ops-work__form--inline">
                          <label>
                            Trạng thái
                            <select
                              value={selected.status}
                              onChange={(e) => patch(selected.id, { status: e.target.value as StudioTaskStatus })}
                            >
                              {STATUSES.map((id) => (
                                <option key={id} value={id}>
                                  {TASK_STATUS_LABEL[id]}
                                </option>
                              ))}
                            </select>
                          </label>
                          <label>
                            Người nhận
                            <span className="ops-who-field">
                              <UserAvatar id={selected.assigneeId} />
                              <select
                                value={selected.assigneeId}
                                onChange={(e) => patch(selected.id, { assigneeId: e.target.value })}
                              >
                                {TASK_ASSIGNEES.map((row) => (
                                  <option key={row.id} value={row.id}>
                                    {row.name} · {row.role}
                                  </option>
                                ))}
                              </select>
                            </span>
                          </label>
                          <label>
                            Ưu tiên
                            <select
                              value={selected.priority}
                              onChange={(e) => patch(selected.id, { priority: e.target.value as StudioTaskPriority })}
                            >
                              {TASK_PRIORITIES.map((id) => (
                                <option key={id} value={id}>
                                  {TASK_PRIORITY_LABEL[id]}
                                </option>
                              ))}
                            </select>
                          </label>
                          <label>
                            Hạn
                            <input type="date" value={selected.due} onChange={(e) => patch(selected.id, { due: e.target.value })} />
                          </label>
                          <label>
                            Giờ hạn
                            <input
                              type="time"
                              value={selected.dueTime ?? ""}
                              onChange={(e) => patch(selected.id, { dueTime: e.target.value })}
                            />
                          </label>
                          <label className="ops-work__span">
                            Mô tả
                            <textarea
                              rows={3}
                              value={selected.detail}
                              onChange={(e) => patch(selected.id, { detail: e.target.value })}
                            />
                          </label>
                          <p className="ops-work__hint ops-work__span">Đổi xong là lưu trên canvas. Demo FE, chưa server.</p>
                        </div>
                      </section>

                      <section className="ops-work__block" aria-labelledby="edu-task-comment-preview">
                        <h3 id="edu-task-comment-preview" className="ops-work__block-title">
                          Comment
                        </h3>
                        {selected.comments.length ? (
                          <ul className="ops-work__comments ops-work__comments--preview">
                            <TaskComment item={selected.comments[selected.comments.length - 1]} />
                          </ul>
                        ) : (
                          <p className="ops-work__comment-empty">Chưa có comment.</p>
                        )}
                        <button type="button" className="ops-work__more" onClick={() => setDetailTab("comment")}>
                          {selected.comments.length ? "Xem thêm" : "Viết comment"}
                        </button>
                      </section>
                    </div>
                  </div>
                ) : (
                  <div className="ops-detail__pane ops-work__pane--comment" role="tabpanel" aria-labelledby="edu-task-comments">
                    <h3 id="edu-task-comments" className="ops-sr">
                      Comment
                    </h3>
                    <ul className="ops-work__comments">
                      {selected.comments.length ? (
                        selected.comments.map((item) => <TaskComment key={item.id} item={item} />)
                      ) : (
                        <li className="ops-work__comment-empty">Chưa có comment.</li>
                      )}
                    </ul>
                    <form
                      className="ops-work__comment-form"
                      onSubmit={(event) => {
                        event.preventDefault();
                        postComment(selected);
                      }}
                    >
                      <UserAvatar id="ha" name="Hà Nguyễn" size="sm" decorative={false} />
                      <div className="ops-work__comment-box">
                        <label className="ops-sr" htmlFor="edu-task-comment">
                          Viết comment
                        </label>
                        <textarea
                          id="edu-task-comment"
                          rows={2}
                          value={commentDraft}
                          placeholder="Viết comment…"
                          onChange={(e) => setCommentDraft(e.target.value)}
                        />
                        <button className="ops-work__comment-send" type="submit" disabled={!commentDraft.trim()}>
                          Gửi
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </section>
          ) : (
            <p className="ops-table-empty">Chọn một việc hoặc thêm việc mới.</p>
          )}
        </aside>
      </div>
    </section>
  );
}
