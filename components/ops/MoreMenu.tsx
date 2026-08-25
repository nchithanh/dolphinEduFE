"use client";

import { useRef } from "react";
import "./chrome.css";

export type MoreItem = { label: string; onClick: () => void };

export function copyId(id: string) {
  void navigator.clipboard?.writeText(id).catch(() => undefined);
}

type MoreMenuProps = {
  items: MoreItem[];
  label?: string;
};

export function MoreMenu({ items, label = "Thêm thao tác" }: MoreMenuProps) {
  const root = useRef<HTMLDetailsElement>(null);

  function pick(onClick: () => void) {
    onClick();
    if (root.current) root.current.open = false;
  }

  return (
    <details ref={root} className="ops-more">
      <summary className="ops-more__btn" aria-label={label}>
        <span aria-hidden>⋯</span>
      </summary>
      <div className="ops-more__menu" role="menu">
        {items.map((item) => (
          <button key={item.label} type="button" role="menuitem" onClick={() => pick(item.onClick)}>
            {item.label}
          </button>
        ))}
      </div>
    </details>
  );
}
