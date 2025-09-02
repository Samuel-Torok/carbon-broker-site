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

  const RangeBar = ({ label, low, high, max = 50 }) => {
    const wLow = Math.min(100, (low / max) * 100);
    const wHigh = Math.min(100, (high / max) * 100);
    return (
      <div className="grid grid-cols-[90px_1fr_90px] items-center gap-3">
        <div className="text-xs text-slate-400">{label}</div>
        <div className="relative h-3 rounded-full bg-white/5 ring-1 ring-white/10 overflow-hidden">
          <div className="absolute inset-y-0 left-0 bg-emerald-500/30" style={{ width: `${wHigh}%` }} />
          <div className="absolute inset-y-0 left-0 bg-emerald-500" style={{ width: `${wLow}%` }} />
        </div>
        <div className="text-xs text-slate-300 tabular-nums">~${low}–{high}B</div>
      </div>
    );
  };

  return (
    <PagePanel>
      <div className="py-10 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white">{L.title}</h1>
        <p className="text-slate-300">{L.subtitle}</p>

        <Section title={L.csrTitle}>
          <p>{L.csrP1}</p>
          <ul className="list-disc pl-6">
            <li>{L.csrBul1}</li>
            <li>{L.csrBul2}</li>
            <li>{L.csrBul3}</li>
            <li>{L.csrBul4}</li>
          </ul>
        </Section>

        <Section title={L.howTitle}>
          <ul className="list-disc pl-6">
            <li>{L.how1}</li>
            <li>{L.how2}</li>
            <li>{L.how3}</li>
          </ul>
        </Section>

        <Section title={L.vcmTitle}>
          <p>{L.vcmP1}</p>
          <p>{L.vcmP2}</p>
          <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="text-sm font-medium text-white/90 mb-2">{L.chartTitle}</div>
            <div className="space-y-3">
              <RangeBar label="2021" low={1} high={2} />
              <RangeBar label="2025*" low={2.5} high={10} />
              <RangeBar label="2030*" low={5} high={50} />
            </div>
            <div className="mt-3 text-[11px] text-slate-400">{L.chartNote}</div>
          </div>
        </Section>

        <div className="mt-8 flex gap-3">
          <Link
            to="/companies"
            className="rounded-lg bg-emerald-500 text-emerald-950 px-4 py-2 font-medium hover:bg-emerald-400"
          >
            {L.buttons.buyCompanies}
          </Link>
        </div>

        <section className="mt-10">
          <h2 className="sr-only">Sources</h2>
          <ul className="list-disc pl-6 text-[11px] leading-relaxed text-slate-400/80">
            <li>{L.src1}</li>
            <li>{L.src2}</li>
            <li>{L.src3}</li>
            <li>{L.src4}</li>
          </ul>
        </section>
      </div>
    </PagePanel>
  );
}

