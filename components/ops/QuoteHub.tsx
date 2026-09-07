"use client";

import { QUOTE_HUB_ADDON, QUOTE_HUB_CORE, type QuoteScopeItem } from "../../lib/quote-scope";
import type { Stage } from "../../lib/types";
import "./QuoteScopeBanner.css";

function HubGrid({
  items,
  onOpen,
}: {
  items: QuoteScopeItem[];
  onOpen: (id: Stage) => void;
}) {
  return (
    <ul className="ops-hub__grid">
      {items.map((item) => (
        <li key={item.id}>
          <button type="button" className="ops-hub__card" onClick={() => onOpen(item.stage)}>
            <span className="ops-hub__card-code">{item.code}</span>
            <span className="ops-hub__card-title">{item.title}</span>
            <span className="ops-hub__card-tobe">{item.toBe}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}

export function QuoteHub({ onOpen }: { onOpen: (id: Stage) => void }) {
  return (
    <section className="ops-hub" aria-labelledby="ops-hub-heading">
      <h2 id="ops-hub-heading" className="ops-hub__title">
        Chức năng CRM · MA Dance
      </h2>
      <p className="ops-hub__lede">
        Chọn một hạng mục để mở màn hình vận hành tương ứng.
      </p>
      <HubGrid items={QUOTE_HUB_CORE} onOpen={onOpen} />
      <p className="ops-hub__sub">B. Mặt ngoài & mở rộng</p>
      <HubGrid items={QUOTE_HUB_ADDON} onOpen={onOpen} />
    </section>
  );
}
