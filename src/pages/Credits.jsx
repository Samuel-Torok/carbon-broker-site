import PagePanel from "../components/PagePanel.jsx";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Shield, Leaf, CheckCircle2, Globe2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useI18n } from "../i18n";

export default function Credits() {
  const { t } = useI18n();
  const F = t("creditsPage.quality.features");

  return (
    <PagePanel maxWidth="max-w-5xl">
      <main className="py-12 space-y-12 text-slate-100">

        {/* 1) What are voluntary carbon credits */}
        <section className="grid gap-8 md:grid-cols-2">
          <div>
            <h1 className="text-3xl font-extrabold title-gradient">
              {t("creditsPage.intro.title")}
            </h1>
            <p className="mt-3 opacity-90">{t("creditsPage.intro.p1")}</p>
            <ul className="mt-4 space-y-2 text-sm opacity-90 list-disc pl-5">
              {t("creditsPage.intro.facts").map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </div>

          <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-5">
            <h3 className="font-semibold mb-3">{t("creditsPage.quality.title")}</h3>
            <p className="text-sm opacity-90">{t("creditsPage.quality.intro")}</p>
          </div>
        </section>

        {/* 2) Quality & integrity */}
        <section>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Feature icon={Shield} title={F.verification.title}>{F.verification.body}</Feature>
            <Feature icon={CheckCircle2} title={F.additionality.title}>{F.additionality.body}</Feature>
            <Feature icon={Globe2} title={F.doubleCounting.title}>{F.doubleCounting.body}</Feature>
            <Feature icon={Leaf} title={F.permanence.title}>{F.permanence.body}</Feature>
          </div>

          <div className="mt-6 rounded-2xl bg-white/5 ring-1 ring-white/10 p-5">
            <h3 className="font-semibold">{t("creditsPage.quality.typesTitle")}</h3>
            <p className="mt-2 text-sm opacity-90">{t("creditsPage.quality.typesBody")}</p>
          </div>
        </section>

        {/* 3) Our products + CTA */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold title-gradient">{t("creditsPage.products.title")}</h2>
          <p className="opacity-90">{t("creditsPage.products.body")}</p>

          <Link to="/marketplace" className="inline-block">
            <Button
              size="lg"
              className="rounded-2xl px-6 py-3 bg-gradient-to-r from-emerald-400 to-indigo-400 text-white border-0 shadow-lg hover:brightness-110"
            >
              {t("creditsPage.products.cta")}
            </Button>
          </Link>

          <div className="text-xs opacity-70">
            <Badge className="mr-2">{t("creditsPage.products.previewTag")}</Badge>
            {t("creditsPage.products.previewNote")}
          </div>
        </section>
      </main>
    </PagePanel>
  );
}

function Feature({ icon: Icon, title, children }) {
  return (
    <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-5">
      <div className="flex items-center gap-2">
        <Icon className="h-5 w-5 text-emerald-400" />
        <h3 className="font-semibold">{title}</h3>
      </div>
      <p className="mt-2 text-sm opacity-90">{children}</p>
    </div>
  );
}
