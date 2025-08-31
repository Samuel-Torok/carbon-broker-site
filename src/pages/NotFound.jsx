import PagePanel from "../components/PagePanel.jsx";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { useI18n } from "../i18n";

export default function NotFound() {
  const { t } = useI18n();
  return (
    <PagePanel maxWidth="max-w-3xl">
      <main className="py-20 text-center">
        <h1 className="mb-4 text-5xl font-extrabold title-gradient">{t("notFound.title")}</h1>
        <p className="mb-6 opacity-80">{t("notFound.subtitle")}</p>
        <Link to="/"><Button>{t("notFound.back")}</Button></Link>
      </main>
    </PagePanel>
  );
}
