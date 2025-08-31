import PagePanel from "../components/PagePanel.jsx";
import { useI18n } from "../i18n";

export default function Assistant() {
  const { t } = useI18n();
  return (
    <PagePanel maxWidth="max-w-3xl">
      <main className="py-12 space-y-4 leading-7">
        <h1 className="text-3xl font-bold title-gradient">{t("assistant.title")}</h1>
        <p className="opacity-80">{t("assistant.subtitle")}</p>
        <p>{t("assistant.body")}</p>
      </main>
    </PagePanel>
  );
}
