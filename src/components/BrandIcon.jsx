import { Link } from "react-router-dom";

export default function BrandIcon() {
  return (
    <Link to="/" aria-label="Go to home" className="fixed left-4 top-4 z-[110] select-none">
      <span className="block h-14 w-14 grid place-items-center rounded-xl
                       bg-slate-900/70 ring-1 ring-white/10 backdrop-blur
                       hover:bg-slate-900/80 transition">
        <img
          src="/luxoffset-icon-512.png"
          alt="LuxOffset"
          className="h-8 w-8 object-contain"
          draggable={false}
        />
      </span>
    </Link>
  );
}
