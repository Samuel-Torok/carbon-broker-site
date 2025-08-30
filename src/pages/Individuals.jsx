import PagePanel from "../components/PagePanel.jsx";
import PackageSelector from "../components/PackageSelector.jsx";

export default function Individuals() {
  return (
    <PagePanel maxWidth="max-w-4xl">
      <main className="py-12 space-y-6">
        <h1 className="text-3xl font-bold title-gradient">For individuals</h1>
        <p className="opacity-80">
          Offset personal emissions with curated packages and verified retirements.
        </p>
        <PackageSelector audience="individual" />
      </main>
    </PagePanel>
  );
}
