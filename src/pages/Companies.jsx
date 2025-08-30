import PackageSelector from "../components/PackageSelector.jsx";

export default function Companies() {
  return (
    <main className="page mx-auto max-w-4xl px-4 py-12 space-y-6">
      <h1 className="text-3xl font-bold title-gradient">For companies (SME)</h1>
      <p className="opacity-80">Buy bundles suitable for Scope 1–3 offsetting. We’ll confirm project mix and retire on registry.</p>
      <PackageSelector audience="company" />
    </main>
  );
}
