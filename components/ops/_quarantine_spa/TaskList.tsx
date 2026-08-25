"use client";

import { useEffect, useMemo, useState } from "react";
import { paginate } from "../../lib/page";
import type { DemoTask } from "../../lib/types";
import { MoreMenu, copyId } from "./MoreMenu";
import { PageInfo } from "./PageInfo";
import { PagePager, PageToolbar } from "./PageToolbar";
import { StatusChip } from "./StatusChip";
import "./chrome.css";
import "./TaskList.css";

type TaskListProps = {
  title: string;
  tasks: DemoTask[];
  onOpen: (id: string) => void;
  onPromo: () => void;
};

export function TaskList({ title, tasks, onOpen, onPromo }: TaskListProps) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return tasks;
    return tasks.filter((t) => `${t.title} ${t.customer} ${t.service} ${t.id}`.toLowerCase().includes(q));
  }, [tasks, search]);

  useEffect(() => setPage(1), [search]);
  const paged = paginate(filtered, page);

  return (
    <section className="ops-tasks" aria-labelledby="ops-tasks-heading">
      <div className="ops-page__head">
        <h1 id="ops-tasks-heading" className="ops-page__title" tabIndex={-1}>
          {title}
        </h1>
      </div>
      <p className="ops-page__lede">Việc nhạy — AI không tự chạy, cần bạn duyệt.</p>
      <div className="ops-dash">
        <div className="ops-dash__main">
      <PageToolbar
        search={search}
        onSearch={setSearch}
        placeholder="Tìm học viên, khóa hoặc mã"
        onRefresh={() => setSearch("")}
      />
      <ul className="ops-res-list ops-stagger">
        {paged.slice.map((task) => (
          <li key={task.id}>
            <article className="ops-res">
              <div className="ops-res__head">
                <span className="ops-res__icon" aria-hidden>
                  <TaskIcon />
                </span>
                <div className="ops-res__copy">
                  <h2>
                    <button type="button" className="ops-res__title" onClick={() => onOpen(task.id)}>
                      {task.customer}
                    </button>
                  </h2>
                  <p className="ops-res__sub">
                    {task.id} · {task.detail}
                  </p>
                </div>
                <span className="ops-res__meta">{task.time}</span>
                <MoreMenu
                  items={[
                    { label: "Duyệt hủy", onClick: () => onOpen(task.id) },
                    { label: "Sao chép mã", onClick: () => copyId(task.id) },
                  ]}
                />
              </div>
              <div className="ops-res__foot">
                <button type="button" className="ops-res__link" onClick={() => onOpen(task.id)}>
                  Duyệt hủy
                </button>
                <span className="ops-res__stats">
                  <StatusChip tone="delay">Cần duyệt</StatusChip>
                  <span>Hủy buổi</span>
                </span>
              </div>
            </article>
          </li>
        ))}
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
          <div className="ops-wid">
            <p className="ops-wid__k">Chờ duyệt</p>
            <p className="ops-wid__v">{tasks.length}</p>
            <p className="ops-wid__k">Hủy buổi — human confirm</p>
          </div>
          <PageInfo onPromo={onPromo} />
        </aside>
      </div>
    </section>
  );
}

function TaskIcon() {
  return (
    <svg viewBox="0 0 24 24" width="1rem" height="1rem" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="6" y="4" width="12" height="16" rx="2" />
      <path d="M9 10h6M9 14h4" strokeLinecap="round" />
    </svg>
  );
}
