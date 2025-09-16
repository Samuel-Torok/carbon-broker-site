import React from "react";
import { useParams, Link } from "react-router-dom";

export default function PartnerStore() {
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
      <div className="mx-auto max-w-3xl px-4 py-10">
        <p>Store not found.</p>
        <Link to="/partners" className="text-indigo-300 underline">Back to partners</Link>
      </div>
    );
  }

  return (
    <div className="relative z-10">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="overflow-hidden rounded-3xl ring-1 ring-white/10 bg-white/5">
          <img src={store.image} alt={store.name} className="w-full h-[320px] object-cover" />
          <div className="p-6">
            <h1 className="text-3xl font-bold">{store.name}</h1>
            <p className="mt-1 text-white/80">{store.address}</p>
            <p className="mt-3 text-white/85">{store.blurb}</p>

            <h2 className="mt-6 text-xl font-semibold">What you can buy</h2>
            <ul className="mt-2 list-disc list-inside space-y-1 text-white/90">
              {store.products.map((x,i)=><li key={i}>{x}</li>)}
            </ul>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/partners" className="btn-outline-neutral">
                <span className="pill"><span className="text-slate-200">Back to map</span></span>
              </Link>
              <Link to="/contact" className="btn-outline-gradient">
                <span className="pill"><span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-indigo-400 font-medium">
                  Partner with us
                </span></span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
