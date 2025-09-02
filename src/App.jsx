import { Routes, Route, useLocation } from "react-router-dom";
import { I18nProvider } from "./i18n";
import SideMenu from "./components/SideMenu";
import BrandIcon from "./components/BrandIcon.jsx";
import CartButton from "./components/CartButton";
import { CartProvider } from "./lib/cart";

import Home from "./pages/Home.jsx";
import FAQ from "./pages/FAQ.jsx";
import About from "./pages/About.jsx";
import Credits from "./pages/Credits.jsx";
import Companies from "./pages/Companies.jsx";
import Individuals from "./pages/Individuals.jsx";
import Contact from "./pages/Contact.jsx";
import Assistant from "./pages/Assistant.jsx";
import NotFound from "./pages/NotFound.jsx";
import GetStarted from "./pages/GetStarted.jsx";
import Marketplace from "./pages/Marketplace.jsx";
import CartReview from "./pages/CartReview.jsx";
import Checkout from "./pages/Checkout.jsx";
import Privacy from "./pages/Privacy.jsx";
import Terms from "./pages/Terms.jsx";
import Imprint from "./pages/Imprint.jsx";
import CSR from "./pages/CSR.jsx";


export default function App() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <I18nProvider>
      <CartProvider>
        <div className="min-h-screen flex flex-col dark-gradient">
          <BrandIcon />
          <SideMenu />
          <CartButton />
          {/* Force remount on every path change to avoid stale tree */}
          <main key={location.key} className={isHome ? "flex-1" : "flex-1 flex min-h-0"}>
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/about" element={<About />} />
              <Route path="/credits" element={<Credits />} />
              <Route path="/companies" element={<Companies />} />
              <Route path="/buy/individuals" element={<Individuals />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/assistant" element={<Assistant />} />
              <Route path="/start" element={<GetStarted />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/cart-review" element={<CartReview />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/imprint" element={<Imprint />} />
              <Route path="/csr" element={<CSR />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </CartProvider>
    </I18nProvider>
  );
}
