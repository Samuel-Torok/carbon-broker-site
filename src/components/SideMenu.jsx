// src/components/SideMenu.jsx
import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

const linkBase =
  "block rounded-lg px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800/60";
const active =
  "text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400";

export default function SideMenu() {
  const [open, setOpen] = useState(false);

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
    <>
      {/* Hamburger (opens on hover or click) */}
      <button
        aria-label="Open menu"
        onClick={() => setOpen(true)}
        onMouseEnter={() => setOpen(true)}
        className="fixed left-4 top-4 z-50 inline-flex items-center justify-center rounded-xl border border-white/10 bg-slate-900/70 p-2 backdrop-blur transition hover:scale-105"
      >
        <Menu className="h-5 w-5 text-slate-200" />
      </button>

      {/* Dim background */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <aside
        data-open={open}
        onMouseLeave={() => setOpen(false)}
        className="fixed inset-y-0 left-0 z-50 w-72 translate-x-[-100%] data-[open=true]:translate-x-0 bg-slate-950/95 border-r border-white/10 backdrop-blur transition-transform"
      >
        <div className="flex items-center justify-between px-4 py-4">
          <Link
            to="/"
            onClick={() => setOpen(false)}
            className="font-semibold tracking-tight"
          >
            <span className="bg-gradient-to-r from-indigo-400 to-emerald-400 bg-clip-text text-transparent">
              Zephyr
            </span>
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

        <nav className="px-2 py-2 space-y-1">
          <NavItem to="/">Home</NavItem>
          <NavItem to="/credits">Carbon Credits</NavItem>
          <NavItem to="/companies">For Companies</NavItem>
          <NavItem to="/buy/individuals">For Individuals</NavItem>
          <NavItem to="/faq">FAQ</NavItem>
          <NavItem to="/about">About</NavItem>
        </nav>

        <div className="mt-4 px-4">
          <Link
            to="/companies"
            onClick={() => setOpen(false)}
            className="block w-full rounded-xl px-4 py-2 text-center font-medium text-white bg-gradient-to-r from-indigo-500 to-emerald-400 hover:opacity-95"
          >
            Get started
          </Link>
        </div>

        <p className="px-4 pt-6 text-xs text-slate-500">
          © {new Date().getFullYear()} Zephyr Carbon
        </p>
      </aside>
    </>
  );
}
