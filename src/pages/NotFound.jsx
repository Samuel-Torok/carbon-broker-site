import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-20 text-center">
      <h1 className="mb-4 text-4xl font-extrabold">404</h1>
      <p className="mb-6 text-slate-500">We couldn’t find that page.</p>
      <Link to="/"><Button>Back home</Button></Link>
    </main>
  );
}
