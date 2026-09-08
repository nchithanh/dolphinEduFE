"use client";

import {
  GUIDE_ADDON,
  GUIDE_CORE,
  GUIDE_FLOW,
  GUIDE_OUT,
  GUIDE_ROLES,
  type QuoteScopeItem,
} from "../../lib/quote-scope";
import type { Stage } from "../../lib/types";
import "./chrome.css";
import "./GuideBoard.css";

type GuideBoardProps = {
  title: string;
  onOpen: (id: Stage) => void;
};

const TOC = [
  { id: "guide-flow", label: "Luồng vận hành" },
  { id: "guide-roles", label: "Vai trò" },
  { id: "guide-core", label: "CRM lõi A1–A14" },
  { id: "guide-addon", label: "Mặt ngoài & mở rộng" },
  { id: "guide-out", label: "Ngoài phạm vi" },
] as const;

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function ModuleCard({ item, onOpen }: { item: QuoteScopeItem; onOpen: (id: Stage) => void }) {
  const headingId = `guide-mod-${item.id}`;
  return (
    <article className="ops-guide__mod" aria-labelledby={headingId}>
      <header className="ops-guide__mod-head">
        <p className="ops-guide__code">{item.code}</p>
        <div>
          <h3 id={headingId} className="ops-guide__mod-title">
            {item.title}
          </h3>
          <p className="ops-guide__who">{item.who}</p>
        </div>
        <button type="button" className="ops-page__cta ops-guide__open" onClick={() => onOpen(item.stage)}>
          Mở màn hình
        </button>
      </header>
      <ol className="ops-guide__steps">
        {item.howTo.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
      <div className="ops-guide__asis">
        <p>
          <strong>As-is.</strong> {item.asIs}
        </p>
        <p>
          <strong>To-be.</strong> {item.toBe}
        </p>
      </div>
      <ul className="ops-guide__rules">
        {item.rules.map((rule) => (
          <li key={rule}>{rule}</li>
        ))}
      </ul>
    </article>
  );
}

export function GuideBoard({ title, onOpen }: GuideBoardProps) {
  return (
    <section className="ops-guide" aria-labelledby="ops-guide-heading">
      <nav className="ops-crumb" aria-label="Breadcrumb">
        <ol>
          <li>Trang chủ</li>
          <li aria-current="page">{title}</li>
        </ol>
      </nav>
      <div className="ops-page__head">
        <div>
          <h1 id="ops-guide-heading" className="ops-page__title" tabIndex={-1}>
            {title}
          </h1>
          <p className="ops-page__lede">
            Playbook vận hành MA Dance trên CRM: luồng lõi, 4 vai trò, hạng mục A1–A14 và mở rộng B. Canvas khác chỉ còn
            bảng dữ liệu — hướng dẫn nằm hết ở đây.
          </p>
        </div>
      </div>

      <div className="ops-guide__layout">
        <nav className="ops-guide__toc" aria-label="Mục lục hướng dẫn">
          <p className="ops-guide__toc-kicker">Mục lục</p>
          <ul>
            {TOC.map((row) => (
              <li key={row.id}>
                <a href={`#${row.id}`} onClick={(e) => { e.preventDefault(); scrollToId(row.id); }}>
                  {row.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ops-guide__main">
          <section className="ops-guide__block" id="guide-flow" aria-labelledby="guide-flow-heading">
            <h2 id="guide-flow-heading" className="ops-guide__h2">
              Luồng vận hành
            </h2>
            <p className="ops-guide__lede">Khóa → ghi danh → sinh lớp → điểm danh → thu phí → bảo lưu / đổi lớp.</p>
            <ol className="ops-guide__flow">
              {GUIDE_FLOW.map((step) => (
                <li key={step.n}>
                  <button
                    type="button"
                    className={`ops-guide__flow-card ops-guide__tone--${step.tone}`}
                    onClick={() => onOpen(step.stage)}
                  >
                    <span className="ops-guide__flow-n">{step.n}</span>
                    <span className="ops-guide__flow-title">{step.title}</span>
                    <span className="ops-guide__flow-note">{step.note}</span>
                  </button>
                </li>
              ))}
            </ol>
          </section>

          <section className="ops-guide__block" id="guide-roles" aria-labelledby="guide-roles-heading">
            <h2 id="guide-roles-heading" className="ops-guide__h2">
              Vai trò
            </h2>
            <p className="ops-guide__lede">
              Đổi vai trên CanvasBar để xem ACL demo (24 quyền · 12 tài khoản). GV không xem học phí và SĐT học viên.
            </p>
            <ul className="ops-guide__roles">
              {GUIDE_ROLES.map((role) => (
                <li key={role.id}>
                  <article className={`ops-guide__role ops-guide__tone--${role.tone}`} aria-labelledby={`guide-role-${role.id}`}>
                    <h3 id={`guide-role-${role.id}`} className="ops-guide__role-title">
                      {role.title}
                    </h3>
                    <p className="ops-guide__role-sum">{role.summary}</p>
                    <p className="ops-guide__kicker">Được</p>
                    <ul>
                      {role.can.map((row) => (
                        <li key={row}>{row}</li>
                      ))}
                    </ul>
                    <p className="ops-guide__kicker">Không</p>
                    <ul>
                      {role.cannot.map((row) => (
                        <li key={row}>{row}</li>
                      ))}
                    </ul>
                  </article>
                </li>
              ))}
            </ul>
          </section>

          <section className="ops-guide__block" id="guide-core" aria-labelledby="guide-core-heading">
            <h2 id="guide-core-heading" className="ops-guide__h2">
              CRM lõi · A1–A14
            </h2>
            <p className="ops-guide__lede">Nghiệp vụ lớp–gói theo discovery MA Dance. Mỗi khối mở đúng màn hình vận hành.</p>
            <div className="ops-guide__mods">
              {GUIDE_CORE.map((item) => (
                <ModuleCard key={item.id} item={item} onOpen={onOpen} />
              ))}
            </div>
          </section>

          <section className="ops-guide__block" id="guide-addon" aria-labelledby="guide-addon-heading">
            <h2 id="guide-addon-heading" className="ops-guide__h2">
              Mặt ngoài & mở rộng
            </h2>
            <p className="ops-guide__lede">B1 là preview (không phải site production). B2 là vận hành thêm trên CRM.</p>
            <div className="ops-guide__mods">
              {GUIDE_ADDON.map((item) => (
                <ModuleCard key={item.id} item={item} onOpen={onOpen} />
              ))}
            </div>
          </section>

          <section className="ops-guide__block" id="guide-out" aria-labelledby="guide-out-heading">
            <h2 id="guide-out-heading" className="ops-guide__h2">
              Ngoài phạm vi
            </h2>
            <ul className="ops-guide__out">
              {GUIDE_OUT.map((row) => (
                <li key={row}>{row}</li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </section>
  );
}
