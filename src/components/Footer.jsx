export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-20 border-t border-white/10 px-4 py-8 text-sm">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 md:flex-row">
        <div className="font-semibold text-white">Zephyr Carbon</div>
        <div className="text-white/60">© {year} YourBrand Carbon. All rights reserved.</div>
        <div className="flex items-center gap-4">
          <a className="hover:text-white/90 text-white/70" href="#">Privacy</a>
          <a className="hover:text-white/90 text-white/70" href="#">Terms</a>
          <a className="hover:text-white/90 text-white/70" href="#">Imprint</a>
        </div>
      </div>
    </footer>
  );
}
