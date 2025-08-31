import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useI18n } from "../i18n/i18n";

const linkBase =
  "block rounded-lg px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800/60";
const active =
  "text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400";

export default function SideMenu() {
  const [open, setOpen] = useState(false);
  const [byHover, setByHover] = useState(false);
  const { lang, setLang, t } = useI18n();
  const year = new Date().getFullYear();

  const NavItem = ({ to, children }) => (
    <NavLink
      to={to}
      onClick={() => setOpen(false)}
      className={({ isActive }) => `${linkBase} ${isActive ? active : ""}`}
    >
      {children}
    </NavLink>
  );

  return (
    <div
      className="fixed right-4 top-4 z-[100] pl-72 pb-14"
      onMouseEnter={() => { setByHover(true); setOpen(true); }}
      onMouseLeave={() => { setOpen(false); setByHover(false); }}
    >
      <button
        aria-label="Open menu"
        onClick={() => { setByHover(false); setOpen(v => !v); }}
        className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-slate-900/70 backdrop-blur transition hover:scale-105"
      >
        {open ? <X className="h-5 w-5 text-slate-200" /> : <Menu className="h-5 w-5 text-slate-200" />}
      </button>

      {open && !byHover && (
        <div className="fixed inset-0 z-40 bg-black/40" onClick={() => setOpen(false)} />
      )}

      <aside
        data-open={open}
        className="absolute right-0 top-14 z-50 w-72 translate-x-full opacity-0 pointer-events-none
                   data-[open=true]:translate-x-0 data-[open=true]:opacity-100 data-[open=true]:pointer-events-auto
                   transition-all duration-200 origin-top-right
                   bg-slate-950/95 border border-white/10 rounded-2xl backdrop-blur flex flex-col max-h-[80vh]"
      >
        <div className="flex items-center justify-between px-4 py-4">
          <Link to="/" onClick={() => setOpen(false)} className="font-semibold tracking-tight">
            <span className="bg-gradient-to-r from-indigo-400 to-emerald-400 bg-clip-text text-transparent">Zephyr</span>
            <span className="ml-1 text-slate-300">Carbon</span>
          </Link>
          <button
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="rounded-lg border border-white/10 p-1 hover:bg-white/5"
          >
            <X className="h-4 w-4 text-slate-300" />
          </button>
        </div>

        <nav className="px-2 py-2 space-y-1 overflow-auto">
          <NavItem to="/">{t("nav.home")}</NavItem>
          <NavItem to="/credits">{t("nav.credits")}</NavItem>
          <NavItem to="/companies">{t("nav.companies")}</NavItem>
          <NavItem to="/buy/individuals">{t("nav.individuals")}</NavItem>
          <NavItem to="/faq">{t("nav.faq")}</NavItem>
          <NavItem to="/about">{t("nav.about")}</NavItem>
          <NavItem to="/contact">{t("nav.contact")}</NavItem>
          <NavItem to="/assistant">{t("nav.assistant")}</NavItem>
        </nav>

        {/* Language switch */}
        <div className="mt-3 px-4">
          <label className="block text-xs text-slate-400 mb-2">{t("nav.language")}</label>
          <div className="flex gap-2">
            <button
              onClick={() => setLang("en")}
              className={`px-3 py-1.5 rounded-lg ring-1 ring-white/10 ${
                lang === "en" ? "bg-white/15 text-white" : "bg-white/5 text-slate-300 hover:bg-white/10"
              }`}
            >
              {t("nav.english")}
            </button>
            <button
              onClick={() => setLang("fr")}
              className={`px-3 py-1.5 rounded-lg ring-1 ring-white/10 ${
                lang === "fr" ? "bg-white/15 text-white" : "bg-white/5 text-slate-300 hover:bg-white/10"
              }`}
            >
              {t("nav.french")}
            </button>
          </div>
        </div>

        <div className="mt-4 px-4 pb-4">
          <Link
            to="/companies"
            onClick={() => setOpen(false)}
            className="block w-full rounded-xl px-4 py-2 text-center font-medium text-white
                       bg-gradient-to-r from-indigo-500 to-emerald-400 hover:opacity-95"
          >
            {t("nav.getStarted")}
          </Link>
        </div>

        <div className="mt-auto border-t border-white/10 px-4 py-3 text-xs text-slate-400">
          <div className="flex items-center justify-between">
            <span>© {year} Zephyr Carbon</span>
            <div className="space-x-3">
              <Link to="/privacy" className="hover:text-slate-200">Privacy</Link>
              <Link to="/terms" className="hover:text-slate-200">Terms</Link>
              <Link to="/imprint" className="hover:text-slate-200">Imprint</Link>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
