// src/App.jsx
import { Routes, Route, useLocation } from "react-router-dom";
import SideMenu from "./components/SideMenu";
import BrandIcon from "./components/BrandIcon.jsx";

import Home from "./pages/Home.jsx";
import FAQ from "./pages/FAQ.jsx";
import About from "./pages/About.jsx";
import Credits from "./pages/Credits.jsx";
import Companies from "./pages/Companies.jsx";
import Individuals from "./pages/Individuals.jsx";
import NotFound from "./pages/NotFound.jsx";

export default function App() {
  const { pathname } = useLocation();
  const isHome = pathname === "/";

  return (
    <div className="min-h-screen flex flex-col dark-gradient">
      <BrandIcon />
      <SideMenu />

      {/* Flex only off-home so PagePanel can take full height */}
      <main className={isHome ? "flex-1" : "flex-1 flex min-h-0"}>
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

      
    </div>
  );
}
