// src/Site.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Badge } from "./components/ui/badge";
import { Leaf, Shield, Gift } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useI18n } from "./i18n";
import { GText } from "./lib/i18n-helpers";
import HelpNudge from "./components/HelpNudge.jsx";


const ICONS = { Leaf, Shield, Gift };
const LANG_KEY = "langChoiceSession"; // module scope

export default function Site() {
  // ---- Core hooks
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  const { t, setLang } = useI18n();

  // ---- UI state
  const [contactOpen, setContactOpen] = useState(false);
  const [qIndex, setQIndex] = useState(0);
  const [showScrollHint, setShowScrollHint] = useState(false);
  const [langPromptOpen, setLangPromptOpen] = useState(false);

  // ---- Derived i18n content
  const quotes   = t("home.quotes");
  const slides   = t("home.slides");
  const features = t("home.features");
  const slideCta = t("home.slideCta");

  // ---- Effects
  React.useEffect(() => {
    if (!quotes?.length) return;
    const id = setInterval(() => setQIndex(i => (i + 1) % quotes.length), 7000);
    return () => clearInterval(id);
  }, [quotes?.length]);

  React.useEffect(() => {
    let timer;
    const reset = () => {
      setShowScrollHint(false);
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (window.scrollY < window.innerHeight * 0.15) setShowScrollHint(true);
      }, 8000);
    };
    reset();
    const events = ["scroll","mousemove","keydown","touchstart"];
    events.forEach(ev => window.addEventListener(ev, reset, { passive: true }));
    return () => {
      clearTimeout(timer);
      events.forEach(ev => window.removeEventListener(ev, reset));
    };
  }, []);

  // Show language prompt once per session on homepage
  React.useEffect(() => {
    if (!isHome) return;
    if (sessionStorage.getItem(LANG_KEY) === "1") return;
    const id = setTimeout(() => setLangPromptOpen(true), 3000);
    return () => clearTimeout(id);
  }, [isHome]);

  // ---- Handlers
  const chooseLang = (lng) => {
    setLang(lng);
    sessionStorage.setItem(LANG_KEY, "1");
    setLangPromptOpen(false);
  };

  // --- JSX continues unchanged below ---



  return (
    <div className="dark">
      <div className="min-h-screen flex flex-col text-slate-100">
        <main
          className={
            isHome
              ? "relative z-10 snap-container h-[100svh] overflow-y-scroll snap-y snap-mandatory scroll-smooth overscroll-contain"
              : "relative z-10 flex-1 flex min-h-0"
          }
        >
          {/* Fixed hero background only on the homepage */}
          {isHome && (
            <div className="fixed inset-0 z-0 pointer-events-none">
              <img src="/images/hero-background.jpg" alt="" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-black/10" />
            </div>
          )}

          {isHome && (
            <>
              {/* ---------- HERO ---------- */}
              <section className="relative overflow-visible h-[100svh] snap-start snap-always">
                <div className="relative mx-auto grid max-w-6xl grid-cols-1 md:grid-cols-12 gap-10 px-4 min-h-[100svh] items-center">
                  <motion.div
                    className="md:col-span-8"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Badge className="mb-4">{t("home.heroBadge")}</Badge>

                    <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
                      <GText text={t("home.heroTitle")} />
                    </h1>

                    <p className="mt-4 text-lg leading-relaxed text-white/85">
                      {t("home.heroSubtitle")}
                    </p>

                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    {/* See options */}
                    <Link to="/start" className="btn-outline-gradient hover:opacity-90">
                      <span className="pill">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-indigo-400 font-medium">
                          {t("home.ctaPrimary")}
                        </span>
                      </span>
                    </Link>

                    {/* How it works */}
                    <Link to="/credits" className="btn-outline-gradient hover:opacity-90">
                      <span className="pill">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-indigo-400 font-medium">
                          {t("home.ctaSecondary")}
                        </span>
                      </span>
                    </Link>

                    {/* Marketplace */}
                    <Link to="/marketplace" className="btn-outline-gradient hover:opacity-90">
                      <span className="pill">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-indigo-400 font-medium">
                          {t("home.ctaMarketplace")}
                        </span>
                      </span>
                    </Link>

                    {/* Contact */}
                    <button type="button" onClick={() => setContactOpen(true)} className="btn-outline-gradient hover:opacity-90">
                      <span className="pill">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-indigo-400 font-medium">
                          {t("home.ctaContact")}
                        </span>
                      </span>
                    </button>

                    <Link to="/assistant" className="btn-outline-gradient hover:opacity-90">
                      <span className="pill">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-indigo-400 font-medium">
                          {t("home.ctaAssistant")}
                        </span>
                      </span>
                    </Link>

                  </div>


                    <div className="mt-6 flex items-center gap-5 text-sm text-white/70">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4" /> {t("home.badges.retirement")}
                      </div>
                      <div className="flex items-center gap-2">
                        <Leaf className="h-4 w-4" /> {t("home.badges.verified")}
                      </div>
                    </div>

                    {Array.isArray(quotes) && quotes.length > 0 && (
                      <div className="mt-8 pt-6 border-t border-white/10">
                        {/* Fixed-height stage prevents layout shift */}
                        <div className="relative overflow-hidden h-[120px] sm:h-[140px] md:h-[160px]">
                          <AnimatePresence mode="wait">
                            <motion.div
                              key={qIndex}
                              initial={{ opacity: 0, y: 6 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -6 }}
                              transition={{ duration: 0.35, ease: "easeOut" }}
                              className="absolute inset-0"
                            >
                              <blockquote className="text-xl sm:text-2xl md:text-3xl italic leading-relaxed text-white/90">
                                <span className="text-white/60">“</span>
                                {quotes[qIndex].text}
                                <span className="text-white/60">”</span>
                              </blockquote>
                              <div className="mt-2 text-white/60 text-base">— {quotes[qIndex].author}</div>
                            </motion.div>
                          </AnimatePresence>
                        </div>
                      </div>
                    )}


                  </motion.div>
                  <div className="md:col-span-4" />
                </div>
                {showScrollHint && (
                  <button
                    type="button"
                    onClick={() => document.getElementById("quickpaths")?.scrollIntoView({ behavior: "smooth" })}
                    className="absolute left-1/2 bottom-6 -translate-x-1/2 flex flex-col items-center text-white/80 hover:text-white transition-opacity"
                    aria-label={t("home.scroll")}
                  >
                    <span className="text-[11px] mb-1 tracking-widest uppercase opacity-80">
                      {t("home.scroll")}
                    </span>
                    <svg
                      className="h-7 w-7 animate-bounce-slow"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>
                )}


              </section>

              {contactOpen && (
              <div className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="w-full max-w-lg rounded-2xl bg-slate-950/90 ring-1 ring-white/10 p-6 text-slate-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold">{t("home.contactModal.title")}</h3>
                    <button
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 hover:bg-white/5"
                      onClick={() => setContactOpen(false)}
                      aria-label={t("home.contactModal.close")}
                    >
                      ✕
                    </button>

                  </div>

                  <form onSubmit={(e) => { e.preventDefault(); alert(t("home.contactModal.sent")); setContactOpen(false); }}>
                    <div className="grid gap-3">
                      <label className="grid gap-1">
                        <span className="text-sm opacity-80">{t("home.contactModal.name")}</span>
                        <input className="rounded-lg bg-slate-900 border border-white/10 px-3 py-2" required />
                      </label>

                      <label className="grid gap-1">
                        <span className="text-sm opacity-80">{t("home.contactModal.email")}</span>
                        <input type="email" className="rounded-lg bg-slate-900 border border-white/10 px-3 py-2" required />
                      </label>

                      <label className="grid gap-1">
                        <span className="text-sm opacity-80">{t("home.contactModal.who")}</span>
                        <div className="relative">
                          <select
                            className="w-full appearance-none rounded-lg bg-slate-900/80 border border-white/10 px-3 py-2 pr-9 focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
                          >
                            <option>{t("home.contactModal.optCompany")}</option>
                            <option>{t("home.contactModal.optIndividual")}</option>
                            <option>{t("home.contactModal.optOther")}</option>
                          </select>
                          <svg
                            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300"
                            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                          >
                            <path d="m6 9 6 6 6-6" />
                          </svg>
                        </div>
                      </label>


                      <label className="grid gap-1">
                        <span className="text-sm opacity-80">{t("home.contactModal.need")}</span>
                        <div className="relative">
                          <select
                            className="w-full appearance-none rounded-lg bg-slate-900/80 border border-white/10 px-3 py-2 pr-9 focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
                          >
                            <option>{t("home.contactModal.needOffsets")}</option>
                            <option>{t("home.contactModal.needAdvice")}</option>
                            <option>{t("home.contactModal.needOther")}</option>
                          </select>
                          <svg
                            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300"
                            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                          >
                            <path d="m6 9 6 6 6-6" />
                          </svg>
                        </div>
                      </label>


                      <label className="grid gap-1">
                        <span className="text-sm opacity-80">{t("home.contactModal.message")}</span>
                        <textarea className="rounded-lg bg-slate-900 border border-white/10 px-3 py-2 min-h-[100px]" placeholder={t("home.contactModal.optional")} />
                      </label>
                    </div>

                    <div className="mt-4 flex items-center justify-end gap-2">
                      <button type="button" onClick={() => setContactOpen(false)} className="btn-outline-neutral">
                        <span className="pill">
                          <span className="text-slate-200">
                            {t("home.contactModal.cancel")}
                          </span>
                        </span>
                      </button>

                      <button type="submit" className="btn-outline-gradient">
                        <span className="pill">
                          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-indigo-400 font-medium">
                            {t("home.contactModal.submit")}
                          </span>
                        </span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
              
            )}

            {langPromptOpen && (
              <div className="fixed inset-0 z-[220] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="w-full max-w-2xl rounded-3xl bg-slate-950/90 ring-1 ring-white/10 p-8 text-slate-100 relative">
                  <button
                    className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/10 hover:bg-white/5 absolute right-5 top-5"
                    onClick={() => setLangPromptOpen(false)}
                    aria-label={t("home.contactModal.close")}
                  >
                    ✕
                  </button>

                  <div className="flex items-start gap-4">
                    <div className="shrink-0 h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center">
                      <span className="text-xl">🌐</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-semibold">{t("home.langPrompt.title")}</h3>
                      <p className="mt-2 text-white/85">{t("home.langPrompt.body")}</p>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    {/* English */}
                    <button onClick={() => chooseLang("en")} className="btn-outline-neutral">
                      <span className="pill">
                        <span className="inline-flex items-center gap-2 text-slate-200">
                          <span className="inline-flex h-5 w-7 items-center justify-center rounded overflow-hidden">
                            <span className="leading-none text-base">🇬🇧</span>
                          </span>
                          {t("home.langPrompt.english")}
                        </span>
                      </span>
                    </button>

                    {/* Français */}
                    <button onClick={() => chooseLang("fr")} className="btn-outline-neutral">
                      <span className="pill">
                        <span className="inline-flex items-center gap-2 text-slate-200">
                          <span className="inline-flex h-5 w-7 items-center justify-center rounded overflow-hidden">
                            <span className="leading-none text-base">🇫🇷</span>
                          </span>
                          {t("home.langPrompt.french")}
                        </span>
                      </span>
                    </button>

                    <button onClick={() => setLangPromptOpen(false)} className="btn-outline-neutral ml-auto">
                      <span className="pill">
                        <span className="text-slate-200">{t("home.langPrompt.later")}</span>
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            )}



              {/* ---------- FULL-SCREEN SLIDES ---------- */}
              <section id="quickpaths" aria-label="Quick paths" className="w-full">
                {slides.map((s, i) => (
                  <MotionSlide key={s.href} slide={s} alignRight={i % 2 === 1} ctaLabel={slideCta} />
                ))}
              </section>

              {/* ---------- FEATURES ---------- */}
              <section id="features" className="mx-auto max-w-6xl px-4 py-8">
                <div className="mb-8 text-center">
                  <h2 className="text-3xl font-bold">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-indigo-400">
                      {t("home.featuresTitle")}
                    </span>
                  </h2>
                  <p className="mt-2 text-white/75">{t("home.featuresSubtitle")}</p>
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  {features.map(({ icon, title, desc }) => {
                    const Icon = ICONS[icon] ?? Leaf;
                    return (
                      <Card key={title} className="border-white/10 bg-white/5">
                        <CardHeader className="flex flex-row items-center gap-3">
                          <div className="rounded-2xl p-2 ring-1 ring-white/10">
                            <Icon className="h-5 w-5 text-emerald-400" />
                          </div>
                          <CardTitle className="text-lg">{title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-white/80">{desc}</p>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </section>

              {/* ---------- CONTACT ---------- */}
              <section id="contact" className="mx-auto max-w-4xl px-4 py-12">
                <div className="text-center">
                  <h2 className="text-3xl font-bold">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-indigo-400">
                      {t("home.contactTitle")}
                    </span>
                  </h2>
                  <p className="mt-2 text-white/75">{t("home.contactSubtitle")}</p>
                  <Link to="/contact" className="inline-block mt-4">
                    <Button>{t("home.contactButton")}</Button>
                  </Link>
                </div>
              </section>
            </>
          )}
        </main>
        {/* AI help popup (bottom-right). Shows after a delay, once per user) */}
        <HelpNudge delay={3500} />
      </div>
    </div>
  );
}

/* --- Full-screen slide component --- */
function MotionSlide({ slide, alignRight, ctaLabel }) {
  const targetHref =
    slide.href === "/companies" || slide.href === "/buy/individuals"
      ? `/start?next=${encodeURIComponent(slide.href)}`
      : slide.href;

  return (
    <section className="relative h-[100svh] w-full overflow-hidden snap-start snap-always">
      <motion.div
        className={`absolute bottom-14 ${alignRight ? "right-10" : "left-10"} max-w-[36rem]`}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ amount: 0.75 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm backdrop-blur">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-indigo-400 font-semibold">
            {slide.label}
          </span>
        </div>

        <h3 className="mt-4 text-3xl md:text-4xl font-extrabold leading-tight">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-indigo-400">
            {slide.title}
          </span>
        </h3>

        <p className="mt-3 text-white/85 text-base md:text-lg">{slide.subtitle}</p>

        <Link
          to={targetHref}
          className="group mt-6 inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur hover:bg-white/15 transition"
        >
          <span className="font-medium">{ctaLabel}</span>
          <svg
            className="h-5 w-5 translate-x-0 transition group-hover:translate-x-1"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </motion.div>
    </section>
  );
}
