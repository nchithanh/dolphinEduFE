"use client";

import { DEMO_ROLES, type DemoRole } from "../../lib/role";
import { CHROME, type OpsLocale } from "../../lib/locale";
import "./BranchSelect.css";

type RoleSelectProps = {
  id: string;
  locale: OpsLocale;
  value: DemoRole;
  onChange: (role: DemoRole) => void;
  compact?: boolean;
};

export function RoleSelect({ id, locale, value, onChange, compact = false }: RoleSelectProps) {
  return (
    <label className={compact ? "ops-branch ops-branch--compact" : "ops-branch"} htmlFor={id}>
      <span className="ops-branch__sr">{CHROME[locale].roleSelect}</span>
      <select
        id={id}
        value={value}
        aria-label={CHROME[locale].roleSelect}
        onChange={(event) => onChange(event.target.value as DemoRole)}
      >
        {DEMO_ROLES.map((role) => (
          <option key={role.id} value={role.id}>
            {role.label} · {role.name.split(" ")[0]}
          </option>
        ))}
      </select>
    </label>
  );
}
