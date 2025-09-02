import { useLocation } from "react-router-dom";
import PagePanel from "../components/PagePanel.jsx";
import { useI18n } from "../i18n";

export default function Checkout() {
  const { state } = useLocation() || {};
  const { t, lang } = useI18n();
  const locale = lang === "fr" ? "fr-FR" : "en-US";

  return (
    <PagePanel maxWidth="max-w-3xl">
      <div className="mx-auto w-full pb-16">
        <h1 className="text-3xl font-semibold text-emerald-400">{t("checkout.title")}</h1>
        <p className="mt-4 text-white/80">
          {t("checkout.body")} {state?.total != null ? `Total: €${state.total.toLocaleString(locale)}` : ""}
        </p>
      </div>
    </PagePanel>
  );
}
