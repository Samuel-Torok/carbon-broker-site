import PagePanel from "../components/PagePanel.jsx";
import PackageSelector from "../components/PackageSelector.jsx";
import { useI18n } from "../i18n";

export default function Companies() {
  const { t } = useI18n();
  return (
    <PagePanel maxWidth="max-w-4xl">
      <main className="py-12 space-y-6">
        <h1 className="text-3xl font-bold title-gradient">{t("companies.title")}</h1>
        <p className="opacity-80">{t("companies.intro")}</p>
        <PackageSelector audience="company" />
      </main>
    </PagePanel>
  );
}