const en = {
  title: "Corporate Social Responsibility (CSR) & the Voluntary Carbon Market (VCM)",
  subtitle: "How we help your CSR and marketing teams deliver credible, compliant climate claims.",
  csrTitle: "What CSR is — and why it matters now",
  csrP1:
    "CSR integrates environmental and social impact into business strategy. Strong, evidence-based CSR improves trust, wins tenders with ESG criteria, attracts talent and supports access to capital.",
  csrBul1: "Brand & customers: clear climate action and proof points build trust and preference.",
  csrBul2: "Talent & culture: purpose-driven initiatives help attract and retain employees.",
  csrBul3: "Procurement: many RFPs include ESG clauses; credible CSR gives a scoring edge.",
  csrBul4: "Finance: investors increasingly evaluate climate risk, targets and disclosures.",
  howTitle: "How we help",
  how1: "Carbon-claims guidance: use terminology correctly (scopes, VCM, retirements) and legally.",
  how2: "Ready templates for Instagram & LinkedIn + website copy; custom assets on request.",
  how3: "Evidence packs: project summaries, retirement IDs and certificate usage guidance.",
  vcmTitle: "Where carbon credits fit (the VCM)",
  vcmP1:
    "We operate on the VCM: sourcing verified credits (e.g., Gold Standard, Verra) and retiring them transparently on your behalf. We prioritize integrity (methodology, permanence, additionality) and disclosure.",
  vcmP2:
    "Analysts project substantial long-term growth if market integrity strengthens. Below is an illustrative range assembled from well-known studies.",
  chartTitle: "Projected VCM market value (illustrative ranges)",
  chartNote:
    "* Ranges reflect widely cited scenarios (e.g., Ecosystem Marketplace 2024; McKinsey/TSVCM 2021; BCG 2023). Exact outcomes depend on integrity, policy and demand.",
  buttons: { buyCompanies: "Purchase for companies" },
  src1: "Ecosystem Marketplace (2024) – State of the Voluntary Carbon Market: recent volumes/values and integrity trends.",
  src2: "McKinsey/TSVCM (2021) – scenarios suggesting ~$5–50B by 2030 under high-integrity assumptions.",
  src3: "BCG (2023) – evidence that buyers pay premiums for higher-quality credits.",
  src4: "Harvard Business School Online (2021) – consumer preference & CSR studies summarised.",
};

const fr = {
  title: "Responsabilité sociétale des entreprises (RSE) & Marché volontaire du carbone (VCM)",
  subtitle: "Comment nous aidons vos équipes RSE et marketing à formuler des messages climatiques fiables et conformes.",
  csrTitle: "Ce qu’est la RSE — et pourquoi c’est essentiel",
  csrP1:
    "La RSE intègre l’impact environnemental et social dans la stratégie. Une RSE solide et étayée renforce la confiance, aide à gagner des appels d’offres intégrant l’ESG, attire les talents et facilite l’accès aux capitaux.",
  csrBul1: "Marque & clients : des actions climatiques claires avec preuves renforcent la confiance.",
  csrBul2: "Talents & culture : une raison d’être crédible améliore l’attraction et la rétention.",
  csrBul3: "Achats : de nombreux marchés publics/privés incluent des critères ESG.",
  csrBul4: "Financement : les investisseurs évaluent de plus en plus le risque climatique et la transparence.",
  howTitle: "Notre accompagnement",
  how1: "Conseils sur les allégations carbone : terminologie correcte (scopes, VCM, retraits) et conformité.",
  how2: "Modèles prêts à l’emploi pour Instagram & LinkedIn + textes web ; créations sur mesure possibles.",
  how3: "Dossiers de preuves : fiches projets, IDs de retrait et bonnes pratiques d’utilisation des certificats.",
  vcmTitle: "La place des crédits carbone (VCM)",
  vcmP1:
    "Nous opérons sur le VCM : approvisionnement en crédits vérifiés (ex. Gold Standard, Verra) et retrait transparent en votre nom. L’intégrité (méthodologie, permanence, additionnalité) et la transparence sont prioritaires.",
  vcmP2:
    "Les analyses projettent une forte croissance à long terme si l’intégrité progresse. Le graphique ci-dessous illustre des fourchettes issues d’études de référence.",
  chartTitle: "Valeur projetée du VCM (fourchettes illustratives)",
  chartNote:
    "* Fourchettes inspirées d’analyses reconnues (Ecosystem Marketplace 2024 ; McKinsey/TSVCM 2021 ; BCG 2023). Les résultats dépendent de l’intégrité, des politiques et de la demande.",
  buttons: { buyCompanies: "Acheter pour entreprises" },
  src1: "Ecosystem Marketplace (2024) – State of the Voluntary Carbon Market : volumes/valeurs récents et intégrité.",
  src2: "McKinsey/TSVCM (2021) – scénarios suggérant ~5–50 Md$ d’ici 2030 (forte intégrité).",
  src3: "BCG (2023) – volonté de payer plus pour des crédits de haute qualité.",
  src4: "Harvard Business School Online (2021) – études sur les préférences des consommateurs et la RSE.",
};
