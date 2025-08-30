import PackageSelector from "../components/PackageSelector.jsx";

export default function Individuals() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 space-y-6">
      <h1 className="text-3xl font-bold">For individuals</h1>
      <p className="text-slate-600 dark:text-slate-300">Offset personal emissions with curated packages and verified retirements.</p>
      <PackageSelector audience="individual" />
    </main>
  );
}
