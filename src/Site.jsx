// src/Site.jsx
import React from "react";
import { motion } from "framer-motion";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Badge } from "./components/ui/badge";
import { Leaf, Shield, Gift } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useI18n } from "./i18n";
import { GText } from "./lib/i18n-helpers";

const ICONS = { Leaf, Shield, Gift };

export default function Site() {
  const { t } = useI18n();
  const { pathname } = useLocation();
  const isHome = pathname === "/";

  const slides = t("home.slides");     // from en.json/fr.json
  const features = t("home.features"); // from en.json/fr.json
  const slideCta = t("home.slideCta"); // new key below

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
              <section className="relative overflow-hidden h-[100svh] snap-start snap-always">
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
                      <Link to="/companies"><Button size="lg">{t("home.ctaPrimary")}</Button></Link>
                      <Link to="/credits"><Button size="lg" variant="outline">{t("home.ctaSecondary")}</Button></Link>
                    </div>

                    <div className="mt-6 flex items-center gap-5 text-sm text-white/70">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4" /> {t("home.badges.retirement")}
                      </div>
                      <div className="flex items-center gap-2">
                        <Leaf className="h-4 w-4" /> {t("home.badges.verified")}
                      </div>
                    </div>
                  </motion.div>
                  <div className="md:col-span-4" />
                </div>
              </section>

              {/* ---------- FULL-SCREEN SLIDES ---------- */}
              <section aria-label="Quick paths" className="w-full">
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
      </div>
    </div>
  );
}

/* --- Full-screen slide component --- */
function MotionSlide({ slide, alignRight, ctaLabel }) {
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
          to={slide.href}
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
