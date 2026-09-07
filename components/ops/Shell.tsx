"use client";

import {
  cloneElement,
  isValidElement,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactElement,
  type ReactNode,
} from "react";
import type { Stage } from "../../lib/types";
import type { NavGroup } from "../../lib/nav";
import type { OpsLocale } from "../../lib/locale";
import type { DemoRole } from "../../lib/role";
import type { EduTheme } from "../../lib/theme";
import { CHROME } from "../../lib/locale";
import { getPhoneSnapshot, subscribePhone } from "../../lib/phone";
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
  theme: EduTheme;
  onThemeChange: (theme: EduTheme) => void;
  branchId: string;
  onBranchChange: (branchId: string) => void;
  role: DemoRole;
  onRoleChange: (role: DemoRole) => void;
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
  theme,
  onThemeChange,
  branchId,
  onBranchChange,
  role,
  onRoleChange,
}: ShellProps) {
  const phone = useSyncExternalStore(subscribePhone, getPhoneSnapshot, () => false);
  const [navOpen, setNavOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const focusChatAfterOpen = useRef(false);

  useEffect(() => {
    setNavOpen(!phone);
  }, [phone]);

  useEffect(() => {
    if (!chatOpen || !focusChatAfterOpen.current) return;
    focusChatAfterOpen.current = false;
    const frame = window.requestAnimationFrame(() => {
      document.getElementById("ops-dock-intent")?.focus();
    });
    return () => window.cancelAnimationFrame(frame);
  }, [chatOpen]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      if (chatOpen) {
        setChatOpen(false);
        window.requestAnimationFrame(() => {
          document.getElementById("ops-bar-chat")?.focus();
        });
        return;
      }
      if (phone && navOpen) setNavOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [chatOpen, navOpen, phone]);

  function toggleChat() {
    setChatOpen((open) => {
      if (open) return false;
      focusChatAfterOpen.current = true;
      return true;
    });
    if (phone) setNavOpen(false);
  }

  function closeChat() {
    setChatOpen(false);
    window.requestAnimationFrame(() => {
      document.getElementById("ops-bar-chat")?.focus();
    });
  }

  function onNavSelect(id: Stage) {
    onSelect(id);
    if (phone) setNavOpen(false);
  }

  const shellClass = [
    "ops-shell",
    phone ? "ops-shell--phone" : null,
    navOpen ? null : "ops-shell--nav-collapsed",
    chatOpen ? null : "ops-shell--chat-collapsed",
  ]
    .filter(Boolean)
    .join(" ");

  const chatSlot = isValidElement(chat)
    ? cloneElement(chat as ReactElement<ChatSlotProps>, { open: chatOpen, onClose: closeChat })
    : chat;

  const copy = CHROME[locale];

  return (
    <div className={shellClass}>
      {phone && navOpen ? (
        <button type="button" className="ops-nav-backdrop" aria-label={copy.collapseNav} onClick={() => setNavOpen(false)} />
      ) : null}
      <ToolNav
        active={active}
        onSelect={onNavSelect}
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
          orgName={orgName}
          navOpen={navOpen}
          chatOpen={chatOpen}
          onToggleNav={() => setNavOpen((open) => !open)}
          onToggleChat={toggleChat}
          locale={locale}
          onLocaleChange={onLocaleChange}
          theme={theme}
          onThemeChange={onThemeChange}
          branchId={branchId}
          onBranchChange={onBranchChange}
          role={role}
          onRoleChange={onRoleChange}
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
