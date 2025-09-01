import PagePanel from "../components/PagePanel.jsx";
import { useI18n } from "../i18n";

export default function About() {
  const { t } = useI18n();
  return (
    <PagePanel maxWidth="max-w-3xl">
      <main className="py-12 space-y-4 leading-7">
        <h1 className="text-3xl font-bold title-gradient">{t("about.title")}</h1>
        <p>{t("about.p1")}</p>
        <p>{t("about.p2")}</p>
      </main>
    </PagePanel>
  );
}
