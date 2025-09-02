import React from "react";
import PagePanel from "../components/PagePanel.jsx";
import { useI18n } from "../i18n";

export default function Privacy() {
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

        <Section title={L.sections.overview.title} id="overview">
          <p>{L.sections.overview.p1}</p>
          <p className="text-xs text-slate-400">{L.disclaimer}</p>
        </Section>

        <Section title={L.sections.controller.title} id="controller">
          <p>{L.sections.controller.p1}</p>
          <ul className="list-disc pl-6">
            <li>{L.placeholders.legalName}</li>
            <li>{L.placeholders.address}</li>
            <li>{L.placeholders.email}</li>
            <li>{L.placeholders.vat}</li>
          </ul>
        </Section>

        <Section title={L.sections.data.title} id="data">
          <ul className="list-disc pl-6">
            <li>{L.sections.data.items.accounts}</li>
            <li>{L.sections.data.items.usage}</li>
            <li>{L.sections.data.items.payments}</li>
            <li>{L.sections.data.items.cookies}</li>
            <li>{L.sections.data.items.comms}</li>
          </ul>
        </Section>

        <Section title={L.sections.basis.title} id="legal-basis">
          <ul className="list-disc pl-6">
            <li>{L.sections.basis.items.contract}</li>
            <li>{L.sections.basis.items.legit}</li>
            <li>{L.sections.basis.items.consent}</li>
            <li>{L.sections.basis.items.legal}</li>
          </ul>
        </Section>

        <Section title={L.sections.cookies.title} id="cookies">
          <p>{L.sections.cookies.p1}</p>
        </Section>

        <Section title={L.sections.analytics.title} id="analytics">
          <p>{L.sections.analytics.p1}</p>
        </Section>

        <Section title={L.sections.payments.title} id="payments">
          <p>{L.sections.payments.p1}</p>
        </Section>

        <Section title={L.sections.sharing.title} id="sharing">
          <p>{L.sections.sharing.p1}</p>
        </Section>

        <Section title={L.sections.transfer.title} id="transfers">
          <p>{L.sections.transfer.p1}</p>
        </Section>

        <Section title={L.sections.retention.title} id="retention">
          <p>{L.sections.retention.p1}</p>
        </Section>

        <Section title={L.sections.rights.title} id="rights">
          <ul className="list-disc pl-6">
            <li>{L.sections.rights.items.access}</li>
            <li>{L.sections.rights.items.rectify}</li>
            <li>{L.sections.rights.items.erase}</li>
            <li>{L.sections.rights.items.restrict}</li>
            <li>{L.sections.rights.items.port}</li>
            <li>{L.sections.rights.items.object}</li>
            <li>{L.sections.rights.items.complain}</li>
          </ul>
          <p className="mt-2">{L.sections.rights.how}</p>
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
  title: "Privacy Policy",
  updated: "Last updated:",
  disclaimer: "This template is provided for convenience and does not constitute legal advice.",
  placeholders: {
    legalName: "Legal entity: [Company name & legal form]",
    address: "Registered address: [Street, ZIP, City, Country]",
    email: "Contact email: [privacy@yourdomain]",
    vat: "VAT / RCS: [e.g., LU…, RCS …]",
  },
  sections: {
    overview: {
      title: "Overview",
      p1: "We process personal data in accordance with the GDPR to provide our services, including browsing this site, placing orders, managing accounts and customer support.",
    },
    controller: { title: "Data Controller", p1: "For the purposes of the GDPR, the controller is:" },
    data: {
      title: "Data We Collect",
      items: {
        accounts: "Account & identity data (name, email) if you create an account or contact us.",
        usage: "Technical/usage data (IP, device, pages) for security and performance.",
        payments: "Payment details processed by our PSP (we do not store full card data).",
        cookies: "Cookies and similar technologies as described below.",
        comms: "Communications and support tickets you send to us.",
      },
    },
    basis: {
      title: "Purposes & Legal Bases",
      items: {
        contract: "To perform a contract or take steps at your request (orders, account).",
        legit: "Legitimate interests (security, fraud prevention, service improvement).",
        consent: "Consent (marketing, non-essential cookies) which you may withdraw at any time.",
        legal: "Compliance with legal obligations (tax, accounting, AML where applicable).",
      },
    },
    cookies: { title: "Cookies", p1: "We use essential cookies for the site to function and, with consent, analytics cookies to measure traffic and improve content." },
    analytics: { title: "Analytics", p1: "If enabled, analytics providers receive pseudonymized usage data subject to their privacy terms. IP masking is used where available." },
    payments: { title: "Payments", p1: "Payments are handled by certified payment processors. They act as independent controllers or processors under their own compliance programs (e.g., PCI DSS)." },
    sharing: { title: "Sharing", p1: "We share data with service providers under appropriate contracts and only as necessary (hosting, analytics, payments, support). We do not sell personal data." },
    transfer: { title: "International Transfers", p1: "Where data leaves the EEA, we rely on adequacy decisions or Standard Contractual Clauses with supplementary measures as needed." },
    retention: { title: "Retention", p1: "We keep data only as long as necessary for the stated purposes or as required by law, then delete or anonymize it." },
    rights: {
      title: "Your Rights",
      items: {
        access: "Access and information",
        rectify: "Rectification",
        erase: "Erasure",
        restrict: "Restriction of processing",
        port: "Data portability",
        object: "Objection (including to direct marketing)",
        complain: "Right to lodge a complaint with your local supervisory authority",
      },
      how: "To exercise your rights, contact us using the details below. We may need to verify your identity.",
    },
    changes: { title: "Changes", p1: "We may update this policy and will indicate the effective date above." },
    contact: { title: "Contact", p1: "Email us at [privacy@yourdomain] for privacy questions." },
  },
};

