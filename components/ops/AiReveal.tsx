"use client";

import { MA_DANCE_LOGO, MA_DANCE_LOGO_ALT } from "../../lib/brand";
import "./AiReveal.css";

type AiRevealProps = {
  label: string;
  compact?: boolean;
};

export function AiReveal({ label, compact = false }: AiRevealProps) {
  return (
    <section className={compact ? "ops-reveal ops-reveal--panel" : "ops-reveal"} aria-live="polite" aria-busy="true">
      <div className="ops-reveal__orb" aria-hidden>
        <img className="ops-reveal__mascot" src={MA_DANCE_LOGO} alt={MA_DANCE_LOGO_ALT} width={88} height={88} />
      </div>
      <p className="ops-reveal__label">{label}</p>
    </section>
  );
}
