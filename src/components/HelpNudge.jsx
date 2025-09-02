import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useI18n } from "../i18n";

const DISMISS_KEY = "zc_help_nudge_dismissed_v1";

export default function HelpNudge({ delay = 3500 }) {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (pathname.startsWith("/assistant")) return;         // don’t show on assistant page
    if (localStorage.getItem(DISMISS_KEY) === "1") return; // already dismissed
    const id = setTimeout(() => setOpen(true), delay);
    return () => clearTimeout(id);
  }, [pathname, delay]);

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, "1");
    setOpen(false);
  };

  const go = () => {
    localStorage.setItem(DISMISS_KEY, "1");
    navigate("/assistant");
  };

  if (!open) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-[30rem] max-w-[95vw]">
      <div className="rounded-2xl bg-white/10 backdrop-blur-xl ring-1 ring-white/15 p-4 shadow-xl">
        <div className="flex items-start gap-3">
          <div className="shrink-0 h-9 w-9 rounded-full bg-emerald-500/20 grid place-items-center">🤖</div>

          <div className="flex-1 min-w-0">
            <div className="font-semibold">{t("nudge.title")}</div>
            <div className="text-sm opacity-80 mt-1">{t("nudge.body")}</div>

            <div className="flex flex-wrap gap-2 mt-3">
              {/* Primary (gradient) — single-line */}
              <button
                onClick={go}
                className="btn-outline-gradient hover:opacity-90 whitespace-nowrap flex-none"
              >
                <span className="pill">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-indigo-400 font-medium whitespace-nowrap">
                    {t("nudge.cta")}
                  </span>
                </span>
              </button>

              {/* Secondary (neutral) — single-line */}
              <button
                onClick={dismiss}
                className="btn-outline-neutral hover:opacity-90 whitespace-nowrap flex-none"
              >
                <span className="pill">
                  <span className="text-slate-200 whitespace-nowrap">
                    {t("nudge.dismiss")}
                  </span>
                </span>
              </button>
            </div>
          </div>

          <button onClick={dismiss} className="opacity-60 hover:opacity-100">×</button>
        </div>
      </div>
    </div>
  );


}
