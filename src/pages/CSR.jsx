import React from "react";
import PagePanel from "../components/PagePanel.jsx";
import { useI18n } from "../i18n";
import { Link } from "react-router-dom";

export default function CSR() {
  const { lang } = useI18n();
  const L = lang === "fr" ? fr : en;

  const Section = ({ title, children }) => (
    <section className="mt-8">
      <h2 className="text-xl font-semibold text-white mb-2">{title}</h2>
      <div className="space-y-3 text-slate-200">{children}</div>
    </section>
  );

  return (
    <PagePanel>
      <div className="py-10 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white">{L.title}</h1>
        <p className="text-slate-300">{L.subtitle}</p>

        <Section title={L.vcmTitle}>
          <p>{L.vcmP1}</p>
          <p>{L.vcmP2}</p>
        </Section>

        <Section title={L.howTitle}>
          <ul className="list-disc pl-6">
            <li>{L.how1}</li>
            <li>{L.how2}</li>
            <li>{L.how3}</li>
          </ul>
        </Section>

        <Section title={L.benefitsTitle}>
          <ul className="list-disc pl-6">
            <li>{L.stat1}</li>
            <li>{L.stat2}</li>
            <li>{L.stat3}</li>
          </ul>
          {/* simple trend bars (illustrative) */}
          <div className="mt-4 space-y-2">
            <div className="text-xs text-slate-400">{L.chartCaption}</div>
            <div className="h-2 w-full bg-white/10 rounded">
              <div className="h-2 bg-emerald-500 rounded" style={{ width: "15%" }} />
            </div>
            <div className="h-2 w-full bg-white/10 rounded">
              <div className="h-2 bg-emerald-500 rounded" style={{ width: "60%" }} />
            </div>
          </div>
        </Section>

        <Section title={L.sourcesTitle}>
          <ul className="list-disc pl-6 text-slate-300">
            <li>{L.src1}</li>
            <li>{L.src2}</li>
            <li>{L.src3}</li>
            <li>{L.src4}</li>
          </ul>
        </Section>

        <div className="mt-8 flex gap-3">
          <Link to="/companies" className="rounded-lg bg-white/10 px-4 py-2 ring-1 ring-white/15 hover:bg-white/20">{L.buttons.companies}</Link>
          <Link to="/marketplace" className="rounded-lg bg-emerald-500 text-emerald-950 px-4 py-2 hover:bg-emerald-400">{L.buttons.marketplace}</Link>
        </div>
      </div>
    </PagePanel>
  );
}

const en = {
  title: "CSR & the Voluntary Carbon Market (VCM)",
  subtitle: "How we support your CSR and marketing teams with credible carbon communications.",
  vcmTitle: "We operate on the VCM",
  vcmP1: "We source verified credits and retire them transparently on your behalf. The VCM is distinct from compliance schemes; procurement focuses on integrity (methodology, permanence, additionality) and disclosure.",
  vcmP2: "Supply and demand have been volatile recently, but reputable analyses still project long-term growth if integrity improves.",
  howTitle: "What we do for teams",
  how1: "Legal/accurate carbon terminology (scopes, claims, retirements) and review of your messaging.",
  how2: "Templates for Instagram & LinkedIn posts, website copy and FAQs—plus custom assets on request.",
  how3: "Evidence packs: retirement IDs, project summaries, and guidance on certificate use.",
  benefitsTitle: "Why this matters",
  stat1: "Consumers say CSR influences purchasing decisions; strong social-impact communication can lift brand preference.",
  stat2: "Companies report willingness to pay premiums for higher-quality credits when climate impact is clear.",
  stat3: "Analysts have projected the VCM could reach tens of billions of USD by 2030 under high-integrity scenarios.",
  chartCaption: "Illustrative: current market vs. 2030 high-integrity scenarios (not to scale).",
  sourcesTitle: "Sources (see our site policy for links)",
  src1: "Ecosystem Marketplace, State of the Voluntary Carbon Market 2024 (market status).",
  src2: "McKinsey/TSVCM (2021): scenarios up to ~$50B by 2030.",
  src3: "BCG (2023): buyers pay more for quality.",
  src4: "Harvard Business School Online (2021): CSR stats on consumer preference.",
  buttons: { companies: "Back to Companies", marketplace: "Visit Marketplace" },
};

const fr = {
  title: "RSE & Marché volontaire du carbone (VCM)",
  subtitle: "Comment nous aidons vos équipes RSE et marketing à communiquer de façon crédible.",
  vcmTitle: "Nous opérons sur le VCM",
  vcmP1: "Nous sourçons des crédits vérifiés et les retirons de manière transparente en votre nom. Le VCM est distinct des marchés de conformité ; l’achat privilégie l’intégrité (méthodologie, permanence, additionnalité) et la transparence.",
  vcmP2: "L’offre et la demande ont été volatiles récemment, mais les analyses sérieuses prévoient une croissance à long terme si l’intégrité progresse.",
  howTitle: "Ce que nous faisons pour vous",
  how1: "Terminologie carbone légale/précise (scopes, allégations, retraits) et relecture de vos messages.",
  how2: "Modèles de posts Instagram & LinkedIn, textes web et FAQ — avec créations sur mesure si besoin.",
  how3: "Dossiers de preuves : IDs de retrait, fiches projets, et bonnes pratiques pour les certificats.",
  benefitsTitle: "Pourquoi c’est important",
  stat1: "Les consommateurs déclarent que la RSE influence leurs achats ; une communication claire renforce la préférence de marque.",
  stat2: "Les entreprises paient davantage pour des crédits de haute qualité lorsque l’impact climatique est démontré.",
  stat3: "Des scénarios estiment que le VCM pourrait atteindre plusieurs dizaines de milliards USD d’ici 2030, sous fortes exigences d’intégrité.",
  chartCaption: "Illustration : marché actuel vs. scénarios 2030 (non à l’échelle).",
  sourcesTitle: "Sources (voir notre politique pour les liens)",
  src1: "Ecosystem Marketplace, State of the Voluntary Carbon Market 2024 (état du marché).",
  src2: "McKinsey/TSVCM (2021) : scénarios jusqu’à ~50 Md$ en 2030.",
  src3: "BCG (2023) : les acheteurs paient plus pour la qualité.",
  src4: "Harvard Business School Online (2021) : statistiques RSE et préférence consommateur.",
  buttons: { companies: "Retour Entreprises", marketplace: "Aller au Marché" },
};
