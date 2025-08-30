// src/App.jsx
import { Routes, Route } from "react-router-dom";
import SideMenu from "./components/SideMenu";
import Footer from "./components/Footer";

import Home from "./pages/Home.jsx";
import FAQ from "./pages/FAQ.jsx";
import About from "./pages/About.jsx";
import Credits from "./pages/Credits.jsx";
import Companies from "./pages/Companies.jsx";
import Individuals from "./pages/Individuals.jsx";
import NotFound from "./pages/NotFound.jsx";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white text-slate-900 dark:from-slate-950 dark:to-slate-900 dark:text-slate-100">
      {/* Hamburger + side drawer */}
      <SideMenu />

      {/* Page content grows and pushes footer down */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/about" element={<About />} />
          <Route path="/credits" element={<Credits />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/buy/individuals" element={<Individuals />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}
