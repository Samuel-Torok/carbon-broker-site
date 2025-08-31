// src/pages/Credits.jsx
import PagePanel from "../components/PagePanel.jsx";
import { useI18n } from "../i18n";

export default function Credits() {
  const { t } = useI18n();
  const bullets = t("credits.bullets"); // array of strings like "Standards: …"

  return (
    <PagePanel maxWidth="max-w-3xl">
      <main className="py-12 space-y-4 leading-7">
        <h1 className="text-3xl font-bold title-gradient">{t("credits.title")}</h1>
        <ul className="list-disc pl-5 space-y-2">
          {bullets.map((b, i) => {
            const [label, rest] = b.split(/:\s*/);
            return (
              <li key={i}>
                <strong>{label}:</strong> {rest}
              </li>
            );
          })}
        </ul>
      </main>
    </PagePanel>
  );
}
