"use client";

import { MA_DANCE_LOGO, MA_DANCE_LOGO_ALT } from "../../lib/brand";
import "./AiReveal.css";

type AiRevealProps = {
  label: string;
};

export function AiReveal({ label }: AiRevealProps) {
  return (
    <section className="ops-reveal" aria-live="polite" aria-busy="true">
      <div className="ops-reveal__orb" aria-hidden>
        <span className="ops-reveal__ring" />
        <span className="ops-reveal__ring ops-reveal__ring--late" />
        <img className="ops-reveal__mascot" src={MA_DANCE_LOGO} alt={MA_DANCE_LOGO_ALT} width={88} height={88} />
      </div>
      <p className="ops-reveal__label">{label}</p>
    </section>
  );
}
