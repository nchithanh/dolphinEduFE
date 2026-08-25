"use client";

import {
  cloneElement,
  isValidElement,
  useEffect,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import type { Stage } from "../../lib/types";
import type { NavGroup } from "../../lib/nav";
import type { OpsLocale } from "../../lib/locale";
import { CanvasBar } from "./CanvasBar";
import { ToolNav } from "./ToolNav";
import "./Shell.css";

type ShellProps = {
  active: Stage;
  canvasKey: string;
  onSelect: (id: Stage) => void;
  canvas: ReactNode;
  chat: ReactNode;
  groups: NavGroup[];
  orgName: string;
  menuState: "loading" | "ready" | "error";
  onRetryMenu?: () => void;
  locale: OpsLocale;
  onLocaleChange: (locale: OpsLocale) => void;
  branchId: string;
  onBranchChange: (branchId: string) => void;
  onQuickAdd?: () => void;
};

type ChatSlotProps = {
  open?: boolean;
  onClose?: () => void;
};

export function Shell({
  active,
  canvasKey,
  onSelect,
  canvas,
  chat,
  groups,
  orgName,
  menuState,
  onRetryMenu,
  locale,
  onLocaleChange,
  branchId,
  onBranchChange,
  onQuickAdd,
}: ShellProps) {
  const [navOpen, setNavOpen] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const focusChatAfterOpen = useRef(false);

  useEffect(() => {
    if (!chatOpen || !focusChatAfterOpen.current) return;
    focusChatAfterOpen.current = false;
    const frame = window.requestAnimationFrame(() => {
      document.getElementById("ops-dock-intent")?.focus();
    });
    return () => window.cancelAnimationFrame(frame);
  }, [chatOpen]);

  useEffect(() => {
    if (!chatOpen) return;
    function onKey(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setChatOpen(false);
      window.requestAnimationFrame(() => {
        document.getElementById("ops-bar-chat")?.focus();
      });
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [chatOpen]);

  function toggleChat() {
    setChatOpen((open) => {
      if (open) return false;
      focusChatAfterOpen.current = true;
      return true;
    });
  }

  function closeChat() {
    setChatOpen(false);
    window.requestAnimationFrame(() => {
      document.getElementById("ops-bar-chat")?.focus();
    });
  }

  const shellClass = [
    "ops-shell",
    navOpen ? null : "ops-shell--nav-collapsed",
    chatOpen ? null : "ops-shell--chat-collapsed",
  ]
    .filter(Boolean)
    .join(" ");

  const chatSlot = isValidElement(chat)
    ? cloneElement(chat as ReactElement<ChatSlotProps>, { open: chatOpen, onClose: closeChat })
    : chat;

  return (
    <div className={shellClass}>
      <ToolNav
        active={active}
        onSelect={onSelect}
        collapsed={!navOpen}
        onCollapse={() => setNavOpen(false)}
        groups={groups}
        orgName={orgName}
        loadState={menuState}
        onRetry={onRetryMenu}
        locale={locale}
        branchId={branchId}
        onBranchChange={onBranchChange}
      />
      <div className="ops-shell__main">
        <CanvasBar
          navOpen={navOpen}
          chatOpen={chatOpen}
          onToggleNav={() => setNavOpen((open) => !open)}
          onToggleChat={toggleChat}
          onQuickAdd={onQuickAdd}
          locale={locale}
          onLocaleChange={onLocaleChange}
          branchId={branchId}
          onBranchChange={onBranchChange}
        />
        <main key={canvasKey} className="ops-shell__canvas ops-canvas-enter">
          {canvas}
        </main>
      </div>
      {chatOpen ? (
        <button type="button" className="ops-chat-backdrop" aria-label="Đóng chat" onClick={closeChat} />
      ) : null}
      {chatSlot}
    </div>
  );
}
