"use client";

import { ALL_BRANCH_ID, DEMO_BRANCHES } from "../../lib/branch";
import { CHROME, type OpsLocale } from "../../lib/locale";
import "./BranchSelect.css";

type BranchSelectProps = {
  id: string;
  locale: OpsLocale;
  value: string;
  onChange: (branchId: string) => void;
  compact?: boolean;
};

export function BranchSelect({ id, locale, value, onChange, compact = false }: BranchSelectProps) {
  const copy = CHROME[locale];
  return (
    <label className={compact ? "ops-branch ops-branch--compact" : "ops-branch"} htmlFor={id}>
      <span className="ops-branch__sr">{copy.branchSelect}</span>
      <select
        id={id}
        value={value}
        aria-label={copy.branchSelect}
        onChange={(event) => onChange(event.target.value)}
      >
        <option value={ALL_BRANCH_ID}>{copy.allBranches}</option>
        {DEMO_BRANCHES.map((branch) => (
          <option key={branch.id} value={branch.id}>
            {branch.name}
          </option>
        ))}
      </select>
    </label>
  );
}
