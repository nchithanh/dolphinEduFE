"use client";

import { nameInitials, staffAvatarSrc } from "../../lib/people-demo";
import { TASK_ASSIGNEES } from "../../lib/tasks-demo";
import "./UserAvatar.css";

type AvatarSize = "xs" | "sm" | "md" | "lg";

const PX: Record<AvatarSize, number> = { xs: 18, sm: 24, md: 32, lg: 44 };

export function UserAvatar({
  id,
  name,
  size = "sm",
  decorative = true,
}: {
  id?: string;
  name?: string;
  size?: AvatarSize;
  decorative?: boolean;
}) {
  const fromAssignee = id ? TASK_ASSIGNEES.find((row) => row.id === id) : undefined;
  const label = name ?? fromAssignee?.name ?? id ?? "?";
  const src = staffAvatarSrc(id) ?? fromAssignee?.avatar;
  const px = PX[size];
  const cls = `ops-avatar ops-avatar--${size}`;

  if (src) {
    return (
      <img
        className={cls}
        src={src}
        alt={decorative ? "" : label}
        width={px}
        height={px}
        draggable={false}
      />
    );
  }

  return (
    <span className={`${cls} ops-avatar--initials`} aria-hidden={decorative}>
      {nameInitials(label)}
    </span>
  );
}

export function UserChip({
  id,
  name,
  role,
  withRole = false,
}: {
  id: string;
  name?: string;
  role?: string;
  withRole?: boolean;
}) {
  const fromAssignee = TASK_ASSIGNEES.find((row) => row.id === id);
  const label = name ?? fromAssignee?.name ?? id;
  const sub = role ?? fromAssignee?.role;
  return (
    <span className={withRole && sub ? "ops-who ops-who--stack" : "ops-who"}>
      <UserAvatar id={id} name={label} />
      <span className="ops-who__txt">
        <span className="ops-who__name">{label}</span>
        {withRole && sub ? <span className="ops-who__role">{sub}</span> : null}
      </span>
    </span>
  );
}
