"use client";

import { MA_DANCE_LOGO, MA_DANCE_LOGO_ALT } from "../../lib/brand";
import { CHROME, type OpsLocale } from "../../lib/locale";
import "./MobileGate.css";

type MobileGateProps = {
  locale: OpsLocale;
  onLocaleChange: (locale: OpsLocale) => void;
};

export function MobileGate({ locale, onLocaleChange }: MobileGateProps) {
  const copy = CHROME[locale];

  return (
    <main className="ops-gate" aria-labelledby="ops-gate-title">
      <div className="ops-gate__stage" aria-hidden>
        <span className="ops-gate__spot ops-gate__spot--top" />
        <span className="ops-gate__spot ops-gate__spot--floor" />
      </div>
      <div className="ops-gate__card">
        <div className="ops-gate__plate">
          <img className="ops-gate__logo" src={MA_DANCE_LOGO} alt={MA_DANCE_LOGO_ALT} width={120} height={120} />
        </div>
        <h1 id="ops-gate-title" className="ops-gate__title">
          {copy.mobileGateTitle}
        </h1>
        <p className="ops-gate__body">{copy.mobileGateBody}</p>
        <p className="ops-gate__hint">{copy.mobileGateHint}</p>
        <div className="ops-gate__lang" role="group" aria-label={copy.langGroup}>
          <button
            type="button"
            className={locale === "vi" ? "ops-gate__lang-btn ops-gate__lang-btn--on" : "ops-gate__lang-btn"}
            aria-pressed={locale === "vi"}
            onClick={() => onLocaleChange("vi")}
          >
            VI
          </button>
          <button
            type="button"
            className={locale === "en" ? "ops-gate__lang-btn ops-gate__lang-btn--on" : "ops-gate__lang-btn"}
            aria-pressed={locale === "en"}
            onClick={() => onLocaleChange("en")}
          >
            EN
          </button>
        </div>
      </div>
    </main>
  );
}
