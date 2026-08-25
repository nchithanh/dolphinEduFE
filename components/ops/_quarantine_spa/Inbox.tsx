"use client";

import { useEffect, useMemo, useState } from "react";
import { paginate } from "../../lib/page";
import type { DemoInboxThread } from "../../lib/types";
import { MoreMenu, copyId } from "./MoreMenu";
import { PageInfo } from "./PageInfo";
import { PagePager, PageToolbar } from "./PageToolbar";
import { StatusChip, inboxChip } from "./StatusChip";
import "./chrome.css";
import "./Inbox.css";

type InboxProps = {
  title: string;
  threads: DemoInboxThread[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onViewCustomer: (name: string) => void;
  onPromo: () => void;
};

const AI_LABEL = {
  waiting: "Chờ bạn",
  draft: "AI đã soạn",
  done: "Đã xử lý",
} as const;

const FILTERS = [
  { id: "all", label: "Tất cả" },
  { id: "draft", label: "AI đã soạn" },
  { id: "waiting", label: "Chờ bạn" },
  { id: "done", label: "Đã xử lý" },
];

export function Inbox({ title, threads, selectedId, onSelect, onViewCustomer, onPromo }: InboxProps) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return threads.filter((t) => {
      if (filter !== "all" && t.aiStatus !== filter) return false;
      if (!q) return true;
      return `${t.customer} ${t.preview} ${t.id}`.toLowerCase().includes(q);
    });
  }, [threads, search, filter]);

  useEffect(() => setPage(1), [search, filter]);
  const paged = paginate(filtered, page);
  const selected = threads.find((t) => t.id === selectedId) ?? paged.slice[0] ?? threads[0];

  return (
    <section className="ops-inbox" aria-labelledby="ops-inbox-heading">
      <div className="ops-page__head">
        <h1 id="ops-inbox-heading" className="ops-page__title" tabIndex={-1}>
          {title}
        </h1>
      </div>
      <p className="ops-page__lede">Hội thoại học viên — AI soạn, bạn quyết. Seed demo.</p>
      <PageToolbar
        search={search}
        onSearch={setSearch}
        placeholder="Tìm hội thoại hoặc mã"
        filterValue={filter}
        filterOptions={FILTERS}
        onFilter={setFilter}
        onRefresh={() => {
          setSearch("");
          setFilter("all");
        }}
      />
      <div className="ops-inbox__split">
        <div className="ops-inbox__col">
          <ul className="ops-res-list ops-stagger">
            {paged.slice.map((thread) => {
              const chip = inboxChip(thread.aiStatus);
              return (
              <li key={thread.id}>
                <article className={thread.id === selected?.id ? "ops-res ops-res--current" : "ops-res"}>
                  <div className="ops-res__head">
                    <span className="ops-res__icon" aria-hidden>
                      <MailIcon />
                    </span>
                    <div className="ops-res__copy">
                      <h2>
                        <button type="button" className="ops-res__title" onClick={() => onSelect(thread.id)}>
                          {thread.customer}
                        </button>
                      </h2>
                      <p className="ops-res__sub">
                        {thread.id} · {thread.preview}
                      </p>
                    </div>
                    <StatusChip tone={chip.tone}>{chip.label}</StatusChip>
                    <MoreMenu
                      items={[
                        { label: "Mở hội thoại", onClick: () => onSelect(thread.id) },
                        { label: "Xem học viên", onClick: () => onViewCustomer(thread.customer) },
                        { label: "Sao chép mã", onClick: () => copyId(thread.id) },
                      ]}
                    />
                  </div>
                  <div className="ops-res__foot">
                    <button type="button" className="ops-res__link" onClick={() => onSelect(thread.id)}>
                      Mở hội thoại
                    </button>
                    <span className="ops-res__stats">{thread.messages.length} tin</span>
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
        {selected ? (
          <div className="ops-inbox__thread" aria-label={`Hội thoại ${selected.customer}`}>
            <div className="ops-inbox__thread-head">
              <div>
                <h2 className="ops-inbox__who">{selected.customer}</h2>
                <p className="ops-inbox__meta">
                  {selected.id} · <StatusChip tone={inboxChip(selected.aiStatus).tone}>{AI_LABEL[selected.aiStatus]}</StatusChip>
                </p>
              </div>
              <button type="button" className="ops-res__link" onClick={() => onViewCustomer(selected.customer)}>
                Xem học viên
              </button>
            </div>
            {selected.messages.map((msg) => (
              <p key={msg.id} className={`ops-inbox__msg ops-inbox__msg--${msg.from}`}>
                {msg.text}
              </p>
            ))}
          </div>
        ) : null}
      </div>
      <PageInfo onPromo={onPromo} />
    </section>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" width="1rem" height="1rem" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="4" y="6" width="16" height="12" rx="2" />
      <path d="M4 8l8 5 8-5" />
    </svg>
  );
}
