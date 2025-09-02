import React from "react";
import PagePanel from "../components/PagePanel.jsx";
import { useI18n } from "../i18n";

export default function Imprint() {
  const { lang } = useI18n();
  const L = lang === "fr" ? fr : en;

  const Item = ({ label, value }) => (
    <p><span className="text-slate-400">{label} </span><span className="text-slate-200">{value}</span></p>
  );

  return (
    <PagePanel>
      <div className="py-10 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white">{L.title}</h1>
        <div className="mt-6 space-y-2">
          <Item label={L.labels.legalName} value="[Company name & legal form]" />
          <Item label={L.labels.address} value="[Street, ZIP, City, Country]" />
          <Item label={L.labels.director} value="[Director / Manager]" />
          <Item label={L.labels.email} value="[info@yourdomain]" />
          <Item label={L.labels.phone} value="[+352 …]" />
          <Item label={L.labels.rcs} value="[RCS Luxembourg: Bxxxxxx]" />
          <Item label={L.labels.vat} value="[VAT: LUxxxxxxx]" />
          <Item label={L.labels.host} value="[Hosting provider name, address]" />
          <Item label={L.labels.supervisor} value="[Supervisory authority if applicable]" />
          <Item label={L.labels.editor} value="[Editorially responsible person]" />
        </div>

        <section className="mt-10">
          <h2 className="text-xl font-semibold text-white mb-2">{L.images.title}</h2>
          <p className="text-slate-200">{L.images.note}</p>
          <ul className="list-disc pl-6 text-slate-200 mt-3 space-y-2">
            <li>ocean.jpg — [Photographer/Creator], [Source/URL], [License].</li>
            <li>[Any other image] — [Author], [Source/URL], [License].</li>
          </ul>
        </section>

        <p className="text-xs text-slate-400 mt-8">{L.disclaimer}</p>
      </div>
    </PagePanel>
  );
}

const en = {
  title: "Imprint (Legal Notice)",
  disclaimer: "This page is a template and not legal advice. Replace placeholders with your actual details.",
  labels: {
    legalName: "Legal entity:",
    address: "Registered address:",
    director: "Director/Manager:",
    email: "Email:",
    phone: "Phone:",
    rcs: "Trade register (RCS):",
    vat: "VAT number:",
    host: "Hosting provider:",
    supervisor: "Supervisory authority:",
    editor: "Editorial responsibility:",
  },
  images: {
    title: "Image Credits / Attributions",
    note: "List each image with author, source and license. Respect license requirements (e.g., CC-BY).",
  },
};

const fr = {
  title: "Mentions légales (Impressum)",
  disclaimer: "Cette page est un modèle non constitutif d’avis juridique. Remplacez les champs par vos informations.",
  labels: {
    legalName: "Entité légale :",
    address: "Adresse du siège :",
    director: "Direction/Gérant :",
    email: "E-mail :",
    phone: "Téléphone :",
    rcs: "Registre du commerce (RCS) :",
    vat: "N° TVA :",
    host: "Hébergeur :",
    supervisor: "Autorité de supervision :",
    editor: "Responsable de la publication :",
  },
  images: {
    title: "Crédits / Attributions d’images",
    note: "Indiquez pour chaque image l’auteur, la source et la licence. Respectez les exigences de licence (ex. CC-BY).",
  },
};
