import React from "react";
import PagePanel from "../components/PagePanel.jsx";
import { useI18n } from "../i18n";

export default function Terms() {
  const { lang } = useI18n();
  const L = lang === "fr" ? fr : en;

  const Section = ({ title, children, id }) => (
    <section id={id} className="mt-8">
      <h2 className="text-xl font-semibold text-white mb-2">{title}</h2>
      <div className="space-y-3 text-slate-200">{children}</div>
    </section>
  );

  return (
    <PagePanel>
      <div className="py-10 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white">{L.title}</h1>
        <p className="text-slate-300 mt-1">{L.updated} 01 Sep 2025</p>

        <Section title={L.sections.scope.title} id="scope">
          <p>{L.sections.scope.p1}</p>
        </Section>

        <Section title={L.sections.accounts.title} id="accounts">
          <p>{L.sections.accounts.p1}</p>
        </Section>

        <Section title={L.sections.orders.title} id="orders">
          <p>{L.sections.orders.p1}</p>
          <ul className="list-disc pl-6">
            <li>{L.sections.orders.items.pricing}</li>
            <li>{L.sections.orders.items.taxes}</li>
            <li>{L.sections.orders.items.credits}</li>
            <li>{L.sections.orders.items.certs}</li>
            <li>{L.sections.orders.items.refunds}</li>
          </ul>
        </Section>

        <Section title={L.sections.ip.title} id="ip">
          <p>{L.sections.ip.p1}</p>
        </Section>

        <Section title={L.sections.acceptable.title} id="acceptable-use">
          <ul className="list-disc pl-6">
            <li>{L.sections.acceptable.items.illegal}</li>
            <li>{L.sections.acceptable.items.security}</li>
            <li>{L.sections.acceptable.items.abuse}</li>
          </ul>
        </Section>

        <Section title={L.sections.links.title} id="links">
          <p>{L.sections.links.p1}</p>
        </Section>

        <Section title={L.sections.disclaimer.title} id="disclaimer">
          <p>{L.sections.disclaimer.p1}</p>
        </Section>

        <Section title={L.sections.liability.title} id="liability">
          <p>{L.sections.liability.p1}</p>
        </Section>

        <Section title={L.sections.law.title} id="law">
          <p>{L.sections.law.p1}</p>
        </Section>

        <Section title={L.sections.changes.title} id="changes">
          <p>{L.sections.changes.p1}</p>
        </Section>

        <Section title={L.sections.contact.title} id="contact">
          <p>{L.sections.contact.p1}</p>
        </Section>
      </div>
    </PagePanel>
  );
}

const en = {
  title: "Terms of Use",
  updated: "Last updated:",
  sections: {
    scope: { title: "Scope", p1: "These Terms govern your use of this website and any services offered here. By accessing or using the site, you agree to these Terms." },
    accounts: { title: "Accounts", p1: "You are responsible for your account credentials and for all activities under your account." },
    orders: {
      title: "Orders & Carbon Credits",
      p1: "Orders are subject to acceptance and availability. For carbon credits (VCM), supply originates from recognized registries/standards; retirements and certificates are handled as stated on this site.",
      items: {
        pricing: "Prices may change before order confirmation.",
        taxes: "You are responsible for applicable taxes/levies.",
        credits: "Carbon credits are not financial instruments and carry project-specific risks (methodology changes, reversal risks, registry rules).",
        certs: "We will issue or relay retirement certificates/IDs once credits are retired.",
        refunds: "Once credits are retired on your behalf, orders are generally non-refundable except where required by law.",
      },
    },
    ip: { title: "Intellectual Property", p1: "All content on this site is owned by us or our licensors and is protected by IP laws. You may not copy, modify, or redistribute without permission." },
    acceptable: {
      title: "Acceptable Use",
      items: {
        illegal: "No unlawful, fraudulent, or infringing activities.",
        security: "No attempts to compromise the site’s security or integrity.",
        abuse: "No abusive, harassing, or misleading behavior.",
      },
    },
    links: { title: "Third-Party Links", p1: "We are not responsible for third-party sites or services linked from here." },
    disclaimer: { title: "Disclaimers", p1: "The site is provided 'as is' without warranties to the fullest extent permitted by law." },
    liability: { title: "Limitation of Liability", p1: "To the maximum extent permitted by law, our liability is limited to the amount paid by you for the relevant order in the 12 months preceding the claim." },
    law: { title: "Governing Law & Venue", p1: "These Terms are governed by Luxembourg law. Exclusive jurisdiction lies with the courts of Luxembourg City." },
    changes: { title: "Changes", p1: "We may update these Terms at any time by posting a new version on this page." },
    contact: { title: "Contact", p1: "Questions? Write to [legal@yourdomain]." },
  },
};

const fr = {
  title: "Conditions d’utilisation",
  updated: "Dernière mise à jour :",
  sections: {
    scope: { title: "Champ d’application", p1: "Les présentes Conditions régissent l’usage de ce site et des services proposés. En y accédant, vous les acceptez." },
    accounts: { title: "Comptes", p1: "Vous êtes responsable de vos identifiants et des activités réalisées via votre compte." },
    orders: {
      title: "Commandes & Crédits carbone",
      p1: "Les commandes sont soumises à acceptation et disponibilité. Pour les crédits carbone (VCM), l’approvisionnement provient de registres/normes reconnus ; les retraits et certificats sont gérés comme indiqué sur ce site.",
      items: {
        pricing: "Les prix peuvent évoluer avant la confirmation.",
        taxes: "Vous êtes responsable des taxes et prélèvements applicables.",
        credits: "Les crédits carbone ne sont pas des instruments financiers et comportent des risques propres aux projets (changements méthodologiques, risques d’inversion, règles de registre).",
        certs: "Nous émettrons ou transmettrons les certificats/IDs de retrait une fois les crédits retirés.",
        refunds: "Une fois les crédits retirés en votre nom, les commandes ne sont en principe pas remboursables sauf obligation légale.",
      },
    },
    ip: { title: "Propriété intellectuelle", p1: "Tout contenu du site nous appartient ou appartient à nos concédants et est protégé. Toute copie/modification/redistribution est interdite sans autorisation." },
    acceptable: {
      title: "Utilisation acceptable",
      items: {
        illegal: "Aucune activité illicite, frauduleuse ou contrefaisante.",
        security: "Aucune tentative de compromettre la sécurité ou l’intégrité du site.",
        abuse: "Aucun comportement abusif, harcelant ou trompeur.",
      },
    },
    links: { title: "Liens tiers", p1: "Nous déclinons toute responsabilité concernant les sites ou services tiers accessibles depuis ce site." },
    disclaimer: { title: "Avertissements", p1: "Le site est fourni « en l’état » sans garantie, dans les limites permises par la loi." },
    liability: { title: "Limitation de responsabilité", p1: "Dans la mesure permise par la loi, notre responsabilité est limitée au montant payé par vous pour la commande concernée au cours des 12 derniers mois." },
    law: { title: "Droit applicable & juridiction", p1: "Les Conditions sont régies par le droit luxembourgeois. Les tribunaux de Luxembourg-Ville sont exclusivement compétents." },
    changes: { title: "Modifications", p1: "Nous pouvons mettre à jour ces Conditions en publiant une nouvelle version sur cette page." },
    contact: { title: "Contact", p1: "Questions ? Écrivez à [legal@votredomaine]." },
  },
};
