import PagePanel from "../components/PagePanel.jsx";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";

export default function NotFound() {
  return (
    <PagePanel maxWidth="max-w-3xl">
      <main className="py-20 text-center">
        <h1 className="mb-4 text-5xl font-extrabold title-gradient">404</h1>
        <p className="mb-6 opacity-80">We couldn’t find that page.</p>
        <Link to="/"><Button>Back home</Button></Link>
      </main>
    </PagePanel>
  );
}
