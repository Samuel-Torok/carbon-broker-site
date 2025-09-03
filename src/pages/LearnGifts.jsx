import PagePanel from "../components/PagePanel.jsx";
import { Gift } from "lucide-react";
import { useI18n } from "../i18n";

export default function LearnGifts() {
  const { t } = useI18n();
  return (
    <PagePanel
      title={t("learn.gift.title","How offset gifts work")}
      subtitle={t("learn.gift.sub","We retire credits to the recipient’s name and send a certificate.")}
      icon={Gift}
    >
      <div className="prose prose-invert max-w-none">
        <h3>{t("learn.gift.h1","What the recipient gets")}</h3>
        <ul>
          <li>{t("learn.gift.p1","Credits retired in their name (not transferable).")}</li>
          <li>{t("learn.gift.p2","A certificate (PDF; optional physical card) with project details and retirement ID.")}</li>
          <li>{t("learn.gift.p3","Optional appearance on the public leaderboard if allowed.")}</li>
        </ul>
        <h3>{t("learn.gift.h2","Delivery & timing")}</h3>
        <p>{t("learn.gift.p4","Electronic certificates are immediate after retirement; physical cards ship separately.")}</p>
      </div>
    </PagePanel>
  );
}
