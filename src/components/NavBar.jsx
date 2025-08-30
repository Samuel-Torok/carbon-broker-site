import { NavLink, Link } from "react-router-dom";
import { Button } from "./ui/button";

const link = "text-sm font-medium hover:opacity-80";
const active = "text-emerald-400";

export default function NavBar() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-white/60 backdrop-blur dark:bg-slate-900/60">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="font-semibold tracking-tight">YourBrand Carbon</Link>
        <nav className="hidden items-center gap-6 md:flex">
          <NavLink to="/about"         className={({isActive}) => `${link} ${isActive?active:""}`}>About</NavLink>
          <NavLink to="/credits"       className={({isActive}) => `${link} ${isActive?active:""}`}>Carbon Credits</NavLink>
          <NavLink to="/faq"           className={({isActive}) => `${link} ${isActive?active:""}`}>FAQ</NavLink>
          <NavLink to="/buy/companies" className={({isActive}) => `${link} ${isActive?active:""}`}>For Companies</NavLink>
          <NavLink to="/buy/individuals" className={({isActive}) => `${link} ${isActive?active:""}`}>For Individuals</NavLink>
        </nav>
        <Link to="/buy/companies"><Button className="hidden md:inline-flex">Get Started</Button></Link>
      </div>
    </header>
  );
}
