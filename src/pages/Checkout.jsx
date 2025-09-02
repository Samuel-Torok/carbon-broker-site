import { useLocation } from "react-router-dom";
import PagePanel from "../components/PagePanel.jsx";

export default function Checkout() {
  const { state } = useLocation() || {};
  return (
    <PagePanel maxWidth="max-w-3xl">
      <div className="mx-auto w-full pb-16">
        <h1 className="text-3xl font-semibold text-emerald-400">Checkout</h1>
        <p className="mt-4 text-white/80">
          Implement your payment here. Total: €{state?.total?.toLocaleString("en-US") ?? "—"}
        </p>
      </div>
    </PagePanel>
  );
}
