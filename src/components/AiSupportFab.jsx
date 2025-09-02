import { Link, useLocation } from "react-router-dom";
import { useI18n } from "../i18n";

export default function AiSupportFab() {
  const { t } = useI18n();
  const { pathname } = useLocation();

  // Homepage only
  if (pathname !== "/") return null;

  return (
    <div className="fixed right-4 bottom-20 z-[60]">
      <Link to="/assistant" className="btn-outline-gradient hover:opacity-90 whitespace-nowrap">
        <span className="pill">
          <span className="inline-flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-indigo-400 font-medium whitespace-nowrap">
            <span className="leading-none">🤖</span>
            {t("aiFab.label")}
          </span>
        </span>
      </Link>
    </div>
  );
}
