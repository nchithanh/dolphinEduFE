"use client";

import { MA_DANCE_LOGO, MA_DANCE_LOGO_ALT } from "../../lib/brand";
import "./BootSplash.css";

type BootSplashProps = {
  leaving?: boolean;
};

export function BootSplash({ leaving = false }: BootSplashProps) {
  return (
    <div
      className={`ops-boot${leaving ? " ops-boot--out" : ""}`}
      role="status"
      aria-live="polite"
      aria-busy={!leaving}
      aria-label="MA Dance"
    >
      <div className="ops-boot__stage" aria-hidden>
        <span className="ops-boot__spot ops-boot__spot--top" />
        <span className="ops-boot__spot ops-boot__spot--floor" />
        <span className="ops-boot__ring" />
        <span className="ops-boot__ring ops-boot__ring--mid" />
        <span className="ops-boot__ring ops-boot__ring--wide" />
      </div>
      <div className="ops-boot__mark">
        <div className="ops-boot__plate">
          <img
            className="ops-boot__logo"
            src={MA_DANCE_LOGO}
            alt={MA_DANCE_LOGO_ALT}
            width={168}
            height={168}
          />
        </div>
        <p className="ops-boot__studio">Dance studio</p>
        <div className="ops-boot__beats" aria-hidden>
          <span />
          <span />
          <span />
          <span />
        </div>
        <span className="ops-boot__bar" aria-hidden />
      </div>
    </div>
  );
}
