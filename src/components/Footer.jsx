export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-20 border-t border-slate-200/60 bg-white/50 px-4 py-8 text-sm dark:border-slate-800 dark:bg-slate-900/50">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 md:flex-row">
        <div className="font-semibold">Zephyr Carbon</div>
        <div className="text-slate-500">© {year} YourBrand Carbon. All rights reserved.</div>
        <div className="flex items-center gap-4">
          <a className="hover:underline" href="#">Privacy</a>
          <a className="hover:underline" href="#">Terms</a>
          <a className="hover:underline" href="#">Imprint</a>
        </div>
      </div>
    </footer>
  );
}
