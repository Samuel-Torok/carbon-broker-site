// src/pages/Credits.jsx
import PagePanel from "../components/PagePanel.jsx";

export default function Credits() {
  return (
    <PagePanel maxWidth="max-w-3xl">
      <main className="py-12 space-y-4 leading-7">
        <h1 className="text-3xl font-bold title-gradient">Carbon credits & quality</h1>
        <ul className="list-disc pl-5 space-y-2">
          <li><b>Standards:</b> Verra (VCS), Gold Standard, ACR, others.</li>
          <li><b>Quality checks:</b> additionality, permanence, leakage, double-counting, MRV robustness.</li>
          <li><b>Project types:</b> nature-based, cookstoves, renewable energy, engineered removals.</li>
          <li><b>Traceability:</b> serials by vintage; retirement certificates provided.</li>
        </ul>
      </main>
    </PagePanel>
  );
}