const fr = {
  title: "Politique de confidentialité",
  updated: "Dernière mise à jour :",
  disclaimer: "Ce modèle est fourni à titre indicatif et ne constitue pas un avis juridique.",
  placeholders: {
    legalName: "Entité légale : [Nom & forme juridique]",
    address: "Adresse du siège : [Rue, CP, Ville, Pays]",
    email: "E-mail de contact : [privacy@votredomaine]",
    vat: "TVA / RCS : [ex. LU…, RCS …]",
  },
  sections: {
    overview: {
      title: "Aperçu",
      p1: "Nous traitons vos données personnelles conformément au RGPD pour fournir nos services : navigation, commandes, gestion de compte et assistance.",
    },
    controller: { title: "Responsable du traitement", p1: "Au sens du RGPD, le responsable est :" },
    data: {
      title: "Données collectées",
      items: {
        accounts: "Données de compte et d’identité (nom, e-mail) si vous créez un compte ou nous contactez.",
        usage: "Données techniques/d’usage (IP, appareil, pages) pour la sécurité et la performance.",
        payments: "Données de paiement traitées par notre prestataire (nous ne stockons pas les données complètes de carte).",
        cookies: "Cookies et technologies similaires comme décrit ci-dessous.",
        comms: "Communications et demandes d’assistance que vous nous envoyez.",
      },
    },
    basis: {
      title: "Finalités et bases légales",
      items: {
        contract: "Exécution d’un contrat ou de mesures précontractuelles (commandes, compte).",
        legit: "Intérêt légitime (sécurité, prévention de la fraude, amélioration du service).",
        consent: "Consentement (marketing, cookies non essentiels) retirable à tout moment.",
        legal: "Obligations légales (fiscalité, comptabilité, LBC/FT le cas échéant).",
      },
    },
    cookies: { title: "Cookies", p1: "Nous utilisons des cookies essentiels et, avec votre consentement, des cookies d’analyse pour mesurer l’audience et améliorer le site." },
    analytics: { title: "Mesure d’audience", p1: "Si activée, la mesure d’audience reçoit des données pseudonymisées, sous leurs propres conditions de confidentialité (IP masquée lorsque possible)." },
    payments: { title: "Paiements", p1: "Les paiements sont gérés par des prestataires certifiés, agissant en qualité de responsables ou sous-traitants, conformément à leurs programmes de conformité (ex. PCI DSS)." },
    sharing: { title: "Partage", p1: "Nous partageons des données avec des prestataires sous contrats adéquats et uniquement si nécessaire (hébergement, analytics, paiements, support). Nous ne vendons pas vos données." },
    transfer: { title: "Transferts internationaux", p1: "En cas de transfert hors EEE, nous nous appuyons sur des décisions d’adéquation ou les clauses contractuelles types avec mesures complémentaires si nécessaire." },
    retention: { title: "Durées de conservation", p1: "Nous conservons les données le temps nécessaire aux finalités indiquées ou aux obligations légales, puis les supprimons ou anonymisons." },
    rights: {
      title: "Vos droits",
      items: {
        access: "Accès et information",
        rectify: "Rectification",
        erase: "Effacement",
        restrict: "Limitation",
        port: "Portabilité",
        object: "Opposition (y compris au marketing direct)",
        complain: "Réclamation auprès de l’autorité de contrôle compétente",
      },
      how: "Pour exercer vos droits, contactez-nous aux coordonnées ci-dessous. Une vérification d’identité peut être requise.",
    },
    changes: { title: "Modifications", p1: "Nous pouvons mettre à jour cette politique et indiquerons la date d’effet ci-dessus." },
    contact: { title: "Contact", p1: "Écrivez-nous à [privacy@votredomaine] pour toute question relative à la vie privée." },
  },
};
