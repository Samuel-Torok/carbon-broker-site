import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useI18n } from "../i18n";

export default function BackHome() {
  const { t } = useI18n();
  return (
    <Link
      to="/"
      className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm font-medium text-slate-200
                 hover:bg-white/10 hover:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 transition"
    >
      <ArrowLeft className="h-4 w-4 opacity-80" />
      <span>{t("notFound.back")}</span>
    </Link>
  );
}
