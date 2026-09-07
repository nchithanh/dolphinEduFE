"use client";

import { BranchSelect } from "./BranchSelect";
import { RoleSelect } from "./RoleSelect";
import { MA_DANCE_LOGO, MA_DANCE_LOGO_ALT } from "../../lib/brand";
import { CHROME, type OpsLocale } from "../../lib/locale";
import { roleProfile, type DemoRole } from "../../lib/role";
import type { EduTheme } from "../../lib/theme";
import { UserAvatar } from "./UserAvatar";
import "./CanvasBar.css";

type CanvasBarProps = {
  orgName?: string;
  navOpen?: boolean;
  chatOpen?: boolean;
  onToggleNav?: () => void;
  onToggleChat?: () => void;
  locale: OpsLocale;
  onLocaleChange: (locale: OpsLocale) => void;
  theme: EduTheme;
  onThemeChange: (theme: EduTheme) => void;
  branchId: string;
  onBranchChange: (branchId: string) => void;
  role: DemoRole;
  onRoleChange: (role: DemoRole) => void;
};

export function CanvasBar({
  orgName = "MA Dance",
  navOpen = true,
  chatOpen = false,
  onToggleNav,
  onToggleChat,
  locale,
  onLocaleChange,
  theme,
  onThemeChange,
  branchId,
  onBranchChange,
  role,
  onRoleChange,
}: CanvasBarProps) {
  const copy = CHROME[locale];
  const who = roleProfile(role);

  function focusToolSearch() {
    window.dispatchEvent(new Event("ops-focus-search"));
  }

  return (
    <header className="ops-bar">
      <button
        type="button"
        className="ops-bar__icon ops-bar__menu"
        id="ops-bar-nav"
        aria-label={navOpen ? copy.collapseNav : copy.expandNav}
        aria-expanded={navOpen}
        aria-controls="ops-nav"
        onClick={onToggleNav}
      >
        <svg viewBox="0 0 24 24" width="1.05rem" height="1.05rem" fill="none" stroke="currentColor" strokeWidth="1.75">
          <path d="M5 7h14M5 12h14M5 17h14" strokeLinecap="round" />
        </svg>
      </button>
      <div className="ops-bar__brand">
        <img className="ops-bar__logo" src={MA_DANCE_LOGO} alt={MA_DANCE_LOGO_ALT} width={32} height={32} />
        <span className="ops-bar__org">{orgName}</span>
      </div>
      <div className="ops-bar__branch">
        <BranchSelect
          id="ops-bar-branch"
          locale={locale}
          value={branchId}
          onChange={onBranchChange}
          compact
        />
      </div>
      <label className="ops-bar__search">
        <span className="ops-bar__sr">{copy.searchBarSr}</span>
        <span className="ops-bar__mag" aria-hidden>
          <svg viewBox="0 0 24 24" width="1rem" height="1rem" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="11" cy="11" r="6" />
            <path d="M16 16.5 20 20.5" strokeLinecap="round" />
          </svg>
        </span>
        <input
          type="search"
          placeholder={copy.searchBar}
          onFocus={focusToolSearch}
          onClick={focusToolSearch}
          readOnly
        />
        <kbd className="ops-bar__kbd">Ctrl K</kbd>
      </label>
      <div className="ops-bar__actions">
        <RoleSelect id="ops-bar-role" locale={locale} value={role} onChange={onRoleChange} compact />
        <button
          type="button"
          className={chatOpen ? "ops-bar__ask ops-bar__ask--on" : "ops-bar__ask"}
          id="ops-bar-chat"
          aria-label={chatOpen ? copy.closeChat : copy.askDolphin}
          aria-expanded={chatOpen}
          aria-controls="ops-chat"
          onClick={onToggleChat}
        >
          <svg viewBox="0 0 24 24" width="1rem" height="1rem" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
            <path d="M12 4.5l1.2 3.6 3.8.2-2.9 2.4.9 3.6L12 12.6 8.9 14.3l.9-3.6-2.9-2.4 3.8-.2z" strokeLinejoin="round" />
          </svg>
          <span className="ops-bar__ask-text">{copy.askDolphin}</span>
        </button>
        <div className="ops-bar__lang" role="group" aria-label={copy.themeGroup}>
          <button
            type="button"
            className={theme === "light" ? "ops-bar__lang-btn ops-bar__lang-btn--on" : "ops-bar__lang-btn"}
            aria-pressed={theme === "light"}
            onClick={() => onThemeChange("light")}
          >
            {copy.themeLight}
          </button>
          <button
            type="button"
            className={theme === "dark" ? "ops-bar__lang-btn ops-bar__lang-btn--on" : "ops-bar__lang-btn"}
            aria-pressed={theme === "dark"}
            onClick={() => onThemeChange("dark")}
          >
            {copy.themeDark}
          </button>
        </div>
        <div className="ops-bar__lang" role="group" aria-label={copy.langGroup}>
          <button
            type="button"
            className={locale === "vi" ? "ops-bar__lang-btn ops-bar__lang-btn--on" : "ops-bar__lang-btn"}
            aria-pressed={locale === "vi"}
            onClick={() => onLocaleChange("vi")}
          >
            VI
          </button>
          <button
            type="button"
            className={locale === "en" ? "ops-bar__lang-btn ops-bar__lang-btn--on" : "ops-bar__lang-btn"}
            aria-pressed={locale === "en"}
            onClick={() => onLocaleChange("en")}
          >
            EN
          </button>
        </div>
        <button type="button" className="ops-bar__icon" aria-label={copy.notify} disabled>
          <svg viewBox="0 0 24 24" width="1.05rem" height="1.05rem" fill="none" stroke="currentColor" strokeWidth="1.75">
            <path d="M6 16h12l-1.2-2.2V10a4.8 4.8 0 10-9.6 0v3.8L6 16z" />
            <path d="M10 17.2a2 2 0 004 0" strokeLinecap="round" />
          </svg>
        </button>
        <div className="ops-bar__user">
          <UserAvatar id={who.avatarId} size="md" name={who.name} decorative={false} />
          <span className="ops-bar__who">
            <span className="ops-bar__name">{who.name.split(" ")[0]}</span>
            <span className="ops-bar__role">{who.label} · MA</span>
          </span>
        </div>
      </div>
    </header>
  );
}
