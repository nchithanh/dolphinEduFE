"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { BranchSelect } from "./BranchSelect";
import { CHROME, type OpsLocale } from "../../lib/locale";
import { groupIdForStage, type NavGroup } from "../../lib/nav";
import type { Stage } from "../../lib/types";
import "./ToolNav.css";

type ToolNavProps = {
  active: Stage;
  onSelect: (id: Stage) => void;
  collapsed?: boolean;
  onCollapse?: () => void;
  groups: NavGroup[];
  orgName: string;
  loadState: "loading" | "ready" | "error";
  onRetry?: () => void;
  locale: OpsLocale;
  branchId: string;
  onBranchChange: (branchId: string) => void;
};

const STROKE = {
  viewBox: "0 0 24 24",
  width: "1.05rem",
  height: "1.05rem",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  "aria-hidden": true as const,
};

export function ToolNav({
  active,
  onSelect,
  collapsed = false,
  onCollapse,
  groups,
  orgName,
  loadState,
  onRetry,
  locale,
  branchId,
  onBranchChange,
}: ToolNavProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(() => new Set((groups ?? []).map((group) => group.id)));
  const searchRef = useRef<HTMLInputElement>(null);
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return groups;
    return groups
      .map((group) => ({
        ...group,
        items: group.items.filter((t) => `${t.label} ${t.hint}`.toLowerCase().includes(q)),
      }))
      .filter((group) => group.items.length > 0);
  }, [groups, query]);

  useEffect(() => {
    setOpen((prev) => {
      const ids = groups.map((group) => group.id);
      if (ids.length === 0) return prev;
      if (ids.every((id) => prev.has(id)) && prev.size === ids.length) return prev;
      return new Set(ids);
    });
  }, [groups]);

  useEffect(() => {
    const gid = groupIdForStage(groups, active);
    setOpen((prev) => {
      if (prev.has(gid)) return prev;
      const next = new Set(prev);
      next.add(gid);
      return next;
    });
  }, [active, groups]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (!(event.ctrlKey || event.metaKey) || event.key.toLowerCase() !== "k") return;
      event.preventDefault();
      searchRef.current?.focus();
    }
    function onBarSearch() {
      searchRef.current?.focus();
    }
    window.addEventListener("keydown", onKey);
    window.addEventListener("ops-focus-search", onBarSearch);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("ops-focus-search", onBarSearch);
    };
  }, []);

  return (
    <aside
      id="ops-nav"
      className="ops-nav"
      aria-hidden={collapsed}
      {...(collapsed ? { inert: true } : {})}
    >
      <div className="ops-nav__pane">
      <div className="ops-nav__brand">
        <span className="ops-nav__mark" aria-hidden>
          D
        </span>
        <span className="ops-nav__brand-text">
          <span className="ops-nav__org">Dolphin Edu</span>
          <span className="ops-nav__who">{orgName}</span>
        </span>
        <button
          type="button"
          className="ops-nav__collapse"
          aria-label={CHROME[locale].collapseNav}
          aria-expanded={!collapsed}
          aria-controls="ops-nav"
          onClick={onCollapse}
        >
          <svg {...STROKE} width="1rem" height="1rem">
            <rect x="4" y="5" width="16" height="14" rx="2" />
            <path d="M9 5v14" />
          </svg>
        </button>
      </div>
      <BranchSelect
        id="ops-nav-branch"
        locale={locale}
        value={branchId}
        onChange={onBranchChange}
      />
      <label className="ops-nav__search">
        <span className="ops-nav__sr">{CHROME[locale].searchNavSr}</span>
        <span className="ops-nav__search-icon" aria-hidden>
          <svg {...STROKE} width="0.95rem" height="0.95rem">
            <circle cx="11" cy="11" r="6" />
            <path d="M16 16.5 20 20.5" strokeLinecap="round" />
          </svg>
        </span>
        <input
          ref={searchRef}
          type="search"
          placeholder={CHROME[locale].searchNav}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <kbd className="ops-nav__kbd">Ctrl K</kbd>
      </label>
      <nav className="ops-nav__menu" aria-label={CHROME[locale].toolsNav}>
        {loadState === "loading" ? <p className="ops-nav__empty">{CHROME[locale].menuLoading}</p> : null}
        {loadState === "error" ? (
          <p className="ops-nav__empty">
            {CHROME[locale].menuError}
            {onRetry ? (
              <>
                {" "}
                <button type="button" className="ops-nav__retry" onClick={onRetry}>
                  {CHROME[locale].retry}
                </button>
              </>
            ) : null}
          </p>
        ) : null}
        {loadState === "ready"
          ? visible.map((group) => {
          const expanded = Boolean(query.trim()) || open.has(group.id);
          return (
            <div key={group.id} className="ops-nav__block">
              <button
                type="button"
                className="ops-nav__group"
                aria-expanded={expanded}
                onClick={() =>
                  setOpen((prev) => {
                    const next = new Set(prev);
                    if (next.has(group.id)) next.delete(group.id);
                    else next.add(group.id);
                    return next;
                  })
                }
              >
                {group.label}
                <span className="ops-nav__group-chev" aria-hidden>
                  {expanded ? "▾" : "▸"}
                </span>
              </button>
              {expanded ? (
                <ul className="ops-nav__list">
                  {group.items.map((tool) => (
                    <li key={tool.id}>
                      <button
                        type="button"
                        className={
                          active === tool.id ? "ops-nav__item ops-nav__item--current" : "ops-nav__item"
                        }
                        aria-current={active === tool.id ? "page" : undefined}
                        onClick={() => onSelect(tool.id)}
                      >
                        <NavIcon id={tool.id} />
                        <span className="ops-nav__label">{tool.label}</span>
                        {tool.ready ? <ItemChevron /> : <span className="ops-nav__soon">{CHROME[locale].soon}</span>}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          );
        })
          : null}
        {loadState === "ready" && visible.length === 0 ? (
          <p className="ops-nav__empty">{CHROME[locale].noMatch}</p>
        ) : null}
      </nav>
      </div>
    </aside>
  );
}

function ItemChevron() {
  return (
    <span className="ops-nav__chev" aria-hidden>
      <svg {...STROKE} width="0.85rem" height="0.85rem">
        <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function NavIcon({ id }: { id: Stage }) {
  if (id === "overview") {
    return (
      <svg {...STROKE}>
        <rect x="3.5" y="3.5" width="7" height="7" rx="1.2" />
        <rect x="13.5" y="3.5" width="7" height="7" rx="1.2" />
        <rect x="3.5" y="13.5" width="7" height="7" rx="1.2" />
        <rect x="13.5" y="13.5" width="7" height="7" rx="1.2" />
      </svg>
    );
  }
  if (id === "inbox") {
    return (
      <svg {...STROKE}>
        <path d="M4 7.5h16v11H4z" />
        <path d="M4 7.5 12 13l8-5.5" />
      </svg>
    );
  }
  if (id === "schedule" || id === "classes") {
    return (
      <svg {...STROKE}>
        <rect x="3.5" y="5.5" width="17" height="15" rx="2" />
        <path d="M8 3.5v4M16 3.5v4M3.5 10h17" strokeLinecap="round" />
      </svg>
    );
  }
  if (id === "students") {
    return (
      <svg {...STROKE}>
        <circle cx="12" cy="8" r="3.1" />
        <path d="M5.5 19.2c.8-3.2 3.2-4.8 6.5-4.8s5.7 1.6 6.5 4.8" strokeLinecap="round" />
      </svg>
    );
  }
  if (id === "tasks") {
    return (
      <svg {...STROKE}>
        <rect x="6" y="4.5" width="12" height="16" rx="2" />
        <path d="M9 11h6M9 15h4" strokeLinecap="round" />
      </svg>
    );
  }
  if (id === "notifications") {
    return (
      <svg {...STROKE}>
        <path d="M6 16h12l-1.2-2.2V10a4.8 4.8 0 10-9.6 0v3.8L6 16z" />
        <path d="M10 17.2a2 2 0 004 0" strokeLinecap="round" />
      </svg>
    );
  }
  if (id === "reports") {
    return (
      <svg {...STROKE}>
        <path d="M5 18V9M10 18V6M15 18v-7M20 18V8" strokeLinecap="round" />
      </svg>
    );
  }
  if (id === "teachers") {
    return (
      <svg {...STROKE}>
        <circle cx="9" cy="8" r="2.6" />
        <circle cx="16" cy="9.2" r="2.1" />
        <path d="M4.5 18.5c.7-2.6 2.5-4 4.5-4s3.8 1.4 4.5 4M13.5 18.2c.4-1.6 1.5-2.6 3-2.6s2.4.8 2.8 2.2" strokeLinecap="round" />
      </svg>
    );
  }
  if (id === "classrooms") {
    return (
      <svg {...STROKE}>
        <path d="M4 20V8l8-4 8 4v12" strokeLinejoin="round" />
        <path d="M10 20v-6h4v6" strokeLinecap="round" />
      </svg>
    );
  }
  if (id === "campaigns") {
    return (
      <svg {...STROKE}>
        <circle cx="8" cy="12" r="3" />
        <path d="M11 10.5 19 6v12l-8-4.5" strokeLinejoin="round" />
      </svg>
    );
  }
  if (id === "leads" || id === "consult") {
    return (
      <svg {...STROKE}>
        <path d="M5 12h10M12 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (id === "courses") {
    return (
      <svg {...STROKE}>
        <path d="M8 4.5h8l.8 2.2H7.2L8 4.5z" />
        <rect x="6" y="6.7" width="12" height="13" rx="1.5" />
        <path d="M9 11h6M9 14.5h4" strokeLinecap="round" />
      </svg>
    );
  }
  if (id === "packages") {
    return (
      <svg {...STROKE}>
        <rect x="5" y="7" width="14" height="12" rx="2" />
        <path d="M5 11h14M12 7v12" />
      </svg>
    );
  }
  if (id === "shifts") {
    return (
      <svg {...STROKE}>
        <circle cx="12" cy="12" r="8" />
        <path d="M12 8v4.5l3 2" strokeLinecap="round" />
      </svg>
    );
  }
  if (id === "suppliers") {
    return (
      <svg {...STROKE}>
        <path d="M4 16h16v3H4z" />
        <path d="M6 16V9h7l3 4h2v3" />
        <circle cx="8" cy="19.2" r="1.2" />
        <circle cx="16" cy="19.2" r="1.2" />
      </svg>
    );
  }
  if (id === "refunds") {
    return (
      <svg {...STROKE}>
        <path d="M16 8H8.5A4.5 4.5 0 108 17" strokeLinecap="round" />
        <path d="M12.5 4.5 16 8l-3.5 3.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (id === "settings") {
    return (
      <svg {...STROKE}>
        <circle cx="12" cy="12" r="3" />
        <path d="M12 4.5v2M12 17.5v2M4.5 12h2M17.5 12h2M6.4 6.4l1.4 1.4M16.2 16.2l1.4 1.4M17.6 6.4l-1.4 1.4M7.8 16.2l-1.4 1.4" strokeLinecap="round" />
      </svg>
    );
  }
  if (id === "access") {
    return (
      <svg {...STROKE}>
        <rect x="5" y="11" width="14" height="9" rx="2" />
        <path d="M8.5 11V8.5a3.5 3.5 0 017 0V11" />
      </svg>
    );
  }
  if (id === "integrations") {
    return (
      <svg {...STROKE}>
        <circle cx="7" cy="12" r="2.4" />
        <circle cx="17" cy="7.5" r="2.4" />
        <circle cx="17" cy="16.5" r="2.4" />
        <path d="M9.2 11.2 14.8 8.3M9.2 12.8 14.8 15.7" />
      </svg>
    );
  }
  if (id === "audit") {
    return (
      <svg {...STROKE}>
        <rect x="6" y="4.5" width="12" height="16" rx="2" />
        <path d="M9 9h6M9 12.5h6M9 16h3.5" strokeLinecap="round" />
      </svg>
    );
  }
  if (id === "inventory") {
    return (
      <svg {...STROKE}>
        <path d="M4.5 8.5 12 4.5l7.5 4v8.5L12 20.5 4.5 17z" />
        <path d="M12 12v8.5M4.5 8.5 12 12l7.5-3.5" />
      </svg>
    );
  }
  return (
    <svg {...STROKE}>
      <rect x="4" y="7" width="16" height="11" rx="2" />
      <path d="M8 7V6.2A2.2 2.2 0 0110.2 4h3.6A2.2 2.2 0 0116 6.2V7" />
    </svg>
  );
}
