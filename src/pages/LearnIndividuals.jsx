import PagePanel from "../components/PagePanel.jsx";
import { Leaf } from "lucide-react";
import { useI18n } from "../i18n";

export default function LearnIndividuals() {
  const { t } = useI18n();
  return (
    <PagePanel
      title={t("learn.self.title","How individual offsets work")}
      subtitle={t("learn.self.sub","What you buy, what gets retired, certificates, and benefits.")}
      icon={Leaf}
    >
      <div className="prose prose-invert max-w-none">
        <h3>{t("learn.self.h1","What happens when you offset?")}</h3>
        <p>{t("learn.self.p1","We source verified credits (Gold Standard/Verra) and retire them in your name. You receive an official PDF certificate and registry links for transparency.")}</p>
        <h3>{t("learn.self.h2","Quality tiers")}</h3>
        <ul>
          <li>{t("learn.self.q1","Standard: reliable, cost-effective.")}</li>
          <li>{t("learn.self.q2","Premium: scarcer nature-based projects, often more recent.")}</li>
          <li>{t("learn.self.q3","Elite: newest, high-impact categories like improved cookstoves/REDD+.")}</li>
        </ul>
        <h3>{t("learn.self.h3","Certificates & reporting")}</h3>
        <p>{t("learn.self.p3","You’ll receive a certificate with your name, quantity (tCO₂e), project info, and retirement ID—ready for personal records or sharing.")}</p>
      </div>
    </PagePanel>
  );
}
