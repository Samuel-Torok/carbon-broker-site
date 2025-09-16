import React from "react";
import { useParams, Link } from "react-router-dom";
import PagePanel from "../components/PagePanel.jsx";
import { Store } from "lucide-react";
import { useI18n } from "../i18n";

export default function PartnerStore() {
  const { t } = useI18n();
  const { slug } = useParams();
  const [store, setStore] = React.useState(null);

  React.useEffect(() => {
    fetch("/api/partners").then(r => r.json()).then(d => {
      const s = (d.partners || []).find(p => p.slug === slug);
      setStore(s || null);
    });
  }, [slug]);

  if (!store) {
    return (
      <PagePanel title={t("partner.notFound")} icon={Store}>
        <Link to="/partners" className="text-indigo-300 underline">{t("partner.back")}</Link>
      </PagePanel>
    );
  }

  return (
    <PagePanel title={store.name} subtitle={store.address} icon={Store} maxWidth="max-w-6xl">
      <div className="overflow-hidden rounded-3xl ring-1 ring-white/10 bg-white/5">
        <img src={store.image} alt={store.name} className="w-full h-[360px] object-cover" />
        <div className="p-6 sm:p-8">
          {/* 2-column content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* left - about + how + sustainability */}
            <div className="lg:col-span-2 space-y-8">
              <section>
                <h2 className="text-xl font-semibold">{t("partner.about")}</h2>
                <p className="mt-2 text-white/85">
                  {store.blurb || "This partner collaborates with LuxOffset to embed micro-offsets into everyday purchases. Scan the QR code on cups/bags to see retirement details and certificates."}
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold">{t("partner.how")}</h2>
                <ul className="mt-2 list-disc list-inside space-y-1 text-white/90">
                  <li>{t("partner.how.step1")}</li>
                  <li>{t("partner.how.step2")}</li>
                  <li>{t("partner.how.step3")}</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold">{t("partner.sustainability")}</h2>
                <p className="mt-2 text-white/85">
                  Verified credits are retired in reputable registries and matched to the item’s footprint estimate.
                  Customers can access the public retirement link from the receipt or QR.
                </p>
              </section>
            </div>

            {/* right - offers + visit/perks */}
            <div className="space-y-8">
              <section>
                <h2 className="text-xl font-semibold">{t("partner.offers")}</h2>
                <ul className="mt-2 list-disc list-inside space-y-1 text-white/90">
                  {(store.products || []).map((x,i)=><li key={i}>{x}</li>)}
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold">{t("partner.visit")}</h2>
                <div className="mt-2 text-white/85 space-y-1">
                  <div><span className="opacity-70">{t("partner.address")}:</span> {store.address}</div>
                  {store.hours && <div><span className="opacity-70">{t("partner.hours")}:</span> {store.hours}</div>}
                  {store.website && <div><span className="opacity-70">{t("partner.website")}:</span> <a className="underline text-indigo-300" href={store.website} target="_blank" rel="noreferrer">{store.website}</a></div>}
                  {store.phone && <div><span className="opacity-70">{t("partner.phone")}:</span> {store.phone}</div>}
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold">{t("partner.perks")}</h2>
                <ul className="mt-2 list-disc list-inside space-y-1 text-white/90">
                  <li>{t("partner.perks.item1")}</li>
                  <li>{t("partner.perks.item2")}</li>
                  <li>{t("partner.perks.item3")}</li>
                  <li>{t("partner.perks.item4")}</li>
                </ul>
              </section>

              <Link to="/partners" className="btn-outline-neutral">
                <span className="pill"><span className="text-slate-200">{t("partner.back")}</span></span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PagePanel>
  );
}
