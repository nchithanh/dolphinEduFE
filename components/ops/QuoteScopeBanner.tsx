"use client";

import type { QuoteScopeItem } from "../../lib/quote-scope";
import "./QuoteScopeBanner.css";

export function QuoteScopeBanner({ item }: { item: QuoteScopeItem }) {
  const headingId = `ops-scope-${item.id}`;
  return (
    <aside className="ops-scope" aria-labelledby={headingId}>
      <p className="ops-scope__code">{item.code}</p>
      <div className="ops-scope__body">
        <p id={headingId} className="ops-scope__kicker">
          Mô tả chức năng
        </p>
        <p className="ops-scope__title">{item.title}</p>
        <p className="ops-scope__flow">
          <span>
            <strong>As-is.</strong> {item.asIs}
          </span>
          <span>
            <strong>To-be.</strong> {item.toBe}
          </span>
        </p>
        <ul className="ops-scope__rules">
          {item.rules.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
