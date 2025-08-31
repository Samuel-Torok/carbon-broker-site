import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useI18n } from "../i18n";

export default function BackHome() {
  const { t } = useI18n();
  return (
    <Link to="/" className="btn-outline-neutral">
      <span className="pill gap-2">
        <ArrowLeft className="h-4 w-4" />
        <span className="text-slate-200">{t("notFound.back")}</span>
      </span>
    </Link>
  );
}
